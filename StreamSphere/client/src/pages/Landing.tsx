import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Play, Upload, Users, Star } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Navigation */}
      <nav className="floating-nav fixed top-0 left-0 right-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-accent">VideoShare</h1>
          <Button 
            onClick={() => window.location.href = '/auth'}
            className="bg-accent hover:bg-pink-600 text-white"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing <span className="text-accent">Videos</span>
          </h2>
          <p className="text-text-secondary text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Watch, share, and create incredible content with our community of creators. 
            Join millions sharing their passion through video.
          </p>
          
          {/* Search Demo */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Input 
                placeholder="Search videos, creators, genres..."
                className="w-full bg-primary border-border rounded-full px-4 py-3 pl-12 text-text-primary placeholder-text-secondary"
                disabled
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-5 w-5" />
            </div>
          </div>

          <Button 
            onClick={() => window.location.href = '/auth'}
            size="lg"
            className="bg-accent hover:bg-pink-600 text-white px-8 py-3 text-lg"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why VideoShare?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-secondary border-border">
              <CardContent className="p-6 text-center">
                <Play className="h-12 w-12 text-accent mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Watch & Discover</h4>
                <p className="text-text-secondary">
                  Discover amazing videos from creators around the world
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary border-border">
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 text-accent mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Create & Share</h4>
                <p className="text-text-secondary">
                  Upload your videos and share your creativity with the world
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary border-border">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Join Community</h4>
                <p className="text-text-secondary">
                  Connect with creators and viewers who share your interests
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary border-border">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-accent mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Rate & Review</h4>
                <p className="text-text-secondary">
                  Rate videos and help others discover quality content
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12">Join Our Growing Community</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">10K+</div>
              <div className="text-text-secondary">Active Creators</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">1M+</div>
              <div className="text-text-secondary">Videos Uploaded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">50M+</div>
              <div className="text-text-secondary">Views & Counting</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-text-secondary text-lg mb-8">
            Join VideoShare today and become part of the creative community
          </p>
          <Button 
            onClick={() => window.location.href = '/auth'}
            size="lg"
            className="bg-accent hover:bg-pink-600 text-white px-8 py-3 text-lg"
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
}
