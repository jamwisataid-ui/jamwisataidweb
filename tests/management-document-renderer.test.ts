import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { beforeAll, describe, expect, it, vi } from "vitest";

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
});
