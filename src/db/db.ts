import { drizzle } from "drizzle-orm/node-postgres";
import { problems as problemSchema, votes as votesSchema } from "./schema.ts";
import pg from "pg";
import { integer } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm/expressions";

// Use pg driver.
const { Pool } = pg;

// Instantiate Drizzle client with pg driver and schema.
export const db = drizzle({
  client: new Pool({
    connectionString: Deno.env.get("DATABASE_URL"),
  }),
  schema: { problemSchema, votesSchema },
});

export async function getProblemCount() {
  const problems = await db.select().from(problemSchema);
  return problems.length;
}
