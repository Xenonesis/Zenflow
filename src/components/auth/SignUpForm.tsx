import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

export function SignUpForm() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { error } = await signUp(values.email, values.password, values.fullName);
      
      if (error) {
        if (error.message?.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else if (error.message?.includes('rate limit')) {
          setError('Too many attempts. Please try again in a few minutes.');
        } else {
          setError(error.message || 'An error occurred during sign up. Please try again.');
        }
        return;
      }
      
      // Success - redirect to sign in page
      navigate('/signin', { state: { 
        message: 'Account created successfully! Please sign in with your new credentials.' 
      }});
    } catch (err) {
      console.error('Sign up exception:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
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
            Join ZenFlow
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-200 font-light">
            Create your personalized dashboard
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
              
              <motion.div variants={slideUp}>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-800 dark:text-white">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-800 dark:text-white">Confirm Password</FormLabel>
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
                  type="submit" 
                  className="w-full relative bg-gradient-to-r from-indigo-600 to-teal-500 text-white py-6 rounded-xl text-lg font-semibold overflow-hidden group shadow-lg shadow-indigo-500/40 hover:shadow-2xl transition-all duration-300"
                  disabled={isLoading}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-teal-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Sign Up
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
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 text-indigo-600 dark:text-indigo-100 hover:text-indigo-500 dark:hover:text-indigo-200 font-semibold" 
              onClick={() => navigate('/signin')}
            >
              Sign in
            </Button>
          </motion.p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}