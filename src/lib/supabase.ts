import { createClient } from "@supabase/supabase-js";

// Define default timeout value (in milliseconds)
const DEFAULT_TIMEOUT = 5000;

// Get Supabase URL and key from environment variables with fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ztrtdfkkwmhdeszjuwrp.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cnRkZmtrd21oZGVzemp1d3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTY5MjEsImV4cCI6MjA2MTk3MjkyMX0.6Z3gLkgDUhPoW1hVBQ0zeTdzwirz090otyjeAMjvfb8";

// Only log an error if we're using the fallback values
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("Using fallback Supabase credentials. For production, set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
}

// Check if variables are properly set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or anonymous key is not set. Check your environment variables.");
}

// Create the Supabase client with optimized settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    // Reduce default timeout to fail faster
    fetch: (url, options) => {
      const controller = new AbortController();
      const { signal } = controller;
      
      // Set timeout to abort the request if it takes too long
      const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
      
      return fetch(url, { ...options, signal }).finally(() => clearTimeout(timeout));
    }
  },
  // Enable debug mode in development
  db: {
    schema: 'public',
  },
  realtime: {
    // Disable realtime subscriptions if not needed
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Verify connection and log any issues
const verifyConnection = async () => {
  try {
    // Try a simple query to verify connection
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection issue:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('Supabase connection successful');
      
      // Verify RLS policies
      const testAuth = await supabase.auth.getSession();
      console.log('Auth session check:', testAuth.data ? 'Session available' : 'No session');
      
      if (testAuth.data?.session) {
        console.log('Verifying profile access with authenticated user...');
        const { error: profileAccessError } = await supabase
          .from('profiles')
          .select('count', { count: 'exact', head: true });
        
        if (profileAccessError) {
          console.error('Profile access error:', profileAccessError);
        } else {
          console.log('Profile access successful');
        }
      }
    }
  } catch (err) {
    console.error('Failed to verify Supabase connection:', err);
  }
};

// Only verify connection in development mode to avoid slowing down production
const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
if (isDev) {
  console.log('Running in development mode, verifying Supabase connection...');
  verifyConnection();
} else {
  console.log('Running in production mode, skipping detailed connection verification');
}

// Type definitions for user data
export type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
};

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type UserProfile = {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  age?: number;
  blood_group?: string;
  height?: number;
  weight?: number;
  gender?: Gender;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

// Authentication helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    } catch (err) {
      console.error('Sign up error:', err);
      return { data: null, error: { message: 'Failed to connect to authentication service' } };
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (err) {
      console.error('Sign in error:', err);
      return { data: null, error: { message: 'Failed to connect to authentication service' } };
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error('Sign out error:', err);
      return { error: { message: 'Failed to sign out' } };
    }
  },
  
  getUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { data, error };
    } catch (err) {
      console.error('Get user error:', err);
      return { data: null, error: { message: 'Failed to get user information' } };
    }
  },
  
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { data, error };
    } catch (err) {
      console.error('Get session error:', err);
      return { data: null, error: { message: 'Failed to get session information' } };
    }
  },
  
  resetPassword: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      return { data, error };
    } catch (err) {
      console.error('Reset password error:', err);
      return { data: null, error: { message: 'Failed to initiate password reset' } };
    }
  }
};

