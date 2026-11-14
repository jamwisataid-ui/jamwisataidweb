import type { Metadata } from "next";
import Link from "next/link";

import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi aplikasi dan website Jam Wisata yang menjelaskan pengumpulan, penggunaan, penyimpanan, perlindungan, dan penghapusan data pribadi.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const sections = [
  { id: "data", title: "1. Data yang kami kumpulkan" },
  { id: "tujuan", title: "2. Tujuan penggunaan data" },
  { id: "pihak", title: "3. Pembagian data" },
  { id: "keamanan", title: "4. Penyimpanan dan keamanan" },
  { id: "hak", title: "5. Hak Anda" },
  { id: "penghapusan", title: "6. Penghapusan akun" },
  { id: "anak", title: "7. Anak di bawah umur" },
  { id: "perubahan", title: "8. Perubahan kebijakan" },
  { id: "kontak", title: "9. Hubungi kami" },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <PremiumHeader />
      <main className="min-h-screen bg-[#F8F6F0] pb-20 pt-32 text-[#223047] sm:pt-36">
        <div className="jam-container max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-9 text-sm text-[#667387]">
            <Link href="/" className="hover:text-[#12305A]">Beranda</Link> <span aria-hidden="true">/</span> Kebijakan Privasi
          </nav>
          <div className="border-b border-[#D9CCAD] pb-9">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8C6708]">Jam Wisata</p>
            <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-none text-[#06152B] sm:text-6xl">Kebijakan Privasi</h1>
            <p className="mt-5 max-w-3xl leading-7">Kebijakan ini menjelaskan bagaimana PT Jaris Ammar Madani (“Jam Wisata”, “kami”) mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda saat menggunakan aplikasi Jam Wisata dan situs jamwisata.id.</p>
            <p className="mt-3 text-sm text-[#667387]">Terakhir diperbarui: 14 November 2026</p>
          </div>
          <div className="grid gap-12 py-10 lg:grid-cols-[240px_1fr]">
            <nav aria-label="Isi kebijakan" className="self-start rounded-2xl border border-[#E6DDCB] bg-white p-5 lg:sticky lg:top-28">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#8C6708]">Isi halaman</p>
              <ul className="space-y-2 text-sm">{sections.map((section) => <li key={section.id}><a className="hover:text-[#8C6708]" href={`#${section.id}`}>{section.title}</a></li>)}</ul>
            </nav>
            <article className="space-y-10 leading-7">
              <section id="data">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">1. Data yang kami kumpulkan</h2>
                <h3 className="font-semibold text-[#223047]">Data yang Anda berikan sendiri</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>Nama lengkap, tanggal lahir, kewarganegaraan, dan nama rombongan.</li>
                  <li>Nomor paspor dan masa berlaku paspor.</li>
                  <li>Alamat email dan nomor WhatsApp.</li>
                  <li>Nama dan email pembayar, bila berbeda dengan jamaah.</li>
                  <li>Dokumen yang Anda unggah, seperti salinan paspor dan identitas.</li>
                  <li>PIN enam angka yang Anda buat sendiri. PIN diproses menjadi hash sebelum disimpan.</li>
                </ul>
                <h3 className="mt-5 font-semibold text-[#223047]">Data yang terkumpul otomatis</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>Token notifikasi perangkat agar kami dapat mengirim pemberitahuan.</li>
                  <li>Token sesi untuk menjaga Anda tetap masuk dan melindungi akses akun.</li>
                  <li>Suara dari mikrofon, hanya pada akun muthowif dan hanya selama siaran bimbingan berlangsung.</li>
                </ul>
                <h3 className="mt-5 font-semibold text-[#223047]">Data yang tidak kami kumpulkan</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>Lokasi GPS perangkat. Jadwal salat menggunakan kota yang dipilih sendiri; koordinat kota berasal dari layanan kami.</li>
                  <li>Daftar kontak, galeri foto, pesan, SMS, dan riwayat panggilan.</li>
                  <li>Advertising ID atau data untuk iklan. Aplikasi Jam Wisata tidak memuat SDK iklan.</li>
                </ul>
              </section>
              <section id="tujuan">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">2. Tujuan penggunaan data</h2>
                <p>Kami menggunakan data Anda untuk:</p>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>Memproses pendaftaran dan keberangkatan umroh.</li>
                  <li>Mengurus dokumen perjalanan, visa, dan keperluan administrasi.</li>
                  <li>Memverifikasi dan mencatat pembayaran.</li>
                  <li>Mengirim pemberitahuan terkait jadwal, status pendaftaran, dan layanan.</li>
                  <li>Menyediakan bimbingan ibadah, termasuk siaran langsung muthowif.</li>
                  <li>Memenuhi kewajiban hukum dan persyaratan otoritas terkait.</li>
                </ul>
                <p className="mt-3 font-semibold text-[#06152B]">Kami tidak menjual data pribadi Anda kepada pihak mana pun.</p>
              </section>
              <section id="pihak">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">3. Pembagian data kepada pihak ketiga</h2>
                <p>Data dibagikan hanya sejauh diperlukan untuk menjalankan layanan kepada penyedia visa dan maskapai, penyedia akomodasi serta transportasi, otoritas pemerintah Indonesia dan Arab Saudi bila diwajibkan, dan penyedia infrastruktur teknologi untuk basis data, penyimpanan berkas, email, notifikasi, serta siaran audio. Setiap pihak hanya menerima data yang relevan dengan layanannya dan wajib menjaga kerahasiaan sesuai perjanjian serta hukum yang berlaku.</p>
              </section>
              <section id="keamanan">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">4. Penyimpanan dan keamanan</h2>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Pengiriman data antara aplikasi dan server menggunakan HTTPS.</li>
                  <li>PIN disimpan sebagai hash, bukan teks PIN asli.</li>
                  <li>Aplikasi membatasi akses dokumen berdasarkan akun jamaah atau petugas berwenang dan menghasilkan tautan akses sementara ketika dokumen dibuka.</li>
                  <li>Token sesi disimpan pada penyimpanan aman di perangkat.</li>
                </ul>
                <p className="mt-3">Kami menyimpan data pendaftaran selama diperlukan untuk menjalankan layanan dan memenuhi kewajiban hukum, termasuk pencatatan keuangan dan dokumen perjalanan. Tidak ada sistem elektronik yang dapat menjamin keamanan mutlak; kami meninjau dan memperbarui perlindungan secara berkala.</p>
              </section>
              <section id="hak">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">5. Hak Anda</h2>
                <p>Sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda dapat meminta informasi mengenai data yang kami simpan, memperbaiki data yang keliru, meminta penghapusan data dan akun, menarik persetujuan, serta mengajukan keberatan atas pemrosesan tertentu. Gunakan kontak di bawah atau halaman <Link className="font-semibold text-[#12305A] underline" href="/hapus-akun">penghapusan akun</Link>.</p>
              </section>
              <section id="penghapusan">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">6. Penghapusan akun dan data</h2>
                <p>Anda dapat meminta penghapusan akun melalui <Link className="font-semibold text-[#12305A] underline" href="/hapus-akun">https://jamwisata.id/hapus-akun</Link>. Setelah identitas terverifikasi, kami akan menghapus data profil, dokumen unggahan yang tidak wajib dipertahankan, kredensial, token sesi, dan token notifikasi paling lambat 30 hari kerja.</p>
                <p className="mt-3">Catatan transaksi keuangan, invoice, bukti pembayaran, dan catatan keberangkatan yang sudah terlaksana dapat dipertahankan lebih lama bila diwajibkan oleh ketentuan perpajakan, akuntansi, kearsipan, penyelesaian sengketa, atau kewajiban hukum lainnya. Data yang dipertahankan dibatasi penggunaannya untuk kewajiban tersebut.</p>
              </section>
              <section id="anak">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">7. Anak di bawah umur</h2>
                <p>Aplikasi ditujukan untuk pengguna berusia 18 tahun ke atas. Pendaftaran jamaah di bawah 18 tahun dilakukan oleh orang tua atau wali yang bertanggung jawab atas data yang diberikan.</p>
              </section>
              <section id="perubahan">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">8. Perubahan kebijakan</h2>
                <p>Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan penting akan diberitahukan melalui aplikasi, website, atau email. Tanggal pembaruan terakhir tercantum di bagian atas halaman.</p>
              </section>
              <section id="kontak" className="rounded-2xl border border-[#D9CCAD] bg-white p-6 sm:p-8">
                <h2 className="mb-3 text-2xl font-semibold text-[#06152B]">9. Hubungi kami</h2>
                <address className="space-y-1 not-italic">
                  <p className="font-semibold text-[#06152B]">PT Jaris Ammar Madani</p>
                  <p>Jl. Cibangkong No. 28A Gatot Subroto, Bandung 40273</p>
                  <p>Email: <a className="font-semibold text-[#12305A] underline" href="mailto:jamwisata99@gmail.com">jamwisata99@gmail.com</a></p>
                  <p>WhatsApp: <a className="font-semibold text-[#12305A] underline" href="https://wa.me/6281809627499">+62 818-0962-7499</a></p>
                </address>
              </section>
            </article>
          </div>
        </div>
      </main>
      <ModernProofFooter />
    </>
  );
}
