import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument } from "pdf-lib";
import sharp, { type OverlayOptions } from "sharp";

import { documentTemplates, templateCurrency, type TemplateFieldConfig } from "./document-templates";
import { terbilang } from "./domain";

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

const asset = (path: string) => join(process.cwd(), "public", path.replace(/^\//, ""));

function xml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(value));
}

function paymentMethod(value?: string) {
  return ({ transfer: "Transfer", cash: "Tunai", card: "Kartu", other: "Lainnya" } as Record<string, string>)[value ?? ""] ?? value ?? "-";
}

function fitLines(value: string, field: TemplateFieldConfig) {
  const clean = value.replace(/\s+/g, " ").trim();
  const maxLines = field.maxLines ?? 1;
  let fontSize = field.fontSize;
  const minimum = field.minFontSize ?? Math.max(10, field.fontSize * .72);
  let lines: string[] = [];
  while (fontSize >= minimum) {
    const averageWidth = fontSize * (field.fontFamily === "serif" ? .48 : .55);
    const characters = Math.max(4, Math.floor(field.width / averageWidth));
    const words = clean.split(" ");
    lines = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= characters || !current) current = candidate;
      else { lines.push(current); current = word; }
    }
    if (current) lines.push(current);
    if (lines.length <= maxLines && lines.length * field.lineHeight <= field.height) break;
    fontSize -= 1;
  }
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const last = lines.length - 1;
    lines[last] = `${lines[last].slice(0, Math.max(1, lines[last].length - 1)).trimEnd()}…`;
  }
  return { fontSize, lines: lines.length ? lines : [""] };
}

async function fieldOverlay(value: string, config: TemplateFieldConfig, yOverride?: number): Promise<OverlayOptions> {
  const field = yOverride === undefined ? config : { ...config, y: yOverride };
  const { fontSize, lines } = fitLines(value, field);
  const fontPath = field.fontFamily === "serif"
    ? asset("/templates/fonts/CormorantGaramond-Italic.ttf")
    : field.fontStyle === "italic"
      ? asset("/templates/fonts/Montserrat-Italic.ttf")
      : asset("/templates/fonts/Montserrat.ttf");
  const markup = `<span foreground="${field.color ?? "#111111"}" font_weight="${field.fontWeight ?? 400}" font_style="${field.fontStyle ?? "normal"}">${xml(lines.join("\n"))}</span>`;
  const input = await sharp({ text: {
    text: markup,
    font: `${field.fontFamily === "serif" ? "Cormorant Garamond" : "Montserrat"} ${fontSize}`,
    fontfile: fontPath,
    width: Math.round(field.width),
    height: Math.round(field.height),
    align: field.textAlign ?? "left",
    rgba: true,
  } }).png().toBuffer();
  return { input, left: Math.round(field.x), top: Math.round(field.y) };
}

async function pageFields(data: TransactionPdfSnapshot, pageItems: TransactionPdfSnapshot["items"], showGrandTotal: boolean) {
  const template = documentTemplates[data.kind];
  const fields = template.fields;
  const output: Array<Promise<OverlayOptions>> = [
    fieldOverlay(data.customer.name, fields.customerName),
    fieldOverlay(dateLabel(data.issuedAt), fields.date),
    fieldOverlay(data.number, fields.documentNumber),
  ];
  if (data.kind === "invoice") {
    pageItems.forEach((item, index) => {
      const rowY = template.rows[index];
      output.push(fieldOverlay(item.description, fields.description, rowY));
      output.push(fieldOverlay(String(item.qty), fields.qty, rowY + 13));
      output.push(fieldOverlay(templateCurrency(item.unitPrice), fields.price, rowY + 13));
      output.push(fieldOverlay(templateCurrency(item.total), fields.itemTotal, rowY + 13));
    });
    if (showGrandTotal) output.push(fieldOverlay(templateCurrency(data.total), fields.grandTotal));
    else output.push(fieldOverlay("Lanjut halaman berikutnya", fields.continuation));
    data.accounts.slice(0, 3).forEach((account, index) => output.push(fieldOverlay(account.accountNumber ?? "-", fields[`account${index + 1}`])));
  } else {
    output.push(fieldOverlay(paymentMethod(data.method), fields.paymentMethod));
    pageItems.forEach((item, index) => {
      const rowY = template.rows[index];
      const descriptionField = pageItems.length === 1 ? fields.description : { ...fields.description, height: 38, maxLines: 1, fontSize: 18, minFontSize: 14 };
      output.push(fieldOverlay(String(index + 1), fields.rowNumber, rowY));
      output.push(fieldOverlay(item.description, descriptionField, rowY));
      output.push(fieldOverlay(String(item.qty), fields.qty, rowY));
      output.push(fieldOverlay(templateCurrency(item.total), fields.itemTotal, rowY));
    });
    if (showGrandTotal) {
      output.push(fieldOverlay(`#${terbilang(data.total)}#`, fields.amountInWords));
      output.push(fieldOverlay(templateCurrency(data.total, false), fields.grandTotal));
    }
    output.push(fieldOverlay(data.company.signerTitle || "Keuangan", fields.signerRole));
    output.push(fieldOverlay(`( ${data.company.signerName || "Atie Supriati"} )`, fields.signerName));
  }
  return Promise.all(output);
}

export async function renderTransactionImages(data: TransactionPdfSnapshot) {
  const template = documentTemplates[data.kind];
  const background = await readFile(asset(template.background));
  const pages = Math.max(1, Math.ceil(data.items.length / template.rows.length));
  const signature = template.signature ? await readFile(asset(template.signature.src)) : null;
  const output: Buffer[] = [];
  for (let pageIndex = 0; pageIndex < pages; pageIndex++) {
    const items = data.items.slice(pageIndex * template.rows.length, (pageIndex + 1) * template.rows.length);
    const composites: OverlayOptions[] = [];
    for (const mask of template.masks ?? []) {
      const input = await sharp({ create: { width: mask.width, height: mask.height, channels: 4, background: mask.color ?? "#ffffff" } }).png().toBuffer();
      composites.push({ input, left: mask.x, top: mask.y });
    }
    if (signature && template.signature) composites.push({ input: signature, left: template.signature.x, top: template.signature.y });
    composites.push(...await pageFields(data, items, pageIndex === pages - 1));
    output.push(await sharp(background).composite(composites).png({ compressionLevel: 9 }).toBuffer());
  }
  return output;
}

export async function renderTransactionPng(data: TransactionPdfSnapshot) {
  const [first] = await renderTransactionImages(data);
  return first;
}

export async function renderTransactionPdf(data: TransactionPdfSnapshot) {
  const template = documentTemplates[data.kind];
  const images = await renderTransactionImages(data);
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${data.kind === "receipt" ? "Kwitansi" : "Invoice"} ${data.number}`);
  pdf.setAuthor("Jam Wisata");
  for (const imageBytes of images) {
    const image = await pdf.embedPng(imageBytes);
    const page = pdf.addPage([template.width, template.height]);
    page.drawImage(image, { x: 0, y: 0, width: template.width, height: template.height });
  }
  return Buffer.from(await pdf.save());
}
