import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { WhatsAppConcierge } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/WhatsAppConcierge";
import { formatIDR, whatsappHref } from "@/data/jamwisata";
import { getPublishedPackages } from "@/lib/cms/public";
import { resolveAbsoluteImageUrl, SITE_URL } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

function HotelStarBadge({ value }: { value?: number }) {
  if (!value) return null;
  const stars = "★★★★★".slice(0, Math.min(Math.max(value, 1), 5));
  return <span className="ml-1.5 inline-flex align-baseline text-[11px] font-bold tracking-[0.08em] text-[#F5D97A]" aria-label={`hotel bintang ${value}`}>{stars}</span>;
}

export async function generateStaticParams() {
  const umrahPackages = await getPublishedPackages();
  return umrahPackages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const umrahPackages = await getPublishedPackages();
  const pkg = umrahPackages.find((p) => p.slug === slug);

  if (!pkg) {
    return {
      title: "Paket Tidak Ditemukan",
    };
  }

  const title = `Paket ${pkg.name} (${pkg.departureDate}) | Jam Wisata`;
  const description = `Paket ${pkg.name} Jam Wisata berangkat ${pkg.departureDate} via ${pkg.airline}. Hotel Makkah: ${pkg.makkahHotel?.name}, Hotel Madinah: ${pkg.madinahHotel?.name}. Harga All In Rp ${formatIDR(pkg.priceFrom ?? 0)} /pax.`;
  const imageUrl = resolveAbsoluteImageUrl(pkg.image);

  return {
    title,
    description,
    alternates: {
      canonical: `/paket-umroh/${pkg.slug}`,
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
      title,
      description,
      url: `${SITE_URL}/paket-umroh/${pkg.slug}`,
      siteName: "Jam Wisata",
      locale: "id_ID",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Foto Paket ${pkg.name} Jam Wisata`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const umrahPackages = await getPublishedPackages();
  const pkg = umrahPackages.find((p) => p.slug === slug);

  if (!pkg) {
    notFound();
  }

  const touristTripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `Paket ${pkg.name} — Jam Wisata`,
    description: `Paket perjalanan ibadah umroh ${pkg.name} bersama Jam Wisata keberangkatan ${pkg.departureDate}. Maskapai: ${pkg.airline}, Hotel Makkah: ${pkg.makkahHotel?.name}, Hotel Madinah: ${pkg.madinahHotel?.name}.`,
    touristType: ["Muslim", "Jamaah Umroh"],
    provider: {
      "@type": "TravelAgency",
      name: "Jam Wisata",
      url: "https://jamwisata.id",
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
    offers: {
      "@type": "Offer",
      price: pkg.priceFrom,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      url: `https://jamwisata.id/paket-umroh/${pkg.slug}`,
      validFrom: "2026-01-01",
    },
    itinerary: pkg.itinerary?.map((item) => ({
      "@type": "Day",
      name: `Hari ${item.day}: ${item.title}`,
      description: item.description,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        name: "Paket Umroh",
        item: "https://jamwisata.id/paket-umroh",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pkg.name,
        item: `https://jamwisata.id/paket-umroh/${pkg.slug}`,
      },
    ],
  };

  return (
    <main className="jam-page min-h-screen bg-white text-[#333333]">
      <JsonLd schema={[touristTripSchema, breadcrumbSchema]} />
      <PremiumHeader />

      {/* Hero Header */}
      <section className="relative isolate overflow-hidden bg-[#021224] text-white pt-32 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 border-b border-[#D5A12B]/30">
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021224] via-[#021224]/85 to-[#021224]/90" />

        <div className="jam-container relative z-10">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#E8C967] transition">
              <ArrowLeft className="size-3.5" /> Beranda
            </Link>
            <span className="text-[#D5A12B]">/</span>
            <Link href="/paket-umroh" className="hover:text-[#E8C967] transition">
              Paket Umroh
            </Link>
            <span className="text-[#D5A12B]">/</span>
            <span className="text-white font-bold">{pkg.name}</span>
          </nav>

          <div className="max-w-[800px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A12B]/40 bg-[#061A2F]/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#F5D97A] backdrop-blur-md ring-1 ring-[#D5A12B]/20">
              <Sparkles className="size-3.5 text-[#E8C967]" /> {pkg.badge ?? "Quad All In"}
            </span>

            <h1 className="mt-4 font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Paket {pkg.name}
            </h1>

            <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl italic text-[#F5D97A]">
              Keberangkatan: {pkg.departureDate} — Bersama {pkg.airline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Specs Grid */}
      <section className="bg-slate-50 py-12 sm:py-16 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Direct AEO Fact Box */}
              <div className="rounded-2xl border border-[#D5A12B]/30 bg-white p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B]">
                  <Sparkles className="size-4 text-[#D5A12B]" />
                  <span>Fakta Program Perjalanan</span>
                </div>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#061A2F]">
                  Program <strong>{pkg.name}</strong> Jam Wisata dijadwalkan berangkat pada <strong>{pkg.departureDate}</strong> melalui <strong>{pkg.departureAirport}</strong> dengan maskapai <strong>{pkg.airline}</strong>. Fasilitas akomodasi meliputi hotel <strong>{pkg.makkahHotel?.name}</strong> ({pkg.makkahHotel?.distance}) di Makkah dan <strong>{pkg.madinahHotel?.name}</strong> ({pkg.madinahHotel?.distance}) di Madinah. Harga paket All In mulai dari <strong>Rp {formatIDR(pkg.priceFrom ?? 0)} /pax</strong>.
                </p>
              </div>

              {/* Highlights */}
              {pkg.highlights && (
                <div className="rounded-2xl border border-[#061A2F]/10 bg-white p-6 sm:p-7 shadow-xs">
                  <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#061A2F]">
                    Highlight Keunggulan Paket
                  </h2>
                  <div className="mt-4 grid sm:grid-cols-2 gap-3">
                    {pkg.highlights.map((item) => (
                      <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#59616D]">
                        <CheckCircle2 className="size-4.5 text-[#D5A12B] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary Timeline */}
              {pkg.itinerary && (
                <div className="rounded-2xl border border-[#061A2F]/10 bg-white p-6 sm:p-7 shadow-xs">
                  <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#061A2F]">
                    Rencana Perjalanan (Itinerary {pkg.durationDays} Hari)
                  </h2>
                  <div className="mt-6 space-y-4">
                    {pkg.itinerary.map((day) => (
                      <div
                        key={day.day}
                        className="relative pl-7 pb-4 last:pb-0 border-l-2 border-[#D5A12B]/30"
                      >
                        <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-[#061A2F] border-2 border-[#D5A12B]" />
                        <span className="text-[11px] font-extrabold text-[#D5A12B] uppercase tracking-wider">
                          Hari {day.day}
                        </span>
                        <h3 className="font-[family-name:var(--font-cinzel)] text-sm sm:text-base font-bold text-[#061A2F] mt-0.5">
                          {day.title}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#59616D]">
                          {day.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs">
                  <h3 className="font-[family-name:var(--font-cinzel)] text-base font-bold text-emerald-950 flex items-center gap-2">
                    <Check className="size-4.5 text-emerald-600" />
                    <span>Fasilitas Termasuk (All In)</span>
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-xs text-[#59616D]">
                    {pkg.includes?.map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-xs">
                  <h3 className="font-[family-name:var(--font-cinzel)] text-base font-bold text-rose-950 flex items-center gap-2">
                    <X className="size-4.5 text-rose-500" />
                    <span>Tidak Termasuk</span>
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-xs text-[#59616D]">
                    {pkg.excludes?.map((exc) => (
                      <li key={exc} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Terms & Conditions */}
              {pkg.terms && (
                <div className="rounded-2xl border border-[#061A2F]/10 bg-white p-6 shadow-xs">
                  <h3 className="font-[family-name:var(--font-cinzel)] text-base font-bold text-[#061A2F] flex items-center gap-2">
                    <FileText className="size-4 text-[#D5A12B]" />
                    <span>Syarat &amp; Dokumen Pendaftaran</span>
                  </h3>
                  <ul className="mt-4 space-y-2 text-xs sm:text-sm text-[#59616D]">
                    {pkg.terms.map((term) => (
                      <li key={term} className="flex items-start gap-2">
                        <span className="text-[#D5A12B] font-bold">✓</span>
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Sticky Sidebar */}
            <aside className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="rounded-2xl border border-[#D5A12B]/40 bg-[#061A2F] text-white p-6 sm:p-7 shadow-xl">
                <span className="text-xs font-bold text-slate-300">Harga Paket All In</span>
                <div className="mt-1">
                  <span className="font-[family-name:var(--font-cinzel)] text-3xl font-extrabold text-[#F5D97A]">
                    Rp {formatIDR(pkg.priceFrom ?? 0)}
                  </span>
                  <span className="text-xs text-slate-300 ml-1">/ jamaah</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-300">
                  Tipe kamar: <strong>Quad All In</strong> (Tersedia upgrade Triple &amp; Double)
                </p>

                <div className="mt-6 pt-5 border-t border-white/10 space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Durasi</span>
                    <span className="font-semibold text-white">{pkg.durationDays} Hari</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Keberangkatan</span>
                    <span className="font-semibold text-white">{pkg.departureDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Maskapai</span>
                    <span className="font-semibold text-white">{pkg.airline}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Hotel Makkah</span>
                    <span className="font-semibold text-white">{pkg.makkahHotel?.name}<HotelStarBadge value={pkg.makkahHotel?.star} /></span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Hotel Madinah</span>
                    <span className="font-semibold text-white">{pkg.madinahHotel?.name}<HotelStarBadge value={pkg.madinahHotel?.star} /></span>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <a
                    href={whatsappHref(pkg.whatsappMessage, `Paket Detail — ${pkg.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lift-soft sheen-gold flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold-rich text-xs font-extrabold uppercase tracking-wider text-[#061A2F] shadow-lg transition hover:scale-105"
                  >
                    <MessageCircle className="size-4" />
                    <span>Konsultasi WhatsApp</span>
                  </a>

                  {pkg.detailUrl && (
                    <a
                      href={pkg.detailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 text-xs font-bold text-white hover:border-[#D5A12B] hover:bg-white/5 transition"
                    >
                      <span>Booking di Portal Resmi</span>
                      <ChevronRight className="size-3.5 text-[#D5A12B]" />
                    </a>
                  )}
                </div>
              </div>

              {/* Trust Box */}
              <div className="rounded-2xl border border-[#061A2F]/10 bg-white p-5 shadow-xs text-xs text-[#59616D] space-y-3">
                <div className="flex items-center gap-2.5 font-bold text-[#061A2F]">
                  <ShieldCheck className="size-4.5 text-[#D5A12B]" />
                  <span>Jaminan Amanah &amp; Berizin Resmi</span>
                </div>
                <p>
                  Jam Wisata Brand of Fajar Indah Gemilang <strong className="text-[#061A2F]">PPIU Nomor 534 Tahun 2019</strong> menyelenggarakan perjalanan ibadah umroh berizin resmi sesuai regulasi Kementerian Haji dan Umrah RI.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <Link href="/legalitas" className="font-bold text-[#D5A12B] hover:underline">
                    Cek Legalitas &amp; PPIU →
                  </Link>
                  <Link href="/travel-umroh-bandung" className="font-bold text-[#061A2F] hover:underline">
                    Kantor Bandung →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ModernProofFooter />
      <WhatsAppConcierge />
    </main>
  );
}
