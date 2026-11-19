import { describe, expect, it } from "vitest";

import { invoiceOutstanding, netPaidForInvoiceIds } from "../src/lib/management/invoice-ledger";

const payments = [
  { id: "pay-dp", invoiceId: "invoice-awal", amount: 16_500_000, status: "confirmed" },
  { id: "pay-lunas", invoiceId: "invoice-pelunasan", amount: 24_400_000, status: "confirmed" },
  { id: "pay-void", invoiceId: "invoice-awal", amount: 1_000_000, status: "void" },
];

describe("invoice settlement ledger", () => {
  it("calculates the original invoice remainder before settlement", () => {
    const paid = netPaidForInvoiceIds(["invoice-awal"], payments, []);
    expect(paid).toBe(16_500_000);
    expect(invoiceOutstanding(40_900_000, paid)).toBe(24_400_000);
  });

  it("aggregates parent and settlement payments without doubling the invoice total", () => {
    const paid = netPaidForInvoiceIds(["invoice-awal", "invoice-pelunasan"], payments, []);
    expect(paid).toBe(40_900_000);
    expect(invoiceOutstanding(40_900_000, paid)).toBe(0);
  });

  it("restores the outstanding amount when a confirmed payment is refunded", () => {
    const paid = netPaidForInvoiceIds(["invoice-awal", "invoice-pelunasan"], payments, [
      { paymentId: "pay-lunas", amount: 4_000_000, status: "confirmed" },
    ]);
    expect(paid).toBe(36_900_000);
    expect(invoiceOutstanding(40_900_000, paid)).toBe(4_000_000);
  });

  it("ignores void payments and void refunds", () => {
    expect(netPaidForInvoiceIds(["invoice-awal"], payments, [
      { paymentId: "pay-dp", amount: 2_000_000, status: "void" },
    ])).toBe(16_500_000);
  });
});
