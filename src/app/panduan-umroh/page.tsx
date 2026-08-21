import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Luggage,
  Sparkles,
} from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { WhatsAppConcierge } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/WhatsAppConcierge";

export const metadata: Metadata = {
  title: "Panduan, Syarat & Tata Cara Umroh Sesuai Sunnah | Jam Wisata",
  description:
    "Panduan lengkap ibadah umroh berlandaskan sunnah: syarat dokumen 2026–2027, rukun dan wajib umroh, checklist perlengkapan, dan tips umroh pertama kali.",
  alternates: {
    canonical: "/panduan-umroh",
  },
  openGraph: {
    title: "Panduan, Syarat & Tata Cara Umroh Sesuai Sunnah | Jam Wisata",
    description:
      "Pelajari tata cara ibadah umroh yang benar sesuai tuntunan Rasulullah ﷺ, rukun, wajib, larangan ihram, dan checklist perlengkapan jamaah.",
    url: "https://jamwisata.id/panduan-umroh",
    siteName: "Jam Wisata",
    locale: "id_ID",
    type: "website",
  },
};

const panduanSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Panduan Lengkap Syarat & Tata Cara Ibadah Umroh Sesuai Sunnah",
      description: "Panduan komprehensif tata cara ibadah umroh, rukun, wajib, syarat dokumen, dan checklist perlengkapan.",
      publisher: {
        "@type": "Organization",
        name: "Jam Wisata",
        url: "https://jamwisata.id",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: "https://jamwisata.id",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Panduan Umroh",
          item: "https://jamwisata.id/panduan-umroh",
        },
      ],
    },
  ],
};

