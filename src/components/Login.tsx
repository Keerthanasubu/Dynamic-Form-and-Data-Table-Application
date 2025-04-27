
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types/authTypes';
import { motion } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, User, AlertCircle, LogIn, Eye, EyeOff, ChevronDown, ChevronUp, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const Login: React.FC = () => {
  const { login, authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      await login(data);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (username: string, password: string) => {
    form.setValue('username', username);
    form.setValue('password', password);
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <Card className="w-full backdrop-blur-lg bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 shadow-xl rounded-2xl relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-30"
        animate={{ 
          scale: [1, 1.02, 1],
          opacity: [0.2, 0.3, 0.2] 
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <CardHeader className="space-y-2 text-center pb-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-2"
        >
          <Building className="h-12 w-12 text-primary mx-auto mb-2" />
        </motion.div>
        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/90 to-primary/70">
          Medical Records
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Login with your credentials
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Username</FormLabel>
                  <FormControl>
                    <motion.div 
                      className="relative group"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    >
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                      <Input 
                        placeholder="Enter your username" 
                        className="pl-10 h-12 bg-background/50 border-muted/30 focus:border-primary transition-all duration-200" 
                        {...field} 
                        aria-label="Username"
                      />
                    </motion.div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Password</FormLabel>
                  <FormControl>
                    <motion.div 
                      className="relative group"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    >
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        className="pl-10 pr-10 h-12 bg-background/50 border-muted/30 focus:border-primary transition-all duration-200" 
                        {...field} 
                        aria-label="Password"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </motion.div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {authState.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authState.error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            <motion.div
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary via-primary to-primary/90 hover:opacity-90 transition-all duration-200" 
                disabled={isLoading || authState.isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col items-center text-center text-sm text-muted-foreground pt-0">
        <Collapsible
          open={isCredentialsOpen}
          onOpenChange={setIsCredentialsOpen}
          className="w-full space-y-2"
        >
          <div className="flex items-center justify-center mb-1">
            <p className="text-sm font-medium">Demo Credentials</p>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8 ml-1">
                {isCredentialsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="space-y-2">
            <TooltipProvider>
              <div className="flex flex-col gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs justify-start"
                      onClick={() => fillCredentials('admin', 'admin123')}
                    >
                      🔑 admin / admin123
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to autofill</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs justify-start"
                      onClick={() => fillCredentials('doctor', 'doctor123')}
                    >
                      🔑 doctor / doctor123
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to autofill</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs justify-start"
                      onClick={() => fillCredentials('nurse', 'nurse123')}
                    >
                      🔑 nurse / nurse123
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to autofill</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
};

export default Login;
