import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

import { requireAdminSession } from "@/lib/admin-session";
import { getManagementContext } from "@/lib/management/data";
import { rupiah } from "@/lib/management/domain";
import { renderReportPdf } from "@/lib/management/pdf";

type Report = { title: string; columns: string[]; rows: Array<Array<string | number>> };
type Filters = { from?: Date; to?: Date; packageId?: string };

function within(value: Date | string | null | undefined, filters: Filters) {
  if (!value) return !filters.from && !filters.to;
  const date = new Date(value);
  return (!filters.from || date >= filters.from) && (!filters.to || date <= filters.to);
}

function createReport(type: string, data: Awaited<ReturnType<typeof getManagementContext>>, filters: Filters): Report | null {
  const registrations = data.registrations.filter((item) => !filters.packageId || item.package?.id === filters.packageId);
  if (type === "jamaah") return { title: "Laporan Data Jamaah", columns: ["Nama", "WhatsApp", "Email", "Paspor", "Status"], rows: data.pilgrims.filter((item) => within(item.createdAt, filters)).map((item) => [item.fullName, item.whatsapp, item.email ?? "", item.passportNumber ?? "", item.status]) };
  if (type === "manifest") return { title: "Manifest & Room List", columns: ["Jamaah", "Gender", "Paket", "Keberangkatan", "Paspor", "Tipe", "Nomor Kamar"], rows: registrations.filter((item) => within(item.departure?.departureDate, filters)).toSorted((a, b) => String(a.pilgrim?.gender).localeCompare(String(b.pilgrim?.gender))).map((item) => [item.pilgrim?.fullName ?? "", item.pilgrim?.gender ?? "", item.package?.name ?? "", item.departure?.departureDate ?? "", item.pilgrim?.passportNumber ?? "", item.roomType ? item.roomType.charAt(0).toUpperCase() + item.roomType.slice(1) : "", item.roomNumber ?? ""]) };
  if (type === "pembayaran") return { title: "Laporan Pembayaran & Piutang", columns: ["Tanggal", "Invoice", "Booking", "Pembayar", "Nominal", "Metode", "Status"], rows: data.payments.filter((payment) => within(payment.paidAt, filters)).filter((payment) => !filters.packageId || registrations.some((registration) => registration.bookingId === payment.bookingId)).map((payment) => [payment.paidAt.toISOString(), data.documents.find((document) => document.id === payment.invoiceId)?.number ?? "", payment.booking?.bookingNumber ?? "", payment.booking?.payerName ?? "", rupiah(payment.amount), payment.method, payment.status]) };
  if (type === "kas") return { title: "Laporan Kas Masuk & Keluar", columns: ["Tanggal", "Keterangan", "Arah", "Jenis", "Nominal"], rows: data.cashTransactions.filter((item) => within(item.transactionAt, filters) && (!filters.packageId || item.packageId === filters.packageId || (item.paymentId && data.payments.some((payment) => payment.id === item.paymentId && registrations.some((registration) => registration.bookingId === payment.bookingId))))).map((item) => [item.transactionAt.toISOString(), item.description, item.direction, item.kind, rupiah(item.amount)]) };
  if (type === "laba") return { title: "Laporan Laba per Paket", columns: ["Paket", "Pemasukan", "Refund", "Biaya", "Komisi", "Laba Realisasi", "Piutang"], rows: data.packages.filter((pkg) => !filters.packageId || pkg.id === filters.packageId).map((pkg) => { const ids = new Set(registrations.filter((registration) => registration.package?.id === pkg.id).map((registration) => registration.id)); const bookingIds = new Set(registrations.filter((registration) => ids.has(registration.id)).map((registration) => registration.bookingId)); const payments = data.payments.filter((payment) => payment.status === "confirmed" && bookingIds.has(payment.bookingId) && within(payment.paidAt, filters)); const income = payments.reduce((sum, payment) => sum + payment.allocations.filter((allocation) => ids.has(allocation.registrationId)).reduce((subtotal, allocation) => subtotal + allocation.amount, 0), 0); const refunded = data.refunds.filter((refund) => refund.registrationId && ids.has(refund.registrationId) && refund.status === "confirmed" && within(refund.refundedAt, filters)).reduce((sum, refund) => sum + refund.amount, 0); const expenses = data.cashTransactions.filter((cash) => cash.packageId === pkg.id && cash.direction === "out" && cash.kind !== "refund" && cash.kind !== "commission" && within(cash.transactionAt, filters)).reduce((sum, cash) => sum + cash.amount, 0); const commissions = data.commissions.filter((commission) => ids.has(commission.registrationId) && commission.status === "paid" && within(commission.paidAt, filters)).reduce((sum, commission) => sum + commission.amount, 0); const receivables = registrations.filter((registration) => registration.package?.id === pkg.id).reduce((sum, registration) => sum + registration.payment.outstanding, 0); return [pkg.name, rupiah(income), rupiah(refunded), rupiah(expenses), rupiah(commissions), rupiah(income - refunded - expenses - commissions), rupiah(receivables)]; }) };
  if (type === "komisi") return { title: "Laporan Komisi Agen", columns: ["Agen", "Jamaah", "Nominal", "Status", "Diperoleh"], rows: data.commissions.filter((item) => within(item.earnedAt ?? item.createdAt, filters) && (!filters.packageId || registrations.some((registration) => registration.id === item.registrationId))).map((item) => [item.agent?.name ?? "", item.pilgrim?.fullName ?? "", rupiah(item.amount), item.status, item.earnedAt?.toISOString() ?? ""]) };
  if (type === "stok") return { title: "Laporan Pergerakan Stok", columns: ["Tanggal", "Barang", "Jenis", "Jumlah", "Saldo", "Catatan"], rows: data.movements.filter((movement) => within(movement.movedAt, filters)).map((movement) => [movement.movedAt.toISOString(), data.inventory.find((item) => item.id === movement.itemId)?.name ?? "", movement.kind, movement.quantity, movement.balanceAfter, movement.note ?? ""]) };
  return null;
}

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  await requireAdminSession();
  const { type } = await params;
  const url = new URL(request.url);
  const fromValue = url.searchParams.get("from");
  const toValue = url.searchParams.get("to");
  const packageId = url.searchParams.get("packageId") || undefined;
  const from = fromValue && /^\d{4}-\d{2}-\d{2}$/.test(fromValue) ? new Date(`${fromValue}T00:00:00+07:00`) : undefined;
  const to = toValue && /^\d{4}-\d{2}-\d{2}$/.test(toValue) ? new Date(`${toValue}T23:59:59.999+07:00`) : undefined;
  if (from && to && from > to) return NextResponse.json({ error: "Tanggal awal tidak boleh melewati tanggal akhir." }, { status: 400 });
  const report = createReport(type, await getManagementContext(), { from, to, packageId });
  if (!report) return NextResponse.json({ error: "Jenis laporan tidak ditemukan." }, { status: 404 });
  const format = url.searchParams.get("format") === "xlsx" ? "xlsx" : "pdf";
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
