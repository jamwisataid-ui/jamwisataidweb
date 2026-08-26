import Link from "next/link";
import { AdminEmptyState, AdminPageHeader, AdminStatus } from "@/components/admin/AdminUi";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listArticlesAdmin } from "@/lib/cms/admin";

export default async function ArticlesAdminPage() {
  const items = await listArticlesAdmin();
  return (
    <>
      <AdminPageHeader
        eyebrow="ARTIKEL"
        title="Daftar artikel"
        description="Tambah artikel baru atau ubah artikel yang sudah ada."
        action={{ href: "/admin/artikel/baru", label: "Tulis artikel baru" }}
      />
      <section className="admin-panel admin-list-panel">
        {items.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Judul artikel</th>
                  <th>Status</th>
                  <th>Terakhir diubah</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Artikel">
                      <strong>{item.title}</strong>
                    </td>
                    <td data-label="Status">
                      <AdminStatus status={item.status} />
                    </td>
                    <td data-label="Diubah">
                      {item.updatedAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </td>
                    <td data-label="Aksi">
                      <div className="admin-table-actions">
                        <Link href={`/admin/artikel/${item.id}`} className="admin-text-button">
                          Ubah
                        </Link>
                        <DeleteButton id={item.id} name={item.title} type="article" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmptyState
            title="Belum ada artikel"
            description="Tekan tombol di bawah untuk menulis artikel pertama."
            href="/admin/artikel/baru"
            action="Tulis artikel baru"
          />
        )}
      </section>
    </>
  );
}
