import { describe, expect, it } from "vitest";

import { accountDeletionRequestSchema, deletionRequestReference } from "@/lib/account-deletion";

describe("account deletion request", () => {
  it("normalizes an Indonesian WhatsApp number", () => {
    const parsed = accountDeletionRequestSchema.parse({
      fullName: "Ahmad Fauzi",
      whatsapp: "0812-3456-7890",
      reason: "Sudah tidak menggunakan layanan.",
    });
    expect(parsed.whatsapp).toBe("6281234567890");
  });

  it("rejects incomplete submissions and retains the honeypot value", () => {
    expect(accountDeletionRequestSchema.safeParse({ fullName: "A", whatsapp: "123" }).success).toBe(false);
    expect(accountDeletionRequestSchema.parse({ fullName: "Ahmad Fauzi", whatsapp: "081234567890", website: "spam.example" }).website).toBe("spam.example");
  });

  it("creates a traceable non-PII reference", () => {
    expect(deletionRequestReference(new Date("2026-11-14T00:00:00.000Z"), "abc123")).toBe("DEL-20261114-ABC123");
  });
});
