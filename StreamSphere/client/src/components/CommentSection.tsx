import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ThumbsUp } from "lucide-react";
import type { CommentWithUser } from "@shared/schema";

interface CommentSectionProps {
  videoId: string;
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery<CommentWithUser[]>({
    queryKey: ['/api/videos', videoId, 'comments'],
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest('POST', `/api/videos/${videoId}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos', videoId, 'comments'] });
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment posted successfully!",
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
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createCommentMutation.mutate(newComment.trim());
  };

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || email?.charAt(0).toUpperCase() || 'U';
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMs = now.getTime() - commentDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Comments ({comments.length})
      </h3>
      
      {/* Add Comment */}
      {user && (
        <div className="mb-6">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="bg-accent text-white text-sm">
                {getInitials(user.firstName, user.lastName, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-primary border-border rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary resize-none h-20"
              />
              <div className="flex justify-end mt-2">
                <Button 
                  type="submit"
                  disabled={!newComment.trim() || createCommentMutation.isPending}
                  className="bg-accent hover:bg-pink-600 text-white"
                >
                  {createCommentMutation.isPending ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-text-secondary text-center py-4">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-text-secondary text-center py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment.user?.profileImageUrl || undefined} />
                <AvatarFallback className="bg-accent text-white text-sm">
                  {getInitials(comment.user?.firstName, comment.user?.lastName, comment.user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-primary rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-text-primary font-medium text-sm">
                      @{comment.user?.firstName || comment.user?.email?.split('@')[0] || 'user'}
                    </span>
                    <span className="text-text-secondary text-xs">
                      {formatTimeAgo(comment.createdAt!)}
                    </span>
                  </div>
                  <p className="text-text-primary text-sm">
                    {comment.content}
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-xs text-text-secondary">
                  <button className="flex items-center space-x-1 hover:text-accent transition-colors">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="hover:text-accent transition-colors">Reply</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
