// External imports
import { toast } from "sonner"; // Toast notifications for user feedback
import { useQueryClient, useMutation } from "@tanstack/react-query"; // React Query for data mutations and cache handling
import { InferRequestType, InferResponseType } from "hono"; // Type inference utilities from Hono

// Internal imports
import { client } from "@/lib/hono"; // API client configured with Hono

// Type definitions inferred from the POST endpoint of the transactions API
type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>["json"];

/**
 * Custom React hook to handle transaction creation using React Query and Hono API client.
 *
 * Features:
 * - Uses React Query's `useMutation` to perform the POST request
 * - Displays toast notifications for success/failure feedback
 * - Invalidates the "transactions" query on successful creation to refetch updated data
 */
export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Function to perform the API call with the request body (json)
    mutationFn: async (json) => {
      const response = await client.api.transactions[":id"]["$patch"]({
        param: { id },
        json,
      });
      return await response.json();
    },

    // Called on successful transaction creation
    onSuccess: () => {
      toast.success("Transaction updated"); // Notify the user
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Refresh the transaction list
      // TODO: Invalidate summary
    },

    // Called if the mutation fails
    onError: () => {
      toast.error("Failed to edit transaction"); // Notify the user
    },
  });

  return mutation; // Return mutation object for use in components
};
