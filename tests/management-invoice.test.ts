import { describe, expect, it } from "vitest";

import { applyItemDescriptions, buildInvoiceItems, invoiceTotals, normalizeReceiptDescription, resolveInvoiceAmount } from "../src/lib/management/invoice";

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

  it("rejects an invoice above the uninvoiced remainder", () => {
    expect(() => resolveInvoiceAmount(58_000_001, 58_000_000)).toThrow("sisa harga");
  });

  it("supports a later settlement invoice using the remaining value", () => {
    expect(resolveInvoiceAmount(57_800_000, 57_800_000)).toBe(57_800_000);
  });
});

describe("invoice line descriptions", () => {
  const items = [
    { description: "Paket A — Jan", qty: 2, unitPrice: 10, total: 20 },
    { description: "Paket A — Jan", qty: 1, unitPrice: 15, total: 15 },
  ];

  it("replaces only non-blank overrides and keeps amounts", () => {
    expect(applyItemDescriptions(items, ["  Pelunasan   umroh Januari ", ""])).toEqual([
      { description: "Pelunasan umroh Januari", qty: 2, unitPrice: 10, total: 20 },
      items[1],
    ]);
  });

  it("ignores missing or malformed overrides", () => {
    expect(applyItemDescriptions(items, undefined)).toBe(items);
    expect(applyItemDescriptions(items, [42, null, "extra"])).toEqual(items);
  });

  it("rejects descriptions that would overflow the template", () => {
    expect(() => applyItemDescriptions(items, ["x".repeat(141)])).toThrow("maksimal 140");
  });
});

describe("receipt description", () => {
  it("normalizes edited text and treats blank as automatic", () => {
    expect(normalizeReceiptDescription("  Pelunasan   umroh Januari ")).toBe("Pelunasan umroh Januari");
    expect(normalizeReceiptDescription("   ")).toBeUndefined();
    expect(normalizeReceiptDescription(null)).toBeUndefined();
  });

  it("rejects text that would overflow the receipt line", () => {
    expect(() => normalizeReceiptDescription("x".repeat(161))).toThrow("maksimal 160");
  });
});
