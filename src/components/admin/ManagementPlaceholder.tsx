import { ClipboardList } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUi";

export function ManagementPlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <AdminPageHeader eyebrow={eyebrow} title={title} description={description} />
      <section className="admin-panel admin-management-empty" aria-label={`Halaman ${title}`}>
        <span aria-hidden><ClipboardList /></span>
        <p>Ruang kerja sudah siap</p>
        <h2>Data akan ditambahkan pada tahap berikutnya.</h2>
        <small>Struktur halaman dan alur kerjanya akan disesuaikan setelah kebutuhan operasional dikonfirmasi bersama Jam Wisata.</small>
      </section>
    </>
  );
}
