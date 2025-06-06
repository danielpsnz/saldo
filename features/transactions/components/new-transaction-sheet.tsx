// External imports
import z from "zod"; // Zod for schema validation

// UI component imports
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Internal imports
import { insertAccountSchema } from "@/db/schema"; // DB schema for form validation
import { useNewAccount } from "../hooks/use-new-accounts"; // UI state hook for controlling the sheet
import { useCreateAccount } from "../api/use-create-account"; // Custom hook for account creation logic
import { AccountForm } from "./account-form"; // Reusable form component for accounts

// Define the form schema by selecting only the required fields
const formSchema = insertAccountSchema.pick({
  name: true,
});

// Type for form values derived from the schema
type FormValues = z.input<typeof formSchema>;

/**
 * Component to display a slide-over sheet for creating a new account.
 *
 * Features:
 * - Controlled via the `useNewAccount` UI state hook
 * - Uses Zod for input validation schema
 * - Submits data through `useCreateAccount` mutation
 * - Renders a pre-configured `AccountForm` component
 */
export const NewAccountSheet = () => {
  // Manage sheet open/close state
  const { isOpen, onClose } = useNewAccount();

  // Mutation hook to handle account creation
  const mutation = useCreateAccount();

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>

        <AccountForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
