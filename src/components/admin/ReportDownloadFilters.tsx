"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Download } from "lucide-react";

const reports = [
  ["keberangkatan", "Rekap Keberangkatan (Jamaah, Kamar & Piutang)"],
  ["manifest", "Manifest & Room List"],
  ["jamaah", "Data Master Jamaah"],
  ["pembayaran", "Riwayat Pembayaran"],
  ["kas", "Kas Masuk & Keluar"],
  ["laba", "Laba Bersih per Paket"],
  ["komisi", "Komisi Agen Referral"],
  ["stok", "Pergerakan Stok Logistik"],
] as const;

function dateInput(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(date);
}

export function ReportDownloadFilters({
  packages,
  departures = [],
}: {
  packages: Array<{ id: string; name: string }>;
  departures?: Array<{ id: string; departureDate: string; dateLabel: string; packageId: string; packageName?: string }>;
}) {
  const today = useMemo(() => new Date(), []);
  const [from, setFrom] = useState(() => dateInput(new Date(today.getFullYear(), today.getMonth(), 1)));
  const [to, setTo] = useState(() => dateInput(today));
  const [packageId, setPackageId] = useState("");
  const [departureId, setDepartureId] = useState("");

  function href(type: string, format: "pdf" | "xlsx") {
    const params = new URLSearchParams({ format });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (packageId) params.set("packageId", packageId);
    if (departureId) params.set("departureId", departureId);
    return `/api/admin/management/reports/${type}?${params}`;
  }

  function preset(days: number) {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - days + 1);
    setFrom(dateInput(start));
    setTo(dateInput(end));
  }

  function presetAll() {
    setFrom("");
    setTo("");
  }

  const filteredDepartures = packageId
    ? departures.filter((d) => d.packageId === packageId)
    : departures;

  return (
    <div className="management-report-filter-workspace">
      <div className="management-report-filters">
        <span>
          <CalendarDays />
          <span>
            <strong>Filter Laporan</strong>
            <small>Filter ini diterapkan ke unduhan Excel, PDF, dan ringkasan.</small>
          </span>
        </span>
        <div className="management-report-presets">
          <button type="button" onClick={() => preset(1)}>Hari ini</button>
          <button type="button" onClick={() => preset(7)}>7 hari</button>
          <button type="button" onClick={() => preset(30)}>30 hari</button>
          <button type="button" onClick={presetAll}>Semua Tanggal</button>
        </div>
        <label>
          <span>Dari tanggal</span>
          <input type="date" value={from} max={to || undefined} onChange={(event) => setFrom(event.target.value)} />
        </label>
        <label>
          <span>Sampai tanggal</span>
          <input type="date" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} />
        </label>
        <label>
          <span>Paket</span>
          <select
            value={packageId}
            onChange={(event) => {
              setPackageId(event.target.value);
              setDepartureId("");
            }}
          >
            <option value="">Semua paket</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Jadwal Keberangkatan</span>
          <select
            value={departureId}
            onChange={(event) => setDepartureId(event.target.value)}
          >
            <option value="">Semua jadwal</option>
            {filteredDepartures.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.dateLabel} {dep.packageName ? `(${dep.packageName})` : ""}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="management-report-links">
        {reports.map(([type, label]) => (
          <div key={type}>
            <span>
              <strong>{label}</strong>
              <small>
                {departureId
                  ? `Jadwal: ${departures.find((d) => d.id === departureId)?.dateLabel}`
                  : from && to
                  ? `${from} sampai ${to}`
                  : "Semua periode"}
              </small>
            </span>
            <div>
              <a href={href(type, "xlsx")}><Download /> Excel</a>
              <a href={href(type, "pdf")}><Download /> PDF</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
