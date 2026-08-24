import Link from "next/link";
import { AdminEmptyState, AdminPageHeader, AdminStatus } from "@/components/admin/AdminUi";
import { listPackagesAdmin } from "@/lib/cms/admin";

export default async function PackagesAdminPage() {
  const items = await listPackagesAdmin();
  return <>
    <AdminPageHeader eyebrow="PAKET UMRAH" title="Daftar paket" description="Tambah paket baru atau ubah informasi paket yang sudah ada." action={{ href: "/admin/paket/baru", label: "Tambah paket baru" }} />
    <section className="admin-panel admin-list-panel">
      {items.length ? <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>Nama paket</th><th>Status</th><th>Terakhir diubah</th><th></th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id}><td data-label="Paket"><strong>{item.name}</strong><small>{item.type.replaceAll("-", " ")}</small></td><td data-label="Status"><AdminStatus status={item.status} /></td><td data-label="Diubah">{item.updatedAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td><td data-label="Aksi"><Link href={`/admin/paket/${item.id}`}>Ubah paket</Link></td></tr>)}</tbody>
      </table></div> : <AdminEmptyState title="Belum ada paket" description="Tekan tombol di bawah untuk menambahkan paket pertama." href="/admin/paket/baru" action="Tambah paket baru" />}
    </section>
  </>;
}
