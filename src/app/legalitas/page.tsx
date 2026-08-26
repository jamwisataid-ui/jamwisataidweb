import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { WhatsAppConcierge } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/WhatsAppConcierge";
import { whatsappHref } from "@/data/jamwisata";
import { defaultOpenGraphImages, defaultTwitterImages, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Legalitas & Izin PPIU Resmi Travel Umroh | Jam Wisata",
  description:
    "Jam Wisata Brand of Fajar Indah Gemilang PPIU Nomor 534 Tahun 2019 menyelenggarakan perjalanan ibadah umroh amanah, nyaman, dan berlandaskan sunnah.",
  alternates: {
    canonical: "/legalitas",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "Legalitas & Izin PPIU Resmi Travel Umroh | Jam Wisata",
    description:
      "Jam Wisata Brand of Fajar Indah Gemilang PPIU Nomor 534 Tahun 2019 menyelenggarakan perjalanan ibadah umroh amanah, nyaman, dan berlandaskan sunnah.",
    url: `${SITE_URL}/legalitas`,
    siteName: "Jam Wisata",
    locale: "id_ID",
    type: "website",
    images: defaultOpenGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "Legalitas & Izin PPIU Resmi Travel Umroh | Jam Wisata",
    description:
      "Jam Wisata Brand of Fajar Indah Gemilang PPIU Nomor 534 Tahun 2019 menyelenggarakan perjalanan ibadah umroh amanah, nyaman, dan berlandaskan sunnah.",
    images: defaultTwitterImages,
  },
};

const legalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      name: "Jam Wisata",
      alternateName: ["Fajar Indah Gemilang", "PPIU Nomor 534 Tahun 2019"],
      url: "https://jamwisata.id/legalitas",
      description: "Jam Wisata Brand of Fajar Indah Gemilang PPIU Nomor 534 Tahun 2019 menyelenggarakan perjalanan ibadah umroh.",
      telephone: "+6281809627499",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Cibangkong No. 28A Gatot Subroto",
        addressLocality: "Bandung",
        addressRegion: "Jawa Barat",
        postalCode: "40273",
        addressCountry: "ID",
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
          name: "Legalitas & PPIU",
          item: "https://jamwisata.id/legalitas",
        },
      ],
    },
  ],
};

