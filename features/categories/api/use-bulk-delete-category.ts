// External imports
import { toast } from "sonner"; // Toast notifications for user feedback
import { useQueryClient, useMutation } from "@tanstack/react-query"; // React Query for data mutations and cache handling
import { InferRequestType, InferResponseType } from "hono"; // Type inference utilities from Hono

// Internal imports
import { client } from "@/lib/hono"; // API client configured with Hono

// Type definitions inferred from the POST endpoint of the categories API
type ResponseType = InferResponseType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>["json"];

/**
 * Custom React hook to handle category bulk-delete using React Query and Hono API client.
 *
 * Features:
 * - Uses React Query's `useMutation` to perform the POST request
 * - Displays toast notifications for success/failure feedback
 * - Invalidates the "categories" query on successful bulk-delete to refetch updated data
 */
export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Function to perform the API call with the request body (json)
    mutationFn: async (json) => {
      const response = await client.api.categories["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },

    // Called on successful category bulk-delete
    onSuccess: () => {
      toast.success("Category deleted"); // Notify the user
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // Refresh the category list
      // TODO: Also invalidate summary
    },

    // Called if the mutation fails
    onError: () => {
      toast.error("Failed to delete categories"); // Notify the user
    },
  });

  return mutation; // Return mutation object for use in components
};
