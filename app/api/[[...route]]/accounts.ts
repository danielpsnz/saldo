// Core dependencies
import { Hono } from "hono"; // Lightweight web framework for building APIs
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"; // Clerk authentication middleware and helper
import { zValidator } from "@hono/zod-validator"; // Zod schema validator middleware
import { createId } from "@paralleldrive/cuid2"; // Utility to generate unique IDs (CUID)

// Project-specific imports
import { db } from "@/db/drizzle"; // Database instance configured with Drizzle ORM
import { accounts, insertAccountSchema } from "@/db/schema"; // Account table schema and validation schema
import { eq } from "drizzle-orm"; // SQL helper for building WHERE clauses

// Initialize the Hono app
const app = new Hono()

  // GET / - Fetches accounts belonging to the authenticated user
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    // Ensure the user is authenticated
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Fetch accounts for the authenticated user
    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    // Return the retrieved account data
    return c.json({ data });
  })

  // POST / - Creates a new account for the authenticated user
  .post(
    "/",
    clerkMiddleware(), // Auth middleware to ensure user is logged in
    zValidator(
      "json",
      insertAccountSchema.pick({ name: true }) // Validate only the "name" field from the schema
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json"); // Access validated input

      // Check if the user is authenticated
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Insert a new account record into the database
      const [data] = await db
        .insert(accounts)
        .values({
          id: createId(), // Generate a unique ID for the account
          userId: auth.userId, // Associate the account with the current user
          ...values, // Spread validated values (only includes name)
        })
        .returning(); // Return the inserted record

      // Return the newly created account data
      return c.json({ data });
    }
  );

// Export the app instance for use elsewhere (e.g. server entry point)
export default app;
