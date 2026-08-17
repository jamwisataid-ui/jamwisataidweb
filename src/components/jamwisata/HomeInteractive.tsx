"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Heart,
  Hotel,
  MessageCircle,
  Plane,
  Play,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { contact, formatRupiah, plannerOptions as plannerOptionsWithIcons, type PlannerOptionContent, type Program, type ProgramCategory, type TestimonialVideo } from "@/data/site-content";

export function PlannerTeaser({ options }: { options: PlannerOptionContent[] }) {
  const [selected, setSelected] = useState(options[0]?.id ?? "");
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map(({ id, title, description }) => {
        const active = id === selected;
        const Icon = plannerOptionsWithIcons.find((item) => item.id === id)?.icon ?? plannerOptionsWithIcons[0].icon;
        return (
          <button key={id} type="button" aria-pressed={active} onClick={() => setSelected(id)} className={`group flex min-h-[132px] items-start gap-4 rounded-2xl border p-5 text-left transition duration-300 ${active ? "border-[var(--jw-gold)] bg-[var(--jw-navy)] text-white shadow-[0_20px_45px_rgba(10,29,58,.16)]" : "border-[var(--jw-navy)]/10 bg-white text-[var(--jw-navy)] hover:-translate-y-1 hover:border-[var(--jw-gold)]"}`}>
            <span className={`grid size-11 shrink-0 place-items-center rounded-full ${active ? "bg-[var(--jw-gold)] text-[var(--jw-navy)]" : "bg-[var(--jw-cream)] text-[var(--jw-gold-dark)]"}`}><Icon className="size-5" /></span>
            <span>
              <strong className="block text-sm font-semibold">{title}</strong>
              <span className={`mt-2 block text-xs leading-5 ${active ? "text-white/65" : "text-[var(--jw-muted)]"}`}>{description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ProgramGrid({ programs }: { programs: Program[] }) {
  const categories: ("Semua" | ProgramCategory)[] = ["Semua", "Reguler", "Plus", "Family", "Private"];
  const [category, setCategory] = useState<(typeof categories)[number]>("Semua");
  const filtered = category === "Semua" ? programs : programs.filter((program) => program.category === category);

  return (
    <>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Kategori program Umrah">
        {categories.map((item) => (
          <button key={item} type="button" role="tab" aria-selected={category === item} onClick={() => setCategory(item)} className={`min-h-11 shrink-0 rounded-full px-5 text-xs font-semibold transition ${category === item ? "bg-[var(--jw-navy)] text-white" : "border border-[var(--jw-navy)]/10 bg-white text-[var(--jw-navy)] hover:border-[var(--jw-gold)]"}`}>{item}</button>
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((program) => <ProgramCard key={program.slug} program={program} />)}
      </div>
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[var(--jw-gold)]/35 bg-[var(--jw-cream)] p-8 text-center">
          <p className="font-editorial text-2xl text-[var(--jw-navy)]">Program kategori ini sedang disiapkan.</p>
          <p className="mt-2 text-sm text-[var(--jw-muted)]">Tim kami dapat membantu mencarikan pilihan yang paling mendekati kebutuhan Anda.</p>
          <a href={contact.whatsapp} className="jw-button jw-button-navy mt-5"><MessageCircle className="size-4" /> Konsultasi dengan tim</a>
        </div>
      ) : null}
    </>
  );
}

function ProgramCard({ program }: { program: Program }) {
  const [favorite, setFavorite] = useState(false);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[var(--jw-navy)]/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(10,29,58,.12)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--jw-navy)]">
        <Image src={program.image} alt={`Program ${program.name} Jam Wisata`} fill sizes="(min-width:1280px) 33vw,(min-width:768px) 50vw,100vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--jw-navy)]/60 via-transparent to-transparent" />
        {program.badge ? <span className="absolute top-4 left-4 rounded-md bg-[var(--jw-gold)] px-3 py-2 text-[9px] font-bold tracking-[0.12em] text-[var(--jw-navy)] uppercase">{program.badge}</span> : null}
        <button type="button" aria-label={favorite ? `Hapus ${program.name} dari favorit` : `Simpan ${program.name} ke favorit`} aria-pressed={favorite} onClick={() => setFavorite((value) => !value)} className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-white/40 bg-[var(--jw-navy)]/30 text-white backdrop-blur-md">
          <Heart className={`size-4 ${favorite ? "fill-[var(--jw-gold)] text-[var(--jw-gold)]" : ""}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="jw-eyebrow !mb-2 !text-[9px]">{program.category}</p>
        <h3 className="font-editorial text-2xl leading-tight text-[var(--jw-navy)]">{program.name}</h3>
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-[var(--jw-navy)]/10 py-4 text-[11px] text-[var(--jw-muted)]">
          <span className="flex gap-2"><CalendarDays className="size-4 shrink-0 text-[var(--jw-gold-dark)]" />{program.departureDate}</span>
          <span className="flex gap-2"><Clock3 className="size-4 shrink-0 text-[var(--jw-gold-dark)]" />{program.duration}</span>
          <span className="flex gap-2"><Plane className="size-4 shrink-0 text-[var(--jw-gold-dark)]" />{program.airline}</span>
          <span className="flex gap-2"><UsersRound className="size-4 shrink-0 text-[var(--jw-gold-dark)]" />{program.mentor}</span>
        </div>
        <div className="mt-4 space-y-2 text-xs text-[var(--jw-muted)]">
          <p className="flex gap-2"><Hotel className="size-4 shrink-0 text-[var(--jw-gold-dark)]" /><span><strong className="font-semibold text-[var(--jw-charcoal)]">Makkah:</strong> {program.makkahHotel}</span></p>
          <p className="flex gap-2"><Hotel className="size-4 shrink-0 text-[var(--jw-gold-dark)]" /><span><strong className="font-semibold text-[var(--jw-charcoal)]">Madinah:</strong> {program.madinahHotel}</span></p>
        </div>
        <div className="mt-auto pt-6">
          <p className="text-[10px] font-medium tracking-wide text-[var(--jw-muted)] uppercase">Harga mulai</p>
          <p className="mt-1 font-editorial text-[30px] text-[var(--jw-gold-dark)]">Rp{formatRupiah(program.price)}<span className="ml-1 font-sans text-[10px] text-[var(--jw-muted)]">/pax</span></p>
          <Link href={`/program/${program.slug}`} className="jw-button jw-button-navy mt-5 w-full">Lihat detail <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </article>
  );
}

export function TestimonialVideos({ videos }: { videos: TestimonialVideo[] }) {
  const [active, setActive] = useState<TestimonialVideo | null>(null);
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);
  return (
    <>
      <div className="mt-10 flex snap-x gap-5 overflow-x-auto pb-3">
        {videos.map((video) => (
          <button key={video.id} type="button" aria-label={`Putar video: ${video.title}`} onClick={() => setActive(video)} className="group relative aspect-[9/14] w-[245px] shrink-0 snap-start overflow-hidden rounded-[22px] bg-[var(--jw-navy)] text-left sm:w-[280px]">
            <Image src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" fill sizes="280px" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--jw-navy)] via-[var(--jw-navy)]/5 to-transparent" />
            <span className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/15 text-white backdrop-blur-md"><Play className="ml-1 size-5 fill-current" /></span>
            <span className="absolute right-5 bottom-5 left-5 text-white"><strong className="font-editorial text-xl">{video.title}</strong><span className="mt-1 block text-xs text-white/60">{video.subtitle}</span></span>
          </button>
        ))}
      </div>
      {active ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[var(--jw-navy)]/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Video ${active.title}`} onMouseDown={(event) => event.currentTarget === event.target && setActive(null)}>
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            <button type="button" aria-label="Tutup video" onClick={() => setActive(null)} className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-white text-[var(--jw-navy)]"><X className="size-5" /></button>
            <div className="aspect-video"><iframe title={active.title} src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1`} className="size-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function FAQList({ faqs }: { faqs: readonly (readonly [string, string])[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-[var(--jw-navy)]/12 border-y border-[var(--jw-navy)]/12">
      {faqs.map(([question, answer], index) => {
        const expanded = open === index;
        return (
          <div key={question}>
            <h3><button type="button" aria-expanded={expanded} aria-controls={`faq-${index}`} onClick={() => setOpen(expanded ? -1 : index)} className="flex min-h-[72px] w-full items-center justify-between gap-6 py-5 text-left text-sm font-semibold text-[var(--jw-navy)] sm:text-base">{question}<ChevronDown className={`size-5 shrink-0 text-[var(--jw-gold-dark)] transition ${expanded ? "rotate-180" : ""}`} /></button></h3>
            <div id={`faq-${index}`} className={`grid transition-[grid-template-rows] duration-300 ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><div className="overflow-hidden"><p className="max-w-3xl pb-6 text-sm leading-7 text-[var(--jw-muted)]">{answer}</p></div></div>
          </div>
        );
      })}
    </div>
  );
}
