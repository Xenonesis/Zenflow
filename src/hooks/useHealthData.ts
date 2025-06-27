import { useQuery, useQueryClient, QueryClient } from '@tanstack/react-query';
import { healthData, WorkoutSession, MoodEntry } from '@/lib/data-sync';

// Constants for query keys
const QUERY_KEYS = {
  workouts: 'workouts',
  moods: 'moods',
  metrics: 'metrics',
};

/**
 * Hook to fetch workout data with caching and optimizations
 */
export function useWorkoutHistory(userId: string | undefined, enabled = true) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [QUERY_KEYS.workouts, userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Get 7 days ago for the date range
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await healthData.getWorkoutsByUser(
        userId,
        sevenDaysAgo.toISOString().split('T')[0]
      );
      
      if (error) {
        console.error('Error fetching workouts:', error);
        throw new Error('Failed to load workout history');
      }
      
      return data || [];
    },
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch mood data with caching and optimizations
 */
export function useMoodHistory(userId: string | undefined, enabled = true) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [QUERY_KEYS.moods, userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Get 7 days ago for the date range
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await healthData.getMoodEntriesByUser(
        userId,
        sevenDaysAgo.toISOString().split('T')[0]
      );
      
      if (error) {
        console.error('Error fetching mood entries:', error);
        throw new Error('Failed to load mood history');
      }
      
      return data || [];
    },
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Prefetch health data for faster page loads - Component version
 * This is the React component safe version that can be used directly in components
 */
export function prefetchHealthData(userId: string | undefined, queryClient?: QueryClient) {
  if (!userId) return;
  
  // Use the provided queryClient if available, otherwise get it from the hook
  // This makes the function more flexible for different contexts
  const qc = queryClient || useQueryClient();
  
  // Prefetch workout data
  qc.prefetchQuery({
    queryKey: [QUERY_KEYS.workouts, userId],
    queryFn: async () => {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await healthData.getWorkoutsByUser(
        userId,
        sevenDaysAgo.toISOString().split('T')[0]
      );
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Prefetch mood data
  qc.prefetchQuery({
    queryKey: [QUERY_KEYS.moods, userId],
    queryFn: async () => {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await healthData.getMoodEntriesByUser(
        userId,
        sevenDaysAgo.toISOString().split('T')[0]
      );
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Service-safe version of prefetch that doesn't use React hooks
 * Use this in services and non-component code
 */
export async function prefetchHealthDataForService(queryClient: QueryClient, userId: string) {
  if (!userId) return;
  
  try {
    // Get 7 days ago for the date range
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];
    
    // Prefetch workout data
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.workouts, userId],
      queryFn: async () => {
        const { data, error } = await healthData.getWorkoutsByUser(userId, startDate);
        if (error) throw error;
        return data || [];
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
    
    // Prefetch mood data
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.moods, userId],
      queryFn: async () => {
        const { data, error } = await healthData.getMoodEntriesByUser(userId, startDate);
        if (error) throw error;
        return data || [];
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
    
    return true;
  } catch (error) {
    console.error('Error prefetching health data:', error);
    return false;
  }
} 