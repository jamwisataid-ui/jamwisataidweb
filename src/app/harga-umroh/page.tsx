import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { WhatsAppConcierge } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/WhatsAppConcierge";
import { formatIDR, whatsappHref } from "@/data/jamwisata";
import { getPublishedPackages } from "@/lib/cms/public";
import { defaultOpenGraphImages, defaultTwitterImages, SITE_URL } from "@/lib/seo";

function HotelStarBadge({ value }: { value?: number }) {
  if (!value) return null;
  const stars = "★★★★★".slice(0, Math.min(Math.max(value, 1), 5));
  return <span className="ml-1 inline-flex align-baseline text-[10px] font-bold tracking-[0.08em] text-[#D5A12B]" aria-label={`hotel bintang ${value}`}>{stars}</span>;
}

export const metadata: Metadata = {
  title: "Biaya & Harga Paket Umroh 2026 – 2027 All In | Jam Wisata",
  description:
    "Rincian harga paket umroh 2026–2027 Jam Wisata mulai Rp33.900.000 (All In). Tanpa biaya tersembunyi, mencakup tiket, visa, hotel dekat masjid, dan manasik.",
  alternates: {
    canonical: "/harga-umroh",
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
    title: "Biaya & Harga Paket Umroh 2026 – 2027 All In | Jam Wisata",
    description:
      "Transparansi biaya umroh 2026–2027. Perbedaan harga kamar Quad, Triple, Double dan rincian fasilitas All In tanpa biaya siluman.",
    url: `${SITE_URL}/harga-umroh`,
    siteName: "Jam Wisata",
    locale: "id_ID",
    type: "website",
    images: defaultOpenGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "Biaya & Harga Paket Umroh 2026 – 2027 All In | Jam Wisata",
    description:
      "Transparansi biaya umroh 2026–2027. Perbedaan harga kamar Quad, Triple, Double dan rincian fasilitas All In tanpa biaya siluman.",
    images: defaultTwitterImages,
  },
};

const hargaSchema = {
  "@context": "https://schema.org",
  "@graph": [
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
          name: "Harga Umroh",
          item: "https://jamwisata.id/harga-umroh",
        },
      ],
    },
  ],
};

const hargaFaqs = [
  {
    q: "Berapa biaya umroh Jam Wisata 2026–2027?",
    a: "Biaya paket umroh Jam Wisata mulai Rp 33.900.000 untuk paket Umroh 9 Hari (Qatar Airways), Rp 36.900.000 untuk Umroh 12 Hari + Turki (Saudia), dan Rp 35.900.000 untuk Umroh Bintang 5 Eksklusif (Garuda Indonesia).",
  },
  {
    q: "Apa yang membedakan tipe kamar Quad, Triple, dan Double?",
    a: "Kamar Quad diisi 4 orang per kamar (harga paket standar All In). Kamar Triple diisi 3 orang, dan kamar Double diisi 2 orang (cocok untuk pasangan/suami-istri) dengan biaya upgrade per jamaah sesuai ketentuan hotel.",
  },
  {
    q: "Apakah ada biaya tambahan di luar harga paket?",
    a: "Tidak ada biaya tersembunyi dari Jam Wisata. Biaya pribadi yang tidak termasuk hanyalah pembuatan paspor pribadi, buku kuning vaksin (bila dipersyaratkan), serta keperluan belanja/laundry pribadi selama di Tanah Suci.",
  },
];

export default async function HargaUmrohPage() {
  const umrahPackages = await getPublishedPackages();
  const displayedPackages = umrahPackages.slice(0, 10);
  return (
    <main className="jam-page min-h-screen bg-white text-[#333333]">
      <JsonLd schema={hargaSchema} />
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
            <span className="text-white font-bold">Harga Umroh</span>
          </nav>

          <div className="max-w-[820px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A12B]/40 bg-[#061A2F]/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#F5D97A] backdrop-blur-md ring-1 ring-[#D5A12B]/20">
              <ShieldCheck className="size-3.5 text-[#E8C967]" /> Transparansi Tanpa Biaya Tersembunyi
            </span>

            <h1 className="mt-4 font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Biaya &amp; Harga Paket Umroh 2026 – 2027
            </h1>

            <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl italic text-[#F5D97A]">
              Sistem Harga All In: Jelas, Transparan, dan Sesuai Kualitas Pelayanan
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
              <span>Fakta Biaya Paket Umroh</span>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#061A2F] font-medium">
              Harga paket umroh Jam Wisata 2026–2027 berkisar antara <strong>Rp 33.900.000 hingga Rp 36.900.000</strong> untuk tipe kamar Quad All In. Seluruh komponen penting (tiket pesawat PP, visa, hotel, makan 3x sehari, manasik, bus eksekutif, dan perlengkapan) telah termasuk di dalam harga.
            </p>
          </div>
        </div>
      </section>

      {/* Packages Pricing Cards */}
      <section className="bg-white py-16 sm:py-20 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl border border-[#061A2F]/12 bg-white p-6 sm:p-7 shadow-xs hover:border-[#D5A12B]/40 hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-extrabold text-[#D5A12B] uppercase tracking-wider">
                    {pkg.badge ?? "Quad All In"}
                  </span>
                  <h2 className="mt-2 font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#061A2F]">
                    {pkg.name}
                  </h2>
                  <p className="mt-1 text-xs text-[#59616D]">
                    {pkg.durationDays} Hari — Berangkat {pkg.departureDate}
                  </p>

                  <div className="mt-5 py-4 border-y border-slate-100">
                    <span className="text-xs text-slate-500 font-medium block">Harga All In</span>
                    <span className="font-[family-name:var(--font-cinzel)] text-2xl font-extrabold text-[#061A2F]">
                      Rp {formatIDR(pkg.priceFrom ?? 0)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ jamaah</span>
                  </div>

                  <ul className="mt-5 space-y-2 text-xs text-[#59616D]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-[#D5A12B]" /> Maskapai: {pkg.airline}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-[#D5A12B]" /> Makkah: {pkg.makkahHotel?.name}<HotelStarBadge value={pkg.makkahHotel?.star} />
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-[#D5A12B]" /> Madinah: {pkg.madinahHotel?.name}<HotelStarBadge value={pkg.madinahHotel?.star} />
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-[#D5A12B]" /> Bimbingan Manasik Intensif
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <Link
                    href={`/paket-umroh/${pkg.slug}`}
                    className="flex h-10 items-center justify-center rounded-lg border border-[#061A2F]/20 text-xs font-bold text-[#061A2F] hover:bg-slate-50 transition"
                  >
                    Detail Paket
                  </Link>
                  <a
                    href={whatsappHref(
                      `Assalamu’alaikum, saya ingin konsultasi rincian biaya ${pkg.name}.`,
                      `Harga Page — ${pkg.name}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-gradient-gold-rich text-xs font-bold text-[#061A2F] shadow-xs hover:scale-105 transition"
                  >
                    <MessageCircle className="size-3.5" />
                    <span>Konsultasi</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="bg-slate-50 py-16 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl font-bold text-[#061A2F]">
              Tanya Jawab Seputar Biaya Umroh
            </h2>
          </div>

          <div className="mt-10 mx-auto max-w-[800px] space-y-4">
            {hargaFaqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-[#061A2F]/10 bg-white p-6 shadow-xs"
              >
                <h3 className="font-[family-name:var(--font-cinzel)] text-base font-bold text-[#061A2F] flex items-center gap-2.5">
                  <HelpCircle className="size-4.5 text-[#D5A12B] shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#59616D] pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ModernProofFooter />
      <WhatsAppConcierge />
    </main>
  );
}
