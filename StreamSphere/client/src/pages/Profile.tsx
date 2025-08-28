import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import { LogOut, Upload, Eye, Star } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navigation />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Profile Header */}
          <Card className="bg-secondary border-border mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profileImageUrl || undefined} />
                  <AvatarFallback className="text-2xl bg-accent text-white">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.email
                    }
                  </h1>
                  <p className="text-text-secondary mb-4">
                    {user.email}
                  </p>
                  <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-text-secondary">
                    <div className="flex items-center space-x-1">
                      <span className="px-2 py-1 bg-accent rounded-full text-xs text-white capitalize">
                        {user.role}
                      </span>
                    </div>
                    <span>Joined {new Date(user.createdAt!).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="border-border hover:bg-muted"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-secondary border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Videos Uploaded</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  {user.role === 'creator' ? 'Start creating!' : 'Upgrade to creator'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Views on your content
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.0</div>
                <p className="text-xs text-muted-foreground">
                  Out of 5 stars
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Role-specific content */}
          {user.role === 'consumer' && (
            <Card className="bg-secondary border-border">
              <CardHeader>
                <CardTitle>Become a Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Want to share your videos with the world? Upgrade to a creator account to start uploading content.
                </p>
                <Button className="bg-accent hover:bg-pink-600 text-white">
                  Request Creator Access
                </Button>
              </CardContent>
            </Card>
          )}

          {user.role === 'creator' && (
            <Card className="bg-secondary border-border">
              <CardHeader>
                <CardTitle>Your Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Upload className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
                  <p className="text-text-secondary mb-4">
                    Start sharing your creativity with the world
                  </p>
                  <Button className="bg-accent hover:bg-pink-600 text-white">
                    Upload Your First Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
