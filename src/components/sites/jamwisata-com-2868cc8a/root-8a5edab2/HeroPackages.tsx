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
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { formatIDR, umrahPackages, whatsappHref } from "@/data/jamwisata";
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
  const context = [
    `Assalamu’alaikum, saya tertarik dengan Paket ${travelPackage.name}`,
    travelPackage.departureDate ? `keberangkatan ${travelPackage.departureDate}.` : ".",
    `Mohon informasi lengkap mengenai durasi, hotel Makkah dan Madinah, fasilitas, harga, serta ketersediaan seat.`,
  ].join(" ");

  return (
    <article className="lift-soft group flex h-full flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_16px_44px_rgba(6,26,47,.08)] ring-1 ring-[#061A2F]/8 transition-all duration-500 hover:shadow-[0_28px_64px_rgba(6,26,47,.16),0_0_0_1px_rgba(213,161,43,.3)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E8E4DB]">
        <Image
          src={travelPackage.image}
          alt={`Paket ${travelPackage.name} Jam Wisata`}
          fill
          sizes="(min-width:1024px) 33vw,(min-width:640px) 50vw,100vw"
          className="object-cover transition duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061A2F]/70 via-transparent to-[#061A2F]/10 transition-opacity duration-500 group-hover:from-[#061A2F]/60" />
        {travelPackage.badge ? (
          <span className="absolute top-4 left-4 rounded-xl bg-gradient-gold-rich px-3 py-1.5 text-[10px] font-extrabold tracking-wider text-[#061A2F] uppercase shadow-md">
            {travelPackage.badge}
          </span>
        ) : null}
        {travelPackage.departureDate ? (
          <span className="absolute right-4 bottom-4 left-4 flex items-center gap-2 rounded-xl border border-white/15 bg-[#061A2F]/85 px-3.5 py-2 text-[11px] font-bold text-white backdrop-blur-md">
            <CalendarDays className="size-4 text-[#E8C967]" />
            {travelPackage.departureDate}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold tracking-[.14em] text-[#D5A12B] uppercase">
              {packageTypeLabels[travelPackage.packageType]}
            </p>
            <h3 className="mt-1.5 text-[22px] leading-[1.15] font-extrabold tracking-tight text-[#061A2F] transition-colors duration-300 group-hover:text-[#0A2745]">
              {travelPackage.name}
            </h3>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-gold-rich text-[#061A2F] shadow-xs">
            <Plane className="size-4" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 divide-x divide-[#061A2F]/8 border-y border-[#061A2F]/8 py-3 text-[11px] text-[#64748B]">
          <div className="flex items-center gap-2.5 pr-2">
            <Clock3 className="size-4 shrink-0 text-[#D5A12B]" />
            <span>
              <strong className="block text-[10px] font-extrabold text-[#061A2F]">Durasi</strong>
              {travelPackage.durationDays ? `${travelPackage.durationDays} hari` : "9 - 12 Hari"}
            </span>
          </div>
          <div className="flex items-center gap-2.5 pl-3">
            <Plane className="size-4 shrink-0 text-[#D5A12B]" />
            <span>
              <strong className="block text-[10px] font-extrabold text-[#061A2F]">Maskapai</strong>
              {travelPackage.airline ?? "Saudia / Garuda"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-1 flex-col justify-between pt-2">
          <div>
            <span className="text-[11px] font-semibold text-[#64748B]">Mulai dari</span>
            <p className="text-2xl font-black tracking-tight text-[#061A2F]">
              {travelPackage.priceFrom ? `Rp${formatIDR(travelPackage.priceFrom)}` : "Hubungi Kami"}
              {travelPackage.priceFrom ? <span className="ml-1 text-xs font-semibold text-[#64748B]">/pax</span> : null}
            </p>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <a
              href={travelPackage.detailUrl ?? "https://jamwisata.com/transaksi/paket-umrah"}
              target="_blank"
              rel="noopener noreferrer"
              className="lift-soft sheen-gold inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-gold-rich px-3.5 text-xs font-bold text-[#061A2F] shadow-sm transition"
            >
              Lihat Detail <ArrowRight className="size-3.5" />
            </a>
            <a
              href={whatsappHref(context, `Paket — ${travelPackage.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#D5A12B]/40 bg-white hover:bg-slate-50 px-3 text-xs font-bold text-[#061A2F] transition"
            >
              <MessageCircle className="size-3.5 text-[#D5A12B]" /> Tanya via WA
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export function HeroPackages() {
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const [hasSearched, setHasSearched] = useState(false);

  const options = useMemo(() => ({
    months: [...new Set(umrahPackages.map((item) => item.departureMonth).filter(Boolean))] as string[],
    types: [...new Set(umrahPackages.map((item) => item.packageType))],
    airlines: [...new Set(umrahPackages.map((item) => item.airline).filter(Boolean))] as string[],
    durations: ["9 Hari", "10 Hari", "12 Hari", "16 Hari"],
  }), []);

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
    return umrahPackages.filter((item) => {
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
  }, [applied]);

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

            {/* Heading — Cinzel (strictly 2 visual lines on desktop, nicely wrapped on small mobile) */}
            <h1 className="font-[family-name:var(--font-cinzel)] text-[26px] xs:text-[30px] sm:text-[42px] lg:text-[50px] xl:text-[56px] font-bold leading-[1.12] sm:leading-[1.08] tracking-[0.02em] text-white drop-shadow-md">
              <span className="block sm:whitespace-nowrap">Perjalanan Ibadah,</span>
              <span className="text-gradient-gold-rich mt-0.5 block font-bold sm:whitespace-nowrap">
                Pengalaman Tak Terlupakan
              </span>
            </h1>

            {/* Body — Montserrat (easy to read, clean, modern) */}
            <p className="font-[family-name:var(--font-montserrat)] mt-2.5 sm:mt-3.5 max-w-[430px] lg:max-w-[460px] text-left text-[12.5px] sm:text-[14.5px] lg:text-[15.5px] font-normal leading-[1.55] sm:leading-[1.6] text-slate-200/90">
              Jam Wisata hadir untuk menemani setiap langkah Anda menuju Baitullah dengan layanan amanah, profesional, dan penuh keberkahan.
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

          {/* Bottom Aligned Row: Left Trust Indicators (Enlarged, Clean) + Right Video CTA (Enlarged) */}
          <div className="mt-6 sm:mt-10 lg:mt-12 flex flex-col gap-3.5 sm:gap-4 sm:flex-row sm:items-center sm:justify-between font-[family-name:var(--font-montserrat)] pt-1 sm:pt-2 pb-1 sm:pb-2">
            {/* Left: Trust Indicators (Clean without card styling) */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-7 lg:gap-8">
              {/* Trust Item 1: Legal & Terpercaya */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <svg className="size-5 sm:size-7 shrink-0 text-[#E8C967] drop-shadow-sm" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                  <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91.25,124.39a15.54,15.54,0,0,0,9.5,0c15.43-5.05,91.25-34.78,91.25-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,105.77-80,110.5-13.65-4.73-80-32.08-80-110.5V56H208ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" />
                </svg>
                <div className="text-left leading-tight">
                  <strong className="block text-xs sm:text-[15px] font-bold text-white tracking-wide">
                    Legal &amp; Terpercaya
                  </strong>
                  <span className="text-[10px] sm:text-xs text-slate-300 font-medium">
                    Amanah &amp; Profesional
                  </span>
                </div>
              </div>

              {/* Subtle vertical separator (tablet & desktop) */}
              <span className="hidden sm:block h-7 w-px bg-white/20" />

              {/* Trust Item 2: Anggota ASTA */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <svg className="size-5 sm:size-7 shrink-0 text-[#E8C967] drop-shadow-sm" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                  <path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32,0L136,123.31V216a8,8,0,0,1-16,0V123.31L85.66,157.66a8,8,0,0,1-11.32-11.32l48-48a8,8,0,0,1,11.32,0L168,132.69l42.34-42.35a8,8,0,0,1,11.32,0A8,8,0,0,1,229.66,109.66ZM128,24A72,72,0,1,0,200,96,72.08,72.08,0,0,0,128,24Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,152Z" />
                </svg>
                <div className="text-left leading-tight">
                  <strong className="block text-xs sm:text-[15px] font-bold text-white tracking-wide">
                    Anggota ASTA
                  </strong>
                  <span className="text-[10px] sm:text-xs text-slate-300 font-medium">
                    Resmi &amp; Terakreditasi
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Video Profile CTA (Enlarged, Aligned with Trust Items) */}
            <div className="shrink-0 flex justify-start sm:justify-end mt-1 sm:mt-0">
              <a
                href="https://www.youtube.com/@jamwisatabandung"
                target="_blank"
                rel="noopener noreferrer"
                className="lift-soft group inline-flex w-full xs:w-auto items-center justify-between xs:justify-start gap-3 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-[#D5A12B]/45 bg-[#061A2F]/80 px-3.5 sm:px-4.5 py-2 sm:py-3 text-white backdrop-blur-md shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition duration-300 hover:border-[#E8C967] hover:bg-[#061A2F]/95 hover:scale-[1.03]"
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
              </a>
            </div>
          </div>
        </div>

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
            {/* Item 1: Legal & Terpercaya */}
            <div className="flex items-center gap-3 xl:px-3.5 first:xl:pl-2">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91.25,124.39a15.54,15.54,0,0,0,9.5,0c15.43-5.05,91.25-34.78,91.25-124.39V56A16,16,0,0,0,208,40Z" />
                  <polyline points="88 136 112 160 168 104" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Legal &amp; Terpercaya
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Amanah, profesional, dan berizin resmi
                </p>
              </div>
            </div>

            {/* Item 2: Pelayanan Profesional */}
            <div className="flex items-center gap-3 xl:px-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M208,128v40a24,24,0,0,1-24,24H168" />
                  <path d="M48,128v40a24,24,0,0,0,24,24H88" />
                  <path d="M48,128A80,80,0,0,1,208,128" />
                  <rect x="32" y="128" width="32" height="56" rx="8" />
                  <rect x="192" y="128" width="32" height="56" rx="8" />
                  <path d="M128,216h24a16,16,0,0,0,16-16v-8" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Pelayanan Profesional
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Tim berpengalaman dan responsif
                </p>
              </div>
            </div>

            {/* Item 3: Hotel Berkualitas */}
            <div className="flex items-center gap-3 xl:px-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="32" y="48" width="128" height="176" rx="8" />
                  <path d="M160,88h56a8,8,0,0,1,8,8V224H160" />
                  <line x1="72" y1="88" x2="88" y2="88" />
                  <line x1="104" y1="88" x2="120" y2="88" />
                  <line x1="72" y1="128" x2="88" y2="128" />
                  <line x1="104" y1="128" x2="120" y2="128" />
                  <line x1="72" y1="168" x2="88" y2="168" />
                  <line x1="104" y1="168" x2="120" y2="168" />
                  <path d="M80,224v-24a16,16,0,0,1,32,0v24" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Hotel Berkualitas
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Pilihan hotel nyaman di lokasi strategis
                </p>
              </div>
            </div>

            {/* Item 4: Maskapai Terbaik */}
            <div className="flex items-center gap-3 xl:px-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M236.4,79.6,183.1,133,96.6,112.5l-33.9,34,51.8,25.9L87.2,199.7,59.3,200,40,219.3l42.4,8.5,8.5,42.4,19.3-19.3.3-27.9,27.3-27.3,25.9,51.8,34-33.9L147.2,127.1l53.4-53.3a24,24,0,0,0-33.9-33.9l-6.7,6.7" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Maskapai Terbaik
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Perjalanan dengan maskapai premium
                </p>
              </div>
            </div>

            {/* Item 5: Bimbingan Ibadah */}
            <div className="flex items-center gap-3 xl:px-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M128,72c-24-24-48-24-88-24A16,16,0,0,0,24,64V192a16,16,0,0,0,16,16c40,0,64,0,88,24,24-24,48-24,88-24a16,16,0,0,0,16-16V64a16,16,0,0,0-16-16C176,48,152,48,128,72Z" />
                  <line x1="128" y1="72" x2="128" y2="232" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Bimbingan Ibadah
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Pendampingan selama perjalanan
                </p>
              </div>
            </div>

            {/* Item 6: Keberangkatan Terjadwal */}
            <div className="flex items-center gap-3 xl:px-3.5 last:xl:pr-2">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white border border-[#D5A12B]/35 text-[#D5A12B] shadow-2xs">
                <svg className="size-5.5" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="40" y="40" width="176" height="176" rx="16" />
                  <line x1="176" y1="24" x2="176" y2="56" />
                  <line x1="80" y1="24" x2="80" y2="56" />
                  <line x1="40" y1="88" x2="216" y2="88" />
                  <polyline points="92 148 116 172 164 124" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#061A2F] leading-snug">
                  Keberangkatan Terjadwal
                </h3>
                <p className="mt-0.5 text-[11px] text-[#59616D] leading-tight">
                  Jadwal rutin dan jelas setiap bulan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Jam Wisata Section */}
      <section id="tentang-kami" className="scroll-mt-24 bg-white pt-10 sm:pt-12 pb-20 sm:pb-24 lg:pb-28">
        <div className="jam-container grid items-center gap-12 lg:grid-cols-[.96fr_1.04fr] lg:gap-16">
          <div className="grid grid-cols-[1.25fr_.75fr] gap-3">
            <figure className="relative min-h-[440px] overflow-hidden rounded-[26px]">
              <Image
                src={`${assetRoot}/about.jpg`}
                alt="Kebersamaan jamaah Jam Wisata"
                fill
                sizes="(min-width:1024px) 38vw,65vw"
                className="object-cover"
              />
            </figure>
            <div className="grid gap-3 pt-12">
              <figure className="relative overflow-hidden rounded-[18px]">
                <Image
                  src={`${assetRoot}/umrah-2.png`}
                  alt="Kegiatan perjalanan jamaah"
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </figure>
              <figure className="relative overflow-hidden rounded-[18px]">
                <Image
                  src={`${assetRoot}/umrah-3.png`}
                  alt="Dokumentasi jamaah di tanah suci"
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </figure>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/20">
              <Building2 className="size-3.5" /> Tentang Jam Wisata
            </span>
            <h2 className="mt-3 font-playfair text-3xl sm:text-4xl font-bold leading-tight text-[#061A2F]">
              Perjalanan yang Baik Dimulai dari Persiapan yang Dipercaya.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#59616D]">
              Jam Wisata membantu mempersiapkan perjalanan umrah dan wisata halal dengan pelayanan yang jelas, nyaman, dan penuh perhatian. Mulai dari konsultasi hingga perjalanan selesai, tim kami siap mendampingi kebutuhan jamaah dan keluarga.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-[#061A2F]/8 bg-white p-3.5 shadow-2xs">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#D5A12B] border border-[#D5A12B]/30">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#061A2F]">Program Terencana</h3>
                  <p className="mt-0.5 text-[11px] text-[#64748B]">Jadwal dan rute disampaikan dengan transparan.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[#061A2F]/8 bg-white p-3.5 shadow-2xs">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#D5A12B] border border-[#D5A12B]/30">
                  <Hotel className="size-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#061A2F]">Hotel Strategis</h3>
                  <p className="mt-0.5 text-[11px] text-[#64748B]">Akomodasi dekat dengan Masjidil Haram &amp; Nabawi.</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://wa.me/6281809627499?text=Assalamu%E2%80%99alaikum%2C%20saya%20ingin%20konsultasi%20paket%20umrah%20Jam%20Wisata."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2.5 rounded-xl bg-[#061A2F] hover:bg-[#0A2745] px-6 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5"
              >
                Konsultasi Jadwal <ArrowRight className="size-4 text-[#E8B84A]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Paket Umrah Section */}
      <section id="paket-umrah" className="scroll-mt-24 bg-white py-20 sm:py-24 lg:py-28">
        <div className="jam-container">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/20">
              Paket Pilihan
            </span>
            <h2 className="mt-3 font-playfair text-3xl sm:text-4xl font-bold text-[#061A2F]">
              Temukan Program Umrah yang Sesuai untuk Anda
            </h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#64748B]">
              Pilih program berdasarkan jadwal, akomodasi, dan kebutuhan perjalanan ibadah Anda.
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
    </>
  );
}
