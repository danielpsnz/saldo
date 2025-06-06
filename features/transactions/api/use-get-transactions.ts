// External imports
import { useQuery } from "@tanstack/react-query"; // React Query hook for data fetching
import { useSearchParams } from "next/navigation";

// Internal imports
import { client } from "@/lib/hono"; // API client configured with Hono

/**
 * Custom React hook to fetch a list of transactions from the API.
 *
 * Features:
 * - Uses React Query's `useQuery` to fetch transaction data
 * - Automatically caches and revalidates the data
 * - Throws an error if the fetch fails (to be handled by the consuming component)
 */
export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    // TODO: Check if params are needed in the key
    queryKey: ["transactions", { from, to, accountId }], // Unique key for caching and refetching
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      // Destructure and return only the data from the response
      const { data } = await response.json();
      return data;
    },
  });

  return query; // Return the query object for use in components
};
