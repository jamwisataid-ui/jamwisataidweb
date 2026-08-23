import Link from "next/link";
import { BookOpenText, CalendarDays, FileStack, PackageOpen } from "lucide-react";
import { getDashboardData } from "@/lib/cms/admin";

export default async function DashboardPage() {
  const { counts, recent } = await getDashboardData();
  const cards = [["Paket", counts.packages, PackageOpen, "/admin/paket"], ["Keberangkatan", counts.departures, CalendarDays, "/admin/paket"], ["Artikel", counts.articles, BookOpenText, "/admin/artikel"], ["Konten", counts.contents, FileStack, "/admin/konten/homepage"]] as const;
  return <><header className="admin-page-header"><div><p className="admin-eyebrow">RINGKASAN</p><h1>Selamat datang di CMS Jam Wisata</h1><p>Kelola informasi publik dengan rapi, transparan, dan tetap satu ruh dengan brand.</p></div><Link className="admin-primary-button" href="/admin/paket/baru">Tambah Paket</Link></header><section className="admin-stat-grid">{cards.map(([label, count, Icon, href]) => <Link href={href} key={label}><Icon /><span>{label}</span><strong>{count}</strong><small>Lihat & kelola →</small></Link>)}</section><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">AKTIVITAS</p><h2>Perubahan terbaru</h2></div></div><div className="admin-activity-list">{recent.length ? recent.map((item) => <div key={item.id}><span>{item.action}</span><p>{item.summary}</p><time>{item.createdAt.toLocaleString("id-ID")}</time></div>) : <p>Belum ada aktivitas.</p>}</div></section></>;
}
