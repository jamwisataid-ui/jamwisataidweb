import { notFound } from "next/navigation";
import { ContentEntryForm } from "@/components/admin/ContentEntryForm";
import { getEntryAdmin } from "@/lib/cms/admin";
const types = ["testimonial", "gallery", "destination", "faq", "service", "homepage", "site-settings"] as const;
export default async function EditContentPage({ params }: { params: Promise<{ type: string; id: string }> }) { const { type, id } = await params; if (!types.includes(type as typeof types[number])) notFound(); const values = await getEntryAdmin(type, id); if (!values) notFound(); return <><header className="admin-page-header"><div><p className="admin-eyebrow">EDIT KONTEN</p><h1>{String(values.title)}</h1><p>Simpan draft atau terbitkan perubahan ke website.</p></div></header><ContentEntryForm type={type as typeof types[number]} values={values} /></>; }
