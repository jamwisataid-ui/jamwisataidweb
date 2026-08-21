import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Compass,
  HeartHandshake,
  HelpCircle,
  Hotel,
  MapPin,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { WhatsAppConcierge } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/WhatsAppConcierge";
import { formatIDR, umrahPackages, whatsappHref } from "@/data/jamwisata";

export const metadata: Metadata = {
  title: "Travel Umroh Bandung Terpercaya & Berlandaskan Sunnah",
  description:
    "Cari travel umroh Bandung amanah dan resmi? Jam Wisata menyediakan paket umroh 2026–2027 bimbingan sunnah, hotel bintang 5 dekat masjid, maskapai terbaik, kantor resmi di Bandung.",
  alternates: {
    canonical: "/travel-umroh-bandung",
  },
  openGraph: {
    title: "Travel Umroh Bandung Terpercaya & Berlandaskan Sunnah | Jam Wisata",
    description:
      "Layanan biro travel umroh terpercaya untuk warga Bandung & Jawa Barat. Jadwal pasti 2026–2027, harga All In transparan, dan pendampingan bimbingan sunnah.",
    url: "https://jamwisata.id/travel-umroh-bandung",
    siteName: "Jam Wisata",
    locale: "id_ID",
    type: "website",
  },
};

const bandungSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": "https://jamwisata.id/travel-umroh-bandung/#localbusiness",
      name: "Jam Wisata — Travel Umroh Bandung",
      url: "https://jamwisata.id/travel-umroh-bandung",
      image: "https://jamwisata.id/images/jamwisata-makkah.png",
      telephone: "+6281809627499",
      email: "jamwisata99@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Cibangkong No. 28A Gatot Subroto",
        addressLocality: "Bandung",
        addressRegion: "Jawa Barat",
        postalCode: "40273",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -6.9272,
        longitude: 107.6322,
      },
      priceRange: "Rp 33.900.000 - Rp 36.900.000",
      areaServed: [
        "Bandung",
        "Kota Bandung",
        "Kabupaten Bandung",
        "Bandung Barat",
        "Cimahi",
        "Jawa Barat",
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "17:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "09:00",
          closes: "14:00",
        },
      ],
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
          name: "Travel Umroh Bandung",
          item: "https://jamwisata.id/travel-umroh-bandung",
        },
      ],
    },
  ],
};

const bandungFaqs = [
  {
    q: "Mengapa memilih Jam Wisata sebagai travel umroh Bandung?",
    a: "Jam Wisata adalah biro perjalanan umroh berpusat di Bandung yang mengedepankan bimbingan ibadah berlandaskan sunnah, transparansi biaya harga All In, maskapai penerbangan kelas dunia (Qatar Airways, Saudia, Garuda), serta hotel dekat masjid seperti Pullman Zamzam Tower.",
  },
  {
    q: "Di mana lokasi kantor Jam Wisata di Bandung?",
    a: "Kantor operasional Jam Wisata beralamat di Jl. Cibangkong No. 28A Gatot Subroto, Bandung 40273, Jawa Barat. Jamaah dapat berkonsultasi langsung di kantor pada hari kerja atau via WhatsApp di +62 818-0962-7499.",
  },
  {
    q: "Bagaimana alur keberangkatan jamaah umroh dari Bandung?",
    a: "Jamaah asal Bandung akan mengikuti rangkaian manasik intensif di Bandung. Pada hari keberangkatan, tim Jam Wisata mendampingi proses perjalanan menuju Bandara Internasional Soekarno-Hatta (CGK) hingga boarding ke Tanah Suci.",
  },
  {
    q: "Berapa biaya paket umroh Jam Wisata untuk jamaah Bandung?",
    a: "Biaya paket umroh Jam Wisata 2026–2027 mulai dari Rp 33.900.000 (tipe Quad All In) untuk program Umroh 9 Hari, Rp 36.900.000 untuk Umroh 12 Hari + Turki, dan Rp 35.900.000 untuk Umroh Bintang 5 Eksklusif.",
  },
];

