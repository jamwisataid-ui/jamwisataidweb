import type { Metadata } from "next";
import Link from "next/link";

import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Cara Jam Wisata mengumpulkan, menggunakan, menyimpan, dan melindungi data pengguna website serta aplikasi mobile.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  { id: "data", title: "Data yang kami proses" },
  { id: "tujuan", title: "Tujuan penggunaan" },
  { id: "pihak", title: "Pihak yang menerima data" },
  { id: "keamanan", title: "Keamanan dan penyimpanan" },
  { id: "hak", title: "Hak dan pilihan Anda" },
  { id: "kontak", title: "Kontak" },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <PremiumHeader />
      <main className="flex-1 bg-[#F8F6F0] pb-20 pt-32 text-[#223047] sm:pt-36">
        <div className="jam-container max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-9 text-sm text-[#667387]">
            <Link href="/" className="hover:text-[#12305A]">Beranda</Link> <span aria-hidden="true">/</span> Kebijakan Privasi
          </nav>
          <div className="border-b border-[#D9CCAD] pb-9">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#A67C23]">Jam Wisata</p>
            <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-none text-[#06152B] sm:text-6xl">Kebijakan Privasi</h1>
            <p className="mt-5 max-w-3xl leading-7">Kebijakan ini menjelaskan pengelolaan data saat Anda menggunakan website jamwisata.id dan aplikasi Jam Wisata. Pengelolanya adalah Jam Wisata (PT Jaris Ammar Madani).</p>
            <p className="mt-3 text-sm text-[#667387]">Terakhir diperbarui: 12 November 2026</p>
          </div>

          <div className="grid gap-12 py-10 lg:grid-cols-[220px_1fr]">
            <nav aria-label="Isi kebijakan" className="self-start rounded-2xl border border-[#E6DDCB] bg-white p-5 lg:sticky lg:top-28">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#A67C23]">Isi halaman</p>
              <ul className="space-y-2 text-sm">{sections.map((section) => <li key={section.id}><a className="hover:text-[#A67C23]" href={`#${section.id}`}>{section.title}</a></li>)}</ul>
            </nav>
            <article className="space-y-10 leading-7">
              <section id="data">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">Data yang kami proses</h2>
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>Identitas dan kontak:</strong> nama, nomor WhatsApp, email, tanggal lahir, jenis kelamin, kewarganegaraan, serta data paspor jika Anda mendaftar sebagai jamaah.</li>
                  <li><strong>Dokumen perjalanan:</strong> berkas yang Anda unggah, seperti KTP, kartu keluarga, paspor, buku vaksin, atau dokumen pendukung lain.</li>
                  <li><strong>Pemesanan dan pembayaran:</strong> paket dan keberangkatan yang dipilih, status pendaftaran, jumlah dan riwayat pembayaran, serta bukti transfer bila diserahkan.</li>
                  <li><strong>Penggunaan layanan:</strong> data sesi akun, alamat IP, informasi perangkat, token notifikasi, dan aktivitas kunjungan website. Website memakai pengenal kunjungan di penyimpanan browser, sumber kunjungan, halaman yang dibuka, dan jenis perangkat untuk statistik internal; sinyal Do Not Track dihormati oleh pelacak website.</li>
                  <li><strong>Audio siaran:</strong> bila Anda menggunakan fitur LIVE Muthowif, suara muthowif dikirim melalui layanan siaran langsung kepada jamaah yang berhak mengakses. Izin mikrofon diminta untuk peran yang menyiarkan.</li>
                </ul>
                <p className="mt-3">Fitur jadwal salat memakai kota yang Anda pilih. Pilihan kota dapat tersimpan di perangkat agar jadwal tetap mudah dibuka.</p>
              </section>
              <section id="tujuan">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">Tujuan penggunaan</h2>
                <p>Kami menggunakan data untuk membuat dan mengamankan akun, memproses pendaftaran perjalanan, memeriksa dokumen, mencatat pembayaran, menyiapkan layanan perjalanan, mengirim pemberitahuan terkait layanan, menyediakan siaran LIVE Muthowif, menjawab pertanyaan, dan memahami penggunaan website agar layanan dapat diperbaiki. Data kontak yang Anda kirim melalui formulir konsultasi diteruskan kepada tim Jam Wisata atau agen terkait untuk menindaklanjuti permintaan Anda.</p>
              </section>
              <section id="pihak">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">Pihak yang menerima data</h2>
                <p>Akses internal dibatasi sesuai tugas tim Jam Wisata. Untuk menjalankan layanan, data tertentu dapat diproses oleh penyedia hosting, penyimpanan dokumen, pengiriman email atau notifikasi, dan infrastruktur siaran audio. Data perjalanan yang diperlukan dapat dibagikan kepada pihak yang menangani pemesanan, keberangkatan, dan dokumen perjalanan. Jika Anda memilih menghubungi kami lewat WhatsApp, percakapan diproses oleh WhatsApp menurut kebijakannya sendiri. Kami juga dapat memberikan data apabila diwajibkan oleh hukum.</p>
              </section>
              <section id="keamanan">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">Keamanan dan penyimpanan</h2>
                <p>Kami menggunakan akses akun untuk membuka data jamaah dan menyimpan dokumen unggahan pada penyimpanan yang tidak ditampilkan sebagai berkas publik. Kami menjaga data selama diperlukan untuk penyelenggaraan perjalanan, administrasi, penyelesaian kewajiban, dan ketentuan hukum yang berlaku. Setelah tidak diperlukan, data dihapus atau tidak lagi digunakan sesuai proses yang berlaku. Tidak ada sistem yang dapat menjamin keamanan mutlak.</p>
              </section>
              <section id="hak">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">Hak dan pilihan Anda</h2>
                <p>Anda dapat meminta akses, koreksi, atau penghapusan data dan akun melalui kontak di bawah. Kami akan memverifikasi identitas pemohon dan menindaklanjuti sesuai kewajiban yang berlaku; sebagian catatan mungkin perlu disimpan untuk administrasi atau kewajiban hukum. Anda dapat menolak izin notifikasi atau mikrofon melalui pengaturan perangkat. Menolak izin tertentu dapat membatasi fitur terkait. Anda dapat menghapus data kunjungan tersimpan melalui pengaturan browser.</p>
              </section>
              <section id="kontak" className="rounded-2xl border border-[#D9CCAD] bg-white p-6 sm:p-8">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">Pertanyaan tentang privasi?</h2>
                <p>Hubungi Jam Wisata (PT Jaris Ammar Madani) untuk pertanyaan atau permintaan terkait data pribadi.</p>
                <address className="mt-4 space-y-1 not-italic">
                  <p>Email: <a className="font-semibold text-[#12305A] underline" href="mailto:jamwisata99@gmail.com">jamwisata99@gmail.com</a></p>
                  <p>WhatsApp: <a className="font-semibold text-[#12305A] underline" href="https://wa.me/6281809627499">+62 818-0962-7499</a></p>
                  <p>Jl. Cibangkong No. 28A Gatot Subroto, Bandung 40273</p>
                </address>
              </section>
              <p className="text-sm text-[#667387]">Jika cara kami mengelola data berubah, halaman ini akan diperbarui bersama tanggal perubahan terakhir.</p>
            </article>
          </div>
        </div>
      </main>
      <ModernProofFooter />
    </>
  );
}
