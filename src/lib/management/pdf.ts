import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

const navy = rgb(10 / 255, 42 / 255, 77 / 255);
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
