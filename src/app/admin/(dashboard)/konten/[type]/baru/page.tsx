import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { ContentEntryForm } from "@/components/admin/ContentEntryForm";
const types = ["testimonial", "gallery", "destination", "faq", "service", "homepage", "site-settings"] as const;
const labels = {
  testimonial: ["Video baru", "Tambah video jamaah", "Salin link video dari YouTube."],
  gallery: ["Foto baru", "Tambah foto galeri", "Pilih foto perjalanan dan beri keterangan singkat."],
  destination: ["Destinasi baru", "Tambah destinasi", "Isi nama destinasi dan pilih fotonya."],
  faq: ["Pertanyaan baru", "Tambah tanya jawab", "Tulis pertanyaan jamaah beserta jawabannya."],
  service: ["Layanan baru", "Tambah layanan", "Jelaskan layanan dengan bahasa yang mudah dipahami."],
  homepage: ["Bagian baru", "Tambah bagian homepage", "Isi tulisan dan foto untuk halaman depan."],
  "site-settings": ["Informasi baru", "Tambah informasi situs", "Isi informasi kontak Jam Wisata."],
} as const;
export default async function NewContentPage({ params }: { params: Promise<{ type: string }> }) { const { type } = await params; if (!types.includes(type as typeof types[number])) notFound(); const selected = type as typeof types[number]; const [eyebrow, title, description] = labels[selected]; return <><AdminPageHeader eyebrow={eyebrow} title={title} description={description} backHref={`/admin/konten/${type}`} /><ContentEntryForm type={selected} /></>; }
