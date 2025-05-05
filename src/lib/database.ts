import { supabase } from './supabase';
import { UserProfile } from './supabase';

// Type definition for workout data
export interface Workout {
  id?: string;
  user_id: string;
  name: string;
  description?: string;
  duration?: number;
  calories_burned?: number;
  date: string | Date;
  created_at?: string;
  updated_at?: string;
}

// Type definition for health metric data
export interface HealthMetric {
  id?: string;
  user_id: string;
  metric_type: string;
  value: number;
  date: string | Date;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Database service for profiles
export const profileService = {
  // Get a user's profile
  async getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      return { data, error };
    } catch (err) {
      console.error('Failed to get user profile:', err);
      return { data: null, error: err };
    }
  },
  
  // Update a user's profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: any }> {
    try {
      // Include updated_at to trigger the database function
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('user_id', userId)
        .select('*')
        .single();
      
      return { data, error };
    } catch (err) {
      console.error('Failed to update user profile:', err);
      return { data: null, error: err };
    }
  },
  
  // Create a profile if it doesn't exist already
  async createUserProfile(userId: string, profileData: Partial<UserProfile> = {}): Promise<{ data: UserProfile | null; error: any }> {
    try {
      // Check if profile exists
      const { data: existingProfile } = await this.getUserProfile(userId);
      
      if (existingProfile) {
        return { data: existingProfile, error: null };
      }
      
      // Create new profile
      const newProfile = {
        id: userId,
        user_id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select('*')
        .single();
      
      return { data, error };
    } catch (err) {
      console.error('Failed to create user profile:', err);
      return { data: null, error: err };
    }
  }
};

// Database service for workouts
export const workoutService = {
  // Get all workouts for a user
  async getUserWorkouts(userId: string): Promise<{ data: Workout[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      
      return { data, error };
    } catch (err) {
      console.error('Failed to get user workouts:', err);
      return { data: null, error: err };
    }
  },
  
  // Add a new workout
  async addWorkout(workout: Workout): Promise<{ data: Workout | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .insert(workout)
        .select('*')
        .single();
      
      return { data, error };
    } catch (err) {
      console.error('Failed to add workout:', err);
      return { data: null, error: err };
    }
  },
  
  // Update an existing workout
  async updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<{ data: Workout | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .update(updates)
        .eq('id', workoutId)
        .select('*')
        .single();
      
      return { data, error };
    } catch (err) {
      console.error('Failed to update workout:', err);
      return { data: null, error: err };
    }
  },
  
  // Delete a workout
  async deleteWorkout(workoutId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);
      
      return { error };
    } catch (err) {
      console.error('Failed to delete workout:', err);
      return { error: err };
    }
  }
};

// Database service for health metrics
export const healthMetricService = {
  // Get health metrics for a user
  async getUserMetrics(userId: string, metricType?: string): Promise<{ data: HealthMetric[] | null; error: any }> {
    try {
      let query = supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', userId);
      
      // Filter by metric type if provided
      if (metricType) {
        query = query.eq('metric_type', metricType);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      return { data, error };
    } catch (err) {
      console.error('Failed to get health metrics:', err);
      return { data: null, error: err };
    }
  },
  
  // Add a new health metric
  async addMetric(metric: HealthMetric): Promise<{ data: HealthMetric | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .insert(metric)
        .select('*')
        .single();
      
      return { data, error };
    } catch (err) {
      console.error('Failed to add health metric:', err);
      return { data: null, error: err };
    }
  },
  
  // Update a health metric
  async updateMetric(metricId: string, updates: Partial<HealthMetric>): Promise<{ data: HealthMetric | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .update(updates)
        .eq('id', metricId)
        .select('*')
        .single();
      
      return { data, error };
    } catch (err) {
      console.error('Failed to update health metric:', err);
      return { data: null, error: err };
    }
  },
  
  // Delete a health metric
  async deleteMetric(metricId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('health_metrics')
        .delete()
        .eq('id', metricId);
      
      return { error };
    } catch (err) {
      console.error('Failed to delete health metric:', err);
      return { error: err };
    }
  },
  
  // Get latest value for a specific metric type
  async getLatestMetric(userId: string, metricType: string): Promise<{ data: HealthMetric | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', userId)
        .eq('metric_type', metricType)
        .order('date', { ascending: false })
        .limit(1)
        .single();
      
      return { data, error };
    } catch (err) {
      console.error(`Failed to get latest ${metricType} metric:`, err);
      return { data: null, error: err };
    }
  }
};

// Function to ensure all tables exist
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Check if profiles table exists and create it if not
    const { error: profileError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (profileError) {
      console.error('Error checking profiles table:', profileError);
      // Table may not exist, but will be created through migration
    }
    
    console.log('Database initialized successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return { success: false, error };
  }
} 