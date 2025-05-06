import { QueryClient } from '@tanstack/react-query';

// Create a single shared QueryClient for both components and services
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1, // Limit retries to avoid excessive requests
    },
  },
});

export default queryClient; 