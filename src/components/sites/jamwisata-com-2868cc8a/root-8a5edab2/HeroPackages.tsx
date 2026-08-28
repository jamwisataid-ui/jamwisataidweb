"use client";

import Image from "next/image";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CircleGauge,
  Clock3,
  Compass,
  Hotel,
  MessageCircle,
  Plane,
  Play,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { HotelStarRating } from "@/components/HotelStarRating";
import { formatIDR, whatsappHref } from "@/data/jamwisata";
import type { TravelPackage } from "@/types/jamwisata";

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";

type Filters = {
  type: string;
  month: string;
  duration: string;
  airline: string;
};

const emptyFilters: Filters = { type: "", month: "", duration: "", airline: "" };

const packageTypeLabels: Record<TravelPackage["packageType"], string> = {
  "bintang-5": "Umroh Bintang 5",
  plus: "Umroh Plus",
  reguler: "Umroh Reguler",
  tour: "Wisata Halal",
};

const monthLabel = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
};

function PackageCard({ travelPackage }: { travelPackage: TravelPackage }) {
  const whatsappText =
    travelPackage.whatsappMessage ||
    `Assalamu’alaikum Jam Wisata, saya ingin konsultasi mengenai ${travelPackage.name}${travelPackage.departureDate ? ` (Keberangkatan ${travelPackage.departureDate})` : ""}. Mohon info seat dan rincian lengkapnya.`;

  return (
    <article className="lift-soft group relative isolate min-h-[500px] overflow-hidden rounded-[26px] border border-[#061A2F]/12 bg-[#021224] p-6 sm:p-7 flex flex-col justify-between shadow-[0_16px_44px_rgba(6,26,47,.12)] transition-all duration-500 hover:shadow-[0_28px_64px_rgba(6,26,47,.25),0_0_0_1px_rgba(213,161,43,.35)] hover:-translate-y-1">
      {/* Full Background Image */}
      <Image
        src={travelPackage.image}
        alt={`Paket ${travelPackage.name} Jam Wisata`}
        fill
        sizes="(min-width:1024px) 33vw,(min-width:640px) 50vw,100vw"
        className="object-cover transition duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
      />

      {/* Cinematic Gradient Overlay from Left & Bottom for Superior Readability */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,18,36,0.58)_0%,rgba(2,18,36,0.42)_35%,rgba(2,18,36,0.76)_72%,rgba(2,18,36,0.88)_100%)] sm:bg-[linear-gradient(135deg,rgba(2,18,36,0.74)_0%,rgba(2,18,36,0.56)_45%,rgba(2,18,36,0.28)_80%,rgba(2,18,36,0.12)_100%)] transition-opacity duration-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_38%,rgba(2,18,36,0.36)_100%)]" />

      {/* Content Container (Top to Bottom structure) */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* 1. Durasi hari (Card transparan dgn border gradient gold rich) */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5A12B] bg-[#021224]/80 px-3.5 py-1 text-xs font-extrabold text-[#F5D97A] backdrop-blur-md shadow-xs ring-1 ring-[#D5A12B]/30">
              <Clock3 className="size-3.5 text-[#E8C967]" />
              <span>{travelPackage.durationDays ? `${travelPackage.durationDays} Hari` : "9 Hari"}</span>
            </span>

            {travelPackage.badge ? (
              <span className="rounded-full bg-gradient-gold-rich px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#061A2F] shadow-sm">
                {travelPackage.badge}
              </span>
            ) : null}
          </div>

          {/* 2. Judul dgn teks putih */}
          <h3 className="mt-4 font-[family-name:var(--font-cinzel)] text-xl sm:text-[22px] font-bold leading-snug text-white drop-shadow-sm transition-colors group-hover:text-[#F5D97A]">
            {travelPackage.name}
          </h3>

          {/* 3. List poin-poin kebawah: Hotel Makkah, Hotel Madinah, Maskapai */}
          <div className="mt-4 space-y-2.5 rounded-2xl border border-white/14 bg-[#061A2F]/52 p-4 backdrop-blur-md">
            {/* Hotel Makkah */}
            <div className="flex items-start gap-2.5 text-xs text-slate-200">
              <Hotel className="size-4 shrink-0 text-[#E8C967] mt-0.5" />
              <div className="min-w-0 flex-1 leading-tight">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#D5A12B]">Hotel Makkah</span>
                <span className="flex items-center justify-between gap-3 font-semibold text-white">
                  <span className="min-w-0">{travelPackage.makkahHotel?.name ?? "Hotel Bintang 5 Makkah"}</span>
                  <HotelStarRating rating={travelPackage.makkahHotel?.star} variant="dark" />
                </span>
              </div>
            </div>

            {/* Hotel Madinah */}
            <div className="flex items-start gap-2.5 text-xs text-slate-200">
              <Building2 className="size-4 shrink-0 text-[#E8C967] mt-0.5" />
              <div className="min-w-0 flex-1 leading-tight">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#D5A12B]">Hotel Madinah</span>
                <span className="flex items-center justify-between gap-3 font-semibold text-white">
                  <span className="min-w-0">{travelPackage.madinahHotel?.name ?? "Hotel Bintang 5 Madinah"}</span>
                  <HotelStarRating rating={travelPackage.madinahHotel?.star} variant="dark" />
                </span>
              </div>
            </div>

            {/* Maskapai */}
            <div className="flex items-start gap-2.5 text-xs text-slate-200">
              <Plane className="size-4 shrink-0 text-[#E8C967] mt-0.5" />
              <div className="leading-tight">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#D5A12B]">Maskapai Penerbangan</span>
                <span className="font-semibold text-white">{travelPackage.airline ?? "Garuda Indonesia / Saudia"}</span>
              </div>
            </div>
          </div>

          {/* 4. Jadwal Keberangkatan */}
          {travelPackage.departureDate ? (
            <div className="mt-3.5 flex items-center gap-2 px-1 text-xs text-slate-300">
              <CalendarDays className="size-3.5 text-[#E8C967] shrink-0" />
              <span>Jadwal: <strong className="font-semibold text-white">{travelPackage.departureDate}</strong></span>
            </div>
          ) : null}
        </div>

        {/* 5. Bagian Harga All In ... & 6. 1 Tombol gradient gold rich konsultasi paket ini */}
        <div className="mt-5 pt-2">
          {travelPackage.priceFrom ? (
            <div className="mb-3 flex items-baseline justify-between gap-1.5 px-1 font-[family-name:var(--font-montserrat)]">
              <span className="text-xs text-slate-300 font-medium">Harga All In</span>
              <div>
                <span className="text-gradient-gold-rich text-xl font-extrabold">
                  Rp {formatIDR(travelPackage.priceFrom)}
                </span>
                <span className="ml-1 text-[11px] text-slate-400">/pax</span>
              </div>
            </div>
          ) : null}

          <a
            href={whatsappHref(whatsappText, `Paket — ${travelPackage.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="lift-soft sheen-gold flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold-rich px-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#061A2F] shadow-[0_6px_22px_rgba(184,134,11,0.35)] transition duration-300 hover:scale-[1.02] active:scale-95"
          >
            <MessageCircle className="size-4" />
            <span>Konsultasi Paket Ini</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function HeroPackages({ packages }: { packages: TravelPackage[] }) {
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const [hasSearched, setHasSearched] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const options = useMemo(() => ({
    months: [...new Set(packages.map((item) => item.departureMonth).filter(Boolean))] as string[],
    types: [...new Set(packages.map((item) => item.packageType))],
    airlines: [
      "Garuda Indonesia",
      "Saudia",
      "Qatar Airways",
      "Oman Air",
      "Emirates",
    ],
    durations: ["9 Hari", "10 Hari", "12 Hari", "16 Hari"],
  }), [packages]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = {
      type: params.get("tujuan") ?? "",
      month: params.get("bulan") ?? "",
      duration: params.get("durasi") ?? "",
      airline: params.get("maskapai") ?? "",
    };
    if (Object.values(fromUrl).some(Boolean)) {
      const timer = window.setTimeout(() => {
        setDraft(fromUrl);
        setApplied(fromUrl);
        setHasSearched(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const filteredPackages = useMemo(() => {
    return packages.filter((item) => {
      const matchType = !applied.type || item.packageType === applied.type;
      const matchMonth = !applied.month || item.departureMonth === applied.month;
      const matchAirline = !applied.airline || item.airline === applied.airline;
      const matchDuration =
        !applied.duration ||
        (applied.duration === "9 Hari" && item.durationDays === 9) ||
        (applied.duration === "10 Hari" && item.durationDays === 10) ||
        (applied.duration === "12 Hari" && item.durationDays === 12) ||
        (applied.duration === "16 Hari" && item.durationDays === 16);

      return matchType && matchMonth && matchAirline && matchDuration;
    });
  }, [applied, packages]);

  const updateUrl = (filters: Filters) => {
    const params = new URLSearchParams();
    if (filters.type) params.set("tujuan", filters.type);
    if (filters.month) params.set("bulan", filters.month);
    if (filters.duration) params.set("durasi", filters.duration);
    if (filters.airline) params.set("maskapai", filters.airline);
    window.history.replaceState({}, "", `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`);
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setApplied(draft);
    setHasSearched(true);
    updateUrl(draft);
    window.setTimeout(() => {
      document.getElementById("paket-umrah")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const reset = () => {
    setDraft(emptyFilters);
    setApplied(emptyFilters);
    setHasSearched(false);
    updateUrl(emptyFilters);
  };

  const activeChips = [
    applied.type ? packageTypeLabels[applied.type as TravelPackage["packageType"]] : "",
    applied.month ? monthLabel(applied.month) : "",
    applied.duration,
    applied.airline,
  ].filter(Boolean);

  const emptyMessage = `Assalamu’alaikum, saya mencari paket umrah Jam Wisata dengan kriteria: ${activeChips.join(", ") || "semua kriteria"}. Mohon informasi jadwal dan ketersediaan paket.`;

  return (
    <>
      {/* Hero Section */}
      <section
        id="beranda"
        className="relative isolate min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] bg-[#021224] text-white flex flex-col justify-between pt-[112px] sm:pt-[126px] lg:pt-[136px] xl:pt-[144px] pb-16 sm:pb-20 lg:pb-22 mb-7 sm:mb-9 lg:mb-11"
      >
        {/* Background Image of Masjidil Haram with Ka'bah & Clock Tower */}
        <Image
          src="/hero-makkah-cinematic.png"
          alt="Keindahan Masjidil Haram, Ka'bah dan Makkah Clock Tower"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_52%] sm:object-[62%_48%] lg:object-[64%_45%]"
        />

        {/* Directional Cinematic Gradient Overlay: Mobile top-down fade for text contrast, Desktop left-rich for Ka'bah */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,18,36,0.93)_0%,rgba(2,18,36,0.82)_45%,rgba(2,18,36,0.60)_75%,rgba(2,18,36,0.40)_100%)] lg:bg-[linear-gradient(90deg,rgba(2,18,36,0.96)_0%,rgba(2,18,36,0.88)_28%,rgba(2,18,36,0.55)_50%,rgba(2,18,36,0.12)_75%,rgba(2,18,36,0.02)_100%)]" />
        {/* Subtle Atmosphere Fades */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(2,18,36,0.55)_0%,transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,18,36,0.65)_0%,transparent_25%)]" />

        {/* Main Hero Content (Upper-Left 40% column on desktop, well-balanced on mobile) */}
        <div className="jam-container relative z-10 w-full my-auto pt-2 sm:pt-4 pb-2 sm:pb-4">
          <div className="max-w-[480px] lg:max-w-[530px]">
            {/* Bismillah & Eyebrow */}
            <div className="mb-2.5 sm:mb-4 flex flex-col items-start gap-1.5 sm:gap-2">
              <Image
                src={`${assetRoot}/bismillah.png`}
                alt="Bismillahirrahmanirrahim"
                width={384}
                height={86}
                className="h-auto w-[120px] sm:w-[155px] lg:w-[175px] opacity-85 drop-shadow-sm"
              />
              <div className="flex items-center gap-2">
                <span className="h-px w-4 sm:w-5 bg-gradient-gold-rich" />
                <p className="font-[family-name:var(--font-cinzel)] text-[9.5px] sm:text-[11px] lg:text-xs font-bold tracking-[0.16em] sm:tracking-[0.2em] text-[#D7A72B] uppercase">
                  Biro Perjalanan Umrah &amp; Wisata Halal
                </p>
              </div>
            </div>

            {/* Heading — Cinzel */}
            <h1 className="font-[family-name:var(--font-cinzel)] text-[26px] xs:text-[30px] sm:text-[42px] lg:text-[50px] xl:text-[56px] font-bold leading-[1.12] sm:leading-[1.08] tracking-[0.02em] text-white drop-shadow-md">
              <span className="block sm:whitespace-nowrap">Setiap Waktu</span>
              <span className="text-gradient-gold-rich mt-0.5 block font-bold sm:whitespace-nowrap">
                Bernilai Ibadah
              </span>
            </h1>

            {/* Body — Montserrat */}
            <p className="font-[family-name:var(--font-montserrat)] mt-2.5 sm:mt-3.5 max-w-[430px] lg:max-w-[460px] text-left text-[12.5px] sm:text-[14.5px] lg:text-[15.5px] font-normal leading-[1.55] sm:leading-[1.6] text-slate-200/90">
              Jam Wisata tidak hanya mengantarkan langkah menuju Baitullah, tetapi juga menemani perjalanan hati menuju Allah dengan amanah, profesional, dan berlandaskan sunnah.
            </p>

            {/* CTA Buttons Row — Exact same horizontal placement, enlarged font size */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3 font-[family-name:var(--font-montserrat)]">
              {/* Primary Gold CTA */}
              <a
                href="#paket-umrah"
                className="lift-soft sheen-gold inline-flex h-[44px] sm:h-[48px] lg:h-[50px] items-center justify-center gap-2 rounded-[8px] bg-gradient-gold-rich px-5 sm:px-6 text-xs lg:text-[13px] font-bold uppercase tracking-wider text-[#061A2F] shadow-[0_8px_24px_rgba(184,134,11,.32)] transition duration-300 hover:scale-[1.02] active:scale-95"
              >
                Lihat Paket Umroh <ArrowRight className="size-3.5" />
              </a>

              {/* Secondary Dark/Gold Outline CTA */}
              <a
                href="https://wa.me/6281809627499?text=Assalamu%E2%80%99alaikum%2C%20saya%20ingin%20berkonsultasi%20mengenai%20paket%20perjalanan%20Jam%20Wisata."
                target="_blank"
                rel="noopener noreferrer"
                className="lift-soft inline-flex h-[44px] sm:h-[48px] lg:h-[50px] items-center justify-center gap-2 rounded-[8px] border border-[#D7A72B]/60 bg-[#061A2F]/60 px-4.5 sm:px-5 text-xs lg:text-[13px] font-bold uppercase tracking-wider text-[#FAF8F3] backdrop-blur-sm transition duration-300 hover:border-[#E8C967] hover:bg-[#061A2F]/85 hover:text-[#E8C967] active:scale-95"
              >
                <MessageCircle className="size-3.5 text-[#E8C967]" />
                <span>Konsultasi Gratis</span>
              </a>
            </div>
          </div>

          {/* Bottom Aligned Row: Left Trust Indicator (Legal & Terpercaya) + Right Video CTA */}
          <div className="mt-6 sm:mt-10 lg:mt-12 flex flex-col gap-3.5 sm:gap-4 sm:flex-row sm:items-center sm:justify-between font-[family-name:var(--font-montserrat)] pt-1 sm:pt-2 pb-1 sm:pb-2">
            {/* Left: Trust Indicator */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <span className="grid size-9 sm:size-11 place-items-center rounded-xl bg-[#061A2F]/80 border border-[#D5A12B]/40 text-[#E8C967] shadow-sm ring-1 ring-[#D5A12B]/20">
                <svg className="size-5 sm:size-6 text-[#E8C967]" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                  <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91.25,124.39a15.54,15.54,0,0,0,9.5,0c15.43-5.05,91.25-34.78,91.25-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,105.77-80,110.5-13.65-4.73-80-32.08-80-110.5V56H208ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" />
                </svg>
              </span>
              <div className="text-left leading-tight">
                <strong className="block text-xs sm:text-[15px] font-bold text-white tracking-wide">
                  Legal &amp; Terpercaya
                </strong>
                <span className="text-[10.5px] sm:text-xs text-slate-300 font-medium">
                  Amanah &amp; Profesional
                </span>
              </div>
            </div>

            {/* Right: Video Profile CTA (Enlarged, Aligned with Trust Items) */}
            <div className="shrink-0 flex justify-start sm:justify-end mt-1 sm:mt-0">
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="lift-soft group inline-flex w-full xs:w-auto items-center justify-between xs:justify-start gap-3 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-[#D5A12B]/45 bg-[#061A2F]/80 px-3.5 sm:px-4.5 py-2 sm:py-3 text-white backdrop-blur-md shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition duration-300 hover:border-[#E8C967] hover:bg-[#061A2F]/95 hover:scale-[1.03] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-8 sm:size-11 place-items-center rounded-lg sm:rounded-xl bg-gradient-gold-rich text-[#061A2F] shadow-md transition-transform group-hover:scale-110">
                    <Play className="size-3.5 sm:size-4.5 fill-current ml-0.5" />
                  </span>
                  <div className="text-left pr-1 leading-tight">
                    <span className="font-[family-name:var(--font-cormorant)] block text-[11px] sm:text-sm font-semibold italic text-slate-200">
                      Tonton Video Profil
                    </span>
                    <strong className="font-[family-name:var(--font-cinzel)] block text-xs sm:text-[15px] font-bold tracking-wider text-[#E8C967]">
                      Jam Wisata
                    </strong>
                  </div>
                </div>
                <ArrowRight className="size-3.5 text-[#E8C967] xs:hidden" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Profile Modal */}
        {showVideoModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Video Profil Jam Wisata"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setShowVideoModal(false)}
          >
            <div
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-[#061A2F] border border-[#D5A12B]/40 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#021224]">
                <h3 className="font-[family-name:var(--font-cinzel)] text-sm sm:text-base font-bold text-[#E8C967]">
                  Video Profil Jam Wisata
                </h3>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  aria-label="Tutup video"
                  className="grid size-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/8vJae3mZooI?autoplay=1&rel=0"
                  title="Video Profil Jam Wisata"
                  className="absolute inset-0 size-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* Smooth Shallow Elliptical SVG Bottom Curve with Rich Gold Stroke */}
        <svg
          className="absolute inset-x-0 -bottom-[32px] sm:-bottom-[42px] lg:-bottom-[48px] w-full h-[34px] sm:h-[44px] lg:h-[50px] block pointer-events-none z-20"
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heroCurveGoldRich" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8C6708" />
              <stop offset="18%" stopColor="#B8860B" />
              <stop offset="38%" stopColor="#D4AF37" />
              <stop offset="52%" stopColor="#F5D97A" />
              <stop offset="72%" stopColor="#D4AF37" />
              <stop offset="90%" stopColor="#B8860B" />
              <stop offset="100%" stopColor="#8C6708" />
            </linearGradient>
          </defs>
          {/* Smooth Solid Fill extending hero dark navy */}
          <path
            d="M0 0 H1440 C1100 55 340 55 0 0 Z"
            fill="#021224"
          />
          {/* Smooth Gradient Gold Rich Stroke on the curved boundary */}
          <path
            d="M0 0 C340 55 1100 55 1440 0"
            stroke="url(#heroCurveGoldRich)"
            strokeWidth="3.5"
            fill="none"
            style={{ filter: "drop-shadow(0px 2px 8px rgba(212,175,55,0.65))" }}
          />
        </svg>
      </section>

      {/* Overlapping Floating Search Package Card (Widescreen 1240px, centered exactly on hero's bottom boundary line) */}
      <section className="relative z-30 -mt-[44px] sm:-mt-[50px] lg:-mt-[56px]" aria-label="Pencarian Paket Umrah">
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="rounded-[14px] sm:rounded-[16px] border border-[#D5A12B]/25 bg-white p-3.5 sm:p-4 lg:p-5 shadow-[0_14px_40px_rgba(0,0,0,0.14)]">
            <form
              onSubmit={submitSearch}
              className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_0.9fr_1.1fr_auto] lg:items-end"
            >
              {/* Field 1: Tujuan */}
              <div className="min-w-0">
                <label className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#061A2F]">
                  <Compass className="size-3.5 text-[#D5A12B]" />
                  <span>Tujuan</span>
                </label>
                <select
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                  className="h-[44px] sm:h-[46px] w-full rounded-[6px] border border-[#DCE5F0] bg-white px-3 text-xs font-semibold text-[#061A2F] outline-none transition focus:border-[#D5A12B] focus:bg-white cursor-pointer"
                >
                  <option value="">Semua Tujuan</option>
                  {options.types.map((type) => (
                    <option key={type} value={type}>
                      {packageTypeLabels[type]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2: Tanggal Keberangkatan */}
              <div className="min-w-0">
                <label className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#061A2F]">
                  <CalendarDays className="size-3.5 text-[#D5A12B]" />
                  <span>Tanggal Keberangkatan</span>
                </label>
                <select
                  value={draft.month}
                  onChange={(e) => setDraft({ ...draft, month: e.target.value })}
                  className="h-[44px] sm:h-[46px] w-full rounded-[6px] border border-[#DCE5F0] bg-white px-3 text-xs font-semibold text-[#061A2F] outline-none transition focus:border-[#D5A12B] focus:bg-white cursor-pointer"
                >
                  <option value="">Semua Bulan</option>
                  {options.months.map((month) => (
                    <option key={month} value={month}>
                      {monthLabel(month)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 3: Durasi */}
              <div className="min-w-0">
                <label className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#061A2F]">
                  <Clock3 className="size-3.5 text-[#D5A12B]" />
                  <span>Durasi</span>
                </label>
                <select
                  value={draft.duration}
                  onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                  className="h-[44px] sm:h-[46px] w-full rounded-[6px] border border-[#DCE5F0] bg-white px-3 text-xs font-semibold text-[#061A2F] outline-none transition focus:border-[#D5A12B] focus:bg-white cursor-pointer"
                >
                  <option value="">Semua Durasi</option>
                  {options.durations.map((dur) => (
                    <option key={dur} value={dur}>
                      {dur}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 4: Maskapai */}
              <div className="min-w-0">
                <label className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#061A2F]">
                  <Plane className="size-3.5 text-[#D5A12B]" />
                  <span>Maskapai</span>
                </label>
                <select
                  value={draft.airline}
                  onChange={(e) => setDraft({ ...draft, airline: e.target.value })}
                  className="h-[44px] sm:h-[46px] w-full rounded-[6px] border border-[#DCE5F0] bg-white px-3 text-xs font-semibold text-[#061A2F] outline-none transition focus:border-[#D5A12B] focus:bg-white cursor-pointer"
                >
                  <option value="">Semua Maskapai</option>
                  {options.airlines.map((airline) => (
                    <option key={airline} value={airline}>
                      {airline}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 5: CARI PAKET Button (Dark Navy) */}
              <button
                type="submit"
                className="flex h-[44px] sm:h-[46px] items-center justify-center gap-2 rounded-[6px] bg-[#061A2F] hover:bg-[#0A2745] px-6 text-xs font-extrabold uppercase tracking-wider text-[#FAF8F3] hover:text-[#E8B84A] shadow-md transition duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer sm:col-span-2 lg:col-span-1"
              >
                <Search className="size-3.5 text-[#E8B84A]" />
                <span>Cari Paket</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Keunggulan Jam Wisata (Horizontal 6-Item Strip on Desktop) */}
      <section className="bg-white pt-10 sm:pt-12 lg:pt-14 pb-4 sm:pb-6" aria-label="Keunggulan Jam Wisata">
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 sm:gap-6 xl:gap-0 xl:divide-x xl:divide-[#061A2F]/10 rounded-2xl border border-[#061A2F]/8 bg-white p-5 sm:p-6 xl:p-4 shadow-xs">
            {/* Item 1: Legal & Berizin Resmi */}
            <div className="flex items-center gap-3 xl:px-3.5 first:xl:pl-2">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91.25,124.39a15.54,15.54,0,0,0,9.5,0c15.43-5.05,91.25-34.78,91.25-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,105.77-80,110.5-13.65-4.73-80-32.08-80-110.5V56H208ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Legal &amp; Berizin Resmi
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Amanah, profesional, dan berizin resmi
                </p>
              </div>
            </div>

            {/* Item 2: Bimbingan Sesuai Sunnah */}
            <div className="flex items-center gap-3 xl:px-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M216,40H48A16,16,0,0,0,32,56V184a16,16,0,0,0,16,16H208a8,8,0,0,1,8,8v8a8,8,0,0,1-16,0v-4H48a24,24,0,0,1-24-24V56A24,24,0,0,1,48,32H216a8,8,0,0,1,8,8V184a8,8,0,0,1-16,0V48A8,8,0,0,1,216,40ZM176,88H80a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Zm0,32H80a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Bimbingan Sunnah
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Manasik intensif sesuai tuntunan Nabi
                </p>
              </div>
            </div>

            {/* Item 3: Hotel Dekat Masjid */}
            <div className="flex items-center gap-3 xl:px-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M240,192h-8V56a16,16,0,0,0-16-16H168a16,16,0,0,0-16,16v40H40A16,16,0,0,0,24,112V192H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM168,56h48V192H168ZM40,112H152V192H40Zm88,16a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16h56A8,8,0,0,1,128,128Zm0,32a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16h56A8,8,0,0,1,128,160Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Hotel Dekat Masjid
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Kenyamanan maksimal di tanah suci
                </p>
              </div>
            </div>

            {/* Item 4: Maskapai Ternama */}
            <div className="flex items-center gap-3 xl:px-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M239.19,84.47l-48,48A8,8,0,0,1,185.54,135L144,119.46v44.69l18.83,18.83A8,8,0,0,1,165.19,190l-14.85,14.85a8,8,0,0,1-11.31,0L112,177.88,85,204.83a8,8,0,0,1-11.31,0L58.83,189.97a8,8,0,0,1,0-11.31L85.78,151.71,58.83,124.76a8,8,0,0,1,0-11.31L73.68,98.6a8,8,0,0,1,7.09-2.35L99.6,115.08,144.29,73.54,128.75,32A8,8,0,0,1,131,23.35l48-48a8,8,0,0,1,12.43,1.3l49.2,65.6A8,8,0,0,1,239.19,84.47Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Maskapai Ternama
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Garuda, Saudia, Qatar, Oman &amp; Emirates
                </p>
              </div>
            </div>

            {/* Item 5: Pelayanan Tulus */}
            <div className="flex items-center gap-3 xl:px-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C110.84,204,32,150.31,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,150.31,145.16,204,128,214.8Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Pelayanan Sepenuh Hati
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Mendampingi setiap kebutuhan jamaah
                </p>
              </div>
            </div>

            {/* Item 6: Transparansi Biaya */}
            <div className="flex items-center gap-3 xl:px-3.5 last:xl:pr-2">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,144H32V64H224V192Zm-96-88a24,24,0,1,0,24,24A24,24,0,0,0,128,104Zm0,32a8,8,0,1,1,8-8A8,8,0,0,1,128,136Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Transparansi Biaya
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Harga all-in tanpa biaya tersembunyi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paket Umrah Section (Directly after Keunggulan) */}
      <section id="paket-umrah" className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24">
        <div className="jam-container">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/20">
              Pilihan Terbaik
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl font-bold text-[#061A2F]">
              Paket Unggulan
            </h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#64748B]">
              Pilihan program ibadah dengan fasilitas terbaik dan pembimbing berpengalaman.
            </p>
          </div>

          <div aria-live="polite" className="mt-6 flex min-h-8 flex-wrap items-center justify-center gap-2">
            {hasSearched ? (
              <>
                <span className="mr-1 text-xs font-extrabold text-[#061A2F]">
                  {filteredPackages.length} paket ditemukan:
                </span>
                {activeChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-white border border-[#D5A12B]/40 px-3 py-1 text-[11px] font-bold text-[#061A2F] shadow-xs"
                  >
                    {chip}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#D5A12B] hover:underline ml-2 cursor-pointer"
                >
                  <RotateCcw className="size-3" /> Reset Filter
                </button>
              </>
            ) : null}
          </div>

          {filteredPackages.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPackages.map((item) => (
                <PackageCard key={item.id} travelPackage={item} />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-[640px] rounded-3xl border border-[#061A2F]/10 bg-white p-8 text-center shadow-xs">
              <CircleGauge className="mx-auto size-8 text-[#D5A12B]" />
              <h3 className="mt-3 text-lg font-extrabold text-[#061A2F]">
                Belum ada paket yang sesuai dengan filter pencarian.
              </h3>
              <p className="mt-1.5 text-xs text-[#64748B]">
                Tim kami siap membantu mencarikan jadwal dan kriteria yang sesuai untuk Anda.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#061A2F]/20 bg-white px-4 text-xs font-bold text-[#061A2F]"
                >
                  <RotateCcw className="size-3.5" /> Reset Filter
                </button>
                <a
                  href={whatsappHref(emptyMessage, "Hasil Pencarian Kosong")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lift-soft sheen-gold inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-gold-rich px-4 text-xs font-extrabold text-[#061A2F] shadow-sm"
                >
                  <MessageCircle className="size-3.5" /> Tanyakan Jadwal via WhatsApp
                </a>
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <a
              href="https://jamwisata.com/transaksi/paket-umrah"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-[#061A2F]/20 hover:border-[#D5A12B] bg-white px-6 text-xs font-bold text-[#061A2F] transition hover:-translate-y-0.5 shadow-2xs"
            >
              Lihat Semua Paket di Portal <ArrowRight className="size-3.5 text-[#D5A12B]" />
            </a>
          </div>
        </div>
      </section>

      {/* Trust Statistics / Achievement Counter Section */}
      <section className="relative isolate overflow-hidden bg-[#030F1F] text-white py-12 sm:py-14 lg:py-16 border-y border-[#D5A12B]/30 shadow-inner" aria-label="Statistik & Kepercayaan Jamaah">
        {/* Full Quality Panoramic Background Photo with Mosque Architecture */}
        <Image
          src="/stats-bg-panoramic.png"
          alt="Jam Wisata Travel Umrah"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center pointer-events-none"
        />

        {/* Content Container */}
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-0 lg:divide-x lg:divide-white/15">
            {/* Stat 1: Ratusan+ Jamaah Berangkat */}
            <div className="group rounded-2xl lg:rounded-none border border-[#D5A12B]/30 lg:border-none bg-[#061A2F]/85 lg:bg-transparent backdrop-blur-md p-3.5 sm:p-5 lg:p-0 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4.5 text-center sm:text-left lg:px-6 first:lg:pl-0 shadow-md lg:shadow-none transition-all duration-300 hover:border-[#D5A12B]/60 hover:bg-[#061A2F]/95 lg:hover:bg-transparent">
              <div className="p-[1.5px] rounded-2xl bg-gradient-to-b from-[#F5D97A] via-[#D4AF37] to-[#8C6708] shadow-[0_4px_16px_rgba(212,175,55,0.30)] shrink-0">
                <span className="grid size-10 sm:size-12 place-items-center rounded-[14px] bg-[#021224] text-[#F5D97A]">
                  <svg className="size-5.5 sm:size-6.5" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.74a8,8,0,0,1-11.07-2.37A80,80,0,0,0,172,165.48a8,8,0,0,1,8.92-13.3A95.73,95.73,0,0,1,228.47,195.63,8,8,0,0,1,250.14,206.74ZM172,148a44,44,0,1,0-44-44,8,8,0,0,1-16,0,60,60,0,1,1,68.42,59.32,8,8,0,0,1-8.42-15.32Z" />
                  </svg>
                </span>
              </div>
              <div className="leading-tight min-w-0">
                <span className="font-[family-name:var(--font-cinzel)] text-xl xs:text-2xl sm:text-[28px] lg:text-[32px] font-bold text-gradient-gold-rich tracking-tight block">
                  Ratusan+
                </span>
                <span className="mt-0.5 text-[11px] xs:text-xs sm:text-[13.5px] font-medium text-slate-100 block">
                  Jamaah Berangkat
                </span>
              </div>
            </div>

            {/* Stat 2: 3+ Tahun Pengalaman */}
            <div className="group rounded-2xl lg:rounded-none border border-[#D5A12B]/30 lg:border-none bg-[#061A2F]/85 lg:bg-transparent backdrop-blur-md p-3.5 sm:p-5 lg:p-0 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4.5 text-center sm:text-left lg:px-6 shadow-md lg:shadow-none transition-all duration-300 hover:border-[#D5A12B]/60 hover:bg-[#061A2F]/95 lg:hover:bg-transparent">
              <div className="p-[1.5px] rounded-2xl bg-gradient-to-b from-[#F5D97A] via-[#D4AF37] to-[#8C6708] shadow-[0_4px_16px_rgba(212,175,55,0.30)] shrink-0">
                <span className="grid size-10 sm:size-12 place-items-center rounded-[14px] bg-[#021224] text-[#F5D97A]">
                  <svg className="size-5.5 sm:size-6.5" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M225.86,102.82c-.06-.3-.12-.6-.19-.89l-13-56.49a16,16,0,0,0-12.16-12.16l-56.49-13c-.29-.07-.59-.13-.89-.19a16,16,0,0,0-6.26,0c-.3.06-.6.12-.89.19l-56.49,13A16,16,0,0,0,67.33,45.44l-13,56.49c-.07.29-.13.59-.19.89a16,16,0,0,0,0,6.26c.06.3.12.6.19.89l13,56.49a16,16,0,0,0,12.16,12.16l56.49,13c.3.07.59.13.89.19a16,16,0,0,0,6.26,0c.29-.06.59-.12.89-.19l56.49-13a16,16,0,0,0,12.16-12.16l13-56.49c.07-.29.13-.59.19-.89A16,16,0,0,0,225.86,102.82Zm-17.78,5.43-13,56.49-56.49,13h0L82.1,164.74l-13-56.49L82.1,51.76l56.49-13,56.49,13,13,56.49ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" />
                  </svg>
                </span>
              </div>
              <div className="leading-tight min-w-0">
                <span className="font-[family-name:var(--font-cinzel)] text-xl xs:text-2xl sm:text-[28px] lg:text-[32px] font-bold text-gradient-gold-rich tracking-tight block">
                  3+ Tahun
                </span>
                <span className="mt-0.5 text-[11px] xs:text-xs sm:text-[13.5px] font-medium text-slate-100 block">
                  Pengalaman
                </span>
              </div>
            </div>

            {/* Stat 3: 99% Kepuasan Jamaah */}
            <div className="group rounded-2xl lg:rounded-none border border-[#D5A12B]/30 lg:border-none bg-[#061A2F]/85 lg:bg-transparent backdrop-blur-md p-3.5 sm:p-5 lg:p-0 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4.5 text-center sm:text-left lg:px-6 shadow-md lg:shadow-none transition-all duration-300 hover:border-[#D5A12B]/60 hover:bg-[#061A2F]/95 lg:hover:bg-transparent">
              <div className="p-[1.5px] rounded-2xl bg-gradient-to-b from-[#F5D97A] via-[#D4AF37] to-[#8C6708] shadow-[0_4px_16px_rgba(212,175,55,0.30)] shrink-0">
                <span className="grid size-10 sm:size-12 place-items-center rounded-[14px] bg-[#021224] text-[#F5D97A]">
                  <svg className="size-5.5 sm:size-6.5" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.37,153.5,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.2-58.84,44.86-39.11A16,16,0,0,0,239.2,97.29Zm-52.09,46.73a8,8,0,0,0-2.58,7.94l11.53,51.41-44.64-27.12a8,8,0,0,0-8.36,0l-44.55,27.07,11.53-51.36a8,8,0,0,0-2.58-7.95L71.29,104.85l51.86-4.5a8,8,0,0,0,6.72-4.88L128,47.88l18.13,47.59a8,8,0,0,0,6.72,4.88l51.86,4.5Z" />
                  </svg>
                </span>
              </div>
              <div className="leading-tight min-w-0">
                <span className="font-[family-name:var(--font-cinzel)] text-xl xs:text-2xl sm:text-[28px] lg:text-[32px] font-bold text-gradient-gold-rich tracking-tight block">
                  99%
                </span>
                <span className="mt-0.5 text-[11px] xs:text-xs sm:text-[13.5px] font-medium text-slate-100 block">
                  Kepuasan Jamaah
                </span>
              </div>
            </div>

            {/* Stat 4: 10+ Destinasi Pilihan */}
            <div className="group rounded-2xl lg:rounded-none border border-[#D5A12B]/30 lg:border-none bg-[#061A2F]/85 lg:bg-transparent backdrop-blur-md p-3.5 sm:p-5 lg:p-0 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4.5 text-center sm:text-left lg:px-6 last:lg:pr-0 shadow-md lg:shadow-none transition-all duration-300 hover:border-[#D5A12B]/60 hover:bg-[#061A2F]/95 lg:hover:bg-transparent">
              <div className="p-[1.5px] rounded-2xl bg-gradient-to-b from-[#F5D97A] via-[#D4AF37] to-[#8C6708] shadow-[0_4px_16px_rgba(212,175,55,0.30)] shrink-0">
                <span className="grid size-10 sm:size-12 place-items-center rounded-[14px] bg-[#021224] text-[#F5D97A]">
                  <svg className="size-5.5 sm:size-6.5" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM173.66,82.34a8,8,0,0,0-9.19-1.87l-64,24a8,8,0,0,0-4.63,4.63l-24,64a8,8,0,0,0,10.14,10.14l64-24a8,8,0,0,0,4.63-4.63l24-64A8,8,0,0,0,173.66,82.34Zm-26.47,40.85-30.82,11.56,11.56-30.82,30.82-11.56Z" />
                  </svg>
                </span>
              </div>
              <div className="leading-tight min-w-0">
                <span className="font-[family-name:var(--font-cinzel)] text-xl xs:text-2xl sm:text-[28px] lg:text-[32px] font-bold text-gradient-gold-rich tracking-tight block">
                  10+
                </span>
                <span className="mt-0.5 text-[11px] xs:text-xs sm:text-[13.5px] font-medium text-slate-100 block">
                  Destinasi Pilihan
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mengapa Memilih Jam Wisata? (Why Choose Us) Section */}
      <section id="tentang-kami" className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24 border-t border-[#061A2F]/6">
        <div className="jam-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
            {/* 1. Intro di Kiri */}
            <div className="flex flex-col justify-between lg:col-span-3 py-1">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/25 mb-3">
                  <Building2 className="size-3.5" /> Mengapa Kami?
                </span>
                <h2 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl lg:text-[30px] font-bold leading-tight text-[#061A2F]">
                  Mengapa Memilih Jam Wisata?
                </h2>
                <div className="w-12 h-1 bg-gradient-gold-rich rounded-full mt-3.5 mb-4" />
                <p className="text-xs sm:text-sm leading-relaxed text-[#59616D]">
                  Kami berkomitmen memberikan layanan terbaik dengan mengutamakan amanah, kenyamanan, dan keberkahan.
                </p>
              </div>

              <div className="mt-6 pt-2">
                <a
                  href="/tentang-kami"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#061A2F] hover:bg-[#0A2745] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:-translate-y-0.5"
                >
                  Tentang Kami
                </a>
              </div>
            </div>

            {/* 2. Gambar Utama Ka'bah & Jamaah */}
            <div className="lg:col-span-3 flex">
              <figure className="relative min-h-[340px] sm:min-h-[380px] w-full overflow-hidden rounded-[20px] shadow-xs border border-[#061A2F]/8">
                <Image
                  src="/why-choose-kabah.jpg"
                  alt="Pintu Kiswah Ka'bah dan Jamaah Umrah Jam Wisata"
                  fill
                  sizes="(min-width:1024px) 25vw, 50vw"
                  className="object-cover object-center"
                />
              </figure>
            </div>

            {/* 3. Checklist Keunggulan */}
            <div className="flex flex-col justify-center lg:col-span-3 py-1">
              <ul className="space-y-3.5 sm:space-y-4">
                {[
                  "Legalitas Resmi & Terpercaya",
                  "Bimbingan Ibadah Sesuai Sunnah",
                  "Akomodasi Hotel Dekat Masjid",
                  "Penerbangan Maskapai Ternama",
                  "Transparansi Biaya & Layanan All In",
                  "Sahabat Baitullah (Alumni Berkelanjutan)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-xs sm:text-[13.5px] font-semibold text-[#061A2F] leading-snug">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full border border-[#D5A12B]/40 bg-white text-[#D5A12B] shadow-2xs mt-0.5">
                      <svg className="size-3.5" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="216 72 104 184 48 128" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Islamic Quote Card di Kanan */}
            <div className="lg:col-span-3 flex">
              <div className="relative isolate flex flex-col justify-center items-center text-center w-full overflow-hidden rounded-[22px] bg-[#021224] p-6 sm:p-7 border border-[#D5A12B]/35 shadow-md">
                {/* Subtle Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(213,161,43,0.12)_0%,transparent_70%)] pointer-events-none" />
                
                {/* Subtle Mosque Silhouette at bottom */}
                <div className="absolute -bottom-1 left-0 right-0 h-16 pointer-events-none opacity-12 text-[#D5A12B]" aria-hidden="true">
                  <svg viewBox="0 0 320 120" fill="currentColor" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,120 L0,85 Q15,80 30,85 L30,60 Q35,40 40,60 L40,85 Q55,80 70,85 L70,30 Q75,10 80,30 L80,85 Q95,78 110,85 L110,50 Q115,28 120,50 L120,85 Q135,80 150,85 L150,65 Q160,45 170,65 L170,85 L320,85 L320,120 Z" />
                    <path d="M20,85 A15,15 0 0,1 50,85 Z M70,85 A20,20 0 0,1 110,85 Z M140,85 A18,18 0 0,1 176,85 Z" />
                  </svg>
                </div>

                <div className="relative z-10">
                  {/* Arabic Calligraphy Verse */}
                  <p className="font-serif text-xl sm:text-[22px] font-bold text-gradient-gold-rich leading-loose tracking-wide" dir="rtl">
                    وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ
                  </p>

                  {/* Translation */}
                  <p className="mt-3 text-xs sm:text-[13px] text-slate-200 leading-relaxed">
                    Dan sempurnakanlah ibadah Haji dan Umrah karena Allah.
                  </p>

                  {/* Divider */}
                  <div className="w-14 h-px bg-[#D5A12B]/40 mx-auto my-3.5" />

                  {/* Surah Reference */}
                  <p className="text-[11px] sm:text-xs font-bold tracking-wider text-[#E8C967]">
                    (QS. Al-Baqarah : 196)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
