import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { ContentEntryForm } from "@/components/admin/ContentEntryForm";
import { getEntryAdmin } from "@/lib/cms/admin";
const types = ["testimonial", "gallery", "destination", "faq", "service", "homepage", "site-settings"] as const;
const labels = { testimonial: "Ubah video jamaah", gallery: "Ubah foto galeri", destination: "Ubah destinasi", faq: "Ubah tanya jawab", service: "Ubah layanan", homepage: "Ubah homepage", "site-settings": "Ubah informasi situs" } as const;
export default async function EditContentPage({ params }: { params: Promise<{ type: string; id: string }> }) { const { type, id } = await params; if (!types.includes(type as typeof types[number])) notFound(); const selected = type as typeof types[number]; const values = await getEntryAdmin(type, id); if (!values) notFound(); return <><AdminPageHeader eyebrow="UBAH DATA" title={labels[selected]} description="Periksa isinya, lalu simpan atau tampilkan perubahan di website." backHref={`/admin/konten/${type}`} /><ContentEntryForm type={selected} values={values} /></>; }
