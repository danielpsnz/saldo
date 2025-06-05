// External imports
import { toast } from "sonner"; // Toast notifications for user feedback
import { useQueryClient, useMutation } from "@tanstack/react-query"; // React Query for data mutations and cache handling
import { InferRequestType, InferResponseType } from "hono"; // Type inference utilities from Hono

// Internal imports
import { client } from "@/lib/hono"; // API client configured with Hono

// Type definitions inferred from the POST endpoint of the accounts API
type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

/**
 * Custom React hook to handle account creation using React Query and Hono API client.
 *
 * Features:
 * - Uses React Query's `useMutation` to perform the POST request
 * - Displays toast notifications for success/failure feedback
 * - Invalidates the "accounts" query on successful creation to refetch updated data
 */
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Function to perform the API call with the request body (json)
    mutationFn: async (json) => {
      const response = await client.api.accounts.$post({ json });
      return await response.json();
    },

    // Called on successful account creation
    onSuccess: () => {
      toast.success("Account created!"); // Notify the user
      queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Refresh the account list
    },

    // Called if the mutation fails
    onError: () => {
      toast.error("Failed to create account"); // Notify the user
    },
  });

  return mutation; // Return mutation object for use in components
};
