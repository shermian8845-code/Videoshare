import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authMiddleware, registerUser, loginUser, getCurrentUser } from "./auth";
import { insertVideoSchema, insertCommentSchema, insertRatingSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Auth routes (public)
  app.post('/api/register', registerUser);
  app.post('/api/login', loginUser);
  app.post('/api/logout', (req, res) => {
    // For JWT-based auth, logout is handled on the client side
    // This endpoint exists for compatibility and future session management
    res.status(200).json({ message: 'Logged out successfully' });
  });
  app.get('/api/user', authMiddleware, getCurrentUser);

  // Video routes
  app.get('/api/videos', async (req, res) => {
    try {
      const { limit = 20, offset = 0, search, genre } = req.query;
      const videos = await storage.getVideos(
        Number(limit),
        Number(offset),
        search as string,
        genre as string
      );
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get('/api/videos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const video = await storage.getVideoById(id);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Increment view count
      await storage.incrementVideoViews(id);
      
      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post('/api/videos', authMiddleware, async (req, res) => {
    try {
      const user = req.user!;
      
      if (user.role !== 'creator') {
        return res.status(403).json({ message: "Only creators can upload videos" });
      }

      const videoData = insertVideoSchema.parse({
        ...req.body,
        creatorId: user.id,
      });

      const video = await storage.createVideo(videoData);
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      console.error("Error creating video:", error);
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  // Comment routes
  app.get('/api/videos/:id/comments', async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getVideoComments(id);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/videos/:id/comments', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      const commentData = insertCommentSchema.parse({
        content: req.body.content,
        userId: user.id,
        videoId: id,
      });

      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Rating routes
  app.get('/api/videos/:id/rating', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user!;
      
      const rating = await storage.getVideoRating(id, user.id);
      const averageRating = await storage.getVideoAverageRating(id);
      
      res.json({
        userRating: rating?.rating || null,
        averageRating: averageRating.average,
        totalRatings: averageRating.total,
      });
    } catch (error) {
      console.error("Error fetching rating:", error);
      res.status(500).json({ message: "Failed to fetch rating" });
    }
  });

  app.post('/api/videos/:id/rating', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      const ratingData = insertRatingSchema.parse({
        rating: req.body.rating,
        userId: user.id,
        videoId: id,
      });

      const rating = await storage.upsertRating(ratingData);
      const averageRating = await storage.getVideoAverageRating(id);
      
      res.json({
        userRating: rating.rating,
        averageRating: averageRating.average,
        totalRatings: averageRating.total,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid rating data", errors: error.errors });
      }
      console.error("Error creating rating:", error);
      res.status(500).json({ message: "Failed to create rating" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