// File storage operations
export const fileStorage = {
  uploadProfileImage: async (userId: string, file: File) => {
    try {
      console.log('Starting profile image upload for user:', userId);
      
      // Create a unique file path using the user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;
      
      console.log('Uploading to path:', filePath);
      
      // Skip the bucket check as it's using an incorrect endpoint
      // Instead, try the upload directly
      console.log('Attempting direct file upload to storage...');
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error('Error uploading file:', error);
        
        // Always create a fallback URL when upload fails, regardless of error code
        const timestamp = Date.now();
        const fallbackUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}-${timestamp}`;
        console.log('Using fallback avatar URL:', fallbackUrl);
        
        return { 
          data: { 
            path: null,
            url: fallbackUrl
          }, 
          error: null 
        };
      }
      
      console.log('File uploaded successfully, getting public URL');
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      console.log('Public URL generated:', urlData.publicUrl);
      
      return { 
        data: { 
          path: data?.path,
          url: urlData.publicUrl
        }, 
        error: null 
      };
    } catch (err) {
      console.error('File upload error:', err);
      
      // Generate fallback avatar when any error occurs
      const timestamp = Date.now();
      const fallbackUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}-${timestamp}`;
      console.log('Using fallback avatar URL after error:', fallbackUrl);
      
      return { 
        data: { 
          path: null,
          url: fallbackUrl
        }, 
        error: null 
      };
    }
  },
  
  deleteProfileImage: async (filePath: string) => {
    try {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);
      
      return { error };
    } catch (err) {
      console.error('File deletion error:', err);
      return { error: { message: 'Failed to delete image' } };
    }
  }
};

