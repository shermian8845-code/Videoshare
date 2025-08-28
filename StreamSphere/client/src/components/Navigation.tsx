import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { Search, Upload, Menu, X, User, LogOut } from "lucide-react";

interface NavigationProps {
  onUpload?: () => void;
}

export default function Navigation({ onUpload }: NavigationProps) {
  const { user } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <>
      <nav className="floating-nav fixed top-0 left-0 right-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowMobileMenu(true)}
              className="text-text-primary hover:text-accent transition-colors md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/">
              <h1 className="text-2xl font-bold text-accent cursor-pointer">VideoShare</h1>
            </Link>
          </div>
          
          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search videos, creators, genres..."
                className="w-full bg-primary border-border rounded-full px-4 py-2 pl-12 text-text-primary placeholder-text-secondary"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-5 w-5" />
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {user?.role === 'creator' && (
              <Button 
                onClick={onUpload}
                className="hidden md:flex bg-accent hover:bg-pink-600 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            )}
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-accent text-white text-sm">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-secondary border-border" align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-secondary w-64 h-full p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-text-primary">Menu</h2>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <Link href="/">
                <div className="flex items-center space-x-3 text-text-primary hover:text-accent transition-colors cursor-pointer">
                  <i className="fas fa-home"></i>
                  <span>Home</span>
                </div>
              </Link>
              <div className="flex items-center space-x-3 text-text-primary hover:text-accent transition-colors cursor-pointer">
                <Search className="h-5 w-5" />
                <span>Search</span>
              </div>
              <Link href="/profile">
                <div className="flex items-center space-x-3 text-text-primary hover:text-accent transition-colors cursor-pointer">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </div>
              </Link>
              {user?.role === 'creator' && (
                <div 
                  onClick={onUpload}
                  className="flex items-center space-x-3 text-text-primary hover:text-accent transition-colors cursor-pointer"
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload Video</span>
                </div>
              )}
              <div 
                onClick={logout}
                className="flex items-center space-x-3 text-text-primary hover:text-accent transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
