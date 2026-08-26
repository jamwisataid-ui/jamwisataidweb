import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { WhatsAppConcierge } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/WhatsAppConcierge";
import { formatIDR, whatsappHref } from "@/data/jamwisata";
import { getPublishedPackages } from "@/lib/cms/public";
import type { TravelPackage } from "@/types/jamwisata";
import { defaultOpenGraphImages, defaultTwitterImages, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Jadwal Keberangkatan Umroh 2026 – 2027 | Jam Wisata",
  description:
    "Jadwal pasti keberangkatan umroh 2026–2027 Jam Wisata. Program 9 hari, 12 hari plus Turki, dan paket bintang 5. Tiket confirmed, seat terbatas.",
  alternates: {
    canonical: "/jadwal-umroh",
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
    title: "Jadwal Keberangkatan Umroh 2026 – 2027 | Jam Wisata",
    description:
      "Informasi tanggal pasti keberangkatan umroh musim 2026–2027 bersama Jam Wisata Bandung. Cek sisa kuota dan jadwal manasik.",
    url: `${SITE_URL}/jadwal-umroh`,
    siteName: "Jam Wisata",
    locale: "id_ID",
    type: "website",
    images: defaultOpenGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "Jadwal Keberangkatan Umroh 2026 – 2027 | Jam Wisata",
    description:
      "Informasi tanggal pasti keberangkatan umroh musim 2026–2027 bersama Jam Wisata Bandung. Cek sisa kuota dan jadwal manasik.",
    images: defaultTwitterImages,
  },
};

const jadwalSchema = (umrahPackages: TravelPackage[]) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Jadwal Keberangkatan Umroh Jam Wisata",
      itemListElement: umrahPackages.map((pkg, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${pkg.name} — ${pkg.departureDate}`,
        url: `https://jamwisata.id/paket-umroh/${pkg.slug}`,
      })),
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
          name: "Jadwal Umroh",
          item: "https://jamwisata.id/jadwal-umroh",
        },
      ],
    },
  ],
});

export default async function JadwalUmrohPage() {
  const umrahPackages = await getPublishedPackages();
  return (
    <main className="jam-page min-h-screen bg-white text-[#333333]">
      <JsonLd schema={jadwalSchema(umrahPackages)} />
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
            <span className="text-white font-bold">Jadwal Umroh</span>
          </nav>

          <div className="max-w-[820px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A12B]/40 bg-[#061A2F]/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#F5D97A] backdrop-blur-md ring-1 ring-[#D5A12B]/20">
              <Calendar className="size-3.5 text-[#E8C967]" /> Kepastian Tanggal Keberangkatan
            </span>

            <h1 className="mt-4 font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Jadwal Keberangkatan Umroh 2026 – 2027
            </h1>

            <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl italic text-[#F5D97A]">
              Jadwal Terencana, Tiket Confirmed, dan Fasilitas Akomodasi Nyaman
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
              <span>Ringkasan Jadwal Terdekat</span>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#061A2F] font-medium">
              Jadwal umroh terdekat Jam Wisata adalah: <strong>10 Oktober 2026</strong> (Umroh 9 Hari via Qatar Airways), <strong>8 Desember 2026</strong> (Umroh 12 Hari + Turki via Saudia), dan <strong>20 Januari 2027</strong> (Umroh Bintang 5 via Garuda Indonesia). Seluruh jadwal berangkat dari Bandara Soekarno-Hatta (CGK).
            </p>
          </div>
        </div>
      </section>

      {/* Schedule Table & Cards */}
      <section className="bg-white py-16 sm:py-20 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="space-y-6">
            {umrahPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-[#061A2F]/12 bg-white p-6 sm:p-7 shadow-xs hover:border-[#D5A12B]/40 hover:shadow-md transition"
              >
                <div className="space-y-2 max-w-[500px]">
                  <div className="inline-flex items-center gap-2 rounded-md bg-[#061A2F] px-2.5 py-1 text-xs font-bold text-[#F5D97A]">
                    <Calendar className="size-3.5 text-[#D5A12B]" />
                    <span>{pkg.departureDate}</span>
                  </div>
                  <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#061A2F]">
                    {pkg.name} ({pkg.durationDays} Hari)
                  </h2>
                  <p className="text-xs text-[#59616D]">
                    Maskapai: <strong>{pkg.airline}</strong> | Hotel Makkah: <strong>{pkg.makkahHotel?.name}</strong> | Hotel Madinah: <strong>{pkg.madinahHotel?.name}</strong>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500 font-medium block">Harga All In</span>
                    <span className="text-xl font-extrabold text-[#061A2F]">
                      Rp {formatIDR(pkg.priceFrom ?? 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/paket-umroh/${pkg.slug}`}
                      className="flex h-11 items-center justify-center rounded-xl border border-[#061A2F]/20 px-4 text-xs font-bold text-[#061A2F] hover:bg-slate-50 transition"
                    >
                      Detail
                    </Link>
                    <a
                      href={whatsappHref(
                        `Assalamu’alaikum, saya ingin reservasi seat untuk jadwal keberangkatan ${pkg.departureDate} (${pkg.name}).`,
                        `Jadwal Page — ${pkg.name}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-gold-rich px-5 text-xs font-bold text-[#061A2F] shadow-sm hover:scale-105 transition"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>Booking Seat</span>
                    </a>
                  </div>
                </div>
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
