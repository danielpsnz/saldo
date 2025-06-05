// External imports
import { toast } from "sonner"; // Toast notifications for user feedback
import { useQueryClient, useMutation } from "@tanstack/react-query"; // React Query for data mutations and cache handling
import { InferRequestType, InferResponseType } from "hono"; // Type inference utilities from Hono

// Internal imports
import { client } from "@/lib/hono"; // API client configured with Hono

// Type definitions inferred from the POST endpoint of the categories API
type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

/**
 * Custom React hook to handle category creation using React Query and Hono API client.
 *
 * Features:
 * - Uses React Query's `useMutation` to perform the POST request
 * - Displays toast notifications for success/failure feedback
 * - Invalidates the "categories" query on successful creation to refetch updated data
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Function to perform the API call with the request body (json)
    mutationFn: async (json) => {
      const response = await client.api.categories.$post({ json });
      return await response.json();
    },

    // Called on successful category creation
    onSuccess: () => {
      toast.success("Category created!"); // Notify the user
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // Refresh the category list
    },

    // Called if the mutation fails
    onError: () => {
      toast.error("Failed to create category"); // Notify the user
    },
  });

  return mutation; // Return mutation object for use in components
};
