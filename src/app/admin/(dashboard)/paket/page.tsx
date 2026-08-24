import Link from "next/link";
import { AdminEmptyState, AdminPageHeader, AdminStatus } from "@/components/admin/AdminUi";
import { listPackagesAdmin } from "@/lib/cms/admin";

export default async function PackagesAdminPage() {
  const items = await listPackagesAdmin();
  return <>
    <AdminPageHeader eyebrow="Program & jadwal" title="Paket perjalanan" description="Kelola informasi kartu paket yang tampil pada homepage." action={{ href: "/admin/paket/baru", label: "Tambah paket" }} />
    <section className="admin-panel admin-list-panel">
      {items.length ? <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>Program</th><th>Tipe</th><th>Status</th><th>Terakhir diubah</th><th>Aksi</th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id}><td data-label="Program"><strong>{item.name}</strong><small>jamwisata.id/paket-umroh/{item.slug}</small></td><td data-label="Tipe">{item.type.replaceAll("-", " ")}</td><td data-label="Status"><AdminStatus status={item.status} /></td><td data-label="Diubah">{item.updatedAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td><td data-label="Aksi"><Link href={`/admin/paket/${item.id}`}>Kelola paket →</Link></td></tr>)}</tbody>
      </table></div> : <AdminEmptyState title="Belum ada paket" description="Susun program perjalanan pertama beserta jadwal, hotel, harga, dan fasilitasnya." href="/admin/paket/baru" action="Tambah paket" />}
    </section>
  </>;
}
