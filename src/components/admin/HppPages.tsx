import Link from "next/link";
import { ArrowRight, Calculator, Download, FileSpreadsheet, Pencil } from "lucide-react";
import { AdminPageHeader } from "./AdminUi";
import { ApplyHppPriceForm, HppMasterPriceForm, HppRecordActions } from "./HppActionForms";
import { HppCalculator, type HppFormInitial } from "./HppCalculator";
import { HPP_CATEGORIES } from "@/lib/management/hpp";
import type { getHppContext } from "@/lib/management/hpp-data";

type Context = Awaited<ReturnType<typeof getHppContext>>;
const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" });
function statusLabel(status: string) { return ({ draft: "Draft", final: "Final", applied: "Sudah diterapkan", archived: "Arsip" } as Record<string, string>)[status] ?? status; }

export function HppListPage({ data }: { data: Context }) {
  const active = data.costings.filter((item) => item.status !== "archived");
  return <><AdminPageHeader eyebrow="KALKULATOR PAKET UMRAH" title="HPP & Simulasi Paket" description="Hitung seluruh biaya paket, FOC, keuntungan, dan harga jual dengan langkah sederhana." actions={[{ href: "/admin/manajemen/hpp-umroh/master-harga", label: "Master harga", secondary: true }, { href: "/admin/manajemen/hpp-umroh/baru", label: "Buat perhitungan" }]} />
    <section className="management-panel hpp-help"><div><span><Calculator /></span><div><strong>Cara cepat menghitung paket</strong><p>Buat perhitungan → periksa harga default → isi jumlah jamaah → atur profit → finalkan. Harga tidak langsung tampil di website sebelum Anda menekan “Terapkan”.</p></div></div></section>
    <section className="management-panel"><header><div><small>{active.length} PERHITUNGAN AKTIF</small><h2>Riwayat simulasi HPP</h2><p>Klik perhitungan untuk melihat rincian, ekspor, atau menerapkan harga.</p></div></header>{active.length ? <div className="management-table-wrap"><table className="management-table"><thead><tr><th>Nama simulasi</th><th>Jamaah</th><th>HPP/pax</th><th>Harga jual</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{active.map((item) => <tr key={item.id}><td><strong>{item.title}</strong><small>Diperbarui {date.format(item.updatedAt)}</small></td><td>{item.paxCount} orang</td><td>{rupiah.format(Number(item.hppPerPax))}</td><td><strong>{rupiah.format(Number(item.sellingPrice))}</strong></td><td><span className={`management-status ${item.status === "applied" ? "good" : item.status === "draft" ? "warn" : "neutral"}`}>{statusLabel(item.status)}</span></td><td><Link className="management-row-link" href={`/admin/manajemen/hpp-umroh/${item.id}`}>Lihat hasil <ArrowRight /></Link></td></tr>)}</tbody></table></div> : <div className="management-empty"><Calculator /><p>Belum ada perhitungan HPP. Tekan “Buat perhitungan” untuk memulai.</p></div>}</section>
    {data.costings.some((item) => item.status === "archived") ? <section className="management-panel"><header><div><small>ARSIP</small><h2>Perhitungan lama</h2></div></header><div className="management-mini-list">{data.costings.filter((item) => item.status === "archived").map((item) => <Link href={`/admin/manajemen/hpp-umroh/${item.id}`} key={item.id}><span><strong>{item.title}</strong><small>{item.paxCount} jamaah · {rupiah.format(Number(item.sellingPrice))}</small></span><span>Lihat</span></Link>)}</div></section> : null}
  </>;
}

export function HppCreatePage({ data }: { data: Context }) {
  return <><AdminPageHeader eyebrow="PERHITUNGAN BARU" title="Hitung HPP paket Umrah" description="Harga default sudah disiapkan. Ubah hanya bagian yang berbeda untuk paket ini." backHref="/admin/manajemen/hpp-umroh" /><HppCalculator masters={data.masterPrices} departures={data.departures} /></>;
}

export function HppEditPage({ data, costing }: { data: Context; costing: Context["costings"][number] }) {
  const initial: HppFormInitial = { ...costing, items: costing.items };
  return <><AdminPageHeader eyebrow="UBAH PERHITUNGAN" title={costing.title} description="Perubahan hanya berlaku untuk simulasi ini dan tidak mengubah harga master." backHref={`/admin/manajemen/hpp-umroh/${costing.id}`} /><HppCalculator initial={initial} masters={data.masterPrices} departures={data.departures} /></>;
}

