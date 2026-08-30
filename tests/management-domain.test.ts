import { describe, expect, it } from "vitest";

import { documentPeriod, dueDate, formatDocumentNumber, paymentStatus, terbilang } from "../src/lib/management/domain";

describe("status pembayaran", () => {
  it.each([
    [{ agreedPrice: 30_000_000, dpTarget: 5_000_000, paid: 0, refunded: 0 }, "Belum Bayar", 30_000_000],
    [{ agreedPrice: 30_000_000, dpTarget: 5_000_000, paid: 2_000_000, refunded: 0 }, "DP", 28_000_000],
    [{ agreedPrice: 30_000_000, dpTarget: 5_000_000, paid: 10_000_000, refunded: 0 }, "Cicilan", 20_000_000],
    [{ agreedPrice: 30_000_000, dpTarget: 5_000_000, paid: 30_000_000, refunded: 0 }, "Lunas", 0],
    [{ agreedPrice: 30_000_000, dpTarget: 5_000_000, paid: 30_000_000, refunded: 30_000_000 }, "Refund", 30_000_000],
  ])("menghitung %o", (input, status, outstanding) => {
    expect(paymentStatus(input)).toMatchObject({ status, outstanding });
  });

  it("menandai refund sebagian tanpa menghilangkan status utama", () => {
    expect(paymentStatus({ agreedPrice: 30_000_000, dpTarget: 5_000_000, paid: 30_000_000, refunded: 2_000_000 })).toMatchObject({ status: "Cicilan", partialRefund: true, netPaid: 28_000_000 });
  });
});

describe("penomoran dokumen", () => {
  it.each([
    ["invoice", { pattern: "{seq}/jamw/300828", padding: 4, nextNumber: 9933, reset: "never" as const, currentPeriod: null }, "9933/jamw/300828", 9934],
    ["kwitansi", { pattern: "{seq}/jamw/300826", padding: 4, nextNumber: 66, reset: "never" as const, currentPeriod: null }, "0066/jamw/300826", 67],
  ])("menghasilkan nomor awal %s Jam Wisata dan menaikkan urutan", (_kind, config, number, nextNumber) => {
    expect(formatDocumentNumber(config, new Date("2026-08-30T10:00:00+07:00"))).toMatchObject({ number, nextNumber });
  });
  it("menghasilkan format existing yang configurable", () => {
    expect(formatDocumentNumber({ pattern: "{seq}/Jamw/{MM}{YY}", padding: 4, nextNumber: 9932, reset: "never", currentPeriod: null }, new Date("2026-08-29T10:00:00+07:00"))).toMatchObject({ number: "9932/Jamw/0826", nextNumber: 9933 });
  });
  it("memulai ulang nomor ketika periode berubah", () => {
    expect(formatDocumentNumber({ pattern: "{seq}{DD}{MM}{YY}", padding: 6, nextNumber: 99, reset: "monthly", currentPeriod: "2026-07" }, new Date("2026-08-29T10:00:00+07:00")).number).toBe("000001290826");
    expect(documentPeriod("yearly", new Date("2026-08-29"))).toBe("2026");
  });
});

describe("utilitas transaksi", () => {
  it("mengubah nominal menjadi teks Indonesia", () => expect(terbilang(31_500_000)).toBe("Tiga puluh satu juta lima ratus ribu rupiah"));
  it("menghitung jatuh tempo H-30 dalam zona Jakarta", () => expect(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(dueDate("2026-10-31", 30))).toBe("2026-10-01"));
});
