import { supabase } from './supabase';

// Types for health metrics
export type HealthMetric = {
  id?: string;
  user_id: string;
  metric_type: 'weight' | 'steps' | 'sleep' | 'water' | 'mood' | 'meditation' | 'workout' | 'heart_rate' | 'custom';
  value: number;
  unit?: string;
  notes?: string;
  recorded_at: string;
  created_at?: string;
};

export type WorkoutSession = {
  id?: string;
  user_id: string;
  name: string;
  workout_type: string;
  duration: number; // in minutes
  calories_burned?: number;
  intensity?: 'low' | 'medium' | 'high';
  notes?: string;
  recorded_at: string;
  created_at?: string;
};

export type MoodEntry = {
  id?: string;
  user_id: string;
  mood_score: number; // 1-10
  mood_label?: 'terrible' | 'bad' | 'poor' | 'neutral' | 'good' | 'great' | 'excellent';
  factors?: string[];
  notes?: string;
  recorded_at: string;
  created_at?: string;
};

// Health data functions
export const healthData = {
  // Metrics
  addMetric: async (metric: HealthMetric) => {
    const { data, error } = await supabase
      .from('health_metrics')
      .insert(metric)
      .select()
      .single();
    return { data, error };
  },
  
  updateMetric: async (id: string, updates: Partial<HealthMetric>) => {
    const { data, error } = await supabase
      .from('health_metrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },
  
  deleteMetric: async (id: string) => {
    const { error } = await supabase
      .from('health_metrics')
      .delete()
      .eq('id', id);
    return { error };
  },
  
  getMetricsByUser: async (userId: string, metricType?: string, startDate?: string, endDate?: string) => {
    let query = supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });
    
    if (metricType) {
      query = query.eq('metric_type', metricType);
    }
    
    if (startDate) {
      query = query.gte('recorded_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('recorded_at', endDate);
    }
    
    const { data, error } = await query;
    return { data, error };
  },
  
  // Workouts
  addWorkout: async (workout: WorkoutSession) => {
    const { data, error } = await supabase
      .from('workouts')
      .insert(workout)
      .select()
      .single();
    return { data, error };
  },
  
  updateWorkout: async (id: string, updates: Partial<WorkoutSession>) => {
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },
  
  deleteWorkout: async (id: string) => {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);
    return { error };
  },
  
  getWorkoutsByUser: async (userId: string, startDate?: string, endDate?: string) => {
    let query = supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });
    
    if (startDate) {
      query = query.gte('recorded_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('recorded_at', endDate);
    }
    
    const { data, error } = await query;
    return { data, error };
  },
  
  // Mood entries
  addMoodEntry: async (moodEntry: MoodEntry) => {
    const { data, error } = await supabase
      .from('mood_entries')
      .insert(moodEntry)
      .select()
      .single();
    return { data, error };
  },
  
  updateMoodEntry: async (id: string, updates: Partial<MoodEntry>) => {
    const { data, error } = await supabase
      .from('mood_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },
  
  deleteMoodEntry: async (id: string) => {
    const { error } = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', id);
    return { error };
  },
  
  getMoodEntriesByUser: async (userId: string, startDate?: string, endDate?: string) => {
    let query = supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });
    
    if (startDate) {
      query = query.gte('recorded_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('recorded_at', endDate);
    }
    
    const { data, error } = await query;
    return { data, error };
  },
};

// Function to create initial database schema
export const setupDatabase = async () => {
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cnRkZmtrd21oZGVzemp1d3JwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjM5NjkyMSwiZXhwIjoyMDYxOTcyOTIxfQ.NdTStK9Eic5-hIkhMWVZq9csxydr2eRh9OzuRKqplgQ';
  
  // This function requires a service role key and should only be used in admin tooling
  // In a real app, you would create the schema through Supabase dashboard or migrations
  console.log('This is a placeholder for setting up the database schema.');
  console.log('In a real app, you would create the schema through Supabase dashboard or migrations.');
  
  // The actual schema creation should be done in the Supabase dashboard
  // or using database migrations, not in client-side code.
}; 