// External imports
import { useQuery } from "@tanstack/react-query"; // React Query hook for data fetching

// Internal imports
import { client } from "@/lib/hono"; // API client configured with Hono

/**
 * Custom React hook to fetch a list of categories from the API.
 *
 * Features:
 * - Uses React Query's `useQuery` to fetch category data
 * - Automatically caches and revalidates the data
 * - Throws an error if the fetch fails (to be handled by the consuming component)
 */
export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["categories", { id }], // Unique key for caching and refetching
    queryFn: async () => {
      const response = await client.api.categories[":id"].$get({
        param: { id },
      });

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error("Failed to fetch category");
      }

      // Destructure and return only the data from the response
      const { data } = await response.json();
      return data;
    },
  });

  return query; // Return the query object for use in components
};
