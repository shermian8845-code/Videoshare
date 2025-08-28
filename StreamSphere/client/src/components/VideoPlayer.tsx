import { useQuery } from "@tanstack/react-query";
import { X, Play, Volume2, Maximize, ThumbsUp, Share, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentSection from "./CommentSection";
import StarRating from "./StarRating";
import type { VideoWithCreator } from "@shared/schema";

interface VideoPlayerProps {
  videoId: string;
  onClose: () => void;
}

export default function VideoPlayer({ videoId, onClose }: VideoPlayerProps) {
  const { data: video, isLoading } = useQuery<VideoWithCreator>({
    queryKey: ['/api/videos', videoId],
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-text-primary text-xl">Loading video...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-text-primary text-xl mb-4">Video not found</div>
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || email?.charAt(0).toUpperCase() || 'U';
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Video Player Section */}
        <div className="flex-1 flex items-center justify-center bg-black">
          <div className="relative w-full h-full max-w-4xl">
            {/* Mock Video Player */}
            <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
              <img 
                src={video.thumbnailUrl || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`}
                alt={video.title}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Video Controls */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <Button size="sm" variant="ghost" className="text-white hover:text-accent">
                  <Play className="h-6 w-6" />
                </Button>
                <div className="flex-1 bg-gray-600 rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full w-1/3"></div>
                </div>
                <span className="text-white text-sm">1:23 / {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '3:45'}</span>
                <Button size="sm" variant="ghost" className="text-white hover:text-accent">
                  <Volume2 className="h-5 w-5" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:text-accent">
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info & Comments Section */}
        <div className="w-full md:w-96 bg-secondary overflow-y-auto">
          <div className="p-6">
            
            {/* Close Button */}
            <Button 
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className="float-right text-text-secondary hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Video Info */}
            <div className="mb-6 clear-both">
              <h2 className="text-xl font-bold text-text-primary mb-2">
                {video.title}
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={video.creator.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-accent text-white text-sm">
                      {getInitials(video.creator.firstName, video.creator.lastName, video.creator.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-text-primary font-medium">
                    @{video.creator.firstName || video.creator.email?.split('@')[0] || 'user'}
                  </span>
                </div>
                <Button 
                  size="sm"
                  className="bg-accent hover:bg-pink-600 text-white"
                >
                  Follow
                </Button>
              </div>
              
              {/* Video Stats */}
              <div className="flex items-center space-x-6 text-sm text-text-secondary mb-4">
                <span>{formatViews(video.views)} views</span>
                <span>{new Date(video.createdAt!).toLocaleDateString()}</span>
                <span>{video.genre}</span>
              </div>

              {/* Rating System */}
              <div className="mb-4">
                <StarRating videoId={videoId} />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-6">
                <Button variant="secondary" size="sm" className="bg-primary text-text-primary hover:bg-gray-700">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  1.2K
                </Button>
                <Button variant="secondary" size="sm" className="bg-primary text-text-primary hover:bg-gray-700">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="secondary" size="sm" className="bg-primary text-text-primary hover:bg-gray-700">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>

              {/* Video Description */}
              {video.description && (
                <div className="mb-6">
                  <p className="text-text-secondary text-sm">{video.description}</p>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <CommentSection videoId={videoId} />
          </div>
        </div>
      </div>
    </div>
  );
}
