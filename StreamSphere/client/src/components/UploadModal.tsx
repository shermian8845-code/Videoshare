import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, X } from "lucide-react";

interface UploadModalProps {
  onClose: () => void;
}

interface VideoUploadData {
  title: string;
  publisher: string;
  producer: string;
  genre: string;
  ageRating: string;
  description?: string;
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const [formData, setFormData] = useState<VideoUploadData>({
    title: "",
    publisher: "",
    producer: "",
    genre: "",
    ageRating: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (data: VideoUploadData) => {
      // For now, we'll just create the video record without file upload
      // In a real implementation, you'd handle file upload to storage
      await apiRequest('POST', '/api/videos', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      toast({
        title: "Success",
        description: "Video uploaded successfully!",
      });
      onClose();
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
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video title.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.genre) {
      toast({
        title: "Error",
        description: "Please select a genre.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.ageRating) {
      toast({
        title: "Error",
        description: "Please select an age rating.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof VideoUploadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Error",
          description: "Please select a valid video file.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (100MB limit)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "File size must be less than 100MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  if (user?.role !== 'creator') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="bg-secondary border-border w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Upload Not Available</h2>
            <p className="text-text-secondary mb-6">
              Only creator accounts can upload videos. Please contact an administrator to upgrade your account.
            </p>
            <Button onClick={onClose} variant="outline" className="border-border">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="bg-secondary border-border w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Upload Video</h2>
            <Button 
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <div className="space-y-4">
                <CloudUpload className="h-12 w-12 text-accent mx-auto" />
                <div>
                  <p className="text-text-primary font-medium">Choose a video file</p>
                  <p className="text-text-secondary text-sm">MP4, MOV, AVI up to 100MB</p>
                  {selectedFile && (
                    <p className="text-success text-sm mt-2">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  id="video-upload"
                  onChange={handleFileSelect}
                />
                <Button 
                  type="button" 
                  onClick={() => document.getElementById('video-upload')?.click()}
                  className="bg-accent hover:bg-pink-600 text-white"
                >
                  Browse Files
                </Button>
              </div>
            </div>

            {/* Video Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-primary font-medium mb-2">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Video title"
                  className="w-full bg-primary border-border text-text-primary placeholder-text-secondary"
                />
              </div>
              <div>
                <label className="block text-text-primary font-medium mb-2">Genre *</label>
                <Select value={formData.genre} onValueChange={(value) => handleInputChange('genre', value)}>
                  <SelectTrigger className="w-full bg-primary border-border text-text-primary">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <SelectItem value="comedy">Comedy</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-text-primary font-medium mb-2">Publisher</label>
                <Input
                  value={formData.publisher}
                  onChange={(e) => handleInputChange('publisher', e.target.value)}
                  placeholder="Publisher name"
                  className="w-full bg-primary border-border text-text-primary placeholder-text-secondary"
                />
              </div>
              <div>
                <label className="block text-text-primary font-medium mb-2">Age Rating *</label>
                <Select value={formData.ageRating} onValueChange={(value) => handleInputChange('ageRating', value)}>
                  <SelectTrigger className="w-full bg-primary border-border text-text-primary">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <SelectItem value="G">G - General Audiences</SelectItem>
                    <SelectItem value="PG">PG - Parental Guidance</SelectItem>
                    <SelectItem value="PG-13">PG-13 - Parents Strongly Cautioned</SelectItem>
                    <SelectItem value="R">R - Restricted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-text-primary font-medium mb-2">Producer</label>
              <Input
                value={formData.producer}
                onChange={(e) => handleInputChange('producer', e.target.value)}
                placeholder="Producer name"
                className="w-full bg-primary border-border text-text-primary placeholder-text-secondary"
              />
            </div>

            <div>
              <label className="block text-text-primary font-medium mb-2">Description (Optional)</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell viewers about your video..."
                className="w-full bg-primary border-border text-text-primary placeholder-text-secondary h-24 resize-none"
              />
            </div>

            {/* Upload Button */}
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                onClick={onClose}
                variant="outline"
                className="border-border"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={uploadMutation.isPending}
                className="bg-accent hover:bg-pink-600 text-white"
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload Video'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
