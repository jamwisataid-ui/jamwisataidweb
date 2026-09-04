"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { rupiah } from "@/lib/management/domain";
import type { getManagementContext } from "@/lib/management/data";

type Context = Awaited<ReturnType<typeof getManagementContext>>;

type ColumnKey =
  | "gender"
  | "kontak"
  | "paspor"
  | "paket"
  | "keberangkatan"
  | "kamar"
  | "kamar_mkh"
  | "kamar_mdn"
  | "agen"
  | "harga"
  | "bayar"
  | "piutang"
  | "status_bayar";

interface ColumnDef {
  key: ColumnKey;
  label: string;
}

const AVAILABLE_COLUMNS: ColumnDef[] = [
  { key: "gender", label: "Jenis Kelamin" },
  { key: "kontak", label: "WhatsApp" },
  { key: "paspor", label: "Nomor Paspor" },
  { key: "paket", label: "Nama Paket" },
  { key: "keberangkatan", label: "Jadwal Keberangkatan" },
  { key: "kamar", label: "Tipe Kamar" },
  { key: "kamar_mkh", label: "Kamar Makkah" },
  { key: "kamar_mdn", label: "Kamar Madinah" },
  { key: "agen", label: "Agen / Referral" },
  { key: "harga", label: "Harga Paket" },
  { key: "bayar", label: "Telah Dibayar" },
  { key: "piutang", label: "Sisa Piutang" },
  { key: "status_bayar", label: "Status Pelunasan" },
];

