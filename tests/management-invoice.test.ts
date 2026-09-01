import { describe, expect, it } from "vitest";

import { buildInvoiceItems, invoiceTotals, resolveInvoiceAmount } from "../src/lib/management/invoice";

const registrations = [
  { agreedPrice: 33_900_000, dpTarget: 5_000_000 },
  { agreedPrice: 33_900_000, dpTarget: 5_000_000 },
];

describe("invoice management", () => {
  it("separates package price and DP invoice totals", () => {
    expect(invoiceTotals(registrations)).toEqual({ totalPrice: 67_800_000, totalDp: 10_000_000 });
  });

  it("renders a DP invoice without changing the package price", () => {
    expect(buildInvoiceItems({ registrations, invoiceAmount: 10_000_000, packageName: "Umroh Premium", departureLabel: "30 Agustus 2026" })).toEqual([
      { description: "Tagihan DP Umroh Premium — 30 Agustus 2026", qty: 2, unitPrice: 5_000_000, total: 10_000_000 },
    ]);
  });

  it("supports a custom invoice amount", () => {
    expect(buildInvoiceItems({ registrations, invoiceAmount: 7_500_000, packageName: "Umroh Premium", departureLabel: "" })[0]).toMatchObject({ qty: 1, unitPrice: 7_500_000, total: 7_500_000 });
  });

  it("rejects invoice amounts above the booking total", () => {
    expect(() => resolveInvoiceAmount(70_000_000, 67_800_000)).toThrow("tidak boleh melebihi");
  });
});
