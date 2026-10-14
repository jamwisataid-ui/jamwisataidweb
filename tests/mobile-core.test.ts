import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { activationSchema, mobileLoginSchema, mobilePilgrimProfileSchema, mobileRegistrationSchema, mobileSelfRegistrationSchema } from "../src/lib/mobile/validation";

describe("mobile core contracts", () => {
  it("accepts a six digit PIN and normalizes Indonesian WhatsApp numbers", () => {
    expect(activationSchema.parse({ token: "a".repeat(32), pin: "123456" }).pin).toBe("123456");
    expect(mobileLoginSchema.parse({ whatsapp: "0812-3456-7890", pin: "654321" }).whatsapp).toBe("6281234567890");
  });

  it("rejects weak PIN formats", () => {
    expect(activationSchema.safeParse({ token: "a".repeat(32), pin: "12345" }).success).toBe(false);
    expect(activationSchema.safeParse({ token: "a".repeat(32), pin: "abcdef" }).success).toBe(false);
  });

  it("validates and normalizes the jamaah fields used by the existing dashboard", () => {
    const result = mobileSelfRegistrationSchema.parse({
      fullName: "Siti Aminah",
      whatsapp: "0812-3456-7890",
      email: "",
      gender: "Perempuan",
      birthDate: "1990-04-21",
      nationality: "Indonesia",
      passportNumber: " a12345 ",
      passportExpiry: "2030-04-21",
      notes: "",
      pin: "123456",
    });
    expect(result.whatsapp).toBe("6281234567890");
    expect(result.email).toBeUndefined();
    expect(result.passportNumber).toBe("A12345");
    expect(mobilePilgrimProfileSchema.safeParse({ ...result, birthDate: "21/04/1990" }).success).toBe(false);
  });

  it("requires valid payer data for a mobile booking", () => {
    const valid = mobileRegistrationSchema.safeParse({
      departureId: "267140de-4a52-4f00-81f4-196695350b0b",
      roomType: "quad",
      payerName: "Siti Aminah",
      payerWhatsapp: "081234567890",
      payerEmail: "",
    });
    expect(valid.success).toBe(true);
    expect(mobileRegistrationSchema.safeParse({ departureId: "invalid", payerName: "S", payerWhatsapp: "12" }).success).toBe(false);
  });

  it("ships an additive migration for linked mobile accounts and pending bookings", () => {
    const migration = readFileSync("drizzle/0018_mobile_core.sql", "utf8");
    expect(migration).toContain("mobile_accounts");
    expect(migration).toContain("pilgrim_id");
    expect(migration).toContain("ADD VALUE IF NOT EXISTS 'pending'");
    expect(migration).not.toContain("DROP TABLE");
  });

  it("stores a payment preference without creating a fake payment", () => {
    const migration = readFileSync("drizzle/0020_add_booking_payment_preference.sql", "utf8");
    expect(migration).toContain("preferred_payment_method");
    expect(migration).not.toContain("INSERT INTO \"payments\"");
    expect(migration).not.toContain("DROP ");
  });
});
