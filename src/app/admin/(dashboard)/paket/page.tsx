import Link from "next/link";
import { AdminEmptyState, AdminPageHeader, AdminStatus } from "@/components/admin/AdminUi";
import { listPackagesAdmin } from "@/lib/cms/admin";

export default async function PackagesAdminPage() {
  const items = await listPackagesAdmin();
  return <>
    <AdminPageHeader eyebrow="Program & jadwal" title="Paket perjalanan" description="Kelola harga, hotel, maskapai, fasilitas, jadwal, dan itinerary dalam satu tempat." action={{ href: "/admin/paket/baru", label: "Tambah paket" }} />
    <section className="admin-panel">
      {items.length ? <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>Program</th><th>Tipe</th><th>Status</th><th>Terakhir diubah</th><th>Aksi</th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>jamwisata.id/paket-umroh/{item.slug}</small></td><td>{item.type.replaceAll("-", " ")}</td><td><AdminStatus status={item.status} /></td><td>{item.updatedAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td><td><Link href={`/admin/paket/${item.id}`}>Kelola →</Link></td></tr>)}</tbody>
      </table></div> : <AdminEmptyState title="Belum ada paket" description="Susun program perjalanan pertama beserta jadwal, hotel, harga, dan fasilitasnya." href="/admin/paket/baru" action="Tambah paket" />}
    </section>
  </>;
}
