import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Star } from "lucide-react";

interface StarRatingProps {
  videoId: string;
}

interface RatingData {
  userRating: number | null;
  averageRating: number;
  totalRatings: number;
}

export default function StarRating({ videoId }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ratingData, isLoading } = useQuery<RatingData>({
    queryKey: ['/api/videos', videoId, 'rating'],
    enabled: !!user,
  });

  const ratingMutation = useMutation({
    mutationFn: async (rating: number) => {
      const response = await apiRequest('POST', `/api/videos/${videoId}/rating`, { rating });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos', videoId, 'rating'] });
      queryClient.invalidateQueries({ queryKey: ['/api/videos', videoId] });
      toast({
        title: "Success",
        description: "Rating submitted successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRating = (rating: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to rate videos.",
        variant: "destructive",
      });
      return;
    }
    ratingMutation.mutate(rating);
  };

  if (isLoading || !user) {
    return (
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-text-primary">Rate this video:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-5 w-5 text-text-secondary cursor-not-allowed"
              />
            ))}
          </div>
          <span className="text-text-secondary text-sm">
            {user ? 'Loading...' : 'Sign in to rate'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-text-primary">Rate this video:</span>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 cursor-pointer transition-colors ${
                star <= (hoverRating || ratingData?.userRating || 0)
                  ? 'text-yellow-400 fill-current'
                  : 'text-text-secondary'
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRating(star)}
            />
          ))}
        </div>
        <span className="text-text-secondary text-sm">
          ({ratingData?.averageRating ? Number(ratingData.averageRating).toFixed(1) : '0.0'}/5 from {ratingData?.totalRatings || 0} ratings)
        </span>
      </div>
    </div>
  );
}
