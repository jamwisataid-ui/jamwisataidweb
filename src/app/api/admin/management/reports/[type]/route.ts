import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

import { requireAdminSession } from "@/lib/admin-session";
import { getManagementContext } from "@/lib/management/data";
import { rupiah } from "@/lib/management/domain";
import { renderReportPdf } from "@/lib/management/pdf";
import { computeProfitLoss, getProfitLossOutcome } from "@/lib/management/profit-loss";

type Report = { title: string; columns: string[]; rows: Array<Array<string | number>> };
type Filters = { from?: Date; to?: Date; packageId?: string; departureId?: string };

function jakartaDateKey(value: Date | string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function within(value: Date | string | null | undefined, filters: Filters) {
  if (!value) return !filters.from && !filters.to;
  const date = new Date(value);
  return (!filters.from || date >= filters.from) && (!filters.to || date <= filters.to);
}

function createReport(
  type: string,
  data: Awaited<ReturnType<typeof getManagementContext>>,
  filters: Filters,
  excludeColumns: string[] = []
): Report | null {
  const registrations = data.registrations.filter((item) => {
    if (filters.packageId && item.package?.id !== filters.packageId) return false;
    if (filters.departureId && item.departure?.id !== filters.departureId) return false;
    return true;
  });

  if (type === "keberangkatan" || type === "rekap" || type === "semua" || type === "penjualan") {
    const selectedDeparture = filters.departureId ? data.departures.find((d) => d.id === filters.departureId) : null;
    const title = selectedDeparture
      ? `Rekap Operasional & Penjualan ${selectedDeparture.dateLabel} (${selectedDeparture.package?.name ?? "Umrah"})`
      : "Laporan Rekap Keseluruhan Penjualan & Operasional";

    type MasterCol = { id: string; header: string; getValue: (r: (typeof registrations)[number]) => string | number };
    const masterCols: MasterCol[] = [
      { id: "jamaah", header: "Nama Jamaah", getValue: (r) => r.pilgrim?.fullName ?? "—" },
      { id: "gender", header: "Gender", getValue: (r) => r.pilgrim?.gender ?? "—" },
      { id: "kontak", header: "WhatsApp", getValue: (r) => r.pilgrim?.whatsapp ?? "—" },
      { id: "paspor", header: "No. Paspor", getValue: (r) => r.pilgrim?.passportNumber ?? "—" },
      { id: "paket", header: "Paket Umrah", getValue: (r) => r.package?.name ?? "—" },
      { id: "keberangkatan", header: "Jadwal", getValue: (r) => r.departure?.dateLabel ?? "—" },
      { id: "kamar", header: "Tipe Kamar", getValue: (r) => (r.roomType ? r.roomType.charAt(0).toUpperCase() + r.roomType.slice(1) : "Quad") },
      { id: "kamar_mkh", header: "Kamar Makkah", getValue: (r) => r.makkahRoomNumber || r.roomNumber || "—" },
      { id: "kamar_mdn", header: "Kamar Madinah", getValue: (r) => r.madinahRoomNumber || "—" },
      { id: "agen", header: "Agen Referral", getValue: (r) => r.agent?.name ?? "Langsung (Tanpa Agen)" },
      { id: "harga", header: "Biaya Paket", getValue: (r) => rupiah(r.agreedPrice) },
      { id: "bayar", header: "Telah Dibayar", getValue: (r) => rupiah(r.payment?.netPaid ?? 0) },
      { id: "piutang", header: "Sisa Piutang", getValue: (r) => rupiah(r.payment?.outstanding ?? 0) },
      { id: "status_bayar", header: "Status Bayar", getValue: (r) => r.payment?.status ?? "Belum Bayar" },
    ];

    const activeCols = masterCols.filter((col) => !excludeColumns.includes(col.id));

    const activeRegs = registrations.filter((r) => within(r.departure?.departureDate, filters));
    const rows = activeRegs.map((r) => activeCols.map((col) => col.getValue(r)));

    return {
      title,
      columns: activeCols.map((col) => col.header),
      rows,
    };
  }

  if (type === "jamaah") return { title: "Laporan Data Jamaah", columns: ["Nama", "WhatsApp", "Email", "Paspor", "Status"], rows: data.pilgrims.filter((item) => within(item.createdAt, filters)).map((item) => [item.fullName, item.whatsapp, item.email ?? "", item.passportNumber ?? "", item.status]) };
  if (type === "manifest") return { title: "Manifest & Room List", columns: ["Jamaah", "Gender", "Paket", "Keberangkatan", "Paspor", "Tipe", "Kamar Makkah", "Kamar Madinah"], rows: registrations.filter((item) => within(item.departure?.departureDate, filters)).toSorted((a, b) => String(a.pilgrim?.gender).localeCompare(String(b.pilgrim?.gender))).map((item) => [item.pilgrim?.fullName ?? "", item.pilgrim?.gender ?? "", item.package?.name ?? "", item.departure?.departureDate ?? "", item.pilgrim?.passportNumber ?? "", item.roomType ? item.roomType.charAt(0).toUpperCase() + item.roomType.slice(1) : "", item.makkahRoomNumber || item.roomNumber || "", item.madinahRoomNumber || ""]) };
  if (type === "pembayaran") return { title: "Laporan Pembayaran & Piutang", columns: ["Tanggal", "Invoice", "Booking", "Pembayar", "Nominal", "Metode", "Status"], rows: data.payments.filter((payment) => payment.isIncludedInReports !== false && within(payment.paidAt, filters)).filter((payment) => !filters.packageId || registrations.some((registration) => registration.bookingId === payment.bookingId)).map((payment) => [payment.paidAt.toISOString(), data.documents.find((document) => document.id === payment.invoiceId)?.number ?? "", payment.booking?.bookingNumber ?? "", payment.booking?.payerName ?? "", rupiah(payment.amount), payment.method, payment.status]) };
  if (type === "kas") return { title: "Laporan Kas Masuk & Keluar", columns: ["Tanggal", "Keterangan", "Arah", "Jenis", "Nominal"], rows: data.cashTransactions.filter((item) => item.isIncludedInReports !== false && within(item.transactionAt, filters) && (!filters.packageId || item.packageId === filters.packageId || (item.paymentId && data.payments.some((payment) => payment.id === item.paymentId && registrations.some((registration) => registration.bookingId === payment.bookingId))))).map((item) => [item.transactionAt.toISOString(), item.description, item.direction, item.kind, rupiah(item.amount)]) };
  if (type === "laba") {
    const report = computeProfitLoss(data.profitLossTransactions, {
      from: filters.from ? jakartaDateKey(filters.from) : undefined,
      to: filters.to ? jakartaDateKey(filters.to) : undefined,
      packageId: filters.packageId,
    });
    const outcome = getProfitLossOutcome(report.netProfit);
    return {
      title: "Laporan Laba Rugi (Basis Kas)",
      columns: ["Tanggal", "Keterangan", "Kategori", "Paket", "Pendapatan", "Beban"],
      rows: [
        ...report.rows.map((row) => [row.dateKey, row.description, row.categoryLabel, row.packageName ?? "Overhead / umum", row.revenue ? rupiah(row.revenue) : "", row.expense ? rupiah(row.expense) : ""]),
        ["", "TOTAL PENDAPATAN", "", "", rupiah(report.revenue), ""],
        ["", "REFUND", "", "", "", rupiah(report.refunds)],
        ["", "BIAYA OPERASIONAL", "", "", "", rupiah(report.operatingExpenses)],
        ["", "KOMISI DIBAYAR", "", "", "", rupiah(report.commissions)],
        ["", `${outcome.label.toUpperCase()} BERSIH`, "", "", outcome.kind === "loss" ? "" : rupiah(outcome.amount), outcome.kind === "loss" ? rupiah(outcome.amount) : ""],
      ],
    };
  }
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
  const departureId = url.searchParams.get("departureId") || undefined;
  const from = fromValue && /^\d{4}-\d{2}-\d{2}$/.test(fromValue) ? new Date(`${fromValue}T00:00:00+07:00`) : undefined;
  const to = toValue && /^\d{4}-\d{2}-\d{2}$/.test(toValue) ? new Date(`${toValue}T23:59:59.999+07:00`) : undefined;
  if (from && to && from > to) return NextResponse.json({ error: "Tanggal awal tidak boleh melewati tanggal akhir." }, { status: 400 });
  const excludeRaw = url.searchParams.get("exclude") || "";
  const excludeColumns = excludeRaw ? excludeRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const report = createReport(type, await getManagementContext(), { from, to, packageId, departureId }, excludeColumns);

  if (!report) return NextResponse.json({ error: "Jenis laporan tidak ditemukan." }, { status: 404 });
  // Generate professional export filename based on report title and date range
  const safeTitle = report.title
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  const dateSuffix = fromValue && toValue ? `_${fromValue}_sd_${toValue}` : fromValue ? `_sejak_${fromValue}` : "";
  const exportFilename = `${safeTitle}${dateSuffix}`;

  const format = url.searchParams.get("format") === "xlsx" ? "xlsx" : "pdf";
  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Jam Wisata";
    const sheet = workbook.addWorksheet(report.title.slice(0, 31));

    // Header Row
    sheet.addRow(report.columns);
    const headerRow = sheet.getRow(1);
    headerRow.height = 28;
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0A2A4D" } };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    // Data Rows
    report.rows.forEach((row, rowIdx) => {
      const addedRow = sheet.addRow(row);
      addedRow.height = 22;
      addedRow.alignment = { vertical: "middle" };
      if (rowIdx % 2 === 1) {
        addedRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
      }
      // Add thin border to each cell
      addedRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          left: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } },
        };
      });
    });

    // Auto-fit Column Widths with minimum 16
    sheet.columns.forEach((column, colIdx) => {
      let maxLength = report.columns[colIdx]?.length ?? 12;
      report.rows.forEach((row) => {
        const valStr = String(row[colIdx] ?? "");
        if (valStr.length > maxLength) maxLength = valStr.length;
      });
      column.width = Math.min(45, Math.max(16, maxLength + 3));
    });

    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: report.columns.length } };
    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(new Uint8Array(buffer), { headers: { "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "content-disposition": `attachment; filename="${exportFilename}.xlsx"` } });
  }
  const pdf = await renderReportPdf(report.title, report.columns, report.rows);
  return new NextResponse(new Uint8Array(pdf), { headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="${exportFilename}.pdf"` } });
}
