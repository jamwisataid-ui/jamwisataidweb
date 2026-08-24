import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminEmptyState, AdminPageHeader, AdminStatus } from "@/components/admin/AdminUi";
import { listEntriesAdmin } from "@/lib/cms/admin";

const contentConfig = {
  testimonial: ["Testimonial", "Kelola cerita jamaah dari video YouTube yang telah diverifikasi."],
  gallery: ["Galeri perjalanan", "Susun dokumentasi asli dari perjalanan dan kegiatan jamaah."],
  destination: ["Destinasi halal", "Tampilkan pilihan perjalanan halal selain program Umrah."],
  faq: ["Pertanyaan umum", "Berikan jawaban singkat dan jelas sebelum jamaah berkonsultasi."],
  service: ["Layanan", "Jelaskan bentuk pendampingan dan layanan yang diterima jamaah."],
  homepage: ["Konten homepage", "Atur pesan utama dan bagian editorial pada halaman depan."],
  "site-settings": ["Informasi situs", "Kelola identitas, kontak, dan informasi utama Jam Wisata."],
} as const;
type EntryType = keyof typeof contentConfig;

export default async function ContentListPage({ params }: { params: Promise<{ type: string }> }) {
  const { type: raw } = await params;
  if (!(raw in contentConfig)) notFound();
  const type = raw as EntryType;
  const [title, description] = contentConfig[type];
  const items = await listEntriesAdmin(type);

  return <>
    <AdminPageHeader eyebrow="Konten situs" title={title} description={description} action={{ href: `/admin/konten/${type}/baru`, label: "Tambah konten" }} />
    <section className="admin-panel admin-list-panel">
      {items.length ? <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>Konten</th><th>Key internal</th><th>Status</th><th>Urutan</th><th>Aksi</th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id}><td data-label="Konten"><strong>{item.title}</strong><small>Terakhir diubah {item.updatedAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</small></td><td data-label="Key">{item.key}</td><td data-label="Status"><AdminStatus status={item.status} /></td><td data-label="Urutan">{item.sortOrder}</td><td data-label="Aksi"><Link href={`/admin/konten/${type}/${item.id}`}>Kelola konten →</Link></td></tr>)}</tbody>
      </table></div> : <AdminEmptyState title={`Belum ada ${title.toLowerCase()}`} description="Tambahkan konten pertama dan simpan sebagai draft sampai informasinya siap diterbitkan." href={`/admin/konten/${type}/baru`} action="Tambah konten" />}
    </section>
  </>;
}
