/**
 * Batch loader utility for efficiently loading large datasets
 */
type BatchLoadOptions<T> = {
  fetchFn: (page: number, pageSize: number) => Promise<T[]>;
  pageSize?: number;
  maxBatches?: number;
  stopCondition?: (items: T[]) => boolean;
};

/**
 * Load data in batches with pagination to prevent large single requests
 * Especially useful for large datasets where we want to show results incrementally
 */
export async function batchLoad<T>({
  fetchFn,
  pageSize = 50,
  maxBatches = 10,
  stopCondition,
}: BatchLoadOptions<T>): Promise<T[]> {
  let allItems: T[] = [];
  let currentPage = 0;
  let shouldContinue = true;

  while (shouldContinue && currentPage < maxBatches) {
    const batchItems = await fetchFn(currentPage, pageSize);
    
    // Add items to our result array
    allItems = [...allItems, ...batchItems];
    
    // Check if we should stop
    if (
      batchItems.length < pageSize || // No more data available
      (stopCondition && stopCondition(allItems)) // Custom stop condition met
    ) {
      shouldContinue = false;
    }
    
    currentPage++;
  }

  return allItems;
}

/**
 * Load data from multiple sources in parallel, with built-in error handling
 * @returns Object with results and any errors that occurred
 */
export async function parallelLoad<T extends Record<string, any>>(
  sources: Record<keyof T, () => Promise<any>>
): Promise<{ 
  results: Partial<T>; 
  errors: Record<string, Error>; 
  hasErrors: boolean;
}> {
  const results: Partial<T> = {};
  const errors: Record<string, Error> = {};
  
  const promises = Object.entries(sources).map(async ([key, loadFn]) => {
    try {
      results[key] = await loadFn();
    } catch (err) {
      console.error(`Error loading ${key}:`, err);
      errors[key] = err instanceof Error ? err : new Error(`Failed to load ${key}`);
    }
  });
  
  await Promise.all(promises);
  
  return { 
    results, 
    errors, 
    hasErrors: Object.keys(errors).length > 0 
  };
} 