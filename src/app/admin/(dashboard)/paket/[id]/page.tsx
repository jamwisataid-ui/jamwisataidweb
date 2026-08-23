import { notFound } from "next/navigation";
import { PackageForm } from "@/components/admin/PackageForm";
import { getPackageAdmin } from "@/lib/cms/admin";
export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const values = await getPackageAdmin(id); if (!values) notFound(); return <><header className="admin-page-header"><div><p className="admin-eyebrow">EDIT PROGRAM</p><h1>{String(values.name)}</h1><p>Perubahan draft tidak tampil di website sampai diterbitkan.</p></div></header><PackageForm values={values} /></>; }
