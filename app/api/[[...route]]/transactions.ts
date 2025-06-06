// Core dependencies
import { Hono } from "hono"; // Lightweight web framework for building APIs
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"; // Clerk authentication middleware and helper
import { zValidator } from "@hono/zod-validator"; // Zod schema validator middleware
import { createId } from "@paralleldrive/cuid2"; // Utility to generate unique IDs (CUID)

// Project-specific imports
import { db } from "@/db/drizzle"; // Database instance configured with Drizzle ORM
import {
  transactions,
  insertTransactionSchema,
  categories,
  accounts,
} from "@/db/schema"; // Account table schema and validation schema

import { and, inArray, eq, gte, lte, desc, sql } from "drizzle-orm"; // SQL helper for building WHERE clauses
import z from "zod";
import { parse, subDays } from "date-fns";

// Initialize the Hono app
const app = new Hono()

  // GET / - Fetches transactions belonging to the authenticated user
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      // Ensure the user is authenticated
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;

      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      // Fetch transactions for the authenticated user
      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));

      // Return the retrieved transaction data
      return c.json({ data });
    }
  )
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)));

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )

  // POST / - Creates a new transaction for the authenticated user
  .post(
    "/",
    clerkMiddleware(), // Auth middleware to ensure user is logged in
    zValidator("json", insertTransactionSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json"); // Access validated input

      // Check if the user is authenticated
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Insert a new transaction record into the database
      const [data] = await db
        .insert(transactions)
        .values({
          id: createId(), // Generate a unique ID for the account
          ...values, // Spread validated values (only includes name)
        })
        .returning(); // Return the inserted record

      // Return the newly created transaction data
      return c.json({ data });
    }
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionSchema.omit({
          id: true,
        })
      )
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            id: createId(),
            ...value,
          }))
        )
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              inArray(transactions.id, values.ids),
              eq(accounts.userId, auth.userId)
            )
          )
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          )
        )
        .returning({
          id: transactions.id,
        });

      return c.json({ data });
    }
  )

  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      })
    ),

    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      );

      const [data] = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToUpdate})`
          )
        )
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )

  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),

    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      );

      const [data] = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          )
        )
        .returning({
          id: transactions.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

// Export the app instance for use elsewhere (e.g. server entry point)
export default app;
