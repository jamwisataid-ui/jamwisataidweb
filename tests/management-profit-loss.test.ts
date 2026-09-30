import { describe, expect, it } from "vitest";

import { computeProfitLoss, getProfitLossOutcome, type ProfitLossTransaction } from "../src/lib/management/profit-loss";

function transaction(overrides: Partial<ProfitLossTransaction> = {}): ProfitLossTransaction {
  return {
    id: crypto.randomUUID(),
    transactionAt: "2026-09-15T10:00:00+07:00",
    description: "Transaksi",
    direction: "out",
    kind: "expense",
    amount: 1_000_000,
    isReversal: false,
    isIncludedInReports: true,
    resolvedPackageId: "package-a",
    packageName: "Umrah September",
    categoryName: "Operasional",
    ...overrides,
  };
}

describe("laporan laba/rugi", () => {
  it("menghitung pendapatan, refund, biaya, komisi, dan laba bersih berbasis kas", () => {
    const report = computeProfitLoss([
      transaction({ direction: "in", kind: "payment", amount: 100_000_000 }),
      transaction({ kind: "refund", amount: 5_000_000 }),
      transaction({ kind: "expense", amount: 20_000_000 }),
      transaction({ kind: "commission", amount: 3_000_000 }),
    ]);

    expect(report).toMatchObject({
      revenue: 100_000_000,
      refunds: 5_000_000,
      netRevenue: 95_000_000,
      operatingExpenses: 20_000_000,
      commissions: 3_000_000,
      netProfit: 72_000_000,
    });
  });

  it("mengecualikan saldo awal, transfer, transaksi pembalik, dan data yang tidak masuk laporan", () => {
    const report = computeProfitLoss([
      transaction({ direction: "in", kind: "opening_balance", amount: 50_000_000 }),
      transaction({ direction: "transfer", kind: "manual", amount: 15_000_000 }),
      transaction({ direction: "in", kind: "payment", amount: 10_000_000, isReversal: true }),
      transaction({ direction: "in", kind: "payment", amount: 10_000_000, isIncludedInReports: false }),
    ]);

    expect(report.rows).toHaveLength(0);
    expect(report.netProfit).toBe(0);
  });

  it("memfilter periode dan paket sambil tetap menyertakan overhead pada laporan keseluruhan", () => {
    const rows = [
      transaction({ id: "a", transactionAt: "2026-08-31T23:00:00+07:00", direction: "in", kind: "payment", amount: 10_000_000 }),
      transaction({ id: "b", transactionAt: "2026-09-01T00:00:00+07:00", direction: "in", kind: "payment", amount: 20_000_000 }),
      transaction({ id: "c", transactionAt: "2026-09-20T10:00:00+07:00", resolvedPackageId: "package-b", amount: 2_000_000 }),
      transaction({ id: "d", transactionAt: "2026-09-20T10:00:00+07:00", resolvedPackageId: null, packageName: null, amount: 1_000_000 }),
    ];

    const overall = computeProfitLoss(rows, { from: "2026-09-01", to: "2026-09-30" });
    expect(overall.rows.map((row) => row.id)).toEqual(["b", "c", "d"]);
    expect(overall.netProfit).toBe(17_000_000);

    const packageOnly = computeProfitLoss(rows, { from: "2026-09-01", to: "2026-09-30", packageId: "package-a" });
    expect(packageOnly.rows.map((row) => row.id)).toEqual(["b"]);
    expect(packageOnly.netProfit).toBe(20_000_000);
  });

  it.each([
    {
      name: "laba",
      transactions: [
        transaction({ direction: "in", kind: "payment", amount: 20_000_000 }),
        transaction({ kind: "expense", amount: 8_000_001 }),
      ],
      expectedNet: 11_999_999,
      expectedOutcome: { kind: "profit", label: "Laba", amount: 11_999_999 },
    },
    {
      name: "impas",
      transactions: [
        transaction({ direction: "in", kind: "payment", amount: 10_000_000 }),
        transaction({ kind: "expense", amount: 10_000_000 }),
      ],
      expectedNet: 0,
      expectedOutcome: { kind: "break-even", label: "Impas", amount: 0 },
    },
    {
      name: "rugi",
      transactions: [
        transaction({ direction: "in", kind: "payment", amount: 338_000_001 }),
        transaction({ kind: "expense", amount: 346_320_000 }),
      ],
      expectedNet: -8_319_999,
      expectedOutcome: { kind: "loss", label: "Rugi", amount: 8_319_999 },
    },
  ])("menyajikan hasil $name dengan tanda dan nominal yang benar", ({ transactions, expectedNet, expectedOutcome }) => {
    const report = computeProfitLoss(transactions);

    expect(report.netProfit).toBe(expectedNet);
    expect(getProfitLossOutcome(report.netProfit)).toEqual(expectedOutcome);
  });
});
