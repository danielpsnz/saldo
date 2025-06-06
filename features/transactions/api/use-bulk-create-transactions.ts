// External imports
import { toast } from "sonner"; // Toast notifications for user feedback
import { useQueryClient, useMutation } from "@tanstack/react-query"; // React Query for data mutations and cache handling
import { InferRequestType, InferResponseType } from "hono"; // Type inference utilities from Hono

// Internal imports
import { client } from "@/lib/hono"; // API client configured with Hono

// Type definitions inferred from the POST endpoint of the transactions API
type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

/**
 * Custom React hook to handle transaction bulk-create using React Query and Hono API client.
 *
 * Features:
 * - Uses React Query's `useMutation` to perform the POST request
 * - Displays toast notifications for success/failure feedback
 * - Invalidates the "transactions" query on successful bulk-create to refetch updated data
 */
export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Function to perform the API call with the request body (json)
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-create"]["$post"]({
        json,
      });
      return await response.json();
    },

    // Called on successful transaction bulk-create
    onSuccess: () => {
      toast.success("Transactions created"); // Notify the user
      queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Refresh the transaction list
      // TODO: Also invalidate summary
    },

    // Called if the mutation fails
    onError: () => {
      toast.error("Failed to create transactions"); // Notify the user
    },
  });

  return mutation; // Return mutation object for use in components
};
