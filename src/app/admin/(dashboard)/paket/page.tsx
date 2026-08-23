import Link from "next/link";
import { listPackagesAdmin } from "@/lib/cms/admin";

export default async function PackagesAdminPage() {
  const items = await listPackagesAdmin();
  return <><header className="admin-page-header"><div><p className="admin-eyebrow">PROGRAM & JADWAL</p><h1>Paket perjalanan</h1><p>Harga, hotel, maskapai, fasilitas, dan itinerary dikelola dari satu entri.</p></div><Link className="admin-primary-button" href="/admin/paket/baru">Tambah Paket</Link></header><section className="admin-panel"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Program</th><th>Tipe</th><th>Status</th><th>Terakhir diubah</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>/{item.slug}</small></td><td>{item.type}</td><td><span className={`admin-status ${item.status}`}>{item.status}</span></td><td>{item.updatedAt.toLocaleDateString("id-ID")}</td><td><Link href={`/admin/paket/${item.id}`}>Edit →</Link></td></tr>)}</tbody></table></div></section></>;
}
