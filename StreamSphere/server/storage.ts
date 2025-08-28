import {
  users,
  videos,
  comments,
  ratings,
  type User,
  type InsertUser,
  type Video,
  type InsertVideo,
  type VideoWithCreator,
  type Comment,
  type CommentWithUser,
  type InsertComment,
  type InsertRating,
  type Rating,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or, sql, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Video operations
  getVideos(limit?: number, offset?: number, search?: string, genre?: string): Promise<VideoWithCreator[]>;
  getVideoById(id: string): Promise<VideoWithCreator | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  incrementVideoViews(videoId: string): Promise<void>;
  
  // Comment operations
  getVideoComments(videoId: string): Promise<CommentWithUser[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Rating operations
  getVideoRating(videoId: string, userId: string): Promise<Rating | undefined>;
  upsertRating(rating: InsertRating): Promise<Rating>;
  getVideoAverageRating(videoId: string): Promise<{ average: number; total: number }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  // Video operations
  async getVideos(limit = 20, offset = 0, search?: string, genre?: string): Promise<VideoWithCreator[]> {
    let query = db
      .select({
        id: videos.id,
        title: videos.title,
        publisher: videos.publisher,
        producer: videos.producer,
        genre: videos.genre,
        ageRating: videos.ageRating,
        description: videos.description,
        thumbnailUrl: videos.thumbnailUrl,
        videoUrl: videos.videoUrl,
        duration: videos.duration,
        views: videos.views,
        creatorId: videos.creatorId,
        createdAt: videos.createdAt,
        updatedAt: videos.updatedAt,
        creator: users,
        averageRating: sql<number>`COALESCE(AVG(${ratings.rating}), 0)`,
        totalRatings: sql<number>`COUNT(${ratings.id})`,
      })
      .from(videos)
      .leftJoin(users, eq(videos.creatorId, users.id))
      .leftJoin(ratings, eq(videos.id, ratings.videoId))
      .groupBy(videos.id, users.id)
      .orderBy(desc(videos.createdAt))
      .limit(limit)
      .offset(offset);

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(videos.title, `%${search}%`),
          like(videos.publisher, `%${search}%`),
          like(videos.genre, `%${search}%`)
        )
      );
    }

    if (genre) {
      conditions.push(eq(videos.genre, genre));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query;
  }

  async getVideoById(id: string): Promise<VideoWithCreator | undefined> {
    const [video] = await db
      .select({
        id: videos.id,
        title: videos.title,
        publisher: videos.publisher,
        producer: videos.producer,
        genre: videos.genre,
        ageRating: videos.ageRating,
        description: videos.description,
        thumbnailUrl: videos.thumbnailUrl,
        videoUrl: videos.videoUrl,
        duration: videos.duration,
        views: videos.views,
        creatorId: videos.creatorId,
        createdAt: videos.createdAt,
        updatedAt: videos.updatedAt,
        creator: users,
        averageRating: sql<number>`COALESCE(AVG(${ratings.rating}), 0)`,
        totalRatings: sql<number>`COUNT(${ratings.id})`,
      })
      .from(videos)
      .leftJoin(users, eq(videos.creatorId, users.id))
      .leftJoin(ratings, eq(videos.id, ratings.videoId))
      .where(eq(videos.id, id))
      .groupBy(videos.id, users.id);

    return video || undefined;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async incrementVideoViews(videoId: string): Promise<void> {
    await db
      .update(videos)
      .set({ views: sql`${videos.views} + 1` })
      .where(eq(videos.id, videoId));
  }

  // Comment operations
  async getVideoComments(videoId: string): Promise<CommentWithUser[]> {
    return await db
      .select({
        id: comments.id,
        content: comments.content,
        userId: comments.userId,
        videoId: comments.videoId,
        likes: comments.likes,
        createdAt: comments.createdAt,
        user: users,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.videoId, videoId))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  // Rating operations
  async getVideoRating(videoId: string, userId: string): Promise<Rating | undefined> {
    const [rating] = await db
      .select()
      .from(ratings)
      .where(and(eq(ratings.videoId, videoId), eq(ratings.userId, userId)));
    return rating || undefined;
  }

  async upsertRating(rating: InsertRating): Promise<Rating> {
    const existing = await this.getVideoRating(rating.videoId, rating.userId);
    
    if (existing) {
      const [updatedRating] = await db
        .update(ratings)
        .set({ rating: rating.rating })
        .where(and(eq(ratings.videoId, rating.videoId), eq(ratings.userId, rating.userId)))
        .returning();
      return updatedRating;
    } else {
      const [newRating] = await db.insert(ratings).values(rating).returning();
      return newRating;
    }
  }

  async getVideoAverageRating(videoId: string): Promise<{ average: number; total: number }> {
    const [result] = await db
      .select({
        average: sql<number>`COALESCE(AVG(${ratings.rating}), 0)`,
        total: sql<number>`COUNT(${ratings.id})`,
      })
      .from(ratings)
      .where(eq(ratings.videoId, videoId));

    return result || { average: 0, total: 0 };
  }
}

export const storage = new DatabaseStorage();
