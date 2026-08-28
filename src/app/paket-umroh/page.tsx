import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  HelpCircle,
  Hotel,
  MessageCircle,
  Plane,
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

function HotelStarBadge({ value }: { value?: number }) {
  if (!value) return null;
  const stars = "★★★★★".slice(0, Math.min(Math.max(value, 1), 5));
  return <span className="ml-1 inline-flex align-baseline text-[10px] font-bold tracking-[0.08em] text-[#D5A12B]" aria-label={`hotel bintang ${value}`}>{stars}</span>;
}

export const metadata: Metadata = {
  title: "Paket Umroh 2026 – 2027 All In & Berlandaskan Sunnah",
  description:
    "Pilihan paket umroh 2026–2027 Jam Wisata: Umroh 9 Hari, Umroh 12 Hari + Turki, dan Umroh Bintang 5 Eksklusif. Harga All In transparan, maskapai bintang lima, hotel dekat masjid.",
  alternates: {
    canonical: "/paket-umroh",
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
    title: "Paket Umroh 2026 – 2027 All In & Berlandaskan Sunnah | Jam Wisata",
    description:
      "Temukan jadwal keberangkatan, rincian biaya All In, fasilitas hotel bintang 5, maskapai penerbangan, dan bimbingan sunnah bersama Jam Wisata.",
    url: `${SITE_URL}/paket-umroh`,
    siteName: "Jam Wisata",
    locale: "id_ID",
    type: "website",
    images: defaultOpenGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "Paket Umroh 2026 – 2027 All In & Berlandaskan Sunnah | Jam Wisata",
    description:
      "Temukan jadwal keberangkatan, rincian biaya All In, fasilitas hotel bintang 5, maskapai penerbangan, dan bimbingan sunnah bersama Jam Wisata.",
    images: defaultTwitterImages,
  },
};

const packageHubSchema = (umrahPackages: TravelPackage[]) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Daftar Paket Umroh Jam Wisata 2026 - 2027",
      description: "Pilihan paket ibadah umroh reguler, plus Turki, dan bintang 5 eksklusif.",
      itemListElement: umrahPackages.map((pkg, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: pkg.name,
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
          name: "Paket Umroh",
          item: "https://jamwisata.id/paket-umroh",
        },
      ],
    },
  ],
});

const hubFaqs = [
  {
    q: "Apa saja paket umroh yang tersedia di Jam Wisata?",
    a: "Jam Wisata menawarkan 3 kategori utama: Paket Umroh 9 Hari Reguler (Qatar Airways & Pullman Zamzam Tower), Paket Umroh 12 Hari + Turkey (Saudia Airlines & napak tilas sejarah Islam), dan Paket Umroh Bintang 5 Eksklusif (Garuda Indonesia Direct & hotel pelataran Ka'bah).",
  },
  {
    q: "Apakah harga paket umroh Jam Wisata sudah all in?",
    a: "Ya, seluruh paket menerapkan sistem Harga All In yang sudah mencakup tiket pesawat internasional PP, visa umrah resmi, akomodasi hotel, makan 3x sehari, manasik intensif, muthawif pembimbing, bus AC eksekutif, dan perlengkapan ibadah.",
  },
  {
    q: "Dari bandara mana keberangkatan umroh Jam Wisata?",
    a: "Keberangkatan utama dilaksanakan dari Bandara Internasional Soekarno-Hatta (CGK) Jakarta. Bagi jamaah asal Bandung dan Jawa Barat, Jam Wisata menyediakan pendampingan dan briefing sejak dari kantor Bandung.",
  },
];

