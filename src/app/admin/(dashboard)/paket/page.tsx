import Link from "next/link";
import { AdminEmptyState, AdminPageHeader, AdminStatus } from "@/components/admin/AdminUi";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listPackagesAdmin, type CmsPackageCategory } from "@/lib/cms/admin";
import { formatRupiahInput } from "@/lib/cms/utils";

export default async function PackagesAdminPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const query = await searchParams;
  const category: CmsPackageCategory = query.category === "halal-tour" ? "halal-tour" : "umrah";
  const isTour = category === "halal-tour";
  const items = await listPackagesAdmin(category);
  return (
    <>
      <AdminPageHeader
        eyebrow={isTour ? "PAKET WISATA" : "PAKET UMRAH"}
        title={`Daftar paket ${isTour ? "Wisata" : "Umroh"}`}
        description="Tambah paket baru atau ubah informasi harga, hotel, dan jadwal paket yang sudah ada."
        action={{ href: `/admin/paket/baru?category=${category}`, label: `Tambah paket ${isTour ? "Wisata" : "Umroh"}` }}
      />
      <section className="admin-panel admin-list-panel">
        <div className="admin-package-tabs" aria-label="Filter kategori paket">
          <Link href="/admin/paket?category=umrah" className={category === "umrah" ? "is-active" : ""}>Paket Umroh</Link>
          <Link href="/admin/paket?category=halal-tour" className={category === "halal-tour" ? "is-active" : ""}>Paket Wisata</Link>
        </div>
        {items.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama paket</th>
                  <th>Harga</th>
                  <th>Jadwal / Maskapai</th>
                  <th>Status</th>
                  <th>Terakhir diubah</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Paket">
                      <strong style={{ fontSize: "15px" }}>{item.name}</strong>
                      <small>{item.type.replaceAll("-", " ")} {item.durationDays ? `• ${item.durationDays} Hari` : ""}</small>
                    </td>
                    <td data-label="Harga">
                      {item.price ? (
                        <strong style={{ color: "#166534", fontSize: "14px" }}>
                          Rp {formatRupiahInput(item.price)}
                        </strong>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>-</span>
                      )}
                    </td>
                    <td data-label="Jadwal">
                      <div>
                        <strong style={{ fontSize: "13px", fontWeight: "600" }}>{item.dateLabel || "-"}</strong>
                        <small style={{ display: "block", color: "#64748b" }}>{item.airline || "-"}</small>
                      </div>
                    </td>
                    <td data-label="Status">
                      <AdminStatus status={item.status} />
                    </td>
                    <td data-label="Diubah">
                      {item.updatedAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </td>
                    <td data-label="Aksi">
                      <div className="admin-table-actions">
                        <Link href={`/admin/paket/${item.id}`} className="admin-text-button">
                          Ubah
                        </Link>
                        <DeleteButton id={item.id} name={item.name} type="package" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmptyState
            title={`Belum ada paket ${isTour ? "Wisata" : "Umroh"}`}
            description="Tekan tombol di bawah untuk menambahkan paket pertama pada kategori ini."
            href={`/admin/paket/baru?category=${category}`}
            action={`Tambah paket ${isTour ? "Wisata" : "Umroh"}`}
          />
        )}
      </section>
    </>
  );
}
