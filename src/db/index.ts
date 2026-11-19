import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL?.trim() ||
  process.env.POSTGRES_URL?.trim() ||
  process.env.DATABASE_URL_UNPOOLED?.trim();

export const isDatabaseConfigured = Boolean(databaseUrl);

type DatabaseGlobals = typeof globalThis & {
  __jamWisataPool?: Pool;
};

const databaseGlobals = globalThis as DatabaseGlobals;

function createPool() {
  if (!databaseUrl) return null;

  return new Pool({
    connectionString: databaseUrl,
    max: Number(process.env.DATABASE_POOL_MAX || 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    application_name: "jamwisata-web",
  });
}

// Reuse one pool during Next.js development reloads and across requests in the
// long-running VPS container. The same driver also works during the temporary
// Neon-to-VPS cutover because both expose the PostgreSQL wire protocol.
export const databasePool = isDatabaseConfigured
  ? (databaseGlobals.__jamWisataPool ??= createPool()!)
  : null;

export const db = databasePool
  ? drizzle(databasePool, { schema })
  : null;

export type Database = NonNullable<typeof db>;

export function requireDatabase(): Database {
  if (!db) {
    throw new Error("DATABASE_URL belum dikonfigurasi.");
  }

  return db;
}
