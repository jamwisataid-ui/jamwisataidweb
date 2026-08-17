"use client";

import Image from "next/image";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleGauge,
  ClipboardCheck,
  Clock3,
  Compass,
  Headphones,
  Hotel,
  MapPin,
  MessageCircle,
  Plane,
  RotateCcw,
  Search,
  UsersRound,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { formatIDR, umrahPackages, whatsappHref } from "@/data/jamwisata";
import type { TravelPackage } from "@/types/jamwisata";

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";

type Filters = { month: string; type: string; airline: string; airport: string };
const emptyFilters: Filters = { month: "", type: "", airline: "", airport: "" };

const trustItems = [
  [Compass, "Perjalanan Terarah", "Program dan informasi dipersiapkan dengan jelas."],
  [BookOpenCheck, "Manasik Jamaah", "Persiapan ibadah sebelum keberangkatan."],
  [UsersRound, "Pendampingan", "Didampingi tour leader dan tim perjalanan."],
  [Headphones, "Tim Indonesia & Saudi", "Koordinasi dari tanah air hingga tanah suci."],
] as const;

const advantages = [
  [ClipboardCheck, "Program Terencana", "Jadwal dan kebutuhan perjalanan disampaikan dengan jelas."],
  [UsersRound, "Pendampingan Jamaah", "Tim membantu sejak persiapan hingga kepulangan."],
  [BookOpenCheck, "Manasik Terarah", "Jamaah dibantu mempersiapkan rangkaian ibadah."],
  [Hotel, "Akomodasi Pilihan", "Pilihan perjalanan disesuaikan dengan kebutuhan jamaah."],
] as const;

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

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-extrabold tracking-[.04em] text-[#40515A] uppercase">{label}</span>
      <span className="relative block">
        <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full appearance-none rounded-[12px] border border-[#0A1D3A]/12 bg-white py-3 pr-10 pl-3.5 text-[13px] font-semibold text-[#0A1D3A] outline-none transition focus:border-[#B8860B] focus:ring-3 focus:ring-[#D4AF37]/14">
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#66737B]" aria-hidden="true" />
      </span>
    </label>
  );
}

function HotelRow({ city, hotel }: { city: string; hotel?: TravelPackage["makkahHotel"] }) {
  return (
    <div className="grid grid-cols-[36px_1fr] gap-3 py-3.5">
      <span className="grid size-9 place-items-center rounded-[11px] bg-white text-[#B8860B] shadow-[0_5px_14px_rgba(10,29,58,.06)]"><Building2 className="size-4" aria-hidden="true" /></span>
      <div className="min-w-0">
        <p className="text-[9px] font-black tracking-[.13em] text-[#B8860B] uppercase">{city}</p>
        <p className="mt-1 text-[13px] leading-4 font-extrabold text-[#0A1D3A]">{hotel?.name ?? "Hotel setaraf — konfirmasi admin"}</p>
        {hotel?.star ? <p className="mt-0.5 text-[10px] text-[#66737B]">Bintang {hotel.star}</p> : null}
      </div>
    </div>
  );
}

