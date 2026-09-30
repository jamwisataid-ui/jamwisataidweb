import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { invoiceTemplate, receiptTemplate } from "../src/lib/management/document-templates";

vi.mock("server-only", () => ({}));

type Renderer = typeof import("../src/lib/management/document-renderer");
let renderer: Renderer;

const base = {
  number: "9933/jamw/300828",
  issuedAt: "2026-08-30T10:00:00+07:00",
  customer: { name: "Jamaah Uji", whatsapp: "08123456789" },
  accounts: [{ accountNumber: "035.888.9996" }],
  company: { name: "Jam Wisata", address: "", phone: "", email: "", signerName: "Atie Supriati", signerTitle: "Keuangan" },
};

beforeAll(async () => {
  renderer = await import("../src/lib/management/document-renderer");
});

describe("renderer template transaksi", () => {
  it("menghasilkan PNG invoice pada koordinat canvas tetap", async () => {
    const png = await renderer.renderTransactionPng({
      ...base,
      kind: "invoice",
      items: [{ description: "Paket Umroh", qty: 1, unitPrice: 30_000_000, total: 30_000_000 }],
      total: 30_000_000,
    });
    await expect(sharp(png).metadata()).resolves.toMatchObject({ format: "png", width: 1024, height: 1536 });
  });

  it("membuat halaman tambahan tanpa memperpanjang template", async () => {
    const items = Array.from({ length: 4 }, (_, index) => ({ description: `Item ${index + 1}`, qty: 1, unitPrice: 5_000_000, total: 5_000_000 }));
    const bytes = await renderer.renderTransactionPdf({ ...base, kind: "invoice", items, total: 20_000_000 });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(2);
    expect(pdf.getPages().map((page) => page.getSize())).toEqual([{ width: 1024, height: 1536 }, { width: 1024, height: 1536 }]);
  }, 15_000);

  it("menghasilkan kwitansi dari template tetap untuk nominal besar", async () => {
    const png = await renderer.renderTransactionPng({
      ...base,
      kind: "receipt",
      number: "0066/jamw/300826",
      invoiceNumber: "9933/jamw/300828",
      method: "transfer",
      items: [{ description: "Pembayaran cicilan paket umroh untuk keluarga dengan keterangan transaksi panjang", qty: 2, unitPrice: 123_456_789, total: 246_913_578 }],
      total: 246_913_578,
    });
    await expect(sharp(png).metadata()).resolves.toMatchObject({ format: "png", width: 1536, height: 1024 });
  });

  it("menjaga data ekstrem di dalam bounding box invoice dan kwitansi", async () => {
    const cases = [
      ["Muhammad Rizky Fadhlurrahman Al-Hafizh bin Abdul Muthalib Pratama", invoiceTemplate.fields.customerName],
      ["INV/JAMWISATA/UMRAH-PREMIUM/2026/00000000012345", invoiceTemplate.fields.documentNumber],
      ["Rp. 1,185,185,184", invoiceTemplate.fields.grandTotal],
      ["Muhammad Rizky Fadhlurrahman Al-Hafizh bin Abdul Muthalib Pratama", receiptTemplate.fields.customerName],
      ["Transfer Antarbank melalui Virtual Account Perusahaan", receiptTemplate.fields.paymentMethod],
      ["#Satu miliar seratus delapan puluh lima juta seratus delapan puluh lima ribu seratus delapan puluh empat rupiah#", receiptTemplate.fields.amountInWords],
      ["1,185,185,184", receiptTemplate.fields.grandTotal],
    ] as const;

    for (const [value, field] of cases) {
      const layout = await renderer.fitTextToBox(value, field);
      expect(layout.lines.length).toBeLessThanOrEqual(field.maxLines ?? 1);
      expect(layout.totalHeight).toBeLessThanOrEqual(field.height);
      expect(Math.max(...layout.lineWidths)).toBeLessThanOrEqual(field.width);
      expect(layout.fontSize).toBeLessThanOrEqual(field.fontSize);
      expect(layout.fontSize).toBeGreaterThanOrEqual(field.minFontSize ?? 8);
    }
  }, 15_000);
});
