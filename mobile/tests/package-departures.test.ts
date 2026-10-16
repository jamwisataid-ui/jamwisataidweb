import { describe, expect, it } from "vitest";

import { findPackageDeparture, flattenPackageDepartures } from "../src/lib/package-departures";
import type { Package } from "../src/types";

const packages: Package[] = [{
  id: "package-a",
  slug: "package-a",
  name: "Paket A",
  category: "umrah",
  packageType: "reguler",
  image: "https://example.com/a.jpg",
  status: "available",
  priceFrom: 34_900_000,
  departures: [
    { id: "departure-3", departureDate: "2027-02-13", dateLabel: "13 Februari 2027", price: 36_900_000, status: "coming-soon", selectable: false },
    { id: "departure-1", departureDate: "2027-01-16", dateLabel: "16 Januari 2027", price: 34_900_000, status: "available", selectable: true },
    { id: "departure-2", departureDate: "2027-01-30", dateLabel: "30 Januari 2027", price: 35_900_000, status: "limited", selectable: true },
    { id: "departure-4", departureDate: "2027-02-20", dateLabel: "20 Februari 2027", price: 37_900_000, status: "sold-out", selectable: false },
  ],
}, {
  id: "legacy",
  slug: "legacy",
  name: "Paket Lama",
  category: "umrah",
  packageType: "reguler",
  image: "https://example.com/legacy.jpg",
  status: "available",
  departureId: "legacy-departure",
  departureDate: "1 Maret 2027",
  priceFrom: 30_000_000,
}];

describe("mobile package departures", () => {
  it("finds the second departure and keeps its own price", () => {
    const result = findPackageDeparture(packages, "departure-2");
    expect(result?.packageItem.id).toBe("package-a");
    expect(result?.departure).toMatchObject({ dateLabel: "30 Januari 2027", price: 35_900_000, status: "limited" });
  });

  it.each([
    ["departure-1", 34_900_000, true],
    ["departure-2", 35_900_000, true],
    ["departure-3", 36_900_000, false],
    ["departure-4", 37_900_000, false],
  ])("keeps the commercial state for %s", (departureId, price, selectable) => {
    expect(findPackageDeparture(packages, departureId)?.departure).toMatchObject({ price, selectable });
  });

  it("flattens and sorts every departure while keeping legacy packages", () => {
    const result = flattenPackageDepartures(packages);
    expect(result.map((item) => item.departure.id)).toEqual(["departure-1", "departure-2", "departure-3", "departure-4", "legacy-departure"]);
  });

  it("does not silently fall back when a departure id is invalid", () => {
    expect(findPackageDeparture(packages, "missing")).toBeUndefined();
  });

  it("does not revive a past legacy departure when the API sends an empty departures list", () => {
    const archived = { ...packages[1], departures: [] };
    expect(flattenPackageDepartures([archived])).toEqual([]);
  });
});
