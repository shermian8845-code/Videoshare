# VideoShare Web Application

## Overview

VideoShare is a full-stack video sharing web application similar to TikTok, designed to allow users to upload, watch, rate, and comment on videos. The application supports two primary user roles: Creators (who can upload videos) and Consumers (who can browse and interact with content). Built with modern web technologies, it features a responsive design with a focus on user experience and scalability.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript for type safety
- **Styling**: Tailwind CSS with a custom dark theme optimized for video content
- **UI Components**: Comprehensive component library using Radix UI primitives with shadcn/ui styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API architecture with organized route handlers
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Authentication**: Replit Auth integration with OpenID Connect (OIDC)
- **File Structure**: Monorepo structure with shared types between client and server

### Database Design
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Key Tables**:
  - Users table with role-based access (consumer/creator)
  - Videos table with metadata (title, publisher, producer, genre, age rating)
  - Comments and ratings for user interaction
  - Sessions table for authentication persistence

### Authentication & Authorization
- **Provider**: Replit Auth with OIDC integration
- **Session Storage**: PostgreSQL-backed sessions for persistence
- **Role-Based Access**: Two-tier system with Creator and Consumer roles
- **Middleware**: Custom authentication middleware for protected routes

### File Storage Strategy
- **Current**: Local file storage in uploads/videos directory
- **Future-Ready**: Architecture designed to easily swap to cloud storage (AWS S3, Cloudinary, etc.)
- **Metadata**: Video information stored in database with file path references

### API Structure
- **Video Operations**: CRUD operations for video management, search, and filtering
- **User Interactions**: Comment system, star rating system (1-5 stars), view tracking
- **Search & Discovery**: Search by title, genre, publisher with pagination support
- **Content Management**: Video upload with metadata validation using Zod schemas

### Development & Production Setup
- **Development**: Hot module replacement with Vite, TypeScript checking, and error overlay
- **Production**: Optimized builds with ESBuild for server code and Vite for client
- **Environment**: Replit-optimized with development tooling and deployment configurations
- **Code Quality**: TypeScript strict mode, ESLint configuration, and shared type definitions

### Responsive Design
- **Mobile-First**: Optimized for mobile viewing with responsive breakpoints
- **Component Library**: Comprehensive UI component system with consistent theming
- **Dark Theme**: Video-focused dark theme with accent colors for better viewing experience
- **Accessibility**: Built with Radix UI primitives ensuring accessibility standards

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Comprehensive primitive component library for accessible UI
- **express**: Node.js web application framework
- **passport**: Authentication middleware with OpenID Connect strategy

### Development & Build Tools
- **vite**: Next-generation frontend build tool
- **typescript**: Static type checking
- **tailwindcss**: Utility-first CSS framework
- **tsx**: TypeScript execution for Node.js development

### Authentication & Security
- **openid-client**: OpenID Connect client implementation
- **express-session**: Session middleware for Express
- **connect-pg-simple**: PostgreSQL session store adapter

### Database & Validation
- **drizzle-kit**: Database migrations and introspection toolkit
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation

### UI & Styling Libraries
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Conditional className utility
- **lucide-react**: Icon library with React components
- **date-fns**: Date utility library for formatting and manipulation

### Development Environment
- **@replit/vite-plugin-runtime-error-modal**: Replit-specific development error handling
- **@replit/vite-plugin-cartographer**: Replit development environment integration