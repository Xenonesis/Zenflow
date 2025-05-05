import { supabase } from '@/lib/supabase';
import { 
  HealthActivity, 
  CreateHealthActivityParams, 
  UpdateHealthActivityParams, 
  HealthActivityFilters 
} from '@/types/health-activities';

/**
 * Fetch health activities for the current user
 */
export async function getHealthActivities(filters?: HealthActivityFilters): Promise<HealthActivity[]> {
  let query = supabase
    .from('health_activities')
    .select('*')
    .order('start_time', { ascending: true });

  // Apply filters if provided
  if (filters?.from_date) {
    query = query.gte('start_time', filters.from_date);
  }
  
  if (filters?.to_date) {
    query = query.lte('start_time', filters.to_date);
  }
  
  if (filters?.activity_type) {
    query = query.eq('activity_type', filters.activity_type);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching health activities:', error);
    throw error;
  }

  return data as HealthActivity[];
}

/**
 * Fetch a single health activity by ID
 */
export async function getHealthActivity(id: string): Promise<HealthActivity | null> {
  const { data, error } = await supabase
    .from('health_activities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching health activity:', error);
    throw error;
  }

  return data as HealthActivity;
}

/**
 * Create a new health activity
 */
export async function createHealthActivity(params: CreateHealthActivityParams): Promise<HealthActivity> {
  // Get the current user ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('health_activities')
    .insert([{
      ...params,
      user_id: user.id // Explicitly set user_id to ensure correct row-level security
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating health activity:', error);
    throw error;
  }

  return data as HealthActivity;
}

/**
 * Update an existing health activity
 */
export async function updateHealthActivity({ id, ...params }: UpdateHealthActivityParams): Promise<HealthActivity> {
  // Get the current user ID for security validation
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('health_activities')
    .update({
      ...params,
      user_id: user.id // Ensure user_id is correct
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating health activity:', error);
    throw error;
  }

  return data as HealthActivity;
}

/**
 * Delete a health activity
 */
export async function deleteHealthActivity(id: string): Promise<void> {
  const { error } = await supabase
    .from('health_activities')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting health activity:', error);
    throw error;
  }
}

/**
 * Get upcoming health activities for notifications
 */
export async function getUpcomingActivitiesForReminders(): Promise<HealthActivity[]> {
  const now = new Date();
  const { data, error } = await supabase
    .from('health_activities')
    .select('*')
    .gte('reminder_time', now.toISOString())
    .lte('reminder_time', new Date(now.getTime() + 15 * 60000).toISOString()) // Next 15 minutes
    .eq('reminder_sent', false);

  if (error) {
    console.error('Error fetching upcoming activities for reminders:', error);
    throw error;
  }

  return data as HealthActivity[];
}

/**
 * Mark a reminder as sent
 */
export async function markReminderAsSent(id: string): Promise<void> {
  const { error } = await supabase
    .from('health_activities')
    .update({ reminder_sent: true })
    .eq('id', id);

  if (error) {
    console.error('Error marking reminder as sent:', error);
    throw error;
  }
}

/**
 * Get activities for a specific day
 */
export async function getActivitiesForDay(date: Date): Promise<HealthActivity[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const { data, error } = await supabase
    .from('health_activities')
    .select('*')
    .lte('start_time', endOfDay.toISOString())
    .gte('start_time', startOfDay.toISOString());

  if (error) {
    console.error('Error fetching activities for day:', error);
    throw error;
  }

  return data as HealthActivity[];
} 