function PackageCard({ travelPackage }: { travelPackage: TravelPackage }) {
  const context = [
    `Assalamu’alaikum, saya tertarik dengan Paket ${travelPackage.name}`,
    travelPackage.departureDate ? `keberangkatan ${travelPackage.departureDate}.` : ".",
    `Mohon informasi lengkap mengenai durasi, hotel Makkah dan Madinah, fasilitas, harga, serta ketersediaan seat.`,
  ].join(" ");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_16px_45px_rgba(10,29,58,.09)] ring-1 ring-[#0A1D3A]/7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(10,29,58,.14)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#dfe8e5]">
        <Image src={travelPackage.image} alt={`Paket ${travelPackage.name} Jam Wisata`} fill sizes="(min-width:1024px) 33vw,(min-width:640px) 50vw,100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06152B]/62 via-transparent to-[#06152B]/8" />
        {travelPackage.badge ? <span className="absolute top-4 left-4 rounded-[8px] bg-[#D4AF37] px-3 py-2 text-[10px] font-black tracking-[.08em] text-[#0A1D3A] uppercase shadow-sm">{travelPackage.badge}</span> : null}
        {travelPackage.departureDate ? <span className="absolute right-4 bottom-4 left-4 flex items-center gap-2 rounded-[10px] border border-white/15 bg-[#0A1D3A]/86 px-3.5 py-2.5 text-[11px] font-bold text-white backdrop-blur-md"><CalendarDays className="size-4 text-[#D4AF37]" />{travelPackage.departureDate}</span> : null}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold tracking-[.13em] text-[#B8860B] uppercase">{packageTypeLabels[travelPackage.packageType]}</p>
            <h3 className="font-display mt-1.5 text-[26px] leading-[1.05] font-semibold tracking-[-.02em] text-[#0A1D3A]">{travelPackage.name}</h3>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#F7F3E9] text-[#B8860B]"><Plane className="size-4.5" aria-hidden="true" /></span>
        </div>

        <div className="mt-5 grid grid-cols-2 divide-x divide-[#0A1D3A]/9 border-y border-[#0A1D3A]/9 py-3.5 text-[11px] text-[#68707A]">
          <div className="flex items-center gap-2.5 pr-3"><Clock3 className="size-4 shrink-0 text-[#B8860B]" /><span><strong className="block text-[10px] font-extrabold text-[#0A1D3A]">Durasi</strong>{travelPackage.durationDays ? `${travelPackage.durationDays} hari` : "Konfirmasi admin"}</span></div>
          <div className="flex items-center gap-2.5 pl-4"><Plane className="size-4 shrink-0 text-[#B8860B]" /><span><strong className="block text-[10px] font-extrabold text-[#0A1D3A]">Maskapai</strong>{travelPackage.airline ?? "Konfirmasi admin"}</span></div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 text-[12px] leading-5 text-[#66737B]">
          <MapPin className="mt-0.5 size-4 shrink-0 text-[#B8860B]" aria-hidden="true" />
          <p><strong className="font-bold text-[#31434C]">Berangkat dari</strong><br />{travelPackage.departureAirport ?? "Konfirmasi admin"}{travelPackage.arrivalAirport ? ` → ${travelPackage.arrivalAirport}` : ""}</p>
        </div>

        <div className="mt-4 divide-y divide-[#0A1D3A]/8 rounded-[16px] bg-[#F7F3E9]/72 px-4 ring-1 ring-[#D4AF37]/12">
          <HotelRow city="Makkah" hotel={travelPackage.makkahHotel} />
          <HotelRow city="Madinah" hotel={travelPackage.madinahHotel} />
        </div>

        {travelPackage.facilities?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {travelPackage.facilities.slice(0, 3).map((facility) => <span key={facility} className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#59616D]"><Check className="size-3.5 text-[#B8860B]" />{facility}</span>)}
          </div>
        ) : null}

        <div className="mt-auto pt-5">
          <p className="text-[10px] font-semibold text-[#748087]">Harga mulai</p>
          <p className="mt-0.5 text-[27px] font-black tracking-[-.045em] text-[#0A1D3A] tabular-nums">
            {travelPackage.priceFrom ? `Rp${formatIDR(travelPackage.priceFrom)}` : "Hubungi Kami"}
            {travelPackage.priceFrom ? <span className="ml-1 text-[11px] font-semibold text-[#748087]">/pax</span> : null}
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <a href={travelPackage.detailUrl ?? "https://jamwisata.com/transaksi/paket-umrah"} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[11px] bg-[#0A1D3A] px-4 text-xs font-extrabold text-white transition hover:bg-[#1E3A5F]">Lihat Detail <ArrowRight className="size-4" /></a>
            <a href={whatsappHref(context, `Paket — ${travelPackage.name}`)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[11px] border border-[#D4AF37]/35 bg-[#F7F3E9] px-3 text-xs font-extrabold text-[#8A6508] transition hover:border-[#B8860B] hover:bg-[#F1E8D3]"><MessageCircle className="size-4" /> Tanya via WhatsApp</a>
          </div>
        </div>
      </div>
    </article>
  );
}

export function HeroPackages() {
  const [tab, setTab] = useState<"umrah" | "hajj">("umrah");
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const [hasSearched, setHasSearched] = useState(false);

  const options = useMemo(() => ({
    months: [...new Set(umrahPackages.map((item) => item.departureMonth).filter(Boolean))] as string[],
    types: [...new Set(umrahPackages.map((item) => item.packageType))],
    airlines: [...new Set(umrahPackages.map((item) => item.airline).filter(Boolean))] as string[],
    airports: [...new Set(umrahPackages.map((item) => item.departureAirport).filter(Boolean))] as string[],
  }), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = { month: params.get("bulan") ?? "", type: params.get("jenis") ?? "", airline: params.get("maskapai") ?? "", airport: params.get("bandara") ?? "" };
    if (Object.values(fromUrl).some(Boolean)) {
      const syncFromUrl = window.setTimeout(() => {
        setDraft(fromUrl);
        setApplied(fromUrl);
        setHasSearched(true);
      }, 0);
      return () => window.clearTimeout(syncFromUrl);
    }
  }, []);

  const filteredPackages = useMemo(() => umrahPackages.filter((item) =>
    (!applied.month || item.departureMonth === applied.month) &&
    (!applied.type || item.packageType === applied.type) &&
    (!applied.airline || item.airline === applied.airline) &&
    (!applied.airport || item.departureAirport === applied.airport)
  ), [applied]);

  const updateUrl = (filters: Filters) => {
    const params = new URLSearchParams();
    if (filters.month) params.set("bulan", filters.month);
    if (filters.type) params.set("jenis", filters.type);
    if (filters.airline) params.set("maskapai", filters.airline);
    if (filters.airport) params.set("bandara", filters.airport);
    window.history.replaceState({}, "", `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`);
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setApplied(draft);
    setHasSearched(true);
    updateUrl(draft);
    window.setTimeout(() => document.getElementById("paket-umrah")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const reset = () => {
    setDraft(emptyFilters);
    setApplied(emptyFilters);
    setHasSearched(false);
    updateUrl(emptyFilters);
  };

  const activeChips = [
    applied.month ? monthLabel(applied.month) : "",
    applied.type ? packageTypeLabels[applied.type as TravelPackage["packageType"]] : "",
    applied.airline,
    applied.airport,
  ].filter(Boolean);

  const emptyMessage = `Assalamu’alaikum, saya mencari paket umrah dengan keberangkatan ${applied.month ? monthLabel(applied.month) : "semua bulan"}, jenis paket ${applied.type ? packageTypeLabels[applied.type as TravelPackage["packageType"]] : "semua paket"}, maskapai ${applied.airline || "semua maskapai"}, dan bandara ${applied.airport || "semua bandara"}. Mohon informasi jadwal yang tersedia.`;

  return (
    <>
      <section id="beranda" className="relative isolate overflow-hidden bg-[#0A1D3A] text-white">
        <Image src={`${assetRoot}/hero.jpg`} alt="Suasana perjalanan umrah menuju Baitullah" fill priority loading="eager" sizes="100vw" className="object-cover object-[58%_center] sm:object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,21,43,.96)_0%,rgba(10,29,58,.78)_48%,rgba(10,29,58,.44)_100%)]" />
        <div className="jam-container relative flex min-h-[980px] flex-col justify-center py-16 sm:min-h-[920px] lg:min-h-[680px] lg:py-14">
          <div className="max-w-[730px]">
            <Image
              src={`${assetRoot}/bismillah.png`}
              alt="Bismillahirrahmanirrahim"
              width={384}
              height={86}
              className="mb-5 h-auto w-[210px] opacity-95 sm:w-[250px]"
            />
            <p className="flex items-center gap-3 text-[11px] font-extrabold tracking-[.2em] text-[#D4AF37] uppercase sm:text-xs"><span className="h-px w-8 bg-[#D4AF37]" /> Pendamping Perjalanan Ibadah</p>
            <h1 className="font-display mt-5 max-w-[720px] text-[clamp(2.75rem,6vw,5rem)] leading-[.96] font-semibold tracking-[-.025em] text-balance">Perjalanan Ibadah,<br /><span className="text-[#D4AF37]">Pengalaman Tak Terlupakan.</span></h1>
            <p className="mt-6 max-w-[570px] text-[16px] leading-7 text-white/80 sm:text-[17px]">Jam Wisata hadir menemani setiap langkah menuju Baitullah dengan layanan yang amanah, profesional, dan penuh perhatian.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#paket-umrah" className="inline-flex min-h-13 items-center justify-center gap-3 rounded-[12px] bg-[#D4AF37] px-6 text-sm font-extrabold text-[#0A1D3A] transition hover:-translate-y-0.5 hover:bg-[#C59C25]">Lihat Paket Umrah <ArrowRight className="size-4" /></a>
              <a href={whatsappHref("Assalamu’alaikum, saya ingin berkonsultasi mengenai paket perjalanan Jam Wisata.", "Hero")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-13 items-center justify-center gap-3 rounded-[12px] border border-white/35 bg-[#0A1D3A]/45 px-6 text-sm font-bold text-white transition hover:border-[#D4AF37] hover:text-[#F4D875]"><MessageCircle className="size-4" /> Konsultasi Gratis</a>
            </div>
          </div>

          <div className="mt-14 rounded-[20px] border border-[#0A1D3A]/8 bg-[#FFFDF8] p-4 text-[#0A1D3A] shadow-[0_26px_70px_rgba(2,15,32,.24)] sm:p-5 lg:mt-16 lg:p-6">
            <div className="flex flex-col gap-4 border-b border-[#0A1D3A]/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-[16px] font-extrabold">Temukan Paket Perjalanan Anda</p><p className="mt-1 text-xs text-[#66737B]">Pilih preferensi perjalanan untuk melihat paket yang sesuai.</p></div>
              <div role="tablist" aria-label="Jenis perjalanan" className="grid grid-cols-2 rounded-[12px] bg-[#E8ECEA] p-1">
                <button type="button" role="tab" aria-selected={tab === "umrah"} onClick={() => setTab("umrah")} className={`min-h-10 rounded-[9px] px-4 text-xs font-extrabold transition ${tab === "umrah" ? "bg-[#0A1D3A] text-white shadow-sm" : "text-[#59616D]"}`}>Paket Umrah</button>
                <button type="button" role="tab" aria-selected={tab === "hajj"} onClick={() => setTab("hajj")} className={`min-h-10 rounded-[9px] px-4 text-xs font-extrabold transition ${tab === "hajj" ? "bg-[#0A1D3A] text-white shadow-sm" : "text-[#59616D]"}`}>Paket Haji</button>
              </div>
            </div>
            {tab === "umrah" ? (
              <form onSubmit={submitSearch} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.2fr_auto] lg:items-end">
                <SelectField label="Bulan Keberangkatan" value={draft.month} onChange={(month) => setDraft({ ...draft, month })}><option value="">Semua Bulan</option>{options.months.map((month) => <option key={month} value={month}>{monthLabel(month)}</option>)}</SelectField>
                <SelectField label="Jenis Paket" value={draft.type} onChange={(type) => setDraft({ ...draft, type })}><option value="">Semua Paket</option>{options.types.filter((type) => type !== "tour").map((type) => <option key={type} value={type}>{packageTypeLabels[type]}</option>)}</SelectField>
                <SelectField label="Maskapai" value={draft.airline} onChange={(airline) => setDraft({ ...draft, airline })}><option value="">Semua Maskapai</option>{options.airlines.map((airline) => <option key={airline} value={airline}>{airline}</option>)}</SelectField>
                <SelectField label="Bandara Keberangkatan" value={draft.airport} onChange={(airport) => setDraft({ ...draft, airport })}><option value="">Semua Bandara</option>{options.airports.map((airport) => <option key={airport} value={airport}>{airport}</option>)}</SelectField>
                <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[11px] bg-[#0A1D3A] px-5 text-sm font-extrabold text-white transition hover:bg-[#1E3A5F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"><Search className="size-4" /> Cari Paket</button>
              </form>
            ) : (
              <div role="tabpanel" className="mt-4 flex flex-col gap-4 rounded-[14px] bg-[#F7F3E9] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-sm font-extrabold">Program haji dikonsultasikan langsung bersama tim.</p><p className="mt-1 text-xs text-[#66737B]">Dapatkan informasi program dan persyaratan terbaru melalui WhatsApp.</p></div>
                <a href={whatsappHref("Assalamu’alaikum, saya ingin berkonsultasi mengenai program haji Jam Wisata.", "Hero Search — Haji")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0A1D3A] px-4 text-xs font-bold text-white"><MessageCircle className="size-4" /> Konsultasi Haji</a>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white" aria-label="Keunggulan utama Jam Wisata">
        <div className="jam-container grid grid-cols-2 border-x border-[#0A1D3A]/7 lg:grid-cols-4">
          {trustItems.map(([Icon, title, text], index) => <div key={title} className={`flex min-h-[118px] items-start gap-3 px-4 py-6 sm:px-6 ${index % 2 ? "border-l border-[#0A1D3A]/8" : ""} ${index > 1 ? "border-t border-[#0A1D3A]/8 lg:border-t-0 lg:border-l" : ""}`}><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#F7F3E9] text-[#B8860B]"><Icon className="size-4.5" strokeWidth={1.7} /></span><div><h2 className="text-[12px] font-extrabold text-[#0A1D3A] sm:text-sm">{title}</h2><p className="mt-1 text-[10px] leading-4 text-[#748087] sm:text-xs">{text}</p></div></div>)}
        </div>
      </section>

      <section id="tentang-kami" className="scroll-mt-24 bg-[#F7F4ED] py-20 sm:py-24 lg:py-28">
        <div className="jam-container grid items-center gap-12 lg:grid-cols-[.96fr_1.04fr] lg:gap-16">
          <div className="grid grid-cols-[1.25fr_.75fr] gap-3"><figure className="relative min-h-[470px] overflow-hidden rounded-[28px]"><Image src={`${assetRoot}/about.jpg`} alt="Kebersamaan jamaah Jam Wisata" fill sizes="(min-width:1024px) 38vw,65vw" className="object-cover" /></figure><div className="grid gap-3 pt-14"><figure className="relative overflow-hidden rounded-[20px]"><Image src={`${assetRoot}/umrah-2.png`} alt="Kegiatan perjalanan jamaah" fill sizes="20vw" className="object-cover" /></figure><figure className="relative overflow-hidden rounded-[20px]"><Image src={`${assetRoot}/umrah-3.png`} alt="Dokumentasi jamaah di tanah suci" fill sizes="20vw" className="object-cover" /></figure></div></div>
          <div><p className="section-eyebrow">Tentang Jam Wisata</p><h2 className="section-title max-w-[650px]">Kami mendampingi, bukan sekadar memberangkatkan.</h2><p className="mt-5 max-w-[620px] text-[15px] leading-7 text-[#68707A]">Kami tidak hanya mengantarkan jamaah menuju Baitullah. Setiap langkah dipersiapkan dengan amanah, ilmu, dan pelayanan sepenuh hati agar perjalanan terasa tenang serta bermakna.</p><div className="mt-7 grid gap-x-7 gap-y-5 sm:grid-cols-2">{advantages.map(([Icon, title, text]) => <div key={title} className="grid grid-cols-[34px_1fr] gap-3 border-t border-[#0A1D3A]/10 pt-4"><Icon className="size-5 text-[#B8860B]" strokeWidth={1.7} /><div><h3 className="text-sm font-extrabold text-[#0A1D3A]">{title}</h3><p className="mt-1 text-xs leading-5 text-[#68707A]">{text}</p></div></div>)}</div><a href="#kontak" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-[12px] bg-[#0A1D3A] px-6 text-sm font-bold text-white hover:bg-[#1E3A5F]">Kenal Lebih Dekat <ArrowRight className="size-4" /></a></div>
        </div>
      </section>

      <section id="paket-umrah" className="scroll-mt-24 bg-white py-20 sm:py-24 lg:py-28">
        <div className="jam-container">
          <div className="mx-auto max-w-[760px] text-center"><p className="section-eyebrow justify-center">Paket Pilihan</p><h2 className="section-title">Temukan Program Umrah yang Sesuai untuk Anda.</h2><p className="mt-4 text-sm leading-6 text-[#66737B] sm:text-base">Pilih program berdasarkan jadwal, akomodasi, dan kebutuhan perjalanan Anda.</p></div>
          <div aria-live="polite" className="mt-8 flex min-h-8 flex-wrap items-center justify-center gap-2">
            {hasSearched ? <><span className="mr-1 text-xs font-extrabold text-[#0A1D3A]">{filteredPackages.length} paket ditemukan</span>{activeChips.map((chip) => <span key={chip} className="rounded-full bg-[#F7F3E9] px-3 py-1.5 text-[10px] font-bold text-[#8A6508]">{chip}</span>)}<button type="button" onClick={reset} className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[10px] font-bold text-[#68707A] hover:bg-[#F7F3E9]"><RotateCcw className="size-3" /> Reset</button></> : null}
          </div>
          {filteredPackages.length ? <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filteredPackages.map((item) => <PackageCard key={item.id} travelPackage={item} />)}</div> : <div className="mx-auto mt-4 max-w-[700px] rounded-[22px] border border-[#0A1D3A]/9 bg-[#F7F3E9] p-8 text-center"><CircleGauge className="mx-auto size-8 text-[#B8860B]" /><h3 className="mt-4 text-xl font-extrabold text-[#0A1D3A]">Belum ada paket yang sesuai dengan pilihan Anda.</h3><p className="mt-2 text-sm text-[#68707A]">Tim kami dapat membantu mencarikan jadwal dengan kriteria serupa.</p><div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row"><button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#0A1D3A]/14 px-4 text-xs font-bold text-[#0A1D3A]"><RotateCcw className="size-4" /> Reset Filter</button><a href={whatsappHref(emptyMessage, "Hasil Pencarian Kosong")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A1D3A] px-4 text-xs font-bold text-white"><MessageCircle className="size-4" /> Tanyakan Jadwal via WhatsApp</a></div></div>}
          <div className="mt-9 text-center"><a href="https://jamwisata.com/transaksi/paket-umrah" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 rounded-[12px] border border-[#0A1D3A]/18 px-6 text-sm font-bold text-[#0A1D3A] hover:border-[#B8860B] hover:text-[#8A6508]">Lihat Semua Paket <ArrowRight className="size-4" /></a></div>
        </div>
      </section>
    </>
  );
}
