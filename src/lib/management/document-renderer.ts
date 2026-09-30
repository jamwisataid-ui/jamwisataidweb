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

type RenderedLine = { input: Buffer; width: number; height: number };

export type FittedTextLayout = {
  fontSize: number;
  lineHeight: number;
  lines: string[];
  lineWidths: number[];
  totalHeight: number;
  truncated: boolean;
};

type LineMeasureCache = Map<string, { width: number; height: number }>;

function fontPath(field: TemplateFieldConfig) {
  return field.fontFamily === "serif"
    ? asset("/templates/fonts/CormorantGaramond-Italic.ttf")
    : field.fontStyle === "italic"
      ? asset("/templates/fonts/Montserrat-Italic.ttf")
      : asset("/templates/fonts/Montserrat.ttf");
}

function lineMarkup(value: string, field: TemplateFieldConfig) {
  return `<span foreground="${field.color ?? "#111111"}" font_weight="${field.fontWeight ?? 400}" font_style="${field.fontStyle ?? "normal"}">${xml(value)}</span>`;
}

async function renderLine(value: string, field: TemplateFieldConfig, fontSize: number): Promise<RenderedLine> {
  const input = await sharp({ text: {
    text: lineMarkup(value || " ", field),
    font: `${field.fontFamily === "serif" ? "Cormorant Garamond" : "Montserrat"} ${fontSize}`,
    fontfile: fontPath(field),
    rgba: true,
    dpi: 72,
  } }).png().toBuffer();
  const metadata = await sharp(input).metadata();
  return { input, width: metadata.width ?? 1, height: metadata.height ?? 1 };
}

async function measureLine(value: string, field: TemplateFieldConfig, fontSize: number, cache: LineMeasureCache) {
  if (!value) return { width: 0, height: 0 };
  const key = [field.fontFamily, field.fontStyle, field.fontWeight, fontSize, value].join("|");
  const cached = cache.get(key);
  if (cached) return cached;
  const { width, height } = await renderLine(value, field, fontSize);
  const measured = { width, height };
  cache.set(key, measured);
  return measured;
}

async function largestPrefixThatFits(value: string, field: TemplateFieldConfig, fontSize: number, maxWidth: number, cache: LineMeasureCache) {
  let low = 1;
  let high = value.length;
  let best = 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const width = (await measureLine(value.slice(0, middle), field, fontSize, cache)).width;
    if (width <= maxWidth) { best = middle; low = middle + 1; }
    else high = middle - 1;
  }
  return best;
}

async function wrapAtSize(value: string, field: TemplateFieldConfig, fontSize: number, cache: LineMeasureCache) {
  const words = value ? value.split(" ") : [""];
  const lines: string[] = [];
  let current = "";
  for (const originalWord of words) {
    let word = originalWord;
    const candidate = current ? `${current} ${word}` : word;
    if ((await measureLine(candidate, field, fontSize, cache)).width <= field.width) {
      current = candidate;
      continue;
    }
    if (current) { lines.push(current); current = ""; }
    while (word && (await measureLine(word, field, fontSize, cache)).width > field.width) {
      const splitAt = await largestPrefixThatFits(word, field, fontSize, field.width, cache);
      lines.push(word.slice(0, splitAt));
      word = word.slice(splitAt);
    }
    current = word;
  }
  if (current || !lines.length) lines.push(current);
  return lines;
}

async function ellipsize(value: string, field: TemplateFieldConfig, fontSize: number, cache: LineMeasureCache) {
  const suffix = "…";
  if ((await measureLine(`${value}${suffix}`, field, fontSize, cache)).width <= field.width) return `${value}${suffix}`;
  let low = 0;
  let high = value.length;
  let best = "";
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const candidate = `${value.slice(0, middle).trimEnd()}${suffix}`;
    if ((await measureLine(candidate, field, fontSize, cache)).width <= field.width) { best = candidate; low = middle + 1; }
    else high = middle - 1;
  }
  return best || suffix;
}

