import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL?.trim() ||
  process.env.POSTGRES_URL?.trim() ||
  process.env.DATABASE_URL_UNPOOLED?.trim();

export const isDatabaseConfigured = Boolean(databaseUrl);

export const db = isDatabaseConfigured
  ? drizzle(databaseUrl!, { schema })
  : null;

export type Database = NonNullable<typeof db>;

export function requireDatabase(): Database {
  if (!db) {
    throw new Error("DATABASE_URL belum dikonfigurasi.");
  }

  return db;
}
