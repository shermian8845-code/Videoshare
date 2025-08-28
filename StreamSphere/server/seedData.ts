import { storage } from './storage';
import { hashPassword } from './auth';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Create sample users
    const users = [
      {
        email: 'john.creator@example.com',
        username: 'johncreator',
        password: await hashPassword('password123'),
        firstName: 'John',
        lastName: 'Creator',
        role: 'creator' as const,
        profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      {
        email: 'jane.smith@example.com',
        username: 'janesmith',
        password: await hashPassword('password123'),
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'creator' as const,
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      {
        email: 'mike.gamer@example.com',
        username: 'mikegamer',
        password: await hashPassword('password123'),
        firstName: 'Mike',
        lastName: 'Johnson',
        role: 'creator' as const,
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      {
        email: 'sarah.consumer@example.com',
        username: 'sarahconsumer',
        password: await hashPassword('password123'),
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: 'consumer' as const,
        profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
    ];

    const createdUsers = [];
    for (const userData of users) {
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (!existingUser) {
        const user = await storage.createUser(userData);
        createdUsers.push(user);
        console.log(`Created user: ${user.email}`);
      } else {
        createdUsers.push(existingUser);
        console.log(`User already exists: ${existingUser.email}`);
      }
    }

    // Create sample videos
    const videoData = [
      {
        title: 'Amazing Dance Performance',
        publisher: 'Dance Studio Pro',
        producer: 'John Creator',
        genre: 'music',
        ageRating: 'G',
        description: 'An incredible dance performance showcasing contemporary moves with upbeat music.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop',
        videoUrl: '/uploads/videos/dance-performance.mp4',
        duration: 180,
        creatorId: createdUsers[0].id, // John Creator
      },
      {
        title: 'Cooking Made Easy: Pasta Recipe',
        publisher: 'Kitchen Masters',
        producer: 'Jane Smith',
        genre: 'education',
        ageRating: 'G',
        description: 'Learn how to make delicious pasta from scratch with simple ingredients.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=600&fit=crop',
        videoUrl: '/uploads/videos/pasta-recipe.mp4',
        duration: 240,
        creatorId: createdUsers[1].id, // Jane Smith
      },
      {
        title: 'Epic Gaming Moments Compilation',
        publisher: 'GameStream',
        producer: 'Mike Johnson',
        genre: 'gaming',
        ageRating: 'PG-13',
        description: 'The most epic gaming moments from this month, featuring incredible plays and funny fails.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
        videoUrl: '/uploads/videos/gaming-compilation.mp4',
        duration: 320,
        creatorId: createdUsers[2].id, // Mike Johnson
      },
      {
        title: 'Morning Yoga Routine',
        publisher: 'Wellness Studio',
        producer: 'John Creator',
        genre: 'education',
        ageRating: 'G',
        description: 'Start your day right with this energizing 5-minute morning yoga routine.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=600&fit=crop',
        videoUrl: '/uploads/videos/morning-yoga.mp4',
        duration: 300,
        creatorId: createdUsers[0].id, // John Creator
      },
      {
        title: 'Stand-up Comedy Special',
        publisher: 'Comedy Central',
        producer: 'Jane Smith',
        genre: 'comedy',
        ageRating: 'PG-13',
        description: 'Hilarious stand-up comedy routine that will have you laughing out loud.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        videoUrl: '/uploads/videos/comedy-special.mp4',
        duration: 420,
        creatorId: createdUsers[1].id, // Jane Smith
      },
      {
        title: 'Football Highlights 2024',
        publisher: 'Sports Network',
        producer: 'Mike Johnson',
        genre: 'sports',
        ageRating: 'G',
        description: 'Best football moments and goals from the 2024 season.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=600&fit=crop',
        videoUrl: '/uploads/videos/football-highlights.mp4',
        duration: 360,
        creatorId: createdUsers[2].id, // Mike Johnson
      },
      {
        title: 'Guitar Tutorial: Beginner Chords',
        publisher: 'Music Academy',
        producer: 'John Creator',
        genre: 'music',
        ageRating: 'G',
        description: 'Learn essential guitar chords that every beginner should know.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
        videoUrl: '/uploads/videos/guitar-tutorial.mp4',
        duration: 480,
        creatorId: createdUsers[0].id, // John Creator
      },
      {
        title: 'Science Experiment: Volcano',
        publisher: 'Science Fun',
        producer: 'Jane Smith',
        genre: 'education',
        ageRating: 'G',
        description: 'Create an amazing volcano eruption using household items.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=600&fit=crop',
        videoUrl: '/uploads/videos/volcano-experiment.mp4',
        duration: 200,
        creatorId: createdUsers[1].id, // Jane Smith
      },
    ];

    for (const video of videoData) {
      try {
        const createdVideo = await storage.createVideo(video);
        console.log(`Created video: ${createdVideo.title}`);

        // Add some sample ratings
        const ratingUsers = createdUsers.slice(0, 3); // First 3 users
        for (const user of ratingUsers) {
          const rating = Math.floor(Math.random() * 5) + 1; // Random rating 1-5
          try {
            await storage.upsertRating({
              rating,
              userId: user.id,
              videoId: createdVideo.id,
            });
          } catch (error) {
            // Ignore duplicate rating errors
          }
        }

        // Add some sample comments
        const comments = [
          'Amazing content! Keep it up!',
          'This is so helpful, thanks for sharing!',
          'Love this! Can you make more?',
          'Great work! Really enjoyed watching.',
          'This made my day! 😊',
        ];

        for (let i = 0; i < Math.min(3, comments.length); i++) {
          try {
            await storage.createComment({
              content: comments[i],
              userId: createdUsers[i % createdUsers.length].id,
              videoId: createdVideo.id,
            });
          } catch (error) {
            // Ignore any errors
          }
        }

        // Add some view counts
        for (let i = 0; i < Math.floor(Math.random() * 1000) + 100; i++) {
          await storage.incrementVideoViews(createdVideo.id);
        }

      } catch (error) {
        console.error(`Error creating video ${video.title}:`, error);
      }
    }

    console.log('Database seeding completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Creator accounts:');
    console.log('- john.creator@example.com / password123');
    console.log('- jane.smith@example.com / password123');
    console.log('- mike.gamer@example.com / password123');
    console.log('Consumer account:');
    console.log('- sarah.consumer@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}