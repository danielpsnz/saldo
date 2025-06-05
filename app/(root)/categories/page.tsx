"use client";

// External imports
import { Loader2, Plus } from "lucide-react"; // Icon for the "Add new" button

// UI component imports
import HeaderBox from "@/components/HeaderBox";
import BankCard from "@/components/BankCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";

// Feature-specific imports
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { columns } from "./columns"; // Table configuration and type
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-category";

/**
 * CategoriesPage Component
 *
 * Displays the user's bank categories and transaction history in a table,
 * along with an option to create a new category and view associated cards.
 */
const CategoriesPage = () => {
  // Hook to control "New category" sheet or modal state
  const newCategory = useNewCategory();
  // Hook to control "Delete category" sheet or modal state
  const deleteCategories = useBulkDeleteCategories();
  // Hook to fetch Categories
  const CategoriesQuery = useGetCategories();
  const categories = CategoriesQuery.data || [];

  const isDisabled = CategoriesQuery.isLoading || deleteCategories.isPending;

  if (CategoriesQuery.isLoading) {
    return (
      <section className="flex">
        <div className="categories">
          {/* Page header */}
          <HeaderBox title="categories" />

          <Card className="border-none drop-shadow-sm">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full flex items-center justify-center">
                <Loader2 className="size-6 text-slate-300 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="flex">
      <div className="categories">
        {/* Page header */}
        <HeaderBox title="Categories" />

        {/* Categories table section */}
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Categories page
            </CardTitle>
            <Button onClick={newCategory.onOpen} size="sm">
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
          </CardHeader>

          <CardContent>
            <DataTable
              columns={columns}
              data={categories}
              filterKey="email" // Enables filtering by email
              onDelete={(row) => {
                const ids = row.map((r) => r.original.id);
                deleteCategories.mutate({ ids });
              }} // Placeholder delete handler
              disabled={isDisabled}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CategoriesPage;
