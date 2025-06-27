/**
 * Simple in-memory query cache to improve data loading performance
 */

type CacheEntry = {
  data: any;
  timestamp: number;
  ttl: number;
};

class QueryCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 60 * 1000; // 1 minute default TTL

  /**
   * Get data from cache if available and not expired
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Store data in cache with optional TTL
   */
  set(key: string, data: any, ttl = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear the entire cache or a specific key
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Helper method to wrap async functions with caching
   */
  async withCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl = this.DEFAULT_TTL
  ): Promise<T> {
    const cachedData = this.get(key);
    if (cachedData !== null) {
      return cachedData as T;
    }

    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }
}

export const queryCache = new QueryCache(); 