import { drizzle } from "drizzle-orm/node-postgres";
import {
  problems as problemSchema,
  sessions as sessionSchema,
  votes as votesSchema,
} from "./schema.ts";
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
  schema: { problemSchema, votesSchema, sessionSchema },
});

export async function getProblemCount() {
  const problems = await db.select().from(problemSchema);
  return problems.length;
}

export async function doesSessionExist(token: string) {
  const session = await db.select().from(sessionSchema).where(
    eq(sessionSchema.token, token),
  );
  return session.length > 0;
}

export async function createSession(token: string, expiry: Date) {
  await db.insert(sessionSchema).values({
    token,
    expiry,
  });
}

export async function createSessionIfNotExists(token: string, expiry: Date) {
  if (!(await doesSessionExist(token))) {
    await createSession(token, expiry);
  }
}
