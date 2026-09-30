"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download } from "lucide-react";

import type { getManagementContext } from "@/lib/management/data";
import { rupiah } from "@/lib/management/domain";
import { computeProfitLoss } from "@/lib/management/profit-loss";

type Context = Awaited<ReturnType<typeof getManagementContext>>;

function jakartaDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function dateLabel(value: Date | string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date(value));
}

export function ProfitLossReport({ data }: { data: Context }) {
  const today = jakartaDate();
  const [from, setFrom] = useState(`${today.slice(0, 4)}-01-01`);
  const [to, setTo] = useState(today);
  const [packageId, setPackageId] = useState("");
  const invalidPeriod = Boolean(from && to && from > to);
  const report = useMemo(
    () => computeProfitLoss(data.profitLossTransactions, { from, to, packageId: packageId || undefined }),
    [data.profitLossTransactions, from, packageId, to],
  );

  function exportUrl(format: "pdf" | "xlsx") {
    const params = new URLSearchParams({ format });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (packageId) params.set("packageId", packageId);
    return `/api/admin/management/reports/laba?${params.toString()}`;
  }

  return <section className="management-panel management-profit-loss-panel">
    <header className="management-profit-loss-header">
      <div><small>LAPORAN KEUANGAN</small><h2>Laba/Rugi</h2><p>Perhitungan berbasis kas dari transaksi yang ditandai masuk laporan. Saldo awal dan transfer antar-rekening tidak dihitung.</p></div>
      <div className="management-profit-loss-actions">
        <a aria-disabled={invalidPeriod} className="management-create-link secondary" href={invalidPeriod ? undefined : exportUrl("xlsx")}><Download /> Excel</a>
        <a aria-disabled={invalidPeriod} className="management-create-link" href={invalidPeriod ? undefined : exportUrl("pdf")}><Download /> PDF</a>
      </div>
    </header>

    <div className="management-report-filters management-profit-loss-filters">
      <label><span>Tanggal awal</span><input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
      <label><span>Tanggal akhir</span><input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
      <label><span>Paket</span><select value={packageId} onChange={(event) => setPackageId(event.target.value)}><option value="">Semua paket & overhead</option>{data.packages.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
      {invalidPeriod ? <span className="management-profit-loss-error">Tanggal awal tidak boleh melewati tanggal akhir.</span> : null}
    </div>

    <div className="management-profit-loss-summary">
      <article className={report.netProfit >= 0 ? "is-profit" : "is-loss"}><span><small>HASIL PERIODE</small><strong>Laba/Rugi bersih</strong></span><b>{rupiah(report.netProfit)}</b></article>
      <article><small>Pendapatan diterima</small><strong className="positive">{rupiah(report.revenue)}</strong></article>
      <article><small>Refund</small><strong className="negative">{rupiah(report.refunds)}</strong></article>
      <article><small>Biaya operasional</small><strong className="negative">{rupiah(report.operatingExpenses)}</strong></article>
      <article><small>Komisi dibayar</small><strong className="negative">{rupiah(report.commissions)}</strong></article>
    </div>

    {report.rows.length ? <details className="management-profit-loss-details"><summary><span><strong>Rincian transaksi</strong><small>{report.rows.length} transaksi pada periode terpilih</small></span><ChevronDown /></summary><div className="management-table-wrap"><table className="management-table management-profit-loss-table"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Paket</th><th>Pendapatan</th><th>Beban</th></tr></thead><tbody>{report.rows.map((row) => <tr key={row.id}><td data-label="Tanggal">{dateLabel(row.transactionAt)}</td><td data-label="Keterangan"><strong>{row.description}</strong></td><td data-label="Kategori">{row.categoryLabel}</td><td data-label="Paket">{row.packageName || "Overhead / umum"}</td><td data-label="Pendapatan" className="positive">{row.revenue ? rupiah(row.revenue) : "—"}</td><td data-label="Beban" className="negative">{row.expense ? rupiah(row.expense) : "—"}</td></tr>)}</tbody></table></div></details> : <div className="management-empty"><p>Belum ada transaksi yang masuk laporan pada periode ini.</p></div>}
  </section>;
}
