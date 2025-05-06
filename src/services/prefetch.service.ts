import { queryCache } from '../lib/query-cache';
import { supabase } from '../lib/supabase';
import { batchLoad, parallelLoad } from '../lib/batch-loader';
import { databaseService } from './database.service';
import { prefetchHealthDataForService } from '@/hooks/useHealthData';
import queryClient from '@/lib/query-client';

class PrefetchService {
  private isPrefetching = false;
  private prefetchPromise: Promise<void> | null = null;

  /**
   * Prefetch critical user data to improve initial load times
   */
  async prefetchUserData(userId: string): Promise<void> {
    if (this.isPrefetching) {
      return this.prefetchPromise as Promise<void>;
    }

    this.isPrefetching = true;
    
    this.prefetchPromise = this.doPrefetch(userId).finally(() => {
      this.isPrefetching = false;
      this.prefetchPromise = null;
    });
    
    return this.prefetchPromise;
  }

  private async doPrefetch(userId: string): Promise<void> {
    console.log('Prefetching user data for faster loads...');
    const startTime = performance.now();
    
    try {
      // Prefetch health data using the service-safe version
      await prefetchHealthDataForService(queryClient, userId);
      
      // Prefetch additional data in parallel for faster loading
      await parallelLoad({
        profile: async () => {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
          
          // Cache the profile data
          queryCache.set(`profile:${userId}`, data, 5 * 60 * 1000);
          return data;
        },
        
        recentMetrics: async () => {
          const { data } = await supabase
            .from('wellness_trends')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(7);
          
          queryCache.set(`wellness_trends:${userId}:recent`, data, 2 * 60 * 1000);
          return data;
        },
        
        moodEntries: async () => {
          const { data } = await supabase
            .from('mood_entries')
            .select('*')
            .eq('user_id', userId)
            .order('recorded_at', { ascending: false })
            .limit(10);
          
          queryCache.set(`mood_entries:${userId}:10`, data, 2 * 60 * 1000);
          return data;
        },

        activeTasks: async () => {
          // Use the database service method that implements proper caching and filtering
          const data = await databaseService.getIncompleteTasks(userId, 20);
          
          // The data is already cached by the database service method
          // This just aliases it for other parts of the app
          queryCache.set(`active_tasks:${userId}`, data, 2 * 60 * 1000);
          return data;
        }
      });
      
      const endTime = performance.now();
      console.log(`Prefetching completed in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      console.error('Error during prefetch:', error);
      // Prefetch errors shouldn't block the application
    }
  }

  /**
   * Clear prefetched data - useful when logging out
   */
  clearPrefetchedData(userId: string) {
    queryCache.clear(`profile:${userId}`);
    queryCache.clear(`wellness_trends:${userId}:recent`);
    queryCache.clear(`mood_entries:${userId}:10`);
    queryCache.clear(`active_tasks:${userId}`);
    queryCache.clear(`incomplete_tasks:${userId}:20`);
    
    // Clear React Query cache for this user's health data
    queryClient.removeQueries(['workouts', userId]);
    queryClient.removeQueries(['moods', userId]);
    queryClient.removeQueries(['metrics', userId]);
  }
}

export const prefetchService = new PrefetchService(); 