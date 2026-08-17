"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { contact } from "@/data/site-content";

const logo = "/sites/jamwisata-com-2868cc8a/root-8a5edab2/logo.png";

const links = [
  ["/#tentang", "Tentang Kami"],
  ["/#program", "Program Umrah"],
  ["/#keberangkatan", "Jadwal Keberangkatan"],
  ["/#artikel", "Artikel"],
  ["/#galeri", "Galeri"],
  ["/#kontak", "Kontak"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div className="jw-announcement">
        <div className="jw-container flex min-h-9 items-center justify-between gap-4 py-1.5 text-[10px] font-semibold tracking-[0.04em] text-white sm:text-xs">
          <Link href="/#program" className="group flex min-w-0 items-center gap-2">
            <span className="truncate">Program keberangkatan 2026–2027 telah tersedia</span>
            <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
          <div className="hidden items-center gap-3 sm:flex">
            <a href={contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram Jam Wisata"><InstagramMark className="size-3.5" /></a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube Jam Wisata"><YoutubeMark className="size-3.5" /></a>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--jw-navy)]/10 bg-white/95 backdrop-blur-xl">
        <div className="jw-container flex h-[76px] items-center justify-between lg:h-[86px]">
          <Link href="/" aria-label="Jam Wisata, kembali ke beranda" className="shrink-0">
            <Image src={logo} alt="Jaris Ammar Madani — Jam Wisata" width={500} height={116} priority className="h-auto w-[158px] sm:w-[190px]" />
          </Link>
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Navigasi utama">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="jw-nav-link">{label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="jw-button jw-button-navy hidden sm:inline-flex">
              <MessageCircle className="size-4" /> Konsultasi Umrah
            </a>
            <a href={contact.whatsapp} target="_blank" rel="noreferrer" aria-label="Konsultasi Umrah via WhatsApp" className="grid size-11 place-items-center rounded-md bg-[var(--jw-navy)] text-white sm:hidden">
              <MessageCircle className="size-5" />
            </a>
            <button ref={triggerRef} type="button" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center rounded-md border border-[var(--jw-navy)]/15 text-[var(--jw-navy)] xl:hidden">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 top-[112px] z-50 bg-[var(--jw-navy)]/55 backdrop-blur-sm xl:hidden" onMouseDown={(event) => event.currentTarget === event.target && setOpen(false)}>
          <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Menu navigasi" className="ml-auto flex h-full w-[min(90vw,420px)] flex-col bg-[var(--jw-cream)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--jw-navy)]/10 pb-5">
              <p className="font-display text-lg text-[var(--jw-navy)]">Menu perjalanan</p>
              <button type="button" aria-label="Tutup menu navigasi" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full bg-white"><X className="size-5" /></button>
            </div>
            <nav className="mt-4" aria-label="Navigasi mobile">
              {links.map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-14 items-center justify-between border-b border-[var(--jw-navy)]/10 font-medium text-[var(--jw-navy)]">
                  {label}<ArrowRight className="size-4 text-[var(--jw-gold-dark)]" />
                </Link>
              ))}
            </nav>
            <div className="mt-auto rounded-2xl bg-[var(--jw-navy)] p-5 text-white">
              <p className="font-editorial text-2xl">Mari berbincang dengan tenang.</p>
              <p className="mt-2 text-sm leading-6 text-white/65">Tim kami siap membantu memahami kebutuhan perjalanan Anda.</p>
              <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="jw-button jw-button-gold mt-5 w-full"><MessageCircle className="size-4" /> Konsultasi Umrah</a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function InstagramMark({ className }: { className: string }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
}

function YoutubeMark({ className }: { className: string }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12c0 3.7-.4 5.7-1.1 6.4-.8.8-3.1 1.1-7.9 1.1s-7.1-.3-7.9-1.1C3.4 17.7 3 15.7 3 12s.4-5.7 1.1-6.4C4.9 4.8 7.2 4.5 12 4.5s7.1.3 7.9 1.1C20.6 6.3 21 8.3 21 12Z" /><path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" /></svg>;
}