// User data helpers
export const userData = {
  getUserProfile: async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const startTime = performance.now();
      
      // Include preferences in the select fields
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, avatar_url, age, blood_group, height, weight, gender, preferences, created_at, updated_at')
        .eq('user_id', userId)
        .single();
      
      const endTime = performance.now();
      console.log(`Database query completed in ${(endTime - startTime).toFixed(2)}ms`);
      
      if (error) {
        // If "not found" error, create an empty profile automatically
        if (error.code === 'PGRST116') {
          console.log('Profile not found for user, creating a default profile');
          return await createDefaultProfile(userId);
        }
        
        console.error('Get profile error:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Get profile error:', err);
      return { data: null, error: { message: 'Failed to fetch user profile' } };
    }
  },
  
  updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
    try {
      console.log('Updating profile for user:', userId);
      console.log('Update data:', JSON.stringify(updates, null, 2));
      
      if (!userId) {
        console.error('Missing userId in updateUserProfile');
        return { data: null, error: { message: 'User ID is required' } };
      }
      
      // Sanitize the updates object to ensure it's valid
      const sanitizedUpdates = { ...updates };
      
      // Ensure numeric fields are properly converted
      if (sanitizedUpdates.age !== undefined) {
        sanitizedUpdates.age = typeof sanitizedUpdates.age === 'string' 
          ? parseInt(sanitizedUpdates.age, 10) 
          : sanitizedUpdates.age;
          
        // Convert 0, NaN, or negative values to null
        if (!sanitizedUpdates.age || isNaN(sanitizedUpdates.age) || sanitizedUpdates.age < 0) {
          sanitizedUpdates.age = null;
        }
      }
      
      if (sanitizedUpdates.height !== undefined) {
        sanitizedUpdates.height = typeof sanitizedUpdates.height === 'string' 
          ? parseFloat(sanitizedUpdates.height) 
          : sanitizedUpdates.height;
          
        // Convert 0, NaN, or negative values to null
        if (!sanitizedUpdates.height || isNaN(sanitizedUpdates.height) || sanitizedUpdates.height < 0) {
          sanitizedUpdates.height = null;
        }
      }
      
      if (sanitizedUpdates.weight !== undefined) {
        sanitizedUpdates.weight = typeof sanitizedUpdates.weight === 'string' 
          ? parseFloat(sanitizedUpdates.weight) 
          : sanitizedUpdates.weight;
          
        // Convert 0, NaN, or negative values to null
        if (!sanitizedUpdates.weight || isNaN(sanitizedUpdates.weight) || sanitizedUpdates.weight < 0) {
          sanitizedUpdates.weight = null;
        }
      }
      
      // Validate blood_group against allowed values
      if (sanitizedUpdates.blood_group !== undefined) {
        const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        
        // Convert empty string or invalid values to null
        if (!sanitizedUpdates.blood_group || !validBloodGroups.includes(sanitizedUpdates.blood_group)) {
          console.log('Converting invalid blood group to null:', sanitizedUpdates.blood_group);
          sanitizedUpdates.blood_group = null;
        }
      }
      
      // Validate gender against allowed values
      if (sanitizedUpdates.gender !== undefined) {
        const validGenders = ['male', 'female', 'other', 'prefer_not_to_say'];
        
        // Convert empty string or invalid values to null
        if (!sanitizedUpdates.gender || !validGenders.includes(sanitizedUpdates.gender as string)) {
          console.log('Converting invalid gender to null:', sanitizedUpdates.gender);
          sanitizedUpdates.gender = null;
        }
      }
      
      // First check if the profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      // Log profile check results
      if (existingProfile) {
        console.log('Existing profile found:', existingProfile.id);
      } else {
        console.log('No existing profile found, will create new one');
      }
        
      // If there's an error checking, and it's not just a "not found" error
      if (checkError) {
        console.error('Error checking profile existence:', checkError);
        if (checkError.code !== 'PGRST116') {
          return { data: null, error: { message: checkError.message || 'Error checking profile' } };
        } else {
          console.log('Profile not found error (expected for new users)');
        }
      }
      
      // Ensure avatar_url is preserved if not explicitly updated
      if (existingProfile && !sanitizedUpdates.avatar_url && existingProfile.avatar_url) {
        console.log('Preserving existing avatar_url:', existingProfile.avatar_url);
        sanitizedUpdates.avatar_url = existingProfile.avatar_url;
      }
      
      // Properly handle preferences as a JSONB object
      if (sanitizedUpdates.preferences) {
        console.log('Processing preferences:', sanitizedUpdates.preferences);
        // Ensure preferences is an object, not a string
        if (typeof sanitizedUpdates.preferences === 'string') {
          try {
            sanitizedUpdates.preferences = JSON.parse(sanitizedUpdates.preferences);
          } catch (e) {
            console.error('Failed to parse preferences string:', e);
            sanitizedUpdates.preferences = { bio: sanitizedUpdates.preferences };
          }
        }
        
        // Merge with existing preferences if available
        if (existingProfile && existingProfile.preferences) {
          sanitizedUpdates.preferences = {
            ...(existingProfile.preferences || {}),
            ...(sanitizedUpdates.preferences || {})
          };
        }
      }
      
      console.log('Sanitized update data:', JSON.stringify(sanitizedUpdates, null, 2));
      
      let result;
      
      // If profile exists, update it
      if (existingProfile) {
        console.log('Updating existing profile');
        const updateData = {
          ...sanitizedUpdates,
          updated_at: new Date().toISOString()
        };
        console.log('Update payload:', JSON.stringify(updateData, null, 2));
        
        result = await supabase
          .from('profiles')
          .update(updateData)
          .eq('user_id', userId)
          .select()
          .single();
      } else {
        // If profile doesn't exist, insert it
        console.log('Creating new profile');
        const insertData = {
          user_id: userId,
          ...sanitizedUpdates,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        console.log('Insert payload:', JSON.stringify(insertData, null, 2));
        
        result = await supabase
          .from('profiles')
          .insert(insertData)
          .select()
          .single();
      }
      
      if (result.error) {
        console.error('Error in profile operation:', result.error);
        return { 
          data: null, 
          error: { 
            message: result.error.message || 'Failed to update profile',
            details: result.error.details,
            code: result.error.code
          } 
        };
      }
      
      console.log('Profile operation successful:', result.data);
      return { data: result.data, error: null };
    } catch (err) {
      console.error('Update profile error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return { 
        data: null, 
        error: { 
          message: `Failed to update user profile: ${errorMessage}`,
          details: err
        } 
      };
    }
  },
  
  // Add more user data operations as needed
};

// Helper function to create a default profile
async function createDefaultProfile(userId: string) {
  try {
    console.log('Creating default profile for user:', userId);
    
    const defaultProfile = {
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(defaultProfile)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating default profile:', error);
      return { data: null, error };
    }
    
    console.log('Default profile created successfully');
    return { data, error: null };
  } catch (err) {
    console.error('Failed to create default profile:', err);
    return { data: null, error: { message: 'Failed to create default user profile' } };
  }
}

// Add this export at the top of the file, right after the supabase client creation:
export const getSupabaseClient = () => {
  return supabase;
};

export default supabase; 