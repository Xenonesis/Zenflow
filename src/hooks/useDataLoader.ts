import { useState, useEffect, useCallback } from 'react';
import { queryCache } from '../lib/query-cache';

interface DataLoaderOptions<T> {
  fetchFn: () => Promise<T>;
  cacheKey?: string;
  cacheTtl?: number;
  initialData?: T;
  dependencies?: any[];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

interface DataLoaderResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for efficiently loading data with caching capabilities
 */
export function useDataLoader<T = any>(options: DataLoaderOptions<T>): DataLoaderResult<T> {
  const {
    fetchFn,
    cacheKey,
    cacheTtl,
    initialData,
    dependencies = [],
    onSuccess,
    onError,
    enabled = true
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    // Setup a timeout to prevent hanging loads
    const timeoutId = setTimeout(() => {
      console.warn(`Data loading timeout for ${cacheKey || 'uncached request'}`);
      setIsLoading(false);
    }, 15000);
    
    try {
      let result: T;
      
      if (cacheKey) {
        result = await queryCache.withCache<T>(cacheKey, fetchFn, cacheTtl);
      } else {
        result = await fetchFn();
      }
      
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      console.error('Error in useDataLoader:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      onError?.(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [fetchFn, cacheKey, cacheTtl, enabled, ...dependencies]);

  const refetch = useCallback(async () => {
    // Clear cache if using cache
    if (cacheKey) {
      queryCache.clear(cacheKey);
    }
    await loadData();
  }, [cacheKey, loadData]);

  useEffect(() => {
    if (enabled) {
      loadData();
    }
  }, [enabled, loadData]);

  return { data, isLoading, error, refetch };
}

/**
 * Helper for prefetching data into cache
 */
export function prefetchData<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  cacheTtl?: number
): Promise<T> {
  return queryCache.withCache<T>(cacheKey, fetchFn, cacheTtl);
} 