export function HppDetailPage({ data, costing }: { data: Context; costing: Context["costings"][number] }) {
  const grouped = HPP_CATEGORIES.map(([key, label]) => ({ key, label, items: costing.items.filter((item) => item.category === key) })).filter((group) => group.items.length);
  return <><AdminPageHeader eyebrow="HASIL PERHITUNGAN HPP" title={costing.title} description={`Formula ${costing.formulaVersion} · ${costing.paxCount} jamaah · ${costing.durationDays} hari`} backHref="/admin/manajemen/hpp-umroh" actions={costing.status === "draft" || costing.status === "final" ? [{ href: `/admin/manajemen/hpp-umroh/${costing.id}/edit`, label: "Edit perhitungan", icon: "edit" }] : undefined} />
    <section className="hpp-detail-hero"><div><small>HPP BERSIH / JAMAAH</small><strong>{rupiah.format(Number(costing.hppPerPax))}</strong><span>Biaya riil {rupiah.format(Number(costing.subtotalBase))} + FOC {rupiah.format(Number(costing.focTourLeader))}</span></div><div><small>HARGA JUAL HASIL HITUNG</small><strong>{rupiah.format(Number(costing.sellingPrice))}</strong><span>Harga penerapan: {rupiah.format(Number(costing.appliedPrice ?? costing.sellingPrice))}</span></div><span className={`management-status ${costing.status === "applied" ? "good" : "neutral"}`}>{statusLabel(costing.status)}</span></section>
    <div className="hpp-detail-columns"><section className="management-panel"><header><div><small>RINCIAN BIAYA</small><h2>Komponen per jamaah</h2></div></header><div className="hpp-detail-groups">{grouped.map((group) => <div key={group.key}><h3>{group.label}</h3>{group.items.map((item) => <p key={item.id}><span><strong>{item.name}</strong><small>{item.currency} · {item.costBasis === "group" ? "biaya rombongan" : item.costBasis === "room_per_night" ? "kamar per malam" : "per jamaah"}</small></span><b>{rupiah.format(Number(item.computedPerPax))}</b></p>)}</div>)}</div></section>
      <aside><section className="management-panel"><header><div><small>FILE LAPORAN</small><h2>Download hasil</h2></div></header><div className="hpp-downloads"><a href={`/api/admin/management/hpp/${costing.id}/export?format=xlsx`}><FileSpreadsheet />Download Excel</a><a href={`/api/admin/management/hpp/${costing.id}/export?format=pdf`}><Download />Download PDF</a></div></section>
      {costing.status !== "archived" ? <section className="management-panel"><header><div><small>UPDATE WEBSITE</small><h2>Terapkan harga paket</h2><p>Harga website baru berubah setelah tombol di bawah ditekan.</p></div></header><ApplyHppPriceForm id={costing.id} appliedPrice={Number(costing.appliedPrice ?? costing.sellingPrice)} departureId={costing.departureId} departures={data.departures} /></section> : null}
      <section className="management-panel"><header><div><small>TINDAKAN</small><h2>Kelola perhitungan</h2></div></header><HppRecordActions id={costing.id} /></section></aside></div>
  </>;
}

export function HppMasterPage({ data }: { data: Context }) {
  const groups = Array.from(new Set(data.masterPrices.map((item) => item.category)));
  const labels: Record<string, string> = { ticket: "Tiket Pesawat", visa: "Visa & Asuransi", la: "Land Arrangement Default", la_package: "Paket LA Siap Pakai", handling: "Handling & Konsumsi", departure_bus: "Bus Keberangkatan", arrival_bus: "Bus Kedatangan", equipment: "Perlengkapan Umrah", manasik: "Bimbingan Manasik", program: "Program Tambahan", social: "Sedekah & Sosial", other: "Biaya Lain & Operasional", hotel_makkah: "Hotel Makkah", hotel_madinah: "Hotel Madinah" };
  return <><AdminPageHeader eyebrow="PENGATURAN HPP" title="Master Harga HPP" description="Harga ini menjadi nilai awal perhitungan baru. Simulasi lama tidak ikut berubah." backHref="/admin/manajemen/hpp-umroh" />
    <div className="management-warning"><Pencil /><span><strong>Aman untuk diperbarui.</strong> Perubahan master hanya dipakai pada simulasi yang dibuat setelahnya.</span></div>
    {groups.map((group) => <section className="management-panel hpp-master-panel" key={group}><header><div><small>KATEGORI</small><h2>{labels[group] ?? group.replaceAll("_", " ")}</h2></div></header><div>{data.masterPrices.filter((item) => item.category === group).map((item) => <HppMasterPriceForm item={item} key={item.id} />)}</div></section>)}
  </>;
}
