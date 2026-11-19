import "server-only";

import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "./schema";
import { requireDatabase } from "./index";

type ManagementTransaction = Parameters<
  Parameters<NodePgDatabase<typeof schema>["transaction"]>[0]
>[0];

/**
 * Run critical multi-table writes in one PostgreSQL transaction. This uses the
 * shared node-postgres pool for both the temporary Neon source and the final
 * PostgreSQL service on the VPS.
 */
export async function withManagementTransaction<T>(
  callback: (tx: ManagementTransaction) => Promise<T>,
): Promise<T> {
  return requireDatabase().transaction(callback);
}
