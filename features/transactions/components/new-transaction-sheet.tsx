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
import { accounts, insertTransactionSchema } from "@/db/schema"; // DB schema for form validation
import { useNewTransaction } from "../hooks/use-new-transactions"; // UI state hook for controlling the sheet
import { useCreateTransaction } from "../api/use-create-transaction"; // Custom hook for transaction creation logic
import { TransactionForm } from "./transaction-form"; // Reusable form component for transactions
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { Loader2 } from "lucide-react";

// Define the form schema by selecting only the required fields
const formSchema = insertTransactionSchema.omit({
  id: true,
});

// Type for form values derived from the schema
type FormValues = z.input<typeof formSchema>;

/**
 * Component to display a slide-over sheet for creating a new transaction.
 *
 * Features:
 * - Controlled via the `useNewtransaction` UI state hook
 * - Uses Zod for input validation schema
 * - Submits data through `useCreatetransaction` mutation
 * - Renders a pre-configured `transactionForm` component
 */
export const NewTransactionSheet = () => {
  // Manage sheet open/close state
  const { isOpen, onClose } = useNewTransaction();

  // Mutation hook to handle transaction creation
  const createMutation = useCreateTransaction();

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) =>
    categoryMutation.mutate({
      name,
    });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) =>
    accountMutation.mutate({
      name,
    });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New transaction</SheetTitle>
          <SheetDescription>Add a new transaction.</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