export default async function PaketUmrohHubPage() {
  const umrahPackages = await getPublishedPackages();
  const displayedPackages = umrahPackages.slice(0, 10);
  return (
    <main className="jam-page min-h-screen bg-white text-[#333333]">
      <JsonLd schema={packageHubSchema(displayedPackages)} />
      <PremiumHeader />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#021224] text-white pt-32 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 border-b border-[#D5A12B]/30">
        <Image
          src="/jamwisata-makkah.png"
          alt="Masjidil Haram Makkah"
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
            <span className="text-white font-bold">Paket Umroh</span>
          </nav>

          <div className="max-w-[820px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A12B]/40 bg-[#061A2F]/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#F5D97A] backdrop-blur-md ring-1 ring-[#D5A12B]/20">
              <Sparkles className="size-3.5 text-[#E8C967]" /> Program Perjalanan Ibadah 2026 – 2027
            </span>

            <h1 className="mt-4 font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Pilihan Paket Umroh All In &amp; Berlandaskan Sunnah
            </h1>

            <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl italic text-[#F5D97A]">
              Kenyamanan Akomodasi Dekat Masjid &amp; Kepastian Jadwal Keberangkatan
            </p>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-200 font-[family-name:var(--font-montserrat)] max-w-[720px]">
              Pilih program umroh yang sesuai dengan kebutuhan ibadah Anda dan keluarga. Seluruh paket dirancang dengan transparansi biaya, hotel strategis, dan bimbingan muthawif bersertifikasi.
            </p>
          </div>
        </div>
      </section>

      {/* AEO Direct Answer Fact Card */}
      <section className="bg-slate-50 py-10 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="rounded-2xl border border-[#D5A12B]/30 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B]">
              <Sparkles className="size-4 text-[#D5A12B]" />
              <span>Ringkasan Paket &amp; Biaya</span>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#061A2F] font-medium">
              Jam Wisata menyelenggarakan paket umroh musim 2026–2027 dengan biaya mulai dari <strong>Rp 33.900.000 (Umroh 9 Hari Qatar Airways)</strong>, <strong>Rp 36.900.000 (Umroh 12 Hari + Turkey)</strong>, dan <strong>Rp 35.900.000 (Umroh Bintang 5 Garuda Indonesia)</strong>. Seluruh program menerapkan sistem <em>Harga All In</em> tanpa biaya tersembunyi.
            </p>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="bg-white py-16 sm:py-20 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayedPackages.map((pkg) => (
              <article
                key={pkg.id}
                className="flex flex-col justify-between rounded-2xl border border-[#061A2F]/12 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[16/10] w-full bg-[#061A2F]">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 rounded-md bg-[#061A2F]/85 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#F5D97A] border border-[#D5A12B]/30">
                    {pkg.badge ?? "Quad All In"}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#061A2F]">
                      <Link href={`/paket-umroh/${pkg.slug}`} className="hover:text-[#D5A12B] transition">
                        {pkg.name}
                      </Link>
                    </h2>

                    <div className="mt-4 space-y-2.5 text-xs text-[#59616D]">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-[#D5A12B] shrink-0" />
                        <span>Jadwal: <strong>{pkg.departureDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plane className="size-4 text-[#D5A12B] shrink-0" />
                        <span>Maskapai: <strong>{pkg.airline}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hotel className="size-4 text-[#D5A12B] shrink-0" />
                        <span>Makkah: <strong>{pkg.makkahHotel?.name}<HotelStarBadge value={pkg.makkahHotel?.star} /></strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hotel className="size-4 text-[#D5A12B] shrink-0" />
                        <span>Madinah: <strong>{pkg.madinahHotel?.name}<HotelStarBadge value={pkg.madinahHotel?.star} /></strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-xs text-slate-500 font-medium">Harga All In</span>
                      <div>
                        <span className="text-xl font-extrabold text-[#061A2F]">
                          Rp {formatIDR(pkg.priceFrom ?? 0)}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">/pax</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/paket-umroh/${pkg.slug}`}
                        className="flex h-11 items-center justify-center rounded-xl border border-[#061A2F]/20 text-xs font-bold text-[#061A2F] hover:bg-slate-50 transition"
                      >
                        Detail &amp; Itinerary
                      </Link>
                      <a
                        href={whatsappHref(pkg.whatsappMessage, `Katalog Paket — ${pkg.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-gold-rich text-xs font-bold text-[#061A2F] shadow-sm hover:scale-[1.02] transition"
                      >
                        <MessageCircle className="size-3.5" />
                        <span>Konsultasi</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-slate-50 py-16 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/30 shadow-2xs">
              Komparasi Paket
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl font-bold text-[#061A2F]">
              Perbandingan Paket Umroh Jam Wisata
            </h2>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-left text-xs bg-white rounded-2xl border border-[#061A2F]/10 shadow-xs overflow-hidden">
              <thead className="bg-[#061A2F] text-white">
                <tr>
                  <th className="p-4 font-bold">Nama Paket</th>
                  <th className="p-4 font-bold">Durasi</th>
                  <th className="p-4 font-bold">Keberangkatan</th>
                  <th className="p-4 font-bold">Maskapai</th>
                  <th className="p-4 font-bold">Hotel Makkah</th>
                  <th className="p-4 font-bold">Hotel Madinah</th>
                  <th className="p-4 font-bold">Harga All In</th>
                  <th className="p-4 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-[#061A2F]">{pkg.name}</td>
                    <td className="p-4 text-[#59616D]">{pkg.durationDays} Hari</td>
                    <td className="p-4 text-[#59616D] whitespace-nowrap">{pkg.departureDate}</td>
                    <td className="p-4 text-[#59616D]">{pkg.airline}</td>
                    <td className="p-4 text-[#59616D]">{pkg.makkahHotel?.name}<HotelStarBadge value={pkg.makkahHotel?.star} /></td>
                    <td className="p-4 text-[#59616D]">{pkg.madinahHotel?.name}<HotelStarBadge value={pkg.madinahHotel?.star} /></td>
                    <td className="p-4 font-extrabold text-[#061A2F] whitespace-nowrap">
                      Rp {formatIDR(pkg.priceFrom ?? 0)}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/paket-umroh/${pkg.slug}`}
                        className="font-bold text-[#D5A12B] hover:underline"
                      >
                        Lihat →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl font-bold text-[#061A2F]">
              Pertanyaan Umum Paket Umroh
            </h2>
          </div>

          <div className="mt-10 mx-auto max-w-[800px] space-y-4">
            {hubFaqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-[#061A2F]/10 bg-slate-50/60 p-6"
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
