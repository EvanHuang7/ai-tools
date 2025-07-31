import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduces unnecessary network calls
      refetchOnWindowFocus: false,
      refetchOnReconnect: true, // Good for handling dropped connections
      refetchOnMount: false,
      retry: 1, // One retry is safer than none for flakiness
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes in memory (renamed from cacheTime)
    },
    mutations: {
      // Don't retry the api call to aviod generating same video or image twice
      retry: 0,
    },
  },
});

export default queryClient;
