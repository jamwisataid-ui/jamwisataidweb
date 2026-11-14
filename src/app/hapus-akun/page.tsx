import type { Metadata } from "next";
import Link from "next/link";

import { AccountDeletionForm } from "@/components/account-deletion/AccountDeletionForm";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";

export const metadata: Metadata = {
  title: "Penghapusan Akun dan Data",
  description: "Ajukan penghapusan akun Jam Wisata dan data pribadi yang terkait dengan akun Anda.",
  alternates: { canonical: "/hapus-akun" },
  robots: { index: true, follow: true },
};

export default function DeleteAccountPage() {
  return (
    <>
      <PremiumHeader />
      <main className="min-h-screen bg-[#F8F6F0] pb-20 pt-32 text-[#223047] sm:pt-36">
        <div className="jam-container max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-9 text-sm text-[#667387]">
            <Link href="/" className="hover:text-[#12305A]">Beranda</Link> <span aria-hidden="true">/</span> Penghapusan Akun
          </nav>
          <div className="border-b border-[#D9CCAD] pb-9">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8C6708]">Privasi Jam Wisata</p>
            <h1 className="max-w-4xl font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-none text-[#06152B] sm:text-6xl">Permintaan Penghapusan Akun</h1>
            <p className="mt-5 max-w-3xl leading-7">Pemilik akun Jam Wisata dapat meminta akun dan data pribadinya dihapus. Halaman ini dapat digunakan tanpa masuk ke aplikasi.</p>
          </div>

          <div className="grid gap-10 py-10 lg:grid-cols-[1fr_440px] lg:items-start">
            <article className="space-y-8 leading-7">
              <section>
                <h2 className="text-2xl font-semibold text-[#06152B]">Data yang akan dihapus</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Profil akun dan data kontak yang tidak lagi diperlukan.</li>
                  <li>Kredensial masuk, token sesi, dan token notifikasi perangkat.</li>
                  <li>Dokumen pribadi yang Anda unggah, setelah verifikasi dan sepanjang tidak wajib dipertahankan oleh hukum.</li>
                  <li>Data preferensi aplikasi yang tersimpan pada layanan kami.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-[#06152B]">Data yang mungkin tetap disimpan</h2>
                <p className="mt-3">Catatan transaksi keuangan, invoice, bukti pembayaran, dan catatan keberangkatan yang sudah terlaksana dapat dipertahankan selama diwajibkan oleh ketentuan perpajakan, akuntansi, kearsipan, penyelesaian sengketa, atau kewajiban hukum lainnya. Data tersebut dibatasi penggunaannya hanya untuk kewajiban tersebut.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-[#06152B]">Tahapan dan waktu proses</h2>
                <ol className="mt-3 list-decimal space-y-2 pl-5">
                  <li>Kirim formulir dengan nomor WhatsApp yang terdaftar.</li>
                  <li>Tim Jam Wisata menghubungi Anda untuk memverifikasi identitas dan ruang lingkup permintaan.</li>
                  <li>Penghapusan diselesaikan paling lambat 30 hari kerja setelah identitas berhasil diverifikasi.</li>
                  <li>Konfirmasi penyelesaian dikirim melalui kontak terdaftar.</li>
                </ol>
              </section>
              <section className="rounded-2xl border border-[#D9CCAD] bg-white p-6">
                <h2 className="text-xl font-semibold text-[#06152B]">Butuh bantuan?</h2>
                <p className="mt-2">Email <a className="font-semibold text-[#12305A] underline" href="mailto:jamwisata99@gmail.com">jamwisata99@gmail.com</a> atau WhatsApp <a className="font-semibold text-[#12305A] underline" href="https://wa.me/6281809627499">+62 818-0962-7499</a>.</p>
              </section>
            </article>
            <AccountDeletionForm />
          </div>
        </div>
      </main>
      <ModernProofFooter />
    </>
  );
}
