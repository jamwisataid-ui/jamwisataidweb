import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { PackageForm } from "@/components/admin/PackageForm";
import { getPackageAdmin } from "@/lib/cms/admin";

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const values = await getPackageAdmin(id);
  if (!values) notFound();
  const category = values.category === "halal-tour" ? "halal-tour" : "umrah";
  const publicPath = category === "halal-tour" ? `/paket-wisata/${values.slug}` : `/paket-umroh/${values.slug}`;

  return (
    <>
      <AdminPageHeader
        eyebrow={`EDIT PAKET ${category === "halal-tour" ? "WISATA" : "UMROH"}`}
        title={String(values.name)}
        description="Kelola seluruh isi paket ini: baik kartu di homepage maupun seluruh konten di Halaman Detail Publik (harga, hotel, maskapai, itinerary harian, keunggulan, fasilitas All-In, dan syarat dokumen)."
        backHref={`/admin/paket?category=${category}`}
        action={{
          href: publicPath,
          label: "Lihat Halaman Detail Web ↗",
        }}
      />
      <PackageForm values={values} />
    </>
  );
}

