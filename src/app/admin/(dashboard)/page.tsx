import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, FileStack, GalleryHorizontal, PackageOpen, Plus, Quote, Sparkles } from "lucide-react";
import { getDashboardData } from "@/lib/cms/admin";

export default async function DashboardPage() {
  const { counts, recent } = await getDashboardData();
  const cards = [["Program perjalanan", counts.packages, PackageOpen, "/admin/paket", "Program aktif dan draft"], ["Jadwal berangkat", counts.departures, CalendarDays, "/admin/paket", "Seluruh keberangkatan"], ["Artikel panduan", counts.articles, BookOpenText, "/admin/artikel", "Bekal ilmu jamaah"], ["Konten terkelola", counts.contents, FileStack, "/admin/konten/homepage", "Galeri, FAQ, dan lainnya"]] as const;
  const quickActions = [["Tambah paket", "Isi kartu paket yang tampil pada homepage.", PackageOpen, "/admin/paket/baru"], ["Tulis artikel", "Bagikan panduan yang membantu persiapan jamaah.", BookOpenText, "/admin/artikel/baru"], ["Tambah galeri", "Simpan momen perjalanan yang autentik.", GalleryHorizontal, "/admin/konten/gallery/baru"], ["Tambah testimonial", "Hubungkan cerita jamaah melalui YouTube.", Quote, "/admin/konten/testimonial/baru"]] as const;
  const today = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  return <>
    <section className="admin-welcome">
      <div><p><Sparkles aria-hidden /> Setiap Waktu Bernilai Ibadah</p><h1>Kelola website Jam Wisata.</h1><span>Perbarui program, jadwal, dan informasi jamaah dari satu tempat.</span><div><Link className="admin-primary-button" href="/admin/paket/baru"><Plus aria-hidden />Tambah paket</Link><Link className="admin-text-button" href="/" target="_blank">Lihat website <ArrowRight aria-hidden /></Link></div></div>
      <aside><small>HARI INI</small><strong>{today}</strong><span>Pastikan jadwal dan ketersediaan program selalu diperbarui.</span></aside>
    </section>
    <section className="admin-section-heading"><div><p className="admin-eyebrow">RINGKASAN</p><h2>Kondisi website</h2></div><span>Data langsung dari Neon</span></section>
    <section className="admin-stat-grid">{cards.map(([label, count, Icon, href, note], index) => <Link href={href} key={label} style={{ "--card-index": index } as React.CSSProperties}><span className="admin-stat-icon"><Icon /></span><small>{label}</small><strong>{count.toLocaleString("id-ID")}</strong><p>{note}</p><i><ArrowRight /></i></Link>)}</section>
    <section className="admin-dashboard-grid">
      <article className="admin-panel admin-quick-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">PINTASAN</p><h2>Aksi cepat</h2></div></div><div className="admin-quick-grid">{quickActions.map(([title, description, Icon, href]) => <Link href={href} key={title}><span><Icon /></span><div><strong>{title}</strong><p>{description}</p></div><ArrowRight /></Link>)}</div></article>
      <article className="admin-panel admin-activity-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">AKTIVITAS</p><h2>Perubahan terbaru</h2></div></div><div className="admin-activity-list">{recent.length ? recent.map((item) => <div key={item.id}><span>{item.action.slice(0, 1).toUpperCase()}</span><p><strong>{item.summary}</strong><small>{item.action}</small></p><time>{item.createdAt.toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</time></div>) : <div className="admin-activity-empty"><FileStack /><p><strong>Belum ada perubahan</strong><small>Aktivitas editorial akan tercatat di sini.</small></p></div>}</div></article>
    </section>
  </>;
}
