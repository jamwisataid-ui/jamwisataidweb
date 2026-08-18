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
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#D5A12B]/40 bg-[#FAF8F3] px-3 text-xs font-bold text-[#061A2F] transition hover:bg-[#F2EADB]"
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
        className="relative isolate min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] overflow-hidden rounded-b-[36px] sm:rounded-b-[50px] lg:rounded-b-[64px] bg-[#061A2F] text-white flex flex-col justify-between pt-[100px] sm:pt-[120px] pb-24 sm:pb-28 lg:pb-28 shadow-[0_24px_60px_rgba(6,26,47,0.35)]"
      >
        {/* Background Image of Masjidil Haram with Ka'bah & Clock Tower */}
        <Image
          src="/jamwisata-makkah.png"
          alt="Suasana Masjidil Haram, Ka'bah dan Makkah Clock Tower"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] sm:object-[68%_center] lg:object-[65%_center]"
        />

        {/* Elegant Cinematic Gradient Overlay: Deep Navy on Left, Transparent on Right */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,26,47,0.96)_0%,rgba(6,26,47,0.88)_35%,rgba(6,26,47,0.45)_68%,rgba(6,26,47,0.15)_100%)]" />
        {/* Top and Bottom Atmosphere Fades */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,26,47,0.75)_0%,transparent_22%,transparent_75%,rgba(6,26,47,0.95)_100%)]" />

        {/* Main Hero Content */}
        <div className="jam-container relative z-10 w-full my-auto py-6 sm:py-8 lg:py-10">
          <div className="max-w-[620px] lg:max-w-[560px] xl:max-w-[620px]">
            {/* Bismillah & Sub Heading (Cormorant Garamond) */}
            <div className="mb-4 sm:mb-5 flex flex-col items-start gap-2.5">
              <Image
                src={`${assetRoot}/bismillah.png`}
                alt="Bismillahirrahmanirrahim"
                width={384}
                height={86}
                className="h-auto w-[180px] sm:w-[210px] opacity-90 drop-shadow-sm"
              />
              <div className="flex items-center gap-2.5">
                <span className="h-px w-6 bg-gradient-gold-rich" />
                <p className="font-[family-name:var(--font-cormorant)] text-base sm:text-lg lg:text-xl font-semibold italic tracking-wide text-[#E8C967]">
                  Biro Perjalanan Umrah &amp; Wisata Halal
                </p>
              </div>
            </div>

            {/* Heading — Cinzel (48–72pt / authoritative & elegant) */}
            <h1 className="font-[family-name:var(--font-cinzel)] text-[32px] sm:text-[46px] lg:text-[54px] xl:text-[62px] font-bold leading-[1.18] tracking-[0.03em] text-white drop-shadow-md">
              PERJALANAN IBADAH,<br />
              <span className="text-gradient-gold-rich mt-1 block font-bold">
                PENGALAMAN TAK TERLUPAKAN
              </span>
            </h1>

            {/* Body — Montserrat (easy to read, clean, modern, text-left, line-height 150%) */}
            <p className="font-[family-name:var(--font-montserrat)] mt-4 sm:mt-5 max-w-[530px] text-left text-xs sm:text-[14px] lg:text-[15px] font-normal leading-[1.65] text-slate-100/90 sm:leading-[1.7]">
              Jam Wisata hadir untuk menemani setiap langkah Anda menuju Baitullah dengan layanan amanah, profesional, dan penuh keberkahan.
            </p>

            {/* CTA Buttons Row — Montserrat */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 font-[family-name:var(--font-montserrat)]">
              {/* Primary Gold CTA */}
              <a
                href="#paket-umrah"
                className="lift-soft sheen-gold inline-flex h-12 sm:h-13 items-center justify-center gap-2.5 rounded-xl bg-gradient-gold-rich px-6 sm:px-7 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#061A2F] shadow-[0_12px_32px_rgba(184,134,11,.38)] transition duration-300 hover:scale-[1.03] active:scale-95"
              >
                Lihat Paket Umroh <ArrowRight className="size-4" />
              </a>

              {/* Secondary Dark/Gold Outline CTA */}
              <a
                href="https://wa.me/6281809627499?text=Assalamu%E2%80%99alaikum%2C%20saya%20ingin%20berkonsultasi%20mengenai%20paket%20perjalanan%20Jam%20Wisata."
                target="_blank"
                rel="noopener noreferrer"
                className="lift-soft inline-flex h-12 sm:h-13 items-center justify-center gap-2.5 rounded-xl border border-[#D5A12B]/70 bg-[#061A2F]/50 px-5 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FAF8F3] backdrop-blur-sm transition duration-300 hover:border-[#E8C967] hover:bg-[#061A2F]/80 hover:text-[#E8C967] active:scale-95"
              >
                <MessageCircle className="size-4 text-[#E8C967]" />
                <span>Konsultasi Gratis</span>
              </a>
            </div>

            {/* Trust Indicators Horizontal — Montserrat */}
            <div className="font-[family-name:var(--font-montserrat)] mt-6 sm:mt-7 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-[11px] sm:text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-[#E8C967]" />
                <span>Legal &amp; Terpercaya</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#E8C967] text-sm leading-none">✦</span>
                <span>Anggota ASTA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video CTA Card (Right Side, Subtle Luxury Pill) */}
        <div className="jam-container relative z-20 w-full pointer-events-none">
          <div className="flex justify-end pointer-events-auto">
            <a
              href="https://www.youtube.com/@jamwisatabandung"
              target="_blank"
              rel="noopener noreferrer"
              className="lift-soft group inline-flex items-center gap-3.5 rounded-2xl border border-[#D5A12B]/40 bg-[#061A2F]/80 px-4 py-3 text-white backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition duration-300 hover:border-[#E8C967] hover:bg-[#061A2F]/95 hover:scale-[1.02]"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-gold-rich text-[#061A2F] shadow-md transition-transform group-hover:scale-110">
                <Play className="size-4 fill-current ml-0.5" />
              </span>
              <div className="text-left pr-1">
                <span className="font-[family-name:var(--font-cormorant)] block text-xs sm:text-sm font-semibold italic text-slate-300">
                  Tonton Video Profil
                </span>
                <strong className="font-[family-name:var(--font-cinzel)] block text-xs sm:text-sm font-bold tracking-wider text-[#E8C967]">
                  Jam Wisata
                </strong>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Rounded Rich Gold Border Accent */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] sm:h-[4px] bg-gradient-gold-rich shadow-[0_-2px_14px_rgba(212,175,55,0.7)]" />
      </section>

      {/* Overlapping Floating Search Package Card (1 Horizontal Row Desktop) */}
      <section className="relative z-30 -mt-10 sm:-mt-14 lg:-mt-14" aria-label="Pencarian Paket Umrah">
        <div className="jam-container">
          <div className="rounded-[18px] sm:rounded-[22px] border border-[#D5A12B]/25 bg-white p-4 sm:p-5 lg:p-6 shadow-[0_20px_50px_rgba(6,26,47,0.16)]">
            <form
              onSubmit={submitSearch}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_0.9fr_1.1fr_auto] lg:items-end"
            >
              {/* Field 1: Tujuan */}
              <div className="min-w-0">
                <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#061A2F]">
                  <Compass className="size-3.5 text-[#D5A12B]" />
                  <span>Tujuan</span>
                </label>
                <select
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#DCE5F0] bg-[#FAF8F3] px-3 text-xs font-bold text-[#061A2F] outline-none transition focus:border-[#D5A12B] focus:bg-white cursor-pointer"
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
                <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#061A2F]">
                  <CalendarDays className="size-3.5 text-[#D5A12B]" />
                  <span>Tanggal Keberangkatan</span>
                </label>
                <select
                  value={draft.month}
                  onChange={(e) => setDraft({ ...draft, month: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#DCE5F0] bg-[#FAF8F3] px-3 text-xs font-bold text-[#061A2F] outline-none transition focus:border-[#D5A12B] focus:bg-white cursor-pointer"
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
                <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#061A2F]">
                  <Clock3 className="size-3.5 text-[#D5A12B]" />
                  <span>Durasi</span>
                </label>
                <select
                  value={draft.duration}
                  onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#DCE5F0] bg-[#FAF8F3] px-3 text-xs font-bold text-[#061A2F] outline-none transition focus:border-[#D5A12B] focus:bg-white cursor-pointer"
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
                <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#061A2F]">
                  <Plane className="size-3.5 text-[#D5A12B]" />
                  <span>Maskapai</span>
                </label>
                <select
                  value={draft.airline}
                  onChange={(e) => setDraft({ ...draft, airline: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#DCE5F0] bg-[#FAF8F3] px-3 text-xs font-bold text-[#061A2F] outline-none transition focus:border-[#D5A12B] focus:bg-white cursor-pointer"
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
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#061A2F] hover:bg-[#0A2745] px-6 text-xs font-extrabold uppercase tracking-wider text-[#FAF8F3] hover:text-[#E8B84A] shadow-md transition duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer sm:col-span-2 lg:col-span-1"
              >
                <Search className="size-4 text-[#E8B84A]" />
                <span>Cari Paket</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Tentang Jam Wisata Section */}
      <section id="tentang-kami" className="scroll-mt-24 bg-[#FAF8F3] py-20 sm:py-24 lg:py-28">
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
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#FAF8F3] text-[#D5A12B] border border-[#D5A12B]/30">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#061A2F]">Program Terencana</h3>
                  <p className="mt-0.5 text-[11px] text-[#64748B]">Jadwal dan rute disampaikan dengan transparan.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[#061A2F]/8 bg-white p-3.5 shadow-2xs">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#FAF8F3] text-[#D5A12B] border border-[#D5A12B]/30">
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
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FAF8F3] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/20">
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
                    className="rounded-full bg-[#FAF8F3] border border-[#D5A12B]/30 px-3 py-1 text-[11px] font-bold text-[#061A2F]"
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
            <div className="mx-auto mt-8 max-w-[640px] rounded-3xl border border-[#061A2F]/10 bg-[#FAF8F3] p-8 text-center">
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
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#061A2F]/20 px-4 text-xs font-bold text-[#061A2F]"
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
