import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: SupabaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: (options?: { scopes?: string; redirectTo?: string }) => Promise<void>;
  session: Session | null;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize auth state and listen for changes
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error restoring session:', error.message);
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setIsAuthenticated(!!data.session);
        if (data.session) {
          localStorage.setItem('supabase.auth.session', JSON.stringify(data.session));
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth event:', event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsAuthenticated(!!newSession);
      setIsLoading(false);

      if (newSession) {
        localStorage.setItem('supabase.auth.session', JSON.stringify(newSession));
      } else {
        localStorage.removeItem('supabase.auth.session');
      }

      // Refresh user data on sign-in or token refresh
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        try {
          const { data: userData, error } = await supabase.auth.getUser();
          if (error) throw error;
          setUser(userData.user ?? null);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      setSession(data.session);
      setUser(data.user ?? null);
      setIsAuthenticated(!!data.session);
      if (data.session) {
        localStorage.setItem('supabase.auth.session', JSON.stringify(data.session));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Register with name, email, and password
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8B5CF6&color=fff`,
          },
        },
      });
      if (error) throw new Error(error.message);
      setSession(data.session);
      setUser(data.user ?? null);
      setIsAuthenticated(!!data.session);
      if (data.session) {
        localStorage.setItem('supabase.auth.session', JSON.stringify(data.session));
      }
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (options?: { scopes?: string; redirectTo?: string }) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: options?.scopes ? `${options.scopes} email profile` : 'email profile',
          redirectTo: options?.redirectTo || window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw new Error(error instanceof Error ? error.message : 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      // Ensure session exists before attempting sign-out
      const { data: currentSession, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn('No active session to sign out from:', sessionError.message);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);

      // Clear local state and storage
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('supabase.auth.session');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Manually refresh session
  const refreshSession = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh error:', error.message);
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('supabase.auth.session');
        return false;
      }
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user ?? null);
        setIsAuthenticated(true);
        localStorage.setItem('supabase.auth.session', JSON.stringify(data.session));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to refresh session:', err);
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('supabase.auth.session');
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    signInWithGoogle,
    session,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};