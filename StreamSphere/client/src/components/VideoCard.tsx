import { Card } from "@/components/ui/card";
import { Star, Eye } from "lucide-react";
import type { VideoWithCreator } from "@shared/schema";

interface VideoCardProps {
  video: VideoWithCreator;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    <Card 
      className="video-card bg-secondary border-border overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={video.thumbnailUrl || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600`}
          alt={video.title}
          className="w-full h-64 object-cover"
        />
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-text-secondary text-sm mb-2">
          @{video.creator.firstName || video.creator.email?.split('@')[0] || 'user'}
        </p>
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center space-x-2">
            <Eye className="h-3 w-3" />
            <span>{formatViews(video.views)} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400" />
            <span>{video.averageRating ? Number(video.averageRating).toFixed(1) : '0.0'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
