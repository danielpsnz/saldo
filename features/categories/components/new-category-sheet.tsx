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
import { categoryInputSchema } from "@/db/schema"; // DB schema for form validation
import { useNewCategory } from "../hooks/use-new-category"; // UI state hook for controlling the sheet
import { useCreateCategory } from "../api/use-create-category"; // Custom hook for category creation logic
import { CategoryForm } from "./category-form"; // Reusable form component for categorys

// Define the form schema by selecting only the required fields
const formSchema = categoryInputSchema;

// Type for form values derived from the schema
type FormValues = z.input<typeof formSchema>;

/**
 * Component to display a slide-over sheet for creating a new category.
 *
 * Features:
 * - Controlled via the `useNewcategory` UI state hook
 * - Uses Zod for input validation schema
 * - Submits data through `useCreatecategory` mutation
 * - Renders a pre-configured `categoryForm` component
 */
export const NewCategorySheet = () => {
  // Manage sheet open/close state
  const { isOpen, onClose } = useNewCategory();

  // Mutation hook to handle category creation
  const mutation = useCreateCategory();

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organise your transactions.
          </SheetDescription>
        </SheetHeader>

        <CategoryForm
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
