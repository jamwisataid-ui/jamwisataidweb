import { describe, expect, it } from "vitest";

import { childInvoiceLabel, installmentLineDescription, invoiceOutstanding, netPaidForInvoiceIds } from "../src/lib/management/invoice-ledger";

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

describe("termin invoices", () => {
  it("splits the remainder into custom termin amounts until lunas", () => {
    const ledger = [
      { id: "dp", invoiceId: "awal", amount: 10_500_000, status: "confirmed" },
      { id: "t1", invoiceId: "termin-1", amount: 5_000_000, status: "confirmed" },
    ];
    const remaining = invoiceOutstanding(34_900_000, netPaidForInvoiceIds(["awal", "termin-1"], ledger, []));
    expect(remaining).toBe(19_400_000);
    ledger.push({ id: "t2", invoiceId: "termin-2", amount: 19_400_000, status: "confirmed" });
    expect(invoiceOutstanding(34_900_000, netPaidForInvoiceIds(["awal", "termin-1", "termin-2"], ledger, []))).toBe(0);
  });

  it("labels partial children as termin and full remainder as pelunasan", () => {
    const termin = installmentLineDescription({ packageName: "Umroh Desember", amount: 5_000_000, remaining: 24_400_000, installmentNumber: 1 });
    const lunas = installmentLineDescription({ packageName: "Umroh Desember", departureLabel: "12 Des", amount: 19_400_000, remaining: 19_400_000, installmentNumber: 2 });
    expect(termin).toBe("Pembayaran termin 1 Umroh Desember");
    expect(lunas).toBe("Pelunasan Umroh Desember — 12 Des");
    expect(childInvoiceLabel({ items: [{ description: termin }] })).toBe("Invoice Termin");
    expect(childInvoiceLabel({ items: [{ description: lunas }] })).toBe("Invoice Pelunasan");
  });
});