function resolvedLineHeight(field: TemplateFieldConfig, fontSize: number) {
  return Math.max(Math.ceil(fontSize * 1.12), Math.round(field.lineHeight * (fontSize / field.fontSize)));
}

export async function fitTextToBox(value: string, field: TemplateFieldConfig): Promise<FittedTextLayout> {
  const clean = value.replace(/\s+/g, " ").trim();
  const cache: LineMeasureCache = new Map();
  const maxLines = Math.max(1, field.maxLines ?? 1);
  const minimum = Math.max(8, Math.floor(field.minFontSize ?? field.fontSize * .72));
  for (let fontSize = Math.round(field.fontSize); fontSize >= minimum; fontSize -= 1) {
    const lineHeight = resolvedLineHeight(field, fontSize);
    const lines = await wrapAtSize(clean, field, fontSize, cache);
    if (lines.length <= maxLines && lines.length * lineHeight <= field.height) {
      const lineWidths = await Promise.all(lines.map(async (line) => (await measureLine(line, field, fontSize, cache)).width));
      return { fontSize, lineHeight, lines, lineWidths, totalHeight: lines.length * lineHeight, truncated: false };
    }
  }
  const fontSize = minimum;
  const lineHeight = resolvedLineHeight(field, fontSize);
  const allLines = await wrapAtSize(clean, field, fontSize, cache);
  const allowedLines = Math.max(1, Math.min(maxLines, Math.floor(field.height / lineHeight)));
  const lines = allLines.slice(0, allowedLines);
  const truncated = allLines.length > allowedLines;
  if (truncated) lines[lines.length - 1] = await ellipsize(lines[lines.length - 1], field, fontSize, cache);
  const lineWidths = await Promise.all(lines.map(async (line) => (await measureLine(line, field, fontSize, cache)).width));
  return { fontSize, lineHeight, lines, lineWidths, totalHeight: lines.length * lineHeight, truncated };
}

async function fieldOverlay(value: string, config: TemplateFieldConfig, yOverride?: number): Promise<OverlayOptions> {
  const field = yOverride === undefined ? config : { ...config, y: yOverride };
  const layout = await fitTextToBox(value, field);
  const canvas = sharp({ create: {
    width: Math.max(1, Math.round(field.width)),
    height: Math.max(1, Math.round(field.height)),
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  } });
  const verticalOffset = field.verticalAlign === "bottom"
    ? field.height - layout.totalHeight
    : field.verticalAlign === "top"
      ? 0
      : (field.height - layout.totalHeight) / 2;
  const composites: OverlayOptions[] = [];
  for (let index = 0; index < layout.lines.length; index++) {
    if (!layout.lines[index]) continue;
    const rendered = await renderLine(layout.lines[index], field, layout.fontSize);
    const lineX = field.textAlign === "right"
      ? field.width - rendered.width
      : field.textAlign === "center"
        ? (field.width - rendered.width) / 2
        : 0;
    const lineY = verticalOffset + index * layout.lineHeight + (layout.lineHeight - rendered.height) / 2;
    composites.push({
      input: rendered.input,
      left: Math.max(0, Math.min(Math.round(field.width - rendered.width), Math.round(lineX))),
      top: Math.max(0, Math.min(Math.round(field.height - rendered.height), Math.round(lineY))),
    });
  }
  const input = await canvas.composite(composites).png().toBuffer();
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
      const descriptionField = pageItems.length === 1 ? { ...fields.description, height: 112, maxLines: 3, verticalAlign: "top" as const } : fields.description;
      output.push(fieldOverlay(item.description, descriptionField, rowY));
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
      const descriptionField = pageItems.length === 1 ? { ...fields.description, height: 120, maxLines: 3, verticalAlign: "top" as const } : { ...fields.description, height: 38, maxLines: 1, fontSize: 18, minFontSize: 14 };
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
  const signature = template.signature
    ? await sharp(await readFile(asset(template.signature.src)))
      .trim()
      .resize(template.signature.width, template.signature.height, {
        fit: "contain",
        withoutEnlargement: true,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()
    : null;
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
