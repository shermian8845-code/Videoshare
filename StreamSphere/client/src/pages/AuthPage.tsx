import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loginSchema, registerSchema, LoginData, RegisterData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Video, Star, Upload, Users } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "consumer",
    },
  });

  const authMutation = useMutation({
    mutationFn: async (data: LoginData | RegisterData) => {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await apiRequest('POST', endpoint, data);
      return response.json();
    },
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      // Set authorization header for future requests
      queryClient.setQueryData(['/api/user'], data.user);
      toast({
        title: "Success",
        description: isLogin ? "Logged in successfully!" : "Account created successfully!",
      });
      // Refresh the page to trigger auth state change
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (data: LoginData) => {
    authMutation.mutate(data);
  };

  const handleRegister = (data: RegisterData) => {
    authMutation.mutate(data);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="flex min-h-screen">
        {/* Left side - Auth form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-md bg-secondary border-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Video className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl font-bold text-text-primary">
                {isLogin ? 'Welcome Back' : 'Join VideoShare'}
              </CardTitle>
              <p className="text-text-secondary">
                {isLogin 
                  ? 'Sign in to your account to continue' 
                  : 'Create your account and start sharing'
                }
              </p>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="bg-primary border-border text-text-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="bg-primary border-border text-text-primary pr-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 text-text-secondary hover:text-text-primary"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-pink-600 text-white"
                      disabled={authMutation.isPending}
                    >
                      {authMutation.isPending ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
                                className="bg-primary border-border text-text-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                className="bg-primary border-border text-text-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="johndoe"
                              className="bg-primary border-border text-text-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              className="bg-primary border-border text-text-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-primary border-border text-text-primary">
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-secondary border-border">
                              <SelectItem value="consumer">Consumer - Watch and interact</SelectItem>
                              <SelectItem value="creator">Creator - Upload and share videos</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className="bg-primary border-border text-text-primary pr-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 text-text-secondary hover:text-text-primary"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className="bg-primary border-border text-text-primary pr-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 text-text-secondary hover:text-text-primary"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-pink-600 text-white"
                      disabled={authMutation.isPending}
                    >
                      {authMutation.isPending ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </Form>
              )}

              <div className="mt-6 text-center">
                <p className="text-text-secondary">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <Button 
                    variant="link" 
                    className="p-0 ml-2 text-accent hover:text-pink-600"
                    onClick={switchMode}
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Button>
                </p>
              </div>

              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-primary rounded-lg border border-border">
                <p className="text-sm text-text-secondary mb-2">Demo Credentials:</p>
                <div className="space-y-1 text-xs text-text-secondary">
                  <p>Creator: john.creator@example.com / password123</p>
                  <p>Consumer: sarah.consumer@example.com / password123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Hero */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent/20 to-accent/5 items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center">
                  <Video className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Share Your Story
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Join millions of creators and viewers in the ultimate video sharing experience.
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <Upload className="h-5 w-5 text-accent" />
                <span className="text-text-secondary">Upload unlimited videos</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-text-secondary">Connect with your audience</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-accent" />
                <span className="text-text-secondary">Rate and discover content</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}