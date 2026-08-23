import Link from "next/link";
import { AdminEmptyState, AdminPageHeader, AdminStatus } from "@/components/admin/AdminUi";
import { listArticlesAdmin } from "@/lib/cms/admin";

export default async function ArticlesAdminPage() {
  const items = await listArticlesAdmin();
  return <>
    <AdminPageHeader eyebrow="Edukasi jamaah" title="Artikel & panduan" description="Bagikan informasi yang bermanfaat, mudah dipahami, dan membantu jamaah mempersiapkan perjalanan." action={{ href: "/admin/artikel/baru", label: "Tulis artikel" }} />
    <section className="admin-panel">
      {items.length ? <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>Artikel</th><th>Status</th><th>Terakhir diubah</th><th>Aksi</th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.title}</strong><small>jamwisata.id/artikel/{item.slug}</small></td><td><AdminStatus status={item.status} /></td><td>{item.updatedAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td><td><Link href={`/admin/artikel/${item.id}`}>Kelola →</Link></td></tr>)}</tbody>
      </table></div> : <AdminEmptyState title="Belum ada artikel" description="Mulai dari panduan persiapan atau informasi yang paling sering ditanyakan jamaah." href="/admin/artikel/baru" action="Tulis artikel" />}
    </section>
  </>;
}
