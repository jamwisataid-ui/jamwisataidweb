import ExcelJS from "exceljs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { getHppExportData } from "./hpp-data";
import { HPP_CATEGORIES } from "./hpp";

type Data = NonNullable<Awaited<ReturnType<typeof getHppExportData>>>;
const money = (value: string | number | null) => Number(value ?? 0);

export async function createHppExcel(data: Data) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Jam Wisata";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet("Perhitungan HPP", { pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 } });
  sheet.views = [{ state: "frozen", ySplit: 8 }];
  sheet.columns = [{ width: 5 }, { width: 31 }, { width: 13 }, { width: 16 }, { width: 10 }, { width: 20 }, { width: 20 }];
  sheet.mergeCells("A1:G1"); sheet.getCell("A1").value = "JAM WISATA · PERHITUNGAN HPP UMRAH";
  sheet.mergeCells("A2:G2"); sheet.getCell("A2").value = data.costing.title;
  sheet.getCell("A4").value = "Durasi"; sheet.getCell("B4").value = `${data.costing.durationDays} hari`;
  sheet.getCell("D4").value = "Jumlah jamaah"; sheet.getCell("E4").value = data.costing.paxCount;
  sheet.getCell("A5").value = "Kurs USD"; sheet.getCell("B5").value = money(data.costing.usdRate);
  sheet.getCell("D5").value = "Kurs SAR"; sheet.getCell("E5").value = money(data.costing.sarRate);
  const header = sheet.addRow(["No", "Komponen", "Kategori", "Mata uang", "Jumlah", "Input harga", "Biaya / jamaah"]);
  data.items.forEach((item, index) => sheet.addRow([index + 1, item.name, item.category, item.currency, money(item.quantity), money(item.unitAmount), money(item.computedPerPax)]));
  sheet.addRow([]);
  const summary = [
    ["Subtotal biaya riil", money(data.costing.subtotalBase)], ["FOC Tour Leader", money(data.costing.focTourLeader)],
    ["HPP bersih / jamaah", money(data.costing.hppPerPax)], ["Profit / jamaah", money(data.costing.profitMargin)],
    ["Fee marketing / jamaah", money(data.costing.marketingFee)], ["Harga jual hasil hitung", money(data.costing.sellingPrice)],
    ["Harga penerapan", money(data.costing.appliedPrice ?? data.costing.sellingPrice)],
  ];
  summary.forEach(([label, value]) => { const row = sheet.addRow(["", "", "", "", "", label, value]); row.getCell(6).font = { bold: true }; row.getCell(7).font = { bold: true }; });
  sheet.getRow(1).height = 34; sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" }, size: 16 }; sheet.getRow(1).alignment = { vertical: "middle" }; sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF071A35" } };
  sheet.getRow(2).height = 26; sheet.getRow(2).font = { bold: true, color: { argb: "FF8B6508" }, size: 14 };
  header.font = { bold: true, color: { argb: "FFFFFFFF" } }; header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF173A64" } }; header.height = 26;
  sheet.eachRow((row, rowNumber) => { row.alignment = { vertical: "middle", wrapText: true }; if (rowNumber > 7) row.height = 23; });
  for (let row = 8; row <= sheet.rowCount; row++) { sheet.getCell(row, 6).numFmt = '"Rp" #,##0.00'; sheet.getCell(row, 7).numFmt = '"Rp" #,##0.00'; }
  sheet.getCell("B5").numFmt = '"Rp" #,##0'; sheet.getCell("E5").numFmt = '"Rp" #,##0';
  sheet.autoFilter = { from: "A7", to: `G${7 + data.items.length}` };
  return workbook.xlsx.writeBuffer();
}

export async function createHppPdf(data: Data) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.027, 0.102, 0.208), gold = rgb(0.83, 0.63, 0.16), ink = rgb(0.09, 0.16, 0.26), muted = rgb(0.38, 0.44, 0.52);
  const format = (value: string | number | null) => `Rp${money(value).toLocaleString("id-ID", { maximumFractionDigits: 2 })}`;
  let page = pdf.addPage([595.28, 841.89]);
  let y = 770;
  const heading = () => {
    page.drawRectangle({ x: 0, y: 757, width: 595.28, height: 85, color: navy });
    page.drawText("JAM WISATA", { x: 42, y: 804, size: 18, font: bold, color: gold });
    page.drawText("LAPORAN PERHITUNGAN HPP UMRAH", { x: 42, y: 780, size: 11, font: bold, color: rgb(1, 1, 1) });
    y = 730;
  };
  heading();
  page.drawText(data.costing.title.slice(0, 70), { x: 42, y, size: 17, font: bold, color: ink }); y -= 25;
  page.drawText(`${data.costing.durationDays} hari  |  ${data.costing.paxCount} jamaah  |  USD ${format(data.costing.usdRate)}  |  SAR ${format(data.costing.sarRate)}`, { x: 42, y, size: 9, font: regular, color: muted }); y -= 32;
  for (const [key, label] of HPP_CATEGORIES) {
    const rows = data.items.filter((item) => item.category === key);
    if (!rows.length) continue;
    if (y < 125 + rows.length * 20) { page = pdf.addPage([595.28, 841.89]); heading(); }
    page.drawRectangle({ x: 38, y: y - 6, width: 519, height: 23, color: rgb(0.95, 0.93, 0.86) });
    page.drawText(label, { x: 46, y, size: 10, font: bold, color: navy }); y -= 25;
    for (const item of rows) {
      page.drawText(item.name.slice(0, 58), { x: 48, y, size: 9, font: regular, color: ink });
      const value = format(item.computedPerPax); page.drawText(value, { x: 540 - bold.widthOfTextAtSize(value, 9), y, size: 9, font: bold, color: ink }); y -= 19;
    }
    y -= 6;
  }
  if (y < 210) { page = pdf.addPage([595.28, 841.89]); heading(); }
  page.drawRectangle({ x: 38, y: y - 145, width: 519, height: 155, color: navy });
  const summaries: Array<[string, string]> = [["Subtotal biaya riil", format(data.costing.subtotalBase)], ["FOC Tour Leader", format(data.costing.focTourLeader)], ["HPP bersih / jamaah", format(data.costing.hppPerPax)], ["Profit + fee marketing", format(money(data.costing.profitMargin) + money(data.costing.marketingFee))], ["HARGA JUAL", format(data.costing.sellingPrice)]];
  let sy = y - 18; summaries.forEach(([label, value], index) => { const size = index === 4 ? 13 : 10; page.drawText(label, { x: 52, y: sy, size, font: index === 4 ? bold : regular, color: index === 4 ? gold : rgb(1, 1, 1) }); page.drawText(value, { x: 540 - bold.widthOfTextAtSize(value, size), y: sy, size, font: bold, color: index === 4 ? gold : rgb(1, 1, 1) }); sy -= index === 3 ? 34 : 24; });
  page.drawText(`Dibuat otomatis oleh Dashboard Jam Wisata · Formula ${data.costing.formulaVersion}`, { x: 38, y: 28, size: 8, font: regular, color: muted });
  return pdf.save();
}