export function UnifiedReportWorkspace({ data }: { data: Context }) {
  // Filters
  const [selectedDepartureId, setSelectedDepartureId] = useState<string>("");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Column exclusions (which columns to HIDE)
  const [excludedColumns, setExcludedColumns] = useState<Set<ColumnKey>>(new Set());
  const [showColumnToggles, setShowColumnToggles] = useState<boolean>(false);

  function toggleColumn(colKey: ColumnKey) {
    setExcludedColumns((prev) => {
      const next = new Set(prev);
      if (next.has(colKey)) {
        next.delete(colKey);
      } else {
        next.add(colKey);
      }
      return next;
    });
  }

  function resetColumns() {
    setExcludedColumns(new Set());
  }

  // Registrations filtered
  const filteredRegistrations = useMemo(() => {
    return data.registrations.filter((reg) => {
      if (reg.status !== "active") return false;

      // Departure filter
      if (selectedDepartureId && reg.departure?.id !== selectedDepartureId) return false;

      // Package filter
      if (selectedPackageId && reg.package?.id !== selectedPackageId) return false;

      // Payment status filter
      if (statusFilter !== "all") {
        const isLunas = (reg.payment?.status || "").toLowerCase() === "lunas";
        const isDp = (reg.payment?.status || "").toLowerCase() === "dp";
        if (statusFilter === "lunas" && !isLunas) return false;
        if (statusFilter === "dp" && !isDp) return false;
        if (statusFilter === "piutang" && (reg.payment?.outstanding ?? 0) <= 0) return false;
      }

      // Search query (Name, phone, passport, agent)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (reg.pilgrim?.fullName || "").toLowerCase();
        const phone = (reg.pilgrim?.whatsapp || "").toLowerCase();
        const passport = (reg.pilgrim?.passportNumber || "").toLowerCase();
        const agent = (reg.agent?.name || "").toLowerCase();
        const pkg = (reg.package?.name || "").toLowerCase();
        if (
          !name.includes(q) &&
          !phone.includes(q) &&
          !passport.includes(q) &&
          !agent.includes(q) &&
          !pkg.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [data.registrations, selectedDepartureId, selectedPackageId, statusFilter, searchQuery]);

  // Summaries from filtered data
  const summary = useMemo(() => {
    let totalAgreed = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;
    let lunasCount = 0;

    for (const r of filteredRegistrations) {
      totalAgreed += r.agreedPrice || 0;
      totalPaid += r.payment?.netPaid || 0;
      totalOutstanding += r.payment?.outstanding || 0;
      if (r.payment?.status === "Lunas") lunasCount++;
    }

    return {
      totalPilgrims: filteredRegistrations.length,
      totalAgreed,
      totalPaid,
      totalOutstanding,
      lunasCount,
    };
  }, [filteredRegistrations]);

  // Export link builder with exclusions
  function getExportUrl(format: "xlsx" | "pdf") {
    const params = new URLSearchParams();
    params.set("format", format);
    if (selectedDepartureId) params.set("departureId", selectedDepartureId);
    if (selectedPackageId) params.set("packageId", selectedPackageId);

    if (excludedColumns.size > 0) {
      params.set("exclude", Array.from(excludedColumns).join(","));
    }

    return `/api/admin/management/reports/rekap?${params.toString()}`;
  }

  const isColVisible = (key: ColumnKey) => !excludedColumns.has(key);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. RINGKASAN BESAR & JELAS */}
      <section className="management-kpis reports" style={{ margin: 0 }}>
        <article>
          <small>Total Jamaah Terpilih</small>
          <strong>{summary.totalPilgrims} Orang</strong>
        </article>
        <article>
          <small>Total Nilai Penjualan</small>
          <strong style={{ color: "#0f172a" }}>{rupiah(summary.totalAgreed)}</strong>
        </article>
        <article>
          <small>Total Telah Diterima</small>
          <strong style={{ color: "#166534" }}>{rupiah(summary.totalPaid)}</strong>
        </article>
        <article>
          <small>Total Sisa Piutang</small>
          <strong style={{ color: summary.totalOutstanding > 0 ? "#991b1b" : "#64748b" }}>
            {rupiah(summary.totalOutstanding)}
          </strong>
        </article>
      </section>

      {/* 2. FILTER TUNGGAL & PENGATURAN TAMPILAN */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "18px 20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>
            {/* Filter Keberangkatan */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                Jadwal Keberangkatan
              </label>
              <select
                value={selectedDepartureId}
                onChange={(e) => setSelectedDepartureId(e.target.value)}
                style={{
                  minHeight: "42px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#0f172a",
                  background: "#f8fafc",
                }}
              >
                <option value="">Semua Jadwal Keberangkatan</option>
                {data.departures.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.dateLabel} ({d.package?.name ?? "Umrah"})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Paket */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                Paket Umrah
              </label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                style={{
                  minHeight: "42px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#0f172a",
                  background: "#f8fafc",
                }}
              >
                <option value="">Semua Paket Umrah</option>
                {data.packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status Bayar */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                Status Pembayaran
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  minHeight: "42px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#0f172a",
                  background: "#f8fafc",
                }}
              >
                <option value="all">Semua Status</option>
                <option value="lunas">Lunas</option>
                <option value="dp">Baru DP</option>
                <option value="piutang">Ada Sisa Piutang</option>
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                Cari Jamaah / Agen / Paspor
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Ketik nama jamaah, agen, dsb..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    minHeight: "42px",
                    padding: "6px 12px 6px 36px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    width: "220px",
                  }}
                />
                <Search
                  style={{ position: "absolute", left: "11px", top: "13px", width: "16px", height: "16px", color: "#94a3b8" }}
                />
              </div>
            </div>
          </div>

          {/* Tombol Export & Tombol Atur Kolom */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setShowColumnToggles((prev) => !prev)}
              style={{
                minHeight: "42px",
                padding: "0 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: showColumnToggles ? "#f1f5f9" : "#fff",
                fontSize: "13px",
                fontWeight: 700,
                color: "#1e293b",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <SlidersHorizontal style={{ width: "16px", height: "16px", color: "#475569" }} />
              <span>Kecualikan Kolom {excludedColumns.size > 0 && `(${excludedColumns.size} disembunyikan)`}</span>
            </button>

            <a
              href={getExportUrl("xlsx")}
              style={{
                minHeight: "42px",
                padding: "0 18px",
                borderRadius: "8px",
                border: "none",
                background: "#166534",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
              }}
            >
              <Download style={{ width: "16px", height: "16px" }} />
              <span>Unduh Excel</span>
            </a>

            <a
              href={getExportUrl("pdf")}
              target="_blank"
              rel="noreferrer"
              style={{
                minHeight: "42px",
                padding: "0 18px",
                borderRadius: "8px",
                border: "none",
                background: "#bd8d1b",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
              }}
            >
              <Download style={{ width: "16px", height: "16px" }} />
              <span>Cetak / PDF</span>
            </a>
          </div>
        </div>

        {/* DRAWER PILIHAN KECUALIKAN KOLOM */}
        {showColumnToggles && (
          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px dashed #cbd5e1",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div>
                <strong style={{ fontSize: "13px", color: "#0f172a" }}>Pilih Kolom yang Ingin Dikecualikan / Disembunyikan:</strong>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                  Secara default semua kolom dicentang (ikut). Hilangkan centang pada kolom yang ingin dikecualikan dari tabel dan unduhan laporan.
                </p>
              </div>
              {excludedColumns.size > 0 && (
                <button
                  type="button"
                  onClick={resetColumns}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#bd8d1b",
                    fontSize: "12px",
                    fontWeight: 700,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Tampilkan Semua Kolom Kembali
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {AVAILABLE_COLUMNS.map((col) => {
                const checked = !excludedColumns.has(col.key);
                return (
                  <label
                    key={col.key}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: checked ? "1px solid #cbd5e1" : "1px dashed #cbd5e1",
                      background: checked ? "#f8fafc" : "#fff",
                      fontSize: "12px",
                      fontWeight: checked ? 600 : 500,
                      color: checked ? "#0f172a" : "#94a3b8",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColumn(col.key)}
                      style={{ accentColor: "#bd8d1b" }}
                    />
                    <span>{col.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 3. TABEL TUNGGAL UTAMA: DETAIL KESELURUHAN LAPORAN */}
      <section className="management-panel" style={{ margin: 0 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <small>DETAIL KESELURUHAN DATA ({filteredRegistrations.length} REKOR)</small>
            <h2 style={{ fontSize: "18px" }}>Tabel Laporan Penjualan, Jamaah & Keuangan</h2>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "13px" }}>
              Mencakup identitas jamaah, data paket keberangkatan, pembagian kamar, agen referral, dan status penerimaan pembayaran.
            </p>
          </div>
        </header>

        {filteredRegistrations.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", background: "#f8fafc", borderRadius: "8px" }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              Tidak ada data jamaah atau penjualan yang cocok dengan filter yang dipilih.
            </p>
          </div>
        ) : (
          <div className="management-table-wrap">
            <table className="management-table">
              <thead>
                <tr>
                  <th style={{ width: "40px", textAlign: "center" }}>No</th>
                  <th>Nama Jamaah</th>
                  {isColVisible("gender") && <th>Gender</th>}
                  {isColVisible("kontak") && <th>WhatsApp</th>}
                  {isColVisible("paspor") && <th>Paspor</th>}
                  {isColVisible("paket") && <th>Paket Umrah</th>}
                  {isColVisible("keberangkatan") && <th>Jadwal</th>}
                  {isColVisible("kamar") && <th>Tipe</th>}
                  {isColVisible("kamar_mkh") && <th>Kamar Makkah</th>}
                  {isColVisible("kamar_mdn") && <th>Kamar Madinah</th>}
                  {isColVisible("agen") && <th>Agen Referral</th>}
                  {isColVisible("harga") && <th style={{ textAlign: "right" }}>Harga Paket</th>}
                  {isColVisible("bayar") && <th style={{ textAlign: "right" }}>Telah Bayar</th>}
                  {isColVisible("piutang") && <th style={{ textAlign: "right" }}>Sisa Piutang</th>}
                  {isColVisible("status_bayar") && <th style={{ textAlign: "center" }}>Status</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg, idx) => {
                  const isLunas = reg.payment?.status === "Lunas";
                  return (
                    <tr key={reg.id}>
                      <td style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>{idx + 1}</td>
                      <td>
                        <strong style={{ display: "block", color: "#0f172a" }}>{reg.pilgrim?.fullName}</strong>
                        <small style={{ color: "#64748b", fontSize: "11px" }}>{reg.booking?.bookingNumber}</small>
                      </td>
                      {isColVisible("gender") && (
                        <td>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: reg.pilgrim?.gender === "Laki-laki" ? "#0284c7" : "#059669",
                            }}
                          >
                            {reg.pilgrim?.gender || "—"}
                          </span>
                        </td>
                      )}
                      {isColVisible("kontak") && <td style={{ fontSize: "12px" }}>{reg.pilgrim?.whatsapp || "—"}</td>}
                      {isColVisible("paspor") && <td style={{ fontSize: "12px" }}>{reg.pilgrim?.passportNumber || "—"}</td>}
                      {isColVisible("paket") && (
                        <td>
                          <strong style={{ fontSize: "13px", color: "#1e293b" }}>{reg.package?.name ?? "—"}</strong>
                        </td>
                      )}
                      {isColVisible("keberangkatan") && (
                        <td style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                          {reg.departure?.dateLabel ?? "—"}
                        </td>
                      )}
                      {isColVisible("kamar") && (
                        <td>
                          <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#f1f5f9", color: "#334155" }}>
                            {(reg.roomType || "quad").toUpperCase()}
                          </span>
                        </td>
                      )}
                      {isColVisible("kamar_mkh") && (
                        <td style={{ fontSize: "12px", fontWeight: 600, color: "#92400e" }}>
                          {reg.makkahRoomNumber || reg.roomNumber || "—"}
                        </td>
                      )}
                      {isColVisible("kamar_mdn") && (
                        <td style={{ fontSize: "12px", fontWeight: 600, color: "#1e3a8a" }}>
                          {reg.madinahRoomNumber || "—"}
                        </td>
                      )}
                      {isColVisible("agen") && (
                        <td>
                          <span style={{ fontSize: "12px", color: reg.agent ? "#0f172a" : "#64748b", fontWeight: reg.agent ? 600 : 400 }}>
                            {reg.agent?.name ?? "Langsung"}
                          </span>
                        </td>
                      )}
                      {isColVisible("harga") && (
                        <td style={{ textAlign: "right", fontSize: "13px", fontWeight: 600 }}>
                          {rupiah(reg.agreedPrice)}
                        </td>
                      )}
                      {isColVisible("bayar") && (
                        <td style={{ textAlign: "right", fontSize: "13px", fontWeight: 700, color: "#166534" }}>
                          {rupiah(reg.payment?.netPaid ?? 0)}
                        </td>
                      )}
                      {isColVisible("piutang") && (
                        <td
                          style={{
                            textAlign: "right",
                            fontSize: "13px",
                            fontWeight: 700,
                            color: (reg.payment?.outstanding ?? 0) > 0 ? "#991b1b" : "#64748b",
                          }}
                        >
                          {rupiah(reg.payment?.outstanding ?? 0)}
                        </td>
                      )}
                      {isColVisible("status_bayar") && (
                        <td style={{ textAlign: "center" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "3px 8px",
                              borderRadius: "6px",
                              background: isLunas ? "#dcfce7" : "#fef3c7",
                              color: isLunas ? "#15803d" : "#b45309",
                              display: "inline-block",
                            }}
                          >
                            {reg.payment?.status ?? "Belum Bayar"}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
