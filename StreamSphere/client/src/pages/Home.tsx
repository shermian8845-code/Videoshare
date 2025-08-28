import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import VideoCard from "@/components/VideoCard";
import VideoPlayer from "@/components/VideoPlayer";
import UploadModal from "@/components/UploadModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { VideoWithCreator } from "@shared/schema";

const GENRES = ["All", "Comedy", "Music", "Gaming", "Education", "Sports"];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const { data: videos = [], isLoading } = useQuery<VideoWithCreator[]>({
    queryKey: ['/api/videos', search, selectedGenre === "All" ? undefined : selectedGenre],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedGenre !== "All") params.append('genre', selectedGenre);
      
      const response = await fetch(`/api/videos?${params}`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      return response.json();
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Query will automatically refetch due to search dependency
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navigation onUpload={() => setShowUpload(true)} />

      <main className="pt-20 pb-20 md:pb-8">
        {/* Hero Section */}
        <section className="px-4 py-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Discover Amazing <span className="text-accent">Videos</span>
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Watch, share, and create incredible content with our community of creators
          </p>
          
          {/* Mobile Search */}
          <div className="md:hidden mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search videos..."
                className="w-full bg-primary border-border rounded-full px-4 py-3 pl-12 text-text-primary placeholder-text-secondary"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-5 w-5" />
            </form>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="px-4 mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {GENRES.map((genre) => (
              <Button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                variant={selectedGenre === genre ? "default" : "secondary"}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedGenre === genre 
                    ? "bg-accent text-white hover:bg-pink-600" 
                    : "bg-secondary text-text-secondary hover:bg-gray-700"
                }`}
              >
                {genre}
              </Button>
            ))}
          </div>
        </section>

        {/* Video Feed */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-text-secondary">Loading videos...</div>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-text-secondary">No videos found</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onClick={() => setSelectedVideo(video.id)}
                    />
                  ))}
                </div>
                
                {videos.length >= 20 && (
                  <div className="text-center mt-12">
                    <Button 
                      variant="secondary"
                      className="bg-secondary text-text-primary hover:bg-gray-700"
                    >
                      Load More Videos
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} />
      )}

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-gray-700 md:hidden z-30">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center space-y-1 p-2 text-accent">
            <i className="fas fa-home text-xl"></i>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-text-secondary hover:text-accent transition-colors">
            <i className="fas fa-search text-xl"></i>
            <span className="text-xs">Search</span>
          </button>
          <button 
            onClick={() => setShowUpload(true)}
            className="flex flex-col items-center space-y-1 p-2 text-text-secondary hover:text-accent transition-colors"
          >
            <i className="fas fa-plus-circle text-2xl"></i>
            <span className="text-xs">Upload</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-text-secondary hover:text-accent transition-colors">
            <i className="fas fa-user text-xl"></i>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
