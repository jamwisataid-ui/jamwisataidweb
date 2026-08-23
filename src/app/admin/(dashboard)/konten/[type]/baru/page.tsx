import { notFound } from "next/navigation";
import { ContentEntryForm } from "@/components/admin/ContentEntryForm";
const types = ["testimonial", "gallery", "destination", "faq", "service", "homepage", "site-settings"] as const;
export default async function NewContentPage({ params }: { params: Promise<{ type: string }> }) { const { type } = await params; if (!types.includes(type as typeof types[number])) notFound(); return <><header className="admin-page-header"><div><p className="admin-eyebrow">KONTEN BARU</p><h1>Tambah konten</h1><p>Gunakan materi asli dan informasi yang dapat dipertanggungjawabkan.</p></div></header><ContentEntryForm type={type as typeof types[number]} /></>; }
