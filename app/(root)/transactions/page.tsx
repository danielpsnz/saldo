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
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transactions";
import { columns } from "./columns"; // Table configuration and type
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";

/**
 * TransactionsPage Component
 *
 * Displays the user's bank transactions and transaction history in a table,
 * along with an option to create a new transaction and view associated cards.
 */
const TransactionsPage = () => {
  // Hook to control "New transaction" sheet or modal state
  const newtransaction = useNewTransaction();
  // Hook to control "Delete transaction" sheet or modal state
  const deletetransactions = useBulkDeleteTransactions();
  // Hook to fetch transactions
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];

  const isDisabled = transactionsQuery.isLoading || deletetransactions.isPending;

  if (transactionsQuery.isLoading) {
    return (
      <section className="flex">
        <div className="transactions">
          {/* Page header */}
          <HeaderBox title="Transactions" />

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
      <div className="transactions">
        {/* Page header */}
        <HeaderBox title="transactions" />

        {/* transactions table section */}
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Transaction History
            </CardTitle>
            <Button onClick={newtransaction.onOpen} size="sm">
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
          </CardHeader>

          <CardContent>
            <DataTable
            filterKey="date"
              columns={columns}
              data={transactions}
              onDelete={(row) => {
                const ids = row.map((r) => r.original.id);
                deletetransactions.mutate({ ids });
              }} // Placeholder delete handler
              disabled={isDisabled}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TransactionsPage;
