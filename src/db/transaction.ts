import "server-only";

import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import ws from "ws";

import * as schema from "./schema";

neonConfig.webSocketConstructor = ws;

const databaseUrl =
  process.env.DATABASE_URL?.trim() ||
  process.env.POSTGRES_URL?.trim() ||
  process.env.DATABASE_URL_UNPOOLED?.trim();

/**
 * Neon HTTP stays the fast default for reads. Critical multi-table writes use a
 * request-scoped WebSocket pool so they are committed or rolled back together.
 */
export async function withManagementTransaction<T>(
  callback: (tx: Parameters<Parameters<NeonDatabase<typeof schema>["transaction"]>[0]>[0]) => Promise<T>,
): Promise<T> {
  if (!databaseUrl) throw new Error("DATABASE_URL belum dikonfigurasi.");

  const pool = new Pool({ connectionString: databaseUrl });
  const database = drizzle(pool, { schema });
  try {
    return await database.transaction(callback);
  } finally {
    await pool.end();
  }
}
