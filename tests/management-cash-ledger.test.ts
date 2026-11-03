import { describe, expect, it } from "vitest";

import { calculateAccountBalance } from "../src/lib/management/cash-ledger";
import { cashSchema } from "../src/lib/management/validation";

const sourceId = "00000000-0000-4000-8000-000000000001";
const destinationId = "00000000-0000-4000-8000-000000000002";
const categoryId = "00000000-0000-4000-8000-000000000003";
const base = { accountId: sourceId, packageId: "", amount: "1000000", transactionAt: "2026-11-03T10:00", description: "Transaksi uji" };

describe("cash ledger transaction types", () => {
  it("adds cash-in only to the selected internal account", () => {
    const transaction = { accountId: sourceId, direction: "in" as const, amount: 1_000_000 };
    expect(calculateAccountBalance(sourceId, [transaction])).toBe(1_000_000);
    expect(calculateAccountBalance(destinationId, [transaction])).toBe(0);
    expect(cashSchema.safeParse({ ...base, direction: "in" }).success).toBe(true);
  });

  it("subtracts an external cash-out without crediting another internal account", () => {
    const transaction = { accountId: sourceId, direction: "out" as const, amount: 400_000 };
    expect(calculateAccountBalance(sourceId, [transaction])).toBe(-400_000);
    expect(calculateAccountBalance(destinationId, [transaction])).toBe(0);
    expect(cashSchema.safeParse({ ...base, direction: "out", categoryId, recipientName: "Vendor Hotel" }).success).toBe(true);
  });

  it("moves an internal transfer between accounts without changing total cash", () => {
    const transaction = { accountId: sourceId, destinationAccountId: destinationId, direction: "transfer" as const, amount: 250_000 };
    const sourceBalance = calculateAccountBalance(sourceId, [transaction]);
    const destinationBalance = calculateAccountBalance(destinationId, [transaction]);
    expect(sourceBalance).toBe(-250_000);
    expect(destinationBalance).toBe(250_000);
    expect(sourceBalance + destinationBalance).toBe(0);
    expect(cashSchema.safeParse({ ...base, direction: "transfer", destinationAccountId: destinationId }).success).toBe(true);
  });

  it("requires a category for external expenses", () => {
    const result = cashSchema.safeParse({ ...base, direction: "out" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors.categoryId).toContain("Kategori biaya wajib dipilih untuk kas keluar.");
  });
});
