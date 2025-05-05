import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase, auth, User } from './supabase';
import { Session } from '@supabase/supabase-js';

// Create a local storage key for caching user data
const USER_CACHE_KEY = 'zenflow_cached_user';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const authInitialized = useRef(false);
  
  // Initialize with cached user data if available
  useEffect(() => {
    try {
      const cachedUserData = localStorage.getItem(USER_CACHE_KEY);
      if (cachedUserData) {
        const userData = JSON.parse(cachedUserData);
        // Only use cached data if it's not too old (e.g., less than 1 hour old)
        const isRecent = new Date().getTime() - userData.cachedAt < 60 * 60 * 1000;
        if (isRecent) {
          console.log('Using cached user data');
          setUser(userData.user);
          // Temporarily reduce loading state to provide faster UI response
          setLoading(false);
        }
      }
    } catch (err) {
      console.warn('Error reading cached user data:', err);
    }
  }, []);

  // Set up authentication listener and initial session
  useEffect(() => {
    if (authInitialized.current) return;
    authInitialized.current = true;
    
    // Check active session on mount
    const getInitialSession = async () => {
      const startTime = performance.now();
      setLoading(true);
      
      try {
        // Get the current session
        const { data: sessionData, error: sessionError } = await auth.getSession();
        
        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          setLoading(false);
          return;
        }
        
        console.log('Initial session data:', sessionData);
        setSession(sessionData?.session || null);
        
        if (sessionData?.session) {
          // Get the user data if there's an active session
          const { data: userData, error: userError } = await auth.getUser();
          
          if (userError) {
            console.error('Error fetching user:', userError);
          } else {
            console.log('Initial user data:', userData);
            if (userData?.user) {
              const newUserData = {
                id: userData.user.id,
                email: userData.user.email || '',
                created_at: userData.user.created_at || '',
                updated_at: userData.user.updated_at || '',
              };
              
              setUser(newUserData);
              
              // Cache the user data for faster initial loads
              try {
                localStorage.setItem(USER_CACHE_KEY, JSON.stringify({
                  user: newUserData,
                  cachedAt: new Date().getTime()
                }));
              } catch (err) {
                console.warn('Error caching user data:', err);
              }
            }
          }
        } else {
          // Clear user if no session
          setUser(null);
          try {
            localStorage.removeItem(USER_CACHE_KEY);
          } catch (error) {
            console.warn('Error removing cached user data:', error);
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        setLoading(false);
        const endTime = performance.now();
        console.log(`Auth initialization completed in ${(endTime - startTime).toFixed(2)}ms`);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
        setSession(session);
        
        if (session) {
          try {
            const { data: userData, error: userError } = await auth.getUser();
            
            if (userError) {
              console.error('Error fetching user after auth change:', userError);
            } else {
              console.log('User data after auth change:', userData);
              if (userData?.user) {
                const newUserData = {
                  id: userData.user.id,
                  email: userData.user.email || '',
                  created_at: userData.user.created_at || '',
                  updated_at: userData.user.updated_at || '',
                };
                setUser(newUserData);
                
                // Update cached user data
                try {
                  localStorage.setItem(USER_CACHE_KEY, JSON.stringify({
                    user: newUserData,
                    cachedAt: new Date().getTime()
                  }));
                } catch (err) {
                  console.warn('Error caching user data:', err);
                }
              }
            }
          } catch (err) {
            console.error('Error in auth state change handler:', err);
          }
        } else {
          setUser(null);
          // Clear cached user data on sign out
          try {
            localStorage.removeItem(USER_CACHE_KEY);
          } catch (err) {
            console.warn('Error removing cached user data:', err);
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      // Clean up subscription on unmount
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signUp: auth.signUp,
    signIn: auth.signIn,
    signOut: auth.signOut,
    resetPassword: auth.resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 