import Link from "next/link";
import { ArrowRight, BookOpenText, FileQuestion, GalleryHorizontal, PackageOpen, Quote } from "lucide-react";

export default function DashboardPage() {
  const actions = [
    ["Paket Umrah", "Tambah paket baru atau ubah paket yang sudah ada.", PackageOpen, "/admin/paket"],
    ["Galeri foto", "Tambah foto perjalanan yang tampil di homepage.", GalleryHorizontal, "/admin/konten/gallery"],
    ["Artikel", "Tulis panduan dan informasi untuk jamaah.", BookOpenText, "/admin/artikel"],
    ["Video jamaah", "Tambahkan video testimonial dari YouTube.", Quote, "/admin/konten/testimonial"],
    ["Tanya jawab", "Ubah pertanyaan dan jawaban di homepage.", FileQuestion, "/admin/konten/faq"],
  ] as const;
  return <>
    <section className="admin-simple-welcome">
      <p className="admin-eyebrow">DASHBOARD JAM WISATA</p>
      <h1>Mau mengubah apa hari ini?</h1>
      <p>Pilih salah satu menu di bawah. Semua perubahan dapat diperiksa sebelum ditampilkan di website.</p>
    </section>
    <section className="admin-simple-actions" aria-label="Pilihan pengelolaan website">
      {actions.map(([title, description, Icon, href]) => <Link href={href} key={title}><span><Icon aria-hidden /></span><div><strong>{title}</strong><p>{description}</p></div><ArrowRight aria-hidden /></Link>)}
    </section>
    <aside className="admin-help-note"><strong>Cara menggunakan dashboard</strong><p>1. Pilih bagian yang ingin diubah. &nbsp; 2. Tekan tombol tambah atau ubah. &nbsp; 3. Tekan “Tampilkan di website” jika sudah benar.</p></aside>
  </>;
}
