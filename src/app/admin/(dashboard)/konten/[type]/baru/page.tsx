import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { ContentEntryForm } from "@/components/admin/ContentEntryForm";
const types = ["testimonial", "gallery", "destination", "faq", "service", "homepage", "site-settings"] as const;
export default async function NewContentPage({ params }: { params: Promise<{ type: string }> }) { const { type } = await params; if (!types.includes(type as typeof types[number])) notFound(); return <><AdminPageHeader eyebrow="Konten baru" title="Tambah konten" description="Gunakan materi asli dan informasi yang dapat dipertanggungjawabkan." backHref={`/admin/konten/${type}`} /><ContentEntryForm type={type as typeof types[number]} /></>; }
