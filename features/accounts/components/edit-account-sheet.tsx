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
import { accountInputSchema } from "@/db/schema"; // DB schema for form validation
import { useOpenAccount } from "../hooks/use-open-account"; // UI state hook for controlling the sheet
import { useEditAccount } from "../api/use-edit-account"; // Custom hook for account update logic
import { useDeleteAccount } from "../api/use-delete-account"; // Custom hook for account deletion logic
import { AccountForm } from "./account-form"; // Reusable form component for accounts
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";

// Define the form schema by selecting only the required fields
const formSchema = accountInputSchema;

// Type for form values derived from the schema
type FormValues = z.input<typeof formSchema>;

/**
 * Component to display a slide-over sheet for editing an account.
 *
 * Features:
 * - Controlled via the `useOpenAccount` UI state hook
 * - Uses Zod for input validation schema
 * - Submits data through `useCreateAccount` mutation
 * - Renders a pre-configured `AccountForm` component
 */
export const EditAccountSheet = () => {
  // Manage sheet open/close state
  const { isOpen, onClose, id } = useOpenAccount();

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account"
  );

  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = accountQuery.isLoading;

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = accountQuery.data
    ? {
        name: accountQuery.data.name,
      }
    : {
        name: "",
      };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
