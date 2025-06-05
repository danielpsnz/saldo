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
import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts";
import { columns } from "./columns"; // Table configuration and type
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";

/**
 * AccountsPage Component
 *
 * Displays the user's bank accounts and transaction history in a table,
 * along with an option to create a new account and view associated cards.
 */
const AccountsPage = () => {
  // Hook to control "New Account" sheet or modal state
  const newAccount = useNewAccount();
  // Hook to control "Delete Account" sheet or modal state
  const deleteAccounts = useBulkDeleteAccounts();
  // Hook to fetch accounts
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data || [];

  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

  if (accountsQuery.isLoading) {
    return (
      <section className="flex">
        <div className="accounts">
          {/* Page header */}
          <HeaderBox
            title="My accounts"
            subtext="Effortlessly manage your banking activites."
          />

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

          {/* Bank cards section */}
          <div className="space-y-4">
            <h2 className="header-2">Your cards</h2>
            <div className="flex flex-wrap gap-6">
              <Skeleton className="h-8 w-48" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex">
      <div className="accounts">
        {/* Page header */}
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activites."
        />

        {/* Accounts table section */}
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Accounts page
            </CardTitle>
            <Button onClick={newAccount.onOpen} size="sm">
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
          </CardHeader>

          <CardContent>
            <DataTable
              columns={columns}
              data={accounts}
              filterKey="email" // Enables filtering by email
              onDelete={(row) => {
                const ids = row.map((r) => r.original.id);
                deleteAccounts.mutate({ ids });
              }} // Placeholder delete handler
              disabled={isDisabled}
            />
          </CardContent>
        </Card>

        {/* Bank cards section */}
        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {/* 
            Future enhancement: Display user’s bank cards
            Example:
            {accounts &&
              accounts.data.map((a: Account) => (
                <BankCard
                  key={a.id}
                  account={a}
                  userName={loggedIn?.firstName}
                />
              ))} 
            */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountsPage;
