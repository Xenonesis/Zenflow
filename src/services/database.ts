import { getSupabaseClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Profile, Workout, WorkoutPlan, HealthMetric } from '@/types/database';

export const initializeDatabase = async () => {
  try {
    const supabase = getSupabaseClient();
    
    // Read the SQL script from the assets
    const response = await fetch('/scripts/db-setup.sql');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch the SQL script: ${response.statusText}`);
    }
    
    const sqlScript = await response.text();
    
    // Execute the SQL script
    const { error } = await supabase.rpc('exec_sql', { sql_query: sqlScript });
    
    if (error) {
      console.error('Error initializing database:', error);
      
      // Handle common errors
      if (error.message.includes('42710') || error.message.includes('already exists')) {
        return { 
          success: true, 
          message: 'Database was already initialized. Any existing objects were preserved.', 
          warning: true 
        };
      }
      
      // Permission errors
      if (error.message.includes('permission denied') || error.message.includes('42501')) {
        return { 
          success: false, 
          error: { 
            message: 'Permission denied. Please ensure your Supabase account has the necessary permissions to create tables and policies.' 
          } 
        };
      }
      
      return { 
        success: false, 
        error 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return { 
      success: false, 
      error: { 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      } 
    };
  }
};

// Profile Operations
export const getProfile = async (user: User) => {
  const supabase = getSupabaseClient();
  
  try {
    // First try to get the existing profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      
      // If profile doesn't exist, create a default one
      if (error.code === 'PGRST116') {
        console.log('Profile not found, creating default profile');
        
        // Create a default profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating default profile:', createError);
          return { success: false, error: createError };
        }
        
        return { success: true, data: newProfile };
      }
      
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    return { 
      success: false, 
      error: { 
        message: err instanceof Error ? err.message : 'An unknown error occurred' 
      } 
    };
  }
};

export const updateProfile = async (user: User, profile: Partial<Profile>) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('user_id', user.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

// Workout Operations
export const getWorkouts = async (user: User) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching workouts:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const addWorkout = async (user: User, workout: Omit<Workout, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('workouts')
    .insert({
      ...workout,
      user_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding workout:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const updateWorkout = async (user: User, id: string, workout: Partial<Workout>) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('workouts')
    .update(workout)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating workout:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const deleteWorkout = async (user: User, id: string) => {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
    
  if (error) {
    console.error('Error deleting workout:', error);
    return { success: false, error };
  }
  
  return { success: true };
};

// Health Metrics Operations
export const getHealthMetrics = async (user: User, metricType?: string) => {
  const supabase = getSupabaseClient();
  
  let query = supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', user.id);
    
  if (metricType) {
    query = query.eq('metric_type', metricType);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching health metrics:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const addHealthMetric = async (user: User, metric: Omit<HealthMetric, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('health_metrics')
    .insert({
      ...metric,
      user_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding health metric:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const updateHealthMetric = async (user: User, id: string, metric: Partial<HealthMetric>) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('health_metrics')
    .update(metric)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating health metric:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const deleteHealthMetric = async (user: User, id: string) => {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('health_metrics')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
    
  if (error) {
    console.error('Error deleting health metric:', error);
    return { success: false, error };
  }
  
  return { success: true };
};

// Workout Plan Operations
export const getWorkoutPlans = async (user: User) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching workout plans:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const getPublicWorkoutPlans = async () => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching public workout plans:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const addWorkoutPlan = async (user: User, workoutPlan: Omit<WorkoutPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('workout_plans')
    .insert({
      ...workoutPlan,
      user_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding workout plan:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const updateWorkoutPlan = async (user: User, id: string, workoutPlan: Partial<WorkoutPlan>) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('workout_plans')
    .update(workoutPlan)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating workout plan:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const deleteWorkoutPlan = async (user: User, id: string) => {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('workout_plans')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
    
  if (error) {
    console.error('Error deleting workout plan:', error);
    return { success: false, error };
  }
  
  return { success: true };
};

// Export/Import Operations
export const exportUserData = async (user: User) => {
  try {
    const supabase = getSupabaseClient();
    
    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (profileError) throw profileError;
    
    // Get workouts
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id);
      
    if (workoutsError) throw workoutsError;
    
    // Get health metrics
    const { data: healthMetrics, error: healthMetricsError } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', user.id);
      
    if (healthMetricsError) throw healthMetricsError;
    
    return { 
      success: true, 
      data: {
        profile,
        workouts,
        healthMetrics,
        exportDate: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error exporting user data:', error);
    return { 
      success: false, 
      error: { 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      } 
    };
  }
};

export const importUserData = async (user: User, data: any) => {
  const supabase = getSupabaseClient();
  
  try {
    // Validate the import data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid import data format');
    }
    
    // Start a transaction
    const { error: txError } = await supabase.rpc('begin_transaction');
    if (txError) throw txError;
    
    try {
      // Update profile if provided
      if (data.profile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            ...data.profile,
            user_id: user.id,
            updated_at: new Date().toISOString()
          });
          
        if (profileError) throw profileError;
      }
      
      // Import workouts if provided
      if (data.workouts && Array.isArray(data.workouts)) {
        for (const workout of data.workouts) {
          const { error: workoutError } = await supabase
            .from('workouts')
            .upsert({
              ...workout,
              user_id: user.id,
              updated_at: new Date().toISOString()
            });
            
          if (workoutError) throw workoutError;
        }
      }
      
      // Import health metrics if provided
      if (data.healthMetrics && Array.isArray(data.healthMetrics)) {
        for (const metric of data.healthMetrics) {
          const { error: metricError } = await supabase
            .from('health_metrics')
            .upsert({
              ...metric,
              user_id: user.id,
              updated_at: new Date().toISOString()
            });
            
          if (metricError) throw metricError;
        }
      }
      
      // Commit the transaction
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) throw commitError;
      
      return { success: true };
    } catch (error) {
      // Rollback on error
      await supabase.rpc('rollback_transaction');
      throw error;
    }
  } catch (error) {
    console.error('Error importing user data:', error);
    return { 
      success: false, 
      error: { 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      } 
    };
  }
}; 