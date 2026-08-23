import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

export const db = isDatabaseConfigured
  ? drizzle(process.env.DATABASE_URL!, { schema })
  : null;

export type Database = NonNullable<typeof db>;

export function requireDatabase(): Database {
  if (!db) {
    throw new Error("DATABASE_URL belum dikonfigurasi.");
  }

  return db;
}
