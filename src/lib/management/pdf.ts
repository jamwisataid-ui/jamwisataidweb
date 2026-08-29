import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

import { rupiah, terbilang } from "./domain";

export type TransactionPdfSnapshot = {
  kind: "invoice" | "receipt";
  number: string;
  issuedAt: string;
  customer: { name: string; whatsapp: string; email?: string | null };
  items: Array<{ description: string; qty: number; unitPrice: number; total: number }>;
  total: number;
  method?: string;
  reference?: string | null;
  accounts: Array<{ bankName?: string | null; accountNumber?: string | null; accountHolder?: string | null }>;
  company: { name: string; address: string; phone: string; email: string; signerName: string; signerTitle: string };
};

const navy = rgb(10 / 255, 42 / 255, 77 / 255);
const gold = rgb(184 / 255, 145 / 255, 54 / 255);
const paleGold = rgb(244 / 255, 235 / 255, 212 / 255);
const gray = rgb(101 / 255, 113 / 255, 132 / 255);
const line = rgb(215 / 255, 222 / 255, 231 / 255);
const white = rgb(1, 1, 1);

function clean(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[\u2018\u2019]/g, "'").replace(/[\u2013\u2014]/g, "-").replace(/[^\x20-\x7E\n]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const words = clean(text).split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width) current = candidate;
    else { if (current) lines.push(current); current = word; }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function drawText(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size: number, color = navy, options?: { width?: number; align?: "left" | "right" | "center" }) {
  const safe = clean(text);
  const textWidth = font.widthOfTextAtSize(safe, size);
  const width = options?.width ?? 0;
  const drawX = options?.align === "right" ? x + width - textWidth : options?.align === "center" ? x + (width - textWidth) / 2 : x;
  page.drawText(safe, { x: drawX, y, font, size, color });
}

async function assets(pdf: PDFDocument) {
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const logoBytes = await readFile(join(process.cwd(), "public", "images", "logo-white.png"));
  const logo = await pdf.embedPng(logoBytes);
  return { regular, bold, italic, logo };
}

