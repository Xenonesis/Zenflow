import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, auth, User } from './supabase';
import { Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Set up authentication listener and initial session
  useEffect(() => {
    // Check active session on mount
    const getInitialSession = async () => {
      setLoading(true);
      
      try {
        // Get the current session
        const { data: sessionData, error: sessionError } = await auth.getSession();
        
        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          setLoading(false);
          return;
        }
        
        setSession(sessionData?.session || null);
        
        if (sessionData?.session) {
          // Get the user data if there's an active session
          try {
            const { data: userData, error: userError } = await auth.getUser();
            
            if (userError) {
              console.error('Error fetching user:', userError);
            } else if (userData?.user) {
              const newUserData = {
                id: userData.user.id,
                email: userData.user.email || '',
                created_at: userData.user.created_at || '',
                updated_at: userData.user.updated_at || '',
              };
              
              setUser(newUserData);
              
              // Get user profile data
              try {
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('user_id', userData.user.id)
                  .single();
                  
                if (profileData) {
                  setUser(prev => ({
                    ...prev!,
                    profile: profileData
                  }));
                }
              } catch (profileErr) {
                console.error('Error fetching profile:', profileErr);
              }
            }
          } catch (userErr) {
            console.error('Error in user data fetch:', userErr);
          }
        } else {
          // Clear user if no session
          setUser(null);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        
        if (session) {
          try {
            const { data: userData } = await auth.getUser();
            if (userData?.user) {
              const newUserData = {
                id: userData.user.id,
                email: userData.user.email || '',
                created_at: userData.user.created_at || '',
                updated_at: userData.user.updated_at || '',
              };
              setUser(newUserData);
              
              // Get user profile
              try {
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('user_id', userData.user.id)
                  .single();
                  
                if (profileData) {
                  setUser(prev => ({
                    ...prev!,
                    profile: profileData
                  }));
                }
              } catch (profileErr) {
                console.error('Error fetching profile on auth change:', profileErr);
              }
            }
          } catch (err) {
            console.error('Error in auth state change handler:', err);
          }
        } else {
          setUser(null);
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