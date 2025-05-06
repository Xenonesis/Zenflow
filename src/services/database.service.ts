import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database.types';
import { queryCache } from '../lib/query-cache';

class DatabaseService {
  // Profile methods
  async getProfile(userId: string) {
    const cacheKey = `profile:${userId}`;
    return queryCache.withCache(cacheKey, async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data as Tables['profiles']['Row'];
    }, 5 * 60 * 1000); // Cache profile for 5 minutes
  }

  async updateProfile(userId: string, profileData: Partial<Tables['profiles']['Update']>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Clear the cache for this profile
    queryCache.clear(`profile:${userId}`);
    
    return data as Tables['profiles']['Row'];
  }

  // Mood methods
  async getMoodEntries(userId: string, limit = 10) {
    const cacheKey = `mood_entries:${userId}:${limit}`;
    return queryCache.withCache(cacheKey, async () => {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as Tables['mood_entries']['Row'][];
    }, 2 * 60 * 1000); // Cache for 2 minutes
  }

  async addMoodEntry(moodData: Tables['mood_entries']['Insert']) {
    const { data, error } = await supabase
      .from('mood_entries')
      .insert(moodData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Clear relevant caches
    queryCache.clear(`mood_entries:${moodData.user_id}:10`);
    
    return data as Tables['mood_entries']['Row'];
  }

  // Self-care activities methods
  async getSelfCareActivities(userId: string, limit = 10) {
    const cacheKey = `self_care_activities:${userId}:${limit}`;
    return queryCache.withCache(cacheKey, async () => {
      const { data, error } = await supabase
        .from('self_care_activities')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as Tables['self_care_activities']['Row'][];
    }, 2 * 60 * 1000); // Cache for 2 minutes
  }

  async addSelfCareActivity(activityData: Tables['self_care_activities']['Insert']) {
    const { data, error } = await supabase
      .from('self_care_activities')
      .insert(activityData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['self_care_activities']['Row'];
  }

  // Meditation sessions methods
  async getMeditationSessions(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('meditation_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as Tables['meditation_sessions']['Row'][];
  }

  async addMeditationSession(sessionData: Tables['meditation_sessions']['Insert']) {
    const { data, error } = await supabase
      .from('meditation_sessions')
      .insert(sessionData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['meditation_sessions']['Row'];
  }

  // Journal entries methods
  async getJournalEntries(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*, mood_entries(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as (Tables['journal_entries']['Row'] & { mood_entries: Tables['mood_entries']['Row'] | null })[];
  }

  async addJournalEntry(entryData: Tables['journal_entries']['Insert']) {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entryData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['journal_entries']['Row'];
  }

  // Exercise sessions methods
  async getExerciseSessions(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('exercise_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as Tables['exercise_sessions']['Row'][];
  }

  async addExerciseSession(sessionData: Tables['exercise_sessions']['Insert']) {
    const { data, error } = await supabase
      .from('exercise_sessions')
      .insert(sessionData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['exercise_sessions']['Row'];
  }

  // Sleep logs methods
  async getSleepLogs(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('sleep_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as Tables['sleep_logs']['Row'][];
  }

  async addSleepLog(logData: Tables['sleep_logs']['Insert']) {
    const { data, error } = await supabase
      .from('sleep_logs')
      .insert(logData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['sleep_logs']['Row'];
  }

  // Daily tasks methods
  async getDailyTasks(userId: string, limit = 20) {
    const cacheKey = `daily_tasks:${userId}:${limit}`;
    return queryCache.withCache(cacheKey, async () => {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data as Tables['daily_tasks']['Row'][];
    }, 2 * 60 * 1000); // Cache for 2 minutes
  }

  // Method to get only incomplete tasks
  async getIncompleteTasks(userId: string, limit = 20) {
    const cacheKey = `incomplete_tasks:${userId}:${limit}`;
    return queryCache.withCache(cacheKey, async () => {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .filter('is_completed', 'eq', false)
        .order('due_date', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data as Tables['daily_tasks']['Row'][];
    }, 2 * 60 * 1000); // Cache for 2 minutes
  }

  async addDailyTask(taskData: Tables['daily_tasks']['Insert']) {
    const { data, error } = await supabase
      .from('daily_tasks')
      .insert(taskData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['daily_tasks']['Row'];
  }

  async updateDailyTask(taskId: string, taskData: Partial<Tables['daily_tasks']['Update']>) {
    const { data, error } = await supabase
      .from('daily_tasks')
      .update(taskData)
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['daily_tasks']['Row'];
  }

  // Wellness trends methods
  async getWellnessTrends(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('wellness_trends')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data as Tables['wellness_trends']['Row'][];
  }

  async addOrUpdateWellnessTrend(trendData: Tables['wellness_trends']['Insert']) {
    // Try to find existing record for this date
    const { data: existingData } = await supabase
      .from('wellness_trends')
      .select('id')
      .eq('user_id', trendData.user_id)
      .eq('date', trendData.date)
      .single();

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('wellness_trends')
        .update(trendData)
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Tables['wellness_trends']['Row'];
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('wellness_trends')
        .insert(trendData)
        .select()
        .single();
      
      if (error) throw error;
      return data as Tables['wellness_trends']['Row'];
    }
  }
}

export const databaseService = new DatabaseService(); 