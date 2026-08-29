import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

import { requireAdminSession } from "@/lib/admin-session";
import { getManagementContext } from "@/lib/management/data";
import { rupiah } from "@/lib/management/domain";
import { renderReportPdf } from "@/lib/management/pdf";

type Report = { title: string; columns: string[]; rows: Array<Array<string | number>> };

function createReport(type: string, data: Awaited<ReturnType<typeof getManagementContext>>): Report | null {
  if (type === "jamaah") return { title: "Laporan Data Jamaah", columns: ["Nama", "WhatsApp", "Email", "Paspor", "Status"], rows: data.pilgrims.map((item) => [item.fullName, item.whatsapp, item.email ?? "", item.passportNumber ?? "", item.status]) };
  if (type === "manifest") return { title: "Manifest & Room List", columns: ["Jamaah", "Gender", "Paket", "Keberangkatan", "Paspor", "Tipe", "Nomor Kamar"], rows: data.registrations.toSorted((a, b) => String(a.pilgrim?.gender).localeCompare(String(b.pilgrim?.gender))).map((item) => [item.pilgrim?.fullName ?? "", item.pilgrim?.gender ?? "", item.package?.name ?? "", item.departure?.departureDate ?? "", item.pilgrim?.passportNumber ?? "", item.roomType ? item.roomType.charAt(0).toUpperCase() + item.roomType.slice(1) : "", item.roomNumber ?? ""]) };
  if (type === "pembayaran") return { title: "Laporan Pembayaran & Piutang", columns: ["Jamaah", "Booking", "Paket", "Terbayar", "Sisa", "Status"], rows: data.registrations.map((item) => [item.pilgrim?.fullName ?? "", item.booking?.bookingNumber ?? "", item.package?.name ?? "", rupiah(item.payment.netPaid), rupiah(item.payment.outstanding), item.payment.partialRefund ? `${item.payment.status} / Refund sebagian` : item.payment.status]) };
  if (type === "kas") return { title: "Laporan Kas Masuk & Keluar", columns: ["Tanggal", "Keterangan", "Arah", "Jenis", "Nominal"], rows: data.cashTransactions.map((item) => [item.transactionAt.toISOString(), item.description, item.direction, item.kind, rupiah(item.amount)]) };
  if (type === "laba") return { title: "Laporan Laba per Paket", columns: ["Paket", "Pemasukan", "Refund", "Biaya", "Komisi", "Laba Realisasi", "Piutang"], rows: data.packageFinancials.map((item) => [item.packageName, rupiah(item.income), rupiah(item.refunded), rupiah(item.expenses), rupiah(item.commissions), rupiah(item.realizedProfit), rupiah(item.receivables)]) };
  if (type === "komisi") return { title: "Laporan Komisi Agen", columns: ["Agen", "Jamaah", "Nominal", "Status", "Diperoleh"], rows: data.commissions.map((item) => [item.agent?.name ?? "", item.pilgrim?.fullName ?? "", rupiah(item.amount), item.status, item.earnedAt?.toISOString() ?? ""]) };
  if (type === "stok") return { title: "Laporan Stok Perlengkapan", columns: ["Barang", "Stok", "Satuan", "Minimum", "Kondisi"], rows: data.inventory.map((item) => [item.name, item.currentStock, item.unit, item.minimumStock, item.currentStock <= item.minimumStock ? "Menipis" : "Aman"]) };
  return null;
}

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  await requireAdminSession();
  const { type } = await params;
  const report = createReport(type, await getManagementContext());
  if (!report) return NextResponse.json({ error: "Jenis laporan tidak ditemukan." }, { status: 404 });
  const format = new URL(request.url).searchParams.get("format") === "xlsx" ? "xlsx" : "pdf";
  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Jam Wisata";
    const sheet = workbook.addWorksheet(report.title.slice(0, 31));
    sheet.addRow(report.columns);
    report.rows.forEach((row) => sheet.addRow(row));
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0A2A4D" } };
    sheet.columns.forEach((column) => { column.width = 22; });
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: report.columns.length } };
    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(new Uint8Array(buffer), { headers: { "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "content-disposition": `attachment; filename="laporan-${type}.xlsx"` } });
  }
  const pdf = await renderReportPdf(report.title, report.columns, report.rows);
  return new NextResponse(new Uint8Array(pdf), { headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="laporan-${type}.pdf"` } });
}
