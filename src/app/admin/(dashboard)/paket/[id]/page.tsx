import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { PackageForm } from "@/components/admin/PackageForm";
import { getPackageAdmin } from "@/lib/cms/admin";
export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const values = await getPackageAdmin(id); if (!values) notFound(); return <><AdminPageHeader eyebrow="Edit paket" title={String(values.name)} description="Ubah informasi yang tampil pada kartu paket di homepage." backHref="/admin/paket" /><PackageForm values={values} /></>; }