export default function LegalitasPage() {
  return (
    <main className="jam-page min-h-screen bg-white text-[#333333]">
      <JsonLd schema={legalSchema} />
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
            <span className="text-white font-bold">Legalitas &amp; PPIU</span>
          </nav>

          <div className="max-w-[820px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A12B]/40 bg-[#061A2F]/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#F5D97A] backdrop-blur-md ring-1 ring-[#D5A12B]/20">
              <ShieldCheck className="size-3.5 text-[#E8C967]" /> Transparansi &amp; Kepatuhan Regulasi
            </span>

            <h1 className="mt-4 font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Legalitas Resmi &amp; Izin Penyelenggara Umroh (PPIU)
            </h1>

            <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl italic text-[#F5D97A]">
              Komitmen Perlindungan Jamaah dan Kepatuhan Penuh Terhadap Regulator Resmi
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
              <span>Fakta Legalitas Jam Wisata</span>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#061A2F] font-medium">
              Jam Wisata Brand of Fajar Indah Gemilang <strong>PPIU Nomor 534 Tahun 2019</strong> menyelenggarakan perjalanan ibadah umroh berlandaskan kepatuhan penuh terhadap ketentuan resmi Kementerian Haji dan Umrah Republik Indonesia. Seluruh proses pendaftaran, penerbitan visa, reservasi tiket maskapai, serta akomodasi hotel di Arab Saudi mematuhi standar operasional terpercaya untuk menjamin keamanan dan kenyamanan ibadah jamaah.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Data Grid */}
      <section className="bg-white py-16 sm:py-20 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#061A2F]">
                Kredensial &amp; Dokumen Perizinan
              </h2>
              <p className="text-xs sm:text-sm text-[#59616D] leading-relaxed">
                Menjaga amanah jamaah adalah prioritas tertinggi Jam Wisata. Kami memastikan seluruh operasional ibadah memiliki legalitas yang kuat, transparan, dan dapat dipertanggungjawabkan.
              </p>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                  <span className="text-[11px] font-extrabold text-[#D5A12B] uppercase tracking-wider">Izin Penyelenggara Umroh</span>
                  <h3 className="mt-1 font-bold text-sm sm:text-base text-[#061A2F]">
                    Jam Wisata Brand of Fajar Indah Gemilang
                  </h3>
                  <p className="mt-1.5 text-xs text-[#59616D]">
                    Nomor Izin Operasional: <strong>PPIU Nomor 534 Tahun 2019</strong>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                  <span className="text-[11px] font-extrabold text-[#D5A12B] uppercase tracking-wider">Regulator Resmi</span>
                  <h3 className="mt-1 font-bold text-sm sm:text-base text-[#061A2F]">
                    Kementerian Haji dan Umrah Republik Indonesia (Kemenhaj RI)
                  </h3>
                  <p className="mt-1 text-xs text-[#59616D]">
                    Regulator resmi penyelenggaraan ibadah haji dan umrah di Indonesia yang memastikan kepatuhan standar pelayanan dan perlindungan hukum bagi jamaah.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                  <span className="text-[11px] font-extrabold text-[#D5A12B] uppercase tracking-wider">Kantor Operasional Terverifikasi</span>
                  <h3 className="mt-1 font-bold text-sm sm:text-base text-[#061A2F]">
                    Jl. Cibangkong No. 28A Gatot Subroto, Bandung 40273
                  </h3>
                  <p className="mt-1 text-xs text-[#59616D]">
                    Kantor fisik aktif yang dapat dikunjungi jamaah untuk verifikasi dokumen, konsultasi langsung, dan bimbingan manasik.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                  <span className="text-[11px] font-extrabold text-[#D5A12B] uppercase tracking-wider">Prinsip 5 Pasti Umrah</span>
                  <ul className="mt-2 space-y-1.5 text-xs text-[#59616D]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-[#D5A12B]" /> 1. Pasti Travelnya Berizin (PPIU No. 534 Th. 2019)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-[#D5A12B]" /> 2. Pasti Jadwal &amp; Tiket Pesawatnya
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-[#D5A12B]" /> 3. Pasti Terbangnya &amp; Maskapainya
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-[#D5A12B]" /> 4. Pasti Hotel &amp; Akomodasinya
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-[#D5A12B]" /> 5. Pasti Visanya
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How to Check Travel Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-[#D5A12B]/40 bg-[#061A2F] text-white p-6 sm:p-7 shadow-xl">
                <div className="flex items-center gap-2.5 text-[#F5D97A]">
                  <Scale className="size-5" />
                  <h3 className="font-[family-name:var(--font-cinzel)] text-lg font-bold">
                    Cara Cek Izin PPIU Travel Umroh
                  </h3>
                </div>
                <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                  Calon jamaah sangat disarankan melakukan pengecekan mandiri sebelum mendaftar ke biro travel manapun:
                </p>

                <ol className="mt-4 space-y-3 text-xs text-slate-200">
                  <li className="flex gap-2">
                    <span className="font-bold text-[#F5D97A]">1.</span>
                    <span>Buka aplikasi atau portal resmi SatuHaji / Kementerian Haji dan Umrah RI.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#F5D97A]">2.</span>
                    <span>Pilih menu Daftar PPIU (Penyelenggara Perjalanan Ibadah Umrah).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#F5D97A]">3.</span>
                    <span>Ketik <strong>Fajar Indah Gemilang</strong> atau cari <strong>PPIU Nomor 534 Tahun 2019</strong> untuk memastikan status izin aktif dan terdaftar resmi.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#F5D97A]">4.</span>
                    <span>Pastikan rekening pembayaran adalah rekening giro resmi perusahaan, bukan rekening pribadi.</span>
                  </li>
                </ol>

                <div className="mt-6 pt-5 border-t border-white/10">
                  <a
                    href={whatsappHref("Assalamu’alaikum, saya ingin memverifikasi legalitas dan izin paket umroh Jam Wisata.", "Legalitas Page")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lift-soft sheen-gold flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold-rich text-xs font-extrabold uppercase tracking-wider text-[#061A2F] shadow-lg transition hover:scale-105"
                  >
                    <MessageCircle className="size-4" />
                    <span>Verifikasi Via WhatsApp</span>
                  </a>
                </div>
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