export async function renderTransactionPdf(data: TransactionPdfSnapshot) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${data.kind === "receipt" ? "Kwitansi" : "Invoice"} ${data.number}`);
  pdf.setAuthor("Jam Wisata");
  const isReceipt = data.kind === "receipt";
  const width = isReceipt ? 864 : 576;
  const height = isReceipt ? 576 : 864;
  const page = pdf.addPage([width, height]);
  const { regular, bold, italic, logo } = await assets(pdf);
  const margin = 42;
  const headerHeight = isReceipt ? 112 : 145;

  page.drawRectangle({ x: 0, y: height - headerHeight, width, height: headerHeight, color: navy });
  page.drawRectangle({ x: 0, y: height - headerHeight, width, height: 7, color: gold });
  const logoScale = 135 / logo.width;
  page.drawImage(logo, { x: margin, y: height - 92, width: 135, height: logo.height * logoScale });
  drawText(page, isReceipt ? "KWITANSI" : "INVOICE", width - margin - 190, height - 65, bold, 25, white, { width: 190, align: "right" });
  drawText(page, `NO. ${data.number}`, width - margin - 190, height - 84, regular, 10, rgb(.9, .81, .54), { width: 190, align: "right" });

  const metaTop = height - headerHeight - 35;
  drawText(page, isReceipt ? "DITERIMA DARI" : "TAGIHAN KEPADA", margin, metaTop, bold, 8, gold);
  drawText(page, data.customer.name, margin, metaTop - 23, bold, 16);
  drawText(page, `${data.customer.whatsapp}${data.customer.email ? `  |  ${data.customer.email}` : ""}`, margin, metaTop - 40, regular, 9, gray);
  const metaWidth = isReceipt ? 300 : 210;
  drawText(page, "TANGGAL", width - margin - metaWidth, metaTop, bold, 8, gold, { width: metaWidth, align: "right" });
  drawText(page, new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(new Date(data.issuedAt)), width - margin - metaWidth, metaTop - 23, bold, 13, navy, { width: metaWidth, align: "right" });
  if (isReceipt) drawText(page, `Metode: ${data.method ?? "-"}${data.reference ? ` | ${data.reference}` : ""}`, width - margin - metaWidth, metaTop - 40, regular, 9, gray, { width: metaWidth, align: "right" });

  const tableTop = metaTop - 78;
  const tableWidth = width - margin * 2;
  const cols = [0, .55, .65, .825, 1].map((value) => margin + tableWidth * value);
  page.drawRectangle({ x: margin, y: tableTop - 28, width: tableWidth, height: 28, color: navy });
  ["KETERANGAN", "QTY", "HARGA", "TOTAL"].forEach((label, index) => drawText(page, label, cols[index] + 8, tableTop - 18, bold, 8, white, { width: cols[index + 1] - cols[index] - 16, align: index ? "right" : "left" }));
  let y = tableTop - 28;
  for (const item of data.items) {
    const description = wrap(item.description, regular, 9, cols[1] - cols[0] - 16).slice(0, 2);
    const rowHeight = Math.max(42, description.length * 12 + 18);
    page.drawRectangle({ x: margin, y: y - rowHeight, width: tableWidth, height: rowHeight, borderColor: line, borderWidth: 1 });
    description.forEach((lineText, index) => drawText(page, lineText, cols[0] + 8, y - 18 - index * 12, regular, 9));
    drawText(page, String(item.qty), cols[1] + 8, y - 24, regular, 9, navy, { width: cols[2] - cols[1] - 16, align: "right" });
    drawText(page, rupiah(item.unitPrice), cols[2] + 8, y - 24, regular, 9, navy, { width: cols[3] - cols[2] - 16, align: "right" });
    drawText(page, rupiah(item.total), cols[3] + 8, y - 24, regular, 9, navy, { width: cols[4] - cols[3] - 16, align: "right" });
    y -= rowHeight;
  }
  const totalWidth = isReceipt ? 280 : 235;
  page.drawRectangle({ x: width - margin - totalWidth, y: y - 48, width: totalWidth, height: 38, color: navy });
  drawText(page, "TOTAL", width - margin - totalWidth + 12, y - 34, bold, 10, white);
  drawText(page, rupiah(data.total), width - margin - totalWidth + 80, y - 35, bold, 13, white, { width: totalWidth - 92, align: "right" });
  y -= 62;
  if (isReceipt) {
    page.drawRectangle({ x: margin, y: y - 42, width: tableWidth, height: 42, color: paleGold });
    drawText(page, `Terbilang: ${terbilang(data.total)}`, margin + 13, y - 26, italic, 9, navy);
  }

  const footerY = isReceipt ? 55 : 65;
  const bankWidth = tableWidth * .58;
  page.drawRectangle({ x: margin, y: footerY, width: bankWidth, height: 82, color: rgb(.965, .973, .98) });
  drawText(page, isReceipt ? "KETERANGAN" : "REKENING PEMBAYARAN", margin + 13, footerY + 61, bold, 8, gold);
  if (isReceipt) drawText(page, "Pembayaran telah diterima dan tercatat pada sistem Jam Wisata.", margin + 13, footerY + 41, regular, 8, gray);
  else if (data.accounts.length) data.accounts.slice(0, 3).forEach((account, index) => drawText(page, `${account.bankName ?? "Bank"} | ${account.accountNumber ?? "-"} | a.n. ${account.accountHolder ?? data.company.name}`, margin + 13, footerY + 42 - index * 14, regular, 8, navy));
  else drawText(page, "Hubungi Jam Wisata untuk informasi rekening pembayaran.", margin + 13, footerY + 41, regular, 8, gray);
  const signerX = width - margin - tableWidth * .3;
  drawText(page, data.company.signerTitle, signerX, footerY + 62, regular, 9, navy, { width: tableWidth * .3, align: "center" });
  page.drawLine({ start: { x: signerX + 20, y: footerY + 16 }, end: { x: width - margin - 20, y: footerY + 16 }, color: navy, thickness: .8 });
  drawText(page, data.company.signerName || "Jam Wisata", signerX, footerY + 3, bold, 9, navy, { width: tableWidth * .3, align: "center" });
  page.drawRectangle({ x: 0, y: 0, width, height: 18, color: gold });
  drawText(page, `${data.company.name}  |  ${data.company.address}  |  ${data.company.phone}  |  ${data.company.email}`, margin, 6, regular, 7, white, { width: width - margin * 2, align: "center" });
  return Buffer.from(await pdf.save());
}

export async function renderReportPdf(title: string, columns: string[], rows: Array<Array<string | number>>) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(title);
  pdf.setAuthor("Jam Wisata");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const width = 842;
  const height = 595;
  const margin = 30;
  const rowHeight = 29;
  const bodyHeight = height - 125;
  const perPage = Math.max(1, Math.floor(bodyHeight / rowHeight));
  const pages = Math.max(1, Math.ceil(rows.length / perPage));
  for (let pageIndex = 0; pageIndex < pages; pageIndex++) {
    const page = pdf.addPage([width, height]);
    page.drawRectangle({ x: 0, y: height - 82, width, height: 82, color: navy });
    drawText(page, title, margin, height - 48, bold, 21, white);
    drawText(page, `Jam Wisata | Dibuat ${new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date())}`, margin, height - 66, regular, 8, rgb(.9, .81, .54));
    const tableWidth = width - margin * 2;
    const colWidth = tableWidth / columns.length;
    let y = height - 105;
    page.drawRectangle({ x: margin, y: y - 25, width: tableWidth, height: 25, color: paleGold });
    columns.forEach((column, index) => drawText(page, column, margin + index * colWidth + 6, y - 16, bold, 7, navy));
    y -= 25;
    rows.slice(pageIndex * perPage, (pageIndex + 1) * perPage).forEach((row) => {
      page.drawLine({ start: { x: margin, y: y - rowHeight }, end: { x: width - margin, y: y - rowHeight }, color: line, thickness: .6 });
      row.forEach((cell, index) => {
        const value = wrap(String(cell), regular, 7, colWidth - 12).slice(0, 2);
        value.forEach((text, lineIndex) => drawText(page, text, margin + index * colWidth + 6, y - 12 - lineIndex * 9, regular, 7, navy));
      });
      y -= rowHeight;
    });
    drawText(page, `Jam Wisata | Halaman ${pageIndex + 1} dari ${pages}`, margin, 14, regular, 7, gray, { width: tableWidth, align: "center" });
  }
  return Buffer.from(await pdf.save());
}
