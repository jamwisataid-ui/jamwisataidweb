import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { ContentEntryForm } from "@/components/admin/ContentEntryForm";
import { getEntryAdmin } from "@/lib/cms/admin";
const types = ["testimonial", "gallery", "destination", "faq", "service", "homepage", "site-settings"] as const;
export default async function EditContentPage({ params }: { params: Promise<{ type: string; id: string }> }) { const { type, id } = await params; if (!types.includes(type as typeof types[number])) notFound(); const values = await getEntryAdmin(type, id); if (!values) notFound(); return <><AdminPageHeader eyebrow="Edit konten" title={String(values.title)} description="Simpan draft atau terbitkan perubahan ke website." backHref={`/admin/konten/${type}`} /><ContentEntryForm type={type as typeof types[number]} values={values} /></>; }