export default function PanduanUmrohPage() {
  return (
    <main className="jam-page min-h-screen bg-white text-[#333333]">
      <JsonLd schema={panduanSchema} />
      <PremiumHeader />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#021224] text-white pt-32 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 border-b border-[#D5A12B]/30">
        <div className="absolute inset-0 bg-gradient-to-t from-[#021224] via-[#021224]/90 to-[#021224]/95" />
        <div className="jam-container relative z-10">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#E8C967] transition">
              <ArrowLeft className="size-3.5" /> Beranda
            </Link>
            <span className="text-[#D5A12B]">/</span>
            <span className="text-white font-bold">Panduan Ibadah</span>
          </nav>

          <div className="max-w-[820px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A12B]/40 bg-[#061A2F]/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#F5D97A] backdrop-blur-md ring-1 ring-[#D5A12B]/20">
              <BookOpen className="size-3.5 text-[#E8C967]" /> Bimbingan Ibadah Sesuai Sunnah
            </span>

            <h1 className="mt-4 font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Panduan, Syarat &amp; Tata Cara Ibadah Umroh
            </h1>

            <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl italic text-[#F5D97A]">
              Menuju Umroh yang Mabrur Sesuai Tuntunan Rasulullah ﷺ
            </p>
          </div>
        </div>
      </section>

      {/* AEO Fact Card */}
      <section className="bg-slate-50 py-10 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="rounded-2xl border border-[#D5A12B]/30 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B]">
              <Sparkles className="size-4 text-[#D5A12B]" />
              <span>Ringkasan Ibadah Umroh</span>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#061A2F] font-medium">
              Ibadah Umroh terdiri atas <strong>4 Rukun Utama</strong> (Ihram &amp; Niat dari Miqat, Thawaf 7 putaran, Sa&apos;i 7 putaran, dan Tahallul) serta <strong>2 Wajib Umroh</strong> (Berihram dari Miqat dan Menjauhi larangan-larangan ihram). Jam Wisata memberikan bimbingan manasik intensif sebelum dan selama di Tanah Suci agar ibadah terlaksana dengan sempurna.
            </p>
          </div>
        </div>
      </section>

      {/* Content Pillars Grid */}
      <section className="bg-white py-16 sm:py-20 border-b border-[#061A2F]/8">
        <div className="jam-container space-y-12">
          {/* Rukun & Wajib Umroh */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-[#061A2F]/12 bg-white p-6 sm:p-8 shadow-xs">
              <span className="text-[11px] font-extrabold text-[#D5A12B] uppercase tracking-wider">Syariat Ibadah</span>
              <h2 className="mt-2 font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#061A2F]">
                4 Rukun Umroh (Wajib Dikerjakan, Tidak Boleh Diganti Dam)
              </h2>
              <ol className="mt-5 space-y-3.5 text-xs sm:text-sm text-[#59616D]">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#D5A12B] text-base">1.</span>
                  <div>
                    <strong className="text-[#061A2F] block">Ihram &amp; Niat dari Miqat:</strong>
                    Mengenakan pakaian ihram dan berniat umroh di miqat yang telah ditentukan (seperti Bir Ali atau Yalamlam).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#D5A12B] text-base">2.</span>
                  <div>
                    <strong className="text-[#061A2F] block">Thawaf di Ka&apos;bah:</strong>
                    Mengelilingi Ka&apos;bah sebanyak 7 putaran dengan posisi Ka&apos;bah berada di sebelah kiri, dimulai dari Hajar Aswad.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#D5A12B] text-base">3.</span>
                  <div>
                    <strong className="text-[#061A2F] block">Sa&apos;i Shafa &amp; Marwah:</strong>
                    Berjalan sebanyak 7 kali bolak-balik antara Bukit Shafa dan Bukit Marwah, dimulai dari Shafa dan berakhir di Marwah.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#D5A12B] text-base">4.</span>
                  <div>
                    <strong className="text-[#061A2F] block">Tahallul (Gunting Rambut):</strong>
                    Mencukur atau memotong sebagian rambut kepala sebagai tanda selesainya rangkaian ibadah umroh.
                  </div>
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-[#061A2F]/12 bg-white p-6 sm:p-8 shadow-xs">
              <span className="text-[11px] font-extrabold text-[#D5A12B] uppercase tracking-wider">Persyaratan Resmi</span>
              <h2 className="mt-2 font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#061A2F]">
                Syarat &amp; Dokumen Umroh 2026–2027
              </h2>
              <ul className="mt-5 space-y-3 text-xs sm:text-sm text-[#59616D]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4.5 text-[#D5A12B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#061A2F]">Paspor Asli:</strong> Masa berlaku minimal 7 bulan sebelum tanggal keberangkatan dengan nama minimal 2 suku kata.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4.5 text-[#D5A12B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#061A2F]">KTP &amp; Kartu Keluarga:</strong> Fotokopi / scan berwarna dokumen kependudukan yang masih berlaku.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4.5 text-[#D5A12B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#061A2F]">Buku Nikah / Akta Lahir:</strong> Bagi pasangan suami istri atau anak yang berangkat bersama orang tua.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4.5 text-[#D5A12B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#061A2F]">Vaksinasi &amp; Kesehatan:</strong> Memenuhi standar regulasi kesehatan dari otoritas Arab Saudi dan Indonesia.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Checklist Perlengkapan */}
          <div className="rounded-2xl border border-[#061A2F]/12 bg-slate-50/70 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-[#061A2F]">
              <Luggage className="size-5 text-[#D5A12B]" />
              <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold">
                Checklist Perlengkapan yang Disediakan Jam Wisata
              </h2>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-[#59616D]">
              Setiap jamaah Jam Wisata mendapatkan paket perlengkapan ibadah premium lengkap tanpa biaya tambahan:
            </p>

            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <strong className="block text-[#061A2F]">Koper Fiber Eksekutif</strong>
                <span className="text-[#59616D] mt-1 block">Koper bagasi roda 4 kokoh &amp; tas kabin seragam</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <strong className="block text-[#061A2F]">Kain Ihram / Mukena</strong>
                <span className="text-[#59616D] mt-1 block">Bahan katun tebal berkualitas tinggi menyerap keringat</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <strong className="block text-[#061A2F]">Batik Seragam Resmi</strong>
                <span className="text-[#59616D] mt-1 block">Batik identitas jamaah Jam Wisata yang elegan</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <strong className="block text-[#061A2F]">Buku Doa &amp; Audio Receiver</strong>
                <span className="text-[#59616D] mt-1 block">Buku panduan saku &amp; earphone wireless selama tawaf/sa&apos;i</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ModernProofFooter />
      <WhatsAppConcierge />
    </main>
  );
}
