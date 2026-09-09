import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { requireDatabase } from "@/db";
import { departures, hppCostingItems, hppCostings, hppPriceMaster, packages } from "@/db/schema";

export async function getHppContext() {
  const database = requireDatabase();
  const [costings, items, masterPrices, packageRows, departureRows] = await Promise.all([
    database.select().from(hppCostings).orderBy(desc(hppCostings.updatedAt)),
    database.select().from(hppCostingItems).orderBy(asc(hppCostingItems.sortOrder)),
    database.select().from(hppPriceMaster).where(eq(hppPriceMaster.status, "active")).orderBy(asc(hppPriceMaster.category), asc(hppPriceMaster.sortOrder)),
    database.select({ id: packages.id, name: packages.name, status: packages.status }).from(packages).orderBy(asc(packages.name)),
    database.select().from(departures).orderBy(asc(departures.departureDate)),
  ]);
  const packagesById = new Map(packageRows.map((item) => [item.id, item]));
  return {
    costings: costings.map((costing) => ({
      ...costing,
      items: items.filter((item) => item.costingId === costing.id),
      package: costing.packageId ? packagesById.get(costing.packageId) : undefined,
      departure: departureRows.find((departure) => departure.id === costing.departureId),
    })),
    masterPrices,
    packages: packageRows,
    departures: departureRows.map((departure) => ({ ...departure, package: packagesById.get(departure.packageId) })),
  };
}

export async function getHppCosting(id: string) {
  const context = await getHppContext();
  return { ...context, costing: context.costings.find((item) => item.id === id) ?? null };
}

export async function getHppExportData(id: string) {
  const database = requireDatabase();
  const costing = await database.query.hppCostings.findFirst({ where: eq(hppCostings.id, id) });
  if (!costing) return null;
  const items = await database.select().from(hppCostingItems).where(eq(hppCostingItems.costingId, id)).orderBy(asc(hppCostingItems.sortOrder));
  return { costing, items };
}
