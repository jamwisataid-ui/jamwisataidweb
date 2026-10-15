import { describe, expect, it } from "vitest";

import { packageFormSchema } from "../src/lib/cms/validation";

const basePackage = {
  id: "multi-departure-package",
  slug: "umroh-banyak-jadwal",
  name: "Umroh Banyak Jadwal",
  category: "umrah",
  packageType: "reguler",
  imageUrl: "/images/test.webp",
  durationDays: 9,
  whatsappMessage: "Mohon informasi paket.",
  departureDate: "2027-01-16",
  departureLabel: "16 Januari 2027",
  airline: "Qatar Airways",
  departureAirport: "Jakarta",
  price: "34900000",
  departureStatus: "open",
  makkahHotel: "Hotel Makkah",
  makkahStar: 5,
  madinahHotel: "Hotel Madinah",
  madinahStar: 4,
};

describe("package departures", () => {
  it("accepts unlimited repeatable departures with independent commercial data", () => {
    const result = packageFormSchema.parse({ ...basePackage, departures: JSON.stringify([
      { departureDate: "2027-01-16", returnDate: "2027-01-24", price: "34900000", capacity: 45, availableSeats: 20, status: "open" },
      { departureDate: "2027-01-30", price: "35900000", capacity: 40, availableSeats: 4, status: "limited" },
      { departureDate: "2027-02-13", price: "36900000", status: "coming-soon" },
    ]) });
    expect(result.departures).toHaveLength(3);
    expect(result.departures[1]).toMatchObject({ departureDate: "2027-01-30", price: 35_900_000, status: "limited" });
  });

  it("keeps legacy single departure payloads working", () => {
    const result = packageFormSchema.parse(basePackage);
    expect(result.departures).toEqual([expect.objectContaining({ departureDate: "2027-01-16", price: 34_900_000, status: "open" })]);
  });

  it("rejects a package without any departure", () => {
    const result = packageFormSchema.safeParse({ ...basePackage, departureDate: "", departures: "[]" });
    expect(result.success).toBe(false);
  });

  it("rejects duplicate dates and remaining quota above capacity", () => {
    const duplicate = { departureDate: "2027-01-16", price: "34900000", capacity: 40, availableSeats: 45, status: "open" };
    const result = packageFormSchema.safeParse({ ...basePackage, departures: JSON.stringify([duplicate, duplicate]) });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message)).toEqual(expect.arrayContaining([
      expect.stringContaining("tidak boleh duplikat"),
      expect.stringContaining("tidak boleh melebihi"),
    ]));
  });
});
