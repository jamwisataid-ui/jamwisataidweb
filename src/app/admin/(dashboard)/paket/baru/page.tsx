import { randomUUID } from "node:crypto";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { PackageForm } from "@/components/admin/PackageForm";
export default async function NewPackagePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const query = await searchParams;
  const category = query.category === "halal-tour" ? "halal-tour" : "umrah";
  const label = category === "halal-tour" ? "Wisata" : "Umroh";
  return <><AdminPageHeader eyebrow="PAKET BARU" title={`Tambah paket ${label}`} description="Isi informasi utama paket. Pengaturan teknis dibuat otomatis oleh sistem." backHref={`/admin/paket?category=${category}`} /><PackageForm values={{ id: randomUUID(), category, packageType: category === "halal-tour" ? "tour" : "reguler" }} /></>;
}
