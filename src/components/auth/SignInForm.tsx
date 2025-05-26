import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export function SignInForm() {
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(location.state?.message || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      await login(values.email, values.password);
      navigate(from);
    } catch (err) {
      const error = err as Error;
      setError(error.message.includes('Invalid login credentials') 
        ? 'The email or password you entered is incorrect. Please try again.' 
        : error.message || 'An error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setIsGoogleLoading(true);
    
    try {
      await signInWithGoogle();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An error occurred during Google sign in. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="w-full max-w-md mx-auto"
    >
      <Card className="relative bg-white/20 dark:bg-indigo-900/50 border border-white/30 dark:border-indigo-700/50 backdrop-blur-md shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-br from-indigo-500/30 to-teal-400/30 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute bottom-0 left-0 h-48 w-48 bg-gradient-to-br from-purple-500/30 to-pink-400/30 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient"></div>
        
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient">
            Welcome Back to ZenFlow
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-200 font-light">
            Sign in to your personalized dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <motion.div variants={slideUp}>
                  <Alert variant="destructive" className="bg-red-100/80 dark:bg-red-900/50 border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-200 backdrop-blur-md">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              
              {success && (
                <motion.div variants={slideUp}>
                  <Alert className="bg-emerald-100/80 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-200 backdrop-blur-md">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              
              <motion.div variants={slideUp}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-6 rounded-xl text-lg font-semibold transition-colors"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                >
                  <FaGoogle className="h-5 w-5 text-red-500" />
                  {isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google'}
                </Button>
              </motion.div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <motion.div variants={slideUp}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-800 dark:text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your.email@example.com" 
                          {...field} 
                          className="bg-white/10 dark:bg-indigo-800/10 border-white/20 dark:border-indigo-700/20 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 backdrop-blur-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={slideUp}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-800 dark:text-white">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="bg-white/10 dark:bg-indigo-800/10 border-white/20 dark:border-indigo-700/20 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 backdrop-blur-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={slideUp}>
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto text-indigo-600 dark:text-indigo-100 hover:text-indigo-500 dark:hover:text-indigo-200 font-semibold"
                  onClick={handleResetPassword}
                >
                  Forgot your password?
                </Button>
              </motion.div>
              
              <motion.div variants={slideUp}>
                <Button 
                  type="submit" 
                  className="w-full relative bg-gradient-to-r from-indigo-600 to-teal-500 text-white py-6 rounded-xl text-lg font-semibold overflow-hidden group shadow-lg shadow-indigo-500/40 hover:shadow-2xl transition-all duration-300"
                  disabled={isLoading}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-teal-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <motion.p 
            variants={slideUp}
            className="text-sm text-slate-500 dark:text-slate-400 font-light"
          >
            Don't have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 text-indigo-600 dark:text-indigo-100 hover:text-indigo-500 dark:hover:text-indigo-200 font-semibold" 
              onClick={() => navigate('/signup')}
            >
              Sign up
            </Button>
          </motion.p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}