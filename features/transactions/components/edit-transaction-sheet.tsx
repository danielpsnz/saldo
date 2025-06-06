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
import { insertTransactionSchema } from "@/db/schema"; // DB schema for form validation
import { useOpenTransaction } from "../hooks/use-open-transaction"; // UI state hook for controlling the sheet
import { useEditTransaction } from "../api/use-edit-transaction"; // Custom hook for transaction update logic
import { useDeleteTransaction } from "../api/use-delete-transaction"; // Custom hook for transaction deletion logic
import { TransactionForm } from "./transaction-form"; // Reusable form component for transactions
import { useGetTransaction } from "../api/use-get-transaction";
import { Loader2 } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";

// Define the form schema by selecting only the required fields
const formSchema = insertTransactionSchema.omit({
  id: true,
});

// Type for form values derived from the schema
type FormValues = z.input<typeof formSchema>;

/**
 * Component to display a slide-over sheet for editing an transaction.
 *
 * Features:
 * - Controlled via the `useOpentransaction` UI state hook
 * - Uses Zod for input validation schema
 * - Submits data through `useCreatetransaction` mutation
 * - Renders a pre-configured `transactionForm` component
 */
export const EditTransactionSheet = () => {
  // Manage sheet open/close state
  const { isOpen, onClose, id } = useOpenTransaction();

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction"
  );

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = transactionQuery.isLoading;

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

  const defaultValues = transactionQuery.data
    ? {
        name: transactionQuery.data.name,
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
            <SheetTitle>Edit transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
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
