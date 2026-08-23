import Link from "next/link";
import { notFound } from "next/navigation";
import { listEntriesAdmin } from "@/lib/cms/admin";

const labels = { testimonial: "Testimonial", gallery: "Galeri", destination: "Destinasi", faq: "FAQ", service: "Layanan", homepage: "Homepage", "site-settings": "Pengaturan Situs" } as const;
type EntryType = keyof typeof labels;
export default async function ContentListPage({ params }: { params: Promise<{ type: string }> }) {
  const { type: raw } = await params; if (!(raw in labels)) notFound(); const type = raw as EntryType;
  const items = await listEntriesAdmin(type);
  return <><header className="admin-page-header"><div><p className="admin-eyebrow">KONTEN SITUS</p><h1>{labels[type]}</h1><p>Atur urutan, visibilitas, dan isi konten yang tampil kepada jamaah.</p></div><Link className="admin-primary-button" href={`/admin/konten/${type}/baru`}>Tambah Konten</Link></header><section className="admin-panel"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Konten</th><th>Key</th><th>Status</th><th>Urutan</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.title}</strong></td><td>{item.key}</td><td><span className={`admin-status ${item.status}`}>{item.status}</span></td><td>{item.sortOrder}</td><td><Link href={`/admin/konten/${type}/${item.id}`}>Edit →</Link></td></tr>)}</tbody></table></div></section></>;
}
