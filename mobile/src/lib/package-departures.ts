import type { Package, PackageDeparture } from "@/types";

export type PackageDepartureSelection = {
  packageItem: Package;
  departure: PackageDeparture;
};

function legacyDeparture(item: Package): PackageDeparture | null {
  if (!item.departureId || !item.departureDate) return null;
  return {
    id: item.departureId,
    departureDate: item.departureDate,
    dateLabel: item.departureDate,
    price: item.priceFrom,
    status: item.status === "limited" ? "limited" : item.status === "sold-out" ? "sold-out" : item.status === "coming-soon" ? "coming-soon" : "available",
    selectable: item.status === "available" || item.status === "limited",
  };
}

export function departuresForPackage(item: Package): PackageDeparture[] {
  if (item.departures) return item.departures;
  const fallback = legacyDeparture(item);
  return fallback ? [fallback] : [];
}

export function findPackageDeparture(packages: Package[] | undefined, departureId: string | undefined): PackageDepartureSelection | undefined {
  if (!packages || !departureId) return undefined;
  for (const packageItem of packages) {
    const departure = departuresForPackage(packageItem).find((candidate) => candidate.id === departureId);
    if (departure) return { packageItem, departure };
  }
  return undefined;
}

export function flattenPackageDepartures(packages: Package[] | undefined): PackageDepartureSelection[] {
  const dateKey = (departure: PackageDeparture) => /^\d{4}-\d{2}-\d{2}$/.test(departure.departureDate) ? departure.departureDate : "9999-12-31";
  return (packages ?? [])
    .flatMap((packageItem) => departuresForPackage(packageItem).map((departure) => ({ packageItem, departure })))
    .sort((left, right) => dateKey(left.departure).localeCompare(dateKey(right.departure)));
}
