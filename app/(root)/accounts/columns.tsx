"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";

export type ResponseType = InferResponseType<typeof client.api.accounts.$get, 200>["data"][0];
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
    accessorKey: "name",
    /**
     * Header with interactive sorting.
     * Clicking the button toggles between ascending and descending sort.
     */
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
];
