import { describe, expect, it } from "vitest";

import { DOCUMENT_NUMBER_PATTERN, documentPeriod, dueDate, formatDocumentNumber, parseDocumentSequenceInput, paymentStatus, terbilang, upcomingBirthday } from "../src/lib/management/domain";

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
    ["invoice", { pattern: DOCUMENT_NUMBER_PATTERN, padding: 4, nextNumber: 9951, reset: "never" as const, currentPeriod: null }, "9951/jamw/011026", 9952],
    ["kwitansi", { pattern: DOCUMENT_NUMBER_PATTERN, padding: 4, nextNumber: 66, reset: "never" as const, currentPeriod: null }, "0066/jamw/011026", 67],
  ])("menghasilkan nomor awal %s Jam Wisata dan menaikkan urutan", (_kind, config, number, nextNumber) => {
    expect(formatDocumentNumber(config, new Date("2026-10-01T10:00:00+07:00"))).toMatchObject({ number, nextNumber });
  });
  it("menghasilkan format existing yang configurable", () => {
    expect(formatDocumentNumber({ pattern: "{seq}/Jamw/{MM}{YY}", padding: 4, nextNumber: 9932, reset: "never", currentPeriod: null }, new Date("2026-08-29T10:00:00+07:00"))).toMatchObject({ number: "9932/Jamw/0826", nextNumber: 9933 });
  });
  it("memulai ulang nomor ketika periode berubah", () => {
    expect(formatDocumentNumber({ pattern: "{seq}{DD}{MM}{YY}", padding: 6, nextNumber: 99, reset: "monthly", currentPeriod: "2026-07" }, new Date("2026-08-29T10:00:00+07:00")).number).toBe("000001290826");
    expect(documentPeriod("yearly", new Date("2026-08-29"))).toBe("2026");
  });
  it("menggunakan tanggal Jakarta ketika waktu UTC masih berada pada hari sebelumnya", () => {
    expect(formatDocumentNumber({ pattern: DOCUMENT_NUMBER_PATTERN, padding: 4, nextNumber: 9951, reset: "never", currentPeriod: null }, new Date("2026-09-30T17:30:00Z")).number).toBe("9951/jamw/011026");
    expect(documentPeriod("monthly", new Date("2026-09-30T17:30:00Z"))).toBe("2026-10");
  });
  it("mempertahankan pattern tanggal dinamis ketika angka urut diedit", () => {
    expect(parseDocumentSequenceInput("9952/jamw/011026")).toEqual({ nextNumber: 9952, padding: 4, pattern: DOCUMENT_NUMBER_PATTERN });
    expect(parseDocumentSequenceInput("0081")).toEqual({ nextNumber: 81, padding: 4, pattern: DOCUMENT_NUMBER_PATTERN });
    expect(parseDocumentSequenceInput("invoice-9952")).toBeNull();
  });
  it("menghasilkan 50 nomor unik berurutan", () => {
    let nextNumber = 9933;
    const numbers = Array.from({ length: 50 }, () => {
      const result = formatDocumentNumber({ pattern: DOCUMENT_NUMBER_PATTERN, padding: 4, nextNumber, reset: "never", currentPeriod: null }, new Date("2026-10-01T10:00:00+07:00"));
      nextNumber = result.nextNumber;
      return result.number;
    });
    expect(new Set(numbers).size).toBe(50);
    expect(numbers.at(-1)).toBe("9982/jamw/011026");
  });
});

describe("utilitas transaksi", () => {
  it("mengubah nominal menjadi teks Indonesia", () => expect(terbilang(31_500_000)).toBe("Tiga puluh satu juta lima ratus ribu rupiah"));
  it("menghitung jatuh tempo H-30 dalam zona Jakarta", () => expect(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(dueDate("2026-10-31", 30))).toBe("2026-10-01"));
});

describe("pengingat ulang tahun", () => {
  it("menghitung ulang tahun hari ini dalam zona Jakarta", () => {
    expect(upcomingBirthday("1990-08-30", new Date("2026-08-29T18:00:00Z"))).toMatchObject({ daysUntil: 0, age: 36, date: "2026-08-30" });
  });

  it("mengarah ke ulang tahun tahun depan bila tanggal sudah lewat", () => {
    expect(upcomingBirthday("1990-08-29", new Date("2026-08-30T05:00:00Z"))).toMatchObject({ daysUntil: 364, age: 37, date: "2027-08-29" });
  });
});

describe("room list & assignment domain", () => {
  it("membersihkan nama hotel untuk kode kamar", async () => {
    const { cleanHotelSlug } = await import("../src/lib/management/domain");
    expect(cleanHotelSlug("Hotel Pullman Zamzam")).toBe("Pullman");
    expect(cleanHotelSlug("Akomodasi Arkan Almanar")).toBe("Arkan");
    expect(cleanHotelSlug(null)).toBe("Hotel");
  });

  it("menghasilkan nomor kamar default terstruktur per kota dan nomor urut", async () => {
    const { generateDefaultRoomNumber } = await import("../src/lib/management/domain");
    expect(generateDefaultRoomNumber({ city: "makkah", hotelName: "Pullman Zamzam", roomType: "quad", roomIndex: 1 })).toBe("MKH-Pullman-Quad-01");
    expect(generateDefaultRoomNumber({ city: "madinah", hotelName: "Arkan Almanar", roomType: "triple", roomIndex: 3 })).toBe("MDN-Arkan-Triple-03");
  });
});
