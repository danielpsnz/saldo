"use client";

// External imports
import { Plus } from "lucide-react"; // Icon for the "Add new" button

// UI component imports
import HeaderBox from "@/components/HeaderBox";
import BankCard from "@/components/BankCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";

// Feature-specific imports
import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts";
import { columns, Payment } from "./columns"; // Table configuration and type

// Temporary mock data (replace with real API call in production)
const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52g",
    amount: 50,
    status: "success",
    email: "a@example.com",
  },
];

/**
 * AccountsPage Component
 *
 * Displays the user's bank accounts and transaction history in a table,
 * along with an option to create a new account and view associated cards.
 */
const AccountsPage = () => {
  // Hook to control "New Account" sheet or modal state
  const newAccount = useNewAccount();

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
              data={data}
              filterKey="email" // Enables filtering by email
              onDelete={() => {}} // Placeholder delete handler
              disabled={false}
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