export default function TravelUmrohBandungPage() {
  return (
    <main className="jam-page min-h-screen bg-white text-[#333333]">
      <JsonLd schema={bandungSchema} />
      <PremiumHeader />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#021224] text-white pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24 lg:pb-28 border-b border-[#D5A12B]/30">
        <Image
          src="/jamwisata-makkah.png"
          alt="Menara Jam Makkah dan Ka'bah"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021224] via-[#021224]/85 to-[#021224]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(213,161,43,0.15)_0%,transparent_70%)]" />

        <div className="jam-container relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#E8C967] transition">
              <ArrowLeft className="size-3.5" /> Beranda
            </Link>
            <span className="text-[#D5A12B]">/</span>
            <span className="text-white font-bold">Travel Umroh Bandung</span>
          </nav>

          <div className="max-w-[860px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A12B]/40 bg-[#061A2F]/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#F5D97A] backdrop-blur-md shadow-xs ring-1 ring-[#D5A12B]/20">
              <MapPin className="size-3.5 text-[#E8C967]" /> Layanan Resmi Wilayah Bandung &amp; Jawa Barat
            </span>

            <h1 className="mt-5 font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white tracking-tight">
              Travel Umroh Bandung Amanah, Nyaman &amp; Berlandaskan Sunnah
            </h1>

            <p className="mt-4 font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl italic text-[#F5D97A] leading-relaxed">
              &ldquo;Setiap Waktu Bernilai Ibadah — Sahabat Terbaik Menuju Baitullah&rdquo;
            </p>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-200 font-[family-name:var(--font-montserrat)] max-w-[760px]">
              Mencari travel umroh terpercaya di Bandung? Jam Wisata hadir memberikan kepastian jadwal, akomodasi hotel dekat masjid, bimbingan manasik sesuai sunnah, dan transparansi biaya tanpa biaya tersembunyi.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href={whatsappHref(
                  "Assalamu’alaikum, saya ingin konsultasi paket umroh keberangkatan dari Bandung.",
                  "Halaman Travel Umroh Bandung"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="lift-soft sheen-gold flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-gold-rich px-7 text-xs font-extrabold uppercase tracking-wider text-[#061A2F] shadow-lg transition hover:scale-105"
              >
                <MessageCircle className="size-4" />
                <span>Konsultasi Warga Bandung</span>
              </a>

              <a
                href="#paket-bandung"
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-[#D5A12B] bg-[#061A2F]/60 px-6 text-xs font-bold text-white transition hover:bg-[#061A2F]"
              >
                <span>Lihat Jadwal &amp; Paket</span>
                <ChevronRight className="size-3.5 text-[#D5A12B]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AEO Direct Answer Fact Card */}
      <section className="bg-slate-50 py-12 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="rounded-2xl border border-[#D5A12B]/30 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B]">
              <Sparkles className="size-4 text-[#D5A12B]" />
              <span>Ringkasan Resmi Jam Wisata Bandung</span>
            </div>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#061A2F] font-medium">
              <strong>Jam Wisata</strong> Brand of Fajar Indah Gemilang <strong>PPIU Nomor 534 Tahun 2019</strong> menyelenggarakan perjalanan ibadah umroh dan wisata halal yang berpusat di Kota Bandung. Dengan kantor operasional di <strong>Jl. Cibangkong No. 28A Gatot Subroto, Bandung 40273</strong>, Jam Wisata melayani jamaah asal Kota Bandung, Kabupaten Bandung, Cimahi, dan seluruh wilayah Jawa Barat dengan standar bimbingan ibadah berlandaskan sunnah, hotel berbintang di ring 1 Makkah/Madinah, dan maskapai penerbangan internasional berstandar tinggi.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Mengapa Jamaah Bandung Memilih Jam Wisata */}
      <section className="bg-white py-16 sm:py-20 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/30 shadow-2xs">
              Keunggulan Layanan
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#061A2F]">
              Kenapa Memilih Jam Wisata di Bandung?
            </h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#64748B]">
              Fasilitas dan komitmen pendampingan lengkap dari persiapan di Bandung hingga kembali ke Tanah Air.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#061A2F]/10 bg-slate-50/50 p-6 transition-all hover:border-[#D5A12B]/40 hover:shadow-md">
              <div className="grid size-11 place-items-center rounded-xl bg-[#061A2F] text-[#E8C967]">
                <MapPin className="size-5.5" />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#061A2F]">
                Kantor Fisik Jelas di Bandung
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#59616D]">
                Lokasi kantor yang mudah diakses di kawasan Gatot Subroto Bandung. Jamaah dan keluarga bisa berkonsultasi, mendaftar, dan menyerahkan dokumen secara langsung dengan rasa tenang.
              </p>
            </div>

            <div className="rounded-2xl border border-[#061A2F]/10 bg-slate-50/50 p-6 transition-all hover:border-[#D5A12B]/40 hover:shadow-md">
              <div className="grid size-11 place-items-center rounded-xl bg-[#061A2F] text-[#E8C967]">
                <Compass className="size-5.5" />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#061A2F]">
                Bimbingan Sesuai Sunnah
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#59616D]">
                Dibimbing langsung oleh ustadz dan muthawif berpengalaman yang memastikan seluruh rukun dan tata cara ibadah dilaksanakan sesuai tuntunan Al-Qur&apos;an dan As-Sunnah.
              </p>
            </div>

            <div className="rounded-2xl border border-[#061A2F]/10 bg-slate-50/50 p-6 transition-all hover:border-[#D5A12B]/40 hover:shadow-md">
              <div className="grid size-11 place-items-center rounded-xl bg-[#061A2F] text-[#E8C967]">
                <Hotel className="size-5.5" />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#061A2F]">
                Hotel Ring 1 Dekat Masjid
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#59616D]">
                Menginap di hotel strategis seperti Pullman Zamzam Tower di pelataran Masjidil Haram dan Arkan Almanar di Madinah. Memudahkan jamaah lansia dan keluarga untuk shalat berjamaah 5 waktu.
              </p>
            </div>

            <div className="rounded-2xl border border-[#061A2F]/10 bg-slate-50/50 p-6 transition-all hover:border-[#D5A12B]/40 hover:shadow-md">
              <div className="grid size-11 place-items-center rounded-xl bg-[#061A2F] text-[#E8C967]">
                <Plane className="size-5.5" />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#061A2F]">
                Maskapai Bintang Lima
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#59616D]">
                Terbang menggunakan armada maskapai terkemuka dunia seperti Qatar Airways, Saudia Airlines, dan Garuda Indonesia dengan fasilitas bagasi dan konsumsi lengkap.
              </p>
            </div>

            <div className="rounded-2xl border border-[#061A2F]/10 bg-slate-50/50 p-6 transition-all hover:border-[#D5A12B]/40 hover:shadow-md">
              <div className="grid size-11 place-items-center rounded-xl bg-[#061A2F] text-[#E8C967]">
                <ShieldCheck className="size-5.5" />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#061A2F]">
                Harga All In Transparan
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#59616D]">
                Tidak ada biaya tersembunyi saat hari keberangkatan. Seluruh komponen penting (visa, tiket, hotel, manasik, handling, perlengkapan) telah termasuk dalam satu paket.
              </p>
            </div>

            <div className="rounded-2xl border border-[#061A2F]/10 bg-slate-50/50 p-6 transition-all hover:border-[#D5A12B]/40 hover:shadow-md">
              <div className="grid size-11 place-items-center rounded-xl bg-[#061A2F] text-[#E8C967]">
                <HeartHandshake className="size-5.5" />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#061A2F]">
                Pendampingan Penuh Hati
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#59616D]">
                Tim tour leader Jam Wisata mendampingi jamaah mulai dari manasik pra-keberangkatan di Bandung hingga kembali ke rumah bersama keluarga dengan selamat dan mabrur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Paket Umroh Tersedia untuk Warga Bandung */}
      <section id="paket-bandung" className="scroll-mt-20 bg-slate-50 py-16 sm:py-20 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/30">
                Pilihan Paket
              </span>
              <h2 className="mt-2 font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#061A2F]">
                Paket Umroh 2026–2027 Jamaah Bandung
              </h2>
            </div>
            <Link
              href="/paket-umroh"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D5A12B] hover:text-[#B8860B] transition"
            >
              <span>Lihat Semua Rincian Paket</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {umrahPackages.map((pkg) => (
              <article
                key={pkg.id}
                className="flex flex-col justify-between rounded-2xl border border-[#061A2F]/10 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[16/10] w-full bg-[#061A2F]">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 rounded-md bg-[#061A2F]/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-[#F5D97A] border border-[#D5A12B]/30">
                    {pkg.badge ?? "Quad All In"}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#061A2F]">
                      {pkg.name}
                    </h3>
                    <div className="mt-3 space-y-2 text-xs text-[#59616D]">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-[#D5A12B] shrink-0" />
                        <span>Keberangkatan: <strong>{pkg.departureDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plane className="size-3.5 text-[#D5A12B] shrink-0" />
                        <span>Maskapai: <strong>{pkg.airline}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hotel className="size-3.5 text-[#D5A12B] shrink-0" />
                        <span>Makkah: <strong>{pkg.makkahHotel?.name}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs text-slate-500 font-medium">Harga All In</span>
                      <span className="text-lg font-extrabold text-[#061A2F]">
                        Rp {formatIDR(pkg.priceFrom ?? 0)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/paket-umroh/${pkg.slug}`}
                        className="flex h-10 items-center justify-center rounded-lg border border-[#061A2F]/20 text-xs font-bold text-[#061A2F] hover:bg-slate-50 transition"
                      >
                        Detail Itinerary
                      </Link>
                      <a
                        href={whatsappHref(
                          `Assalamu’alaikum, saya ingin konsultasi paket ${pkg.name} untuk warga Bandung.`,
                          `Bandung Page — ${pkg.name}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-gradient-gold-rich text-xs font-bold text-[#061A2F] shadow-sm hover:scale-[1.02] transition"
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

      {/* Section: Lokasi Kantor Bandung & Google Maps */}
      <section className="bg-white py-16 sm:py-20 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/30 shadow-2xs">
                Kunjungi Kantor Kami
              </span>
              <h2 className="mt-3 font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#061A2F]">
                Kantor Resmi Jam Wisata di Bandung
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#59616D]">
                Kami menyambut hangat kedatangan jamaah dan keluarga untuk silaturahmi, konsultasi mendalam mengenai jadwal manasik, pemilihan tipe kamar hotel, serta pendaftaran paket umroh.
              </p>

              <div className="mt-6 space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <MapPin className="size-5 text-[#D5A12B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#061A2F]">Alamat Kantor:</strong>
                    <span className="text-[#59616D]">Jl. Cibangkong No. 28A Gatot Subroto, Bandung 40273, Jawa Barat</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <Clock className="size-5 text-[#D5A12B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#061A2F]">Jam Operasional:</strong>
                    <span className="text-[#59616D]">Senin – Jumat: 09.00 – 17.00 WIB | Sabtu: 09.00 – 14.00 WIB</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <a
                  href="https://maps.app.goo.gl/gVK4okTQSEtzyX9w5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lift-soft flex h-11 items-center justify-center gap-2 rounded-xl bg-[#061A2F] px-6 text-xs font-bold text-white hover:bg-[#021224] transition shadow-md"
                >
                  <MapPin className="size-3.5 text-[#E8C967]" />
                  <span>Buka Google Maps ↗</span>
                </a>
                <a
                  href={whatsappHref("Assalamu’alaikum, saya ingin membuat janji konsultasi di kantor Bandung.", "Bandung Kantor")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#061A2F]/20 px-5 text-xs font-bold text-[#061A2F] hover:border-[#D5A12B] transition"
                >
                  <MessageCircle className="size-3.5 text-[#D5A12B]" />
                  <span>Buat Janji Temu</span>
                </a>
              </div>
            </div>

            {/* Map Preview Box */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#D5A12B]/30 shadow-lg bg-slate-100">
                <iframe
                  title="Lokasi Kantor Jam Wisata Bandung"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7431189490157!2d107.6322!3d-6.9272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMzcuOSJTIDEwN8KwMzcnNTUuOSJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  className="absolute inset-0 size-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: FAQ Khusus Bandung */}
      <section className="bg-slate-50 py-16 sm:py-20 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/30 shadow-2xs">
              Tanya Jawab
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#061A2F]">
              Pertanyaan Seputar Umroh di Bandung
            </h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#64748B]">
              Jawaban ringkas dan transparan seputar layanan Jam Wisata untuk calon jamaah Bandung.
            </p>
          </div>

          <div className="mt-10 mx-auto max-w-[800px] space-y-4">
            {bandungFaqs.map((faq) => (
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
