import { describe, expect, it } from "vitest";

import { packageFormSchema } from "../src/lib/cms/validation";

const validPackage = {
  id: "package-plus-test",
  departureId: "",
  slug: "umroh-plus-test",
  name: "Umroh Plus Test",
  category: "umrah",
  packageType: "plus",
  imageUrl: "/images/test.webp",
  durationDays: 12,
  whatsappMessage: "Mohon informasi paket Umroh Plus.",
  departureDate: "2027-01-10",
  departureLabel: "10 Januari 2027",
  airline: "Saudi Airlines",
  departureAirport: "Jakarta",
  price: "39900000",
  departureStatus: "open",
  makkahHotel: "Hotel Makkah Test",
  makkahStar: 5,
  madinahHotel: "Hotel Madinah Test",
  madinahStar: 4,
};

describe("hotel Program Umroh Plus", () => {
  it("accepts multiple destinations from the serialized form value", () => {
    const result = packageFormSchema.parse({
      ...validPackage,
      plusHotels: JSON.stringify([
        { destination: "Istanbul", hotelName: "Ramada Plaza", star: 5 },
        { destination: "Bursa", hotelName: "Almira Hotel", star: 4 },
      ]),
    });

    expect(result.plusHotels).toEqual([
      { destination: "Istanbul", hotelName: "Ramada Plaza", star: 5 },
      { destination: "Bursa", hotelName: "Almira Hotel", star: 4 },
    ]);
  });

  it("requires at least one additional hotel for an Umroh Plus package", () => {
    const result = packageFormSchema.safeParse({ ...validPackage, plusHotels: "[]" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors.plusHotels?.[0]).toContain("minimal satu hotel");
  });

  it("rejects incomplete additional hotel data", () => {
    const result = packageFormSchema.safeParse({
      ...validPackage,
      plusHotels: JSON.stringify([{ destination: "", hotelName: "Hotel", star: 4 }]),
    });
    expect(result.success).toBe(false);
  });

  it("keeps regular packages backward compatible and discards additional hotels", () => {
    const result = packageFormSchema.parse({
      ...validPackage,
      packageType: "reguler",
      plusHotels: JSON.stringify([{ destination: "Istanbul", hotelName: "Ramada Plaza", star: 5 }]),
    });
    expect(result.plusHotels).toEqual([]);
  });
});
