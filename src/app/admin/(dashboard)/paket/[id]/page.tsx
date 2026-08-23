import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { PackageForm } from "@/components/admin/PackageForm";
import { getPackageAdmin } from "@/lib/cms/admin";
export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const values = await getPackageAdmin(id); if (!values) notFound(); return <><AdminPageHeader eyebrow="Edit program" title={String(values.name)} description="Perubahan draft tidak tampil di website sampai diterbitkan." backHref="/admin/paket" /><PackageForm values={values} /></>; }
