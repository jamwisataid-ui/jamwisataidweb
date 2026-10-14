import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { activationSchema, mobileLoginSchema } from "../src/lib/mobile/validation";

describe("mobile core contracts", () => {
  it("accepts a six digit PIN and normalizes Indonesian WhatsApp numbers", () => {
    expect(activationSchema.parse({ token: "a".repeat(32), pin: "123456" }).pin).toBe("123456");
    expect(mobileLoginSchema.parse({ whatsapp: "0812-3456-7890", pin: "654321" }).whatsapp).toBe("6281234567890");
  });

  it("rejects weak PIN formats", () => {
    expect(activationSchema.safeParse({ token: "a".repeat(32), pin: "12345" }).success).toBe(false);
    expect(activationSchema.safeParse({ token: "a".repeat(32), pin: "abcdef" }).success).toBe(false);
  });

  it("ships an additive migration for linked mobile accounts and pending bookings", () => {
    const migration = readFileSync("drizzle/0018_mobile_core.sql", "utf8");
    expect(migration).toContain("mobile_accounts");
    expect(migration).toContain("pilgrim_id");
    expect(migration).toContain("ADD VALUE IF NOT EXISTS 'pending'");
    expect(migration).not.toContain("DROP TABLE");
  });
});
