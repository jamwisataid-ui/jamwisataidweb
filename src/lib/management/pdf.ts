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
  invoiceNumber?: string;
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
  const margin = isReceipt ? 38 : 32;
  const headerHeight = isReceipt ? 104 : 174;
  const dateLabel = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(new Date(data.issuedAt));

  page.drawRectangle({ x: 0, y: height - headerHeight, width, height: headerHeight, color: navy });
  page.drawRectangle({ x: 0, y: height - headerHeight, width, height: 4, color: gold });
  page.drawLine({ start: { x: 10, y: height - 12 }, end: { x: width - 10, y: height - 12 }, color: gold, thickness: 1.2 });
  const logoWidth = isReceipt ? 292 : 270;
  const logoScale = logoWidth / logo.width;
  page.drawImage(logo, { x: isReceipt ? (width - logoWidth) / 2 : margin, y: height - headerHeight + (headerHeight - logo.height * logoScale) / 2 + 2, width: logoWidth, height: logo.height * logoScale });
  if (!isReceipt) {
    drawText(page, data.company.phone, width - margin - 210, height - 63, bold, 10, white, { width: 210, align: "right" });
    drawText(page, data.company.email, width - margin - 210, height - 82, regular, 9, rgb(.9, .81, .54), { width: 210, align: "right" });
    for (const [index, addressLine] of wrap(data.company.address, regular, 8, 190).slice(0, 2).entries()) drawText(page, addressLine, width - margin - 190, height - 105 - index * 11, regular, 8, white, { width: 190, align: "right" });
  }

  const titleY = height - headerHeight - (isReceipt ? 53 : 56);
  drawText(page, isReceipt ? "KWITANSI" : "INVOICE", margin, titleY, bold, isReceipt ? 34 : 38, navy);
  page.drawLine({ start: { x: margin, y: titleY - 12 }, end: { x: isReceipt ? 360 : width - margin, y: titleY - 12 }, color: gold, thickness: 1.2 });

  const metaTop = titleY - (isReceipt ? 50 : 60);
  const leftWidth = isReceipt ? 455 : 255;
  drawText(page, isReceipt ? "TELAH DITERIMA DARI" : "INVOICE TO", margin, metaTop, bold, 8, navy);
  drawText(page, data.customer.name, margin, metaTop - 25, isReceipt ? italic : regular, isReceipt ? 18 : 15, isReceipt ? gold : navy);
  drawText(page, `${data.customer.whatsapp}${data.customer.email ? `  |  ${data.customer.email}` : ""}`, margin, metaTop - 43, regular, 8, gray);
  page.drawLine({ start: { x: margin, y: metaTop - 50 }, end: { x: margin + leftWidth, y: metaTop - 50 }, color: gold, thickness: .8 });

  const metaX = isReceipt ? 575 : 330;
  const metaLabelWidth = isReceipt ? 86 : 78;
  const metaValueWidth = width - margin - metaX - metaLabelWidth;
  const metaRows = isReceipt ? [["TANGGAL", dateLabel], ["NO KWITANSI", data.number], ["INVOICE", data.invoiceNumber ?? "-"], ["METODE", data.method ?? "-"]] : [["TANGGAL", dateLabel], ["NO INVOICE", data.number]];
  metaRows.forEach(([label, value], index) => {
    const rowY = metaTop + 7 - index * 31;
    page.drawRectangle({ x: metaX, y: rowY - 21, width: width - margin - metaX, height: 27, borderColor: gold, borderWidth: .8 });
    page.drawRectangle({ x: metaX, y: rowY - 21, width: metaLabelWidth, height: 27, color: navy });
    drawText(page, label, metaX + 8, rowY - 11, bold, 7, white);
    drawText(page, value, metaX + metaLabelWidth + 9, rowY - 12, regular, isReceipt ? 10 : 9, navy, { width: metaValueWidth - 12, align: "left" });
  });

  const tableTop = metaTop - (isReceipt ? 110 : 88);
  const tableWidth = width - margin * 2;
  const cols = [0, isReceipt ? .56 : .50, isReceipt ? .65 : .61, isReceipt ? .82 : .80, 1].map((value) => margin + tableWidth * value);
  page.drawRectangle({ x: margin, y: tableTop - 28, width: tableWidth, height: 28, color: navy });
  ["KETERANGAN", "QTY", "HARGA", "TOTAL"].forEach((label, index) => drawText(page, label, cols[index] + 8, tableTop - 18, bold, 8, white, { width: cols[index + 1] - cols[index] - 16, align: index ? "right" : "left" }));
  let y = tableTop - 28;
  for (const item of data.items) {
    const description = wrap(item.description, regular, 9, cols[1] - cols[0] - 16).slice(0, 2);
    const rowHeight = Math.max(isReceipt ? 35 : 40, description.length * 11 + 15);
    page.drawRectangle({ x: margin, y: y - rowHeight, width: tableWidth, height: rowHeight, borderColor: line, borderWidth: 1 });
    description.forEach((lineText, index) => drawText(page, lineText, cols[0] + 8, y - 18 - index * 12, regular, 9));
    drawText(page, String(item.qty), cols[1] + 8, y - 24, regular, 9, navy, { width: cols[2] - cols[1] - 16, align: "right" });
    drawText(page, rupiah(item.unitPrice), cols[2] + 8, y - 24, regular, 9, navy, { width: cols[3] - cols[2] - 16, align: "right" });
    drawText(page, rupiah(item.total), cols[3] + 8, y - 24, regular, 9, navy, { width: cols[4] - cols[3] - 16, align: "right" });
    y -= rowHeight;
  }
  const totalWidth = isReceipt ? 355 : 260;
  page.drawRectangle({ x: width - margin - totalWidth, y: y - 46, width: totalWidth, height: 38, color: navy, borderColor: gold, borderWidth: 1.2 });
  drawText(page, "TOTAL", width - margin - totalWidth + 15, y - 33, bold, 11, white);
  drawText(page, rupiah(data.total), width - margin - totalWidth + 92, y - 34, bold, isReceipt ? 16 : 14, rgb(1,.75,.28), { width: totalWidth - 106, align: "right" });
  y -= 58;
  if (isReceipt) {
    page.drawRectangle({ x: margin, y: y - 37, width: tableWidth * .56, height: 34, color: paleGold, borderColor: gold, borderWidth: .7 });
    drawText(page, "TERBILANG", margin + 12, y - 24, bold, 8, navy);
    drawText(page, `#${terbilang(data.total)}#`, margin + 82, y - 24, italic, 9, navy);
  }

  const footerY = isReceipt ? 28 : 50;
  const bankWidth = tableWidth * (isReceipt ? .57 : .59);
  if (!isReceipt) {
    page.drawRectangle({ x: margin, y: footerY, width: bankWidth, height: 100, color: rgb(.978,.974,.956), borderColor: gold, borderWidth: .8 });
    page.drawRectangle({ x: margin, y: footerY + 73, width: 150, height: 27, color: navy });
    drawText(page, "REKENING PEMBAYARAN", margin + 12, footerY + 83, bold, 8, white);
    if (data.accounts.length) data.accounts.slice(0, 3).forEach((account, index) => {
      drawText(page, account.bankName ?? "Bank", margin + 13, footerY + 53 - index * 19, bold, 8, navy);
      drawText(page, `${account.accountNumber ?? "-"}  a.n. ${account.accountHolder ?? data.company.name}`, margin + 74, footerY + 53 - index * 19, regular, 8, navy);
    });
    else drawText(page, "Hubungi Jam Wisata untuk informasi rekening pembayaran.", margin + 13, footerY + 48, regular, 8, gray);
  } else {
    drawText(page, data.company.address, margin, footerY + 36, regular, 9, navy);
    drawText(page, data.company.phone, margin, footerY + 19, regular, 9, navy);
  }
  const signerWidth = tableWidth * .30;
  const signerX = width - margin - signerWidth;
  drawText(page, data.company.signerTitle || "Keuangan", signerX, footerY + 65, bold, 10, navy, { width: signerWidth, align: "center" });
  page.drawLine({ start: { x: signerX + 18, y: footerY + 18 }, end: { x: width - margin - 18, y: footerY + 18 }, color: navy, thickness: .8 });
  drawText(page, `( ${data.company.signerName || "Jam Wisata"} )`, signerX, footerY + 3, bold, 9, navy, { width: signerWidth, align: "center" });
  page.drawRectangle({ x: 0, y: 0, width, height: 12, color: navy });
  page.drawRectangle({ x: 0, y: 12, width, height: 3, color: gold });
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
