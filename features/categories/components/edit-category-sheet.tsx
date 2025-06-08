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
import { useOpenCategory } from "../hooks/use-open-category"; // UI state hook for controlling the sheet
import { useEditCategory } from "../api/use-edit-category"; // Custom hook for category update logic
import { useDeleteCategory } from "../api/use-delete-category"; // Custom hook for category deletion logic
import { CategoryForm } from "./category-form"; // Reusable form component for categorys
import { useGetCategory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";

// Define the form schema by selecting only the required fields
const formSchema = categoryInputSchema;

// Type for form values derived from the schema
type FormValues = z.input<typeof formSchema>;

/**
 * Component to display a slide-over sheet for editing an category.
 *
 * Features:
 * - Controlled via the `useOpencategory` UI state hook
 * - Uses Zod for input validation schema
 * - Submits data through `useCreatecategory` mutation
 * - Renders a pre-configured `categoryForm` component
 */
export const EditCategorySheet = () => {
  // Manage sheet open/close state
  const { isOpen, onClose, id } = useOpenCategory();

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category"
  );

  const categoryQuery = useGetCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = categoryQuery.isLoading;

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

  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name,
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
            <SheetTitle>Edit category</SheetTitle>
            <SheetDescription>Edit an existing category.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
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
