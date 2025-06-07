"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { InferResponseType } from "hono";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { client } from "@/lib/hono";

import { Actions } from "./actions";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

export type ResponseType = InferResponseType<
  typeof client.api.transactions.$get,
  200
>["data"][0];
/**
 * Column configuration for the Payments table.
 * Each object in this array defines how a specific column behaves and is rendered.
 */
export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    /**
     * Header checkbox to select/deselect all rows on the current page.
     * Shows indeterminate state if only some rows are selected.
     */
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    /**
     * Cell-level checkbox to select/deselect individual rows.
     */
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "date",
    /**
     * Header with interactive sorting.
     * Clicking the button toggles between ascending and descending sort.
     */
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;

      return <span>{format(date, "dd MMMM, yyyy")}</span>;
    },
  },
  {
    accessorKey: "category",
    /**
     * Header with interactive sorting.
     * Clicking the button toggles between ascending and descending sort.
     */
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.category}</span>;
    },
  },
  {
    accessorKey: "payee",
    /**
     * Header with interactive sorting.
     * Clicking the button toggles between ascending and descending sort.
     */
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    /**
     * Header with interactive sorting.
     * Clicking the button toggles between ascending and descending sort.
     */
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      return (
        <span>
          <Badge
            variant={amount < 0 ? "destructive" : "primary"}
            className="text-xs font-medium px-3.5 py-2.5"
          >
            {formatCurrency(amount)}
          </Badge>
        </span>
      );
    },
  },
  {
    accessorKey: "account",
    /**
     * Header with interactive sorting.
     * Clicking the button toggles between ascending and descending sort.
     */
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.account}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.account} />,
  },
];
