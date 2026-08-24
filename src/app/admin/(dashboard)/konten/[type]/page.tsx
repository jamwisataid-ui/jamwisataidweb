import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminEmptyState, AdminPageHeader, AdminStatus } from "@/components/admin/AdminUi";
import { listEntriesAdmin } from "@/lib/cms/admin";

const contentConfig = {
  testimonial: ["Video jamaah", "Tambah atau ubah video testimonial yang tampil di homepage.", "Tambah video"],
  gallery: ["Galeri foto", "Foto terbaru otomatis tampil paling depan di homepage.", "Tambah foto"],
  destination: ["Destinasi halal", "Tambah atau ubah destinasi perjalanan halal.", "Tambah destinasi"],
  faq: ["Tanya jawab", "Tambah jawaban untuk pertanyaan yang sering ditanyakan jamaah.", "Tambah pertanyaan"],
  service: ["Layanan", "Tambah atau ubah informasi layanan Jam Wisata.", "Tambah layanan"],
  homepage: ["Konten homepage", "Ubah tulisan dan foto pada halaman depan.", "Tambah bagian"],
  "site-settings": ["Informasi situs", "Ubah nomor WhatsApp, email, dan alamat.", "Tambah informasi"],
} as const;
type EntryType = keyof typeof contentConfig;

export default async function ContentListPage({ params }: { params: Promise<{ type: string }> }) {
  const { type: raw } = await params;
  if (!(raw in contentConfig)) notFound();
  const type = raw as EntryType;
  const [title, description, actionLabel] = contentConfig[type];
  const items = await listEntriesAdmin(type);

  return <>
    <AdminPageHeader eyebrow="HOMEPAGE" title={title} description={description} action={{ href: `/admin/konten/${type}/baru`, label: actionLabel }} />
    <section className="admin-panel admin-list-panel">
      {items.length ? <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>Nama</th><th>Status</th><th>Terakhir diubah</th><th></th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id}><td data-label="Nama"><strong>{item.title}</strong></td><td data-label="Status"><AdminStatus status={item.status} /></td><td data-label="Diubah">{item.updatedAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td><td data-label="Aksi"><Link href={`/admin/konten/${type}/${item.id}`}>Ubah</Link></td></tr>)}</tbody>
      </table></div> : <AdminEmptyState title={`Belum ada ${title.toLowerCase()}`} description="Tekan tombol di bawah untuk menambahkan data pertama." href={`/admin/konten/${type}/baru`} action={actionLabel} />}
    </section>
  </>;
}
