"use client";

import Image from "next/image";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  Headphones,
  Tag,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { whatsappHref } from "@/data/jamwisata";

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";

function WhatsAppMark({ className = "size-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16.04 3.2A12.7 12.7 0 0 0 5.3 22.68L3.6 28.8l6.27-1.64a12.73 12.73 0 1 0 6.17-23.96Zm0 22.88c-2.07 0-4.1-.56-5.86-1.61l-.42-.25-3.72.97.99-3.62-.27-.44a10.15 10.15 0 1 1 9.28 4.95Zm5.57-7.6c-.3-.15-1.8-.89-2.08-.99-.28-.1-.48-.15-.69.15-.2.31-.78.99-.96 1.2-.18.2-.36.23-.66.08-1.8-.9-2.98-1.61-4.18-3.66-.31-.54.32-.5.9-1.67.1-.2.05-.38-.03-.54-.07-.15-.68-1.65-.94-2.26-.25-.6-.5-.51-.68-.52h-.59c-.2 0-.53.08-.81.38-.28.31-1.06 1.04-1.06 2.53s1.09 2.94 1.24 3.14c.15.2 2.14 3.27 5.19 4.59.72.31 1.29.5 1.73.64.73.23 1.39.2 1.91.12.58-.09 1.8-.74 2.05-1.45.25-.71.25-1.32.18-1.45-.08-.13-.28-.2-.58-.35Z" />
    </svg>
  );
}

const topics = [
  {
    icon: CalendarDays,
    title: "Tanya Jadwal Keberangkatan",
    detail: "Tanggal dan ketersediaan seat terbaru",
    message: "Assalamu’alaikum, saya ingin menanyakan jadwal keberangkatan dan ketersediaan seat paket Jam Wisata.",
  },
  {
    icon: Tag,
    title: "Info Harga & Paket",
    detail: "Rincian program dan harga terbaru",
    message: "Assalamu’alaikum, saya ingin mendapatkan informasi harga dan pilihan paket perjalanan Jam Wisata.",
  },
  {
    icon: Building2,
    title: "Fasilitas & Hotel",
    detail: "Hotel Makkah, Madinah, dan fasilitas",
    message: "Assalamu’alaikum, saya ingin menanyakan hotel Makkah, hotel Madinah, dan fasilitas yang tersedia dalam paket Jam Wisata.",
  },
  {
    icon: Headphones,
    title: "Hubungi Customer Service",
    detail: "Pertanyaan dan konsultasi lainnya",
    message: "Assalamu’alaikum, saya ingin berkonsultasi dengan customer service Jam Wisata.",
  },
] as const;

const dismissedKey = "jamwisata-concierge-dismissed";

export function WhatsAppConcierge() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const canAutoOpen = useCallback(() => {
    if (sessionStorage.getItem(dismissedKey)) return false;
    const modalOpen = document.querySelector('[role="dialog"]');
    const navigationOpen = document.querySelector('[aria-controls="mobile-navigation"][aria-expanded="true"]');
    return !modalOpen && !navigationOpen;
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(dismissedKey)) return;
    const autoOpen = () => canAutoOpen() && setOpen(true);
    const timeout = window.setTimeout(autoOpen, 12_000);
    return () => window.clearTimeout(timeout);
  }, [canAutoOpen]);

  const close = useCallback((dismiss = true) => {
    setOpen(false);
    if (dismiss) sessionStorage.setItem(dismissedKey, "1");
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab" && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="whatsapp-concierge"
        aria-label={open ? "Tutup bantuan Jam Wisata" : "Buka bantuan Jam Wisata"}
        onClick={() => setOpen((value) => !value)}
        className={`concierge-trigger fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[85] isolate grid size-16 place-items-center rounded-full border-2 border-white/85 bg-gradient-to-br from-[#1E3A5F] via-[#0A1D3A] to-[#06152B] text-white shadow-[0_18px_44px_rgba(6,21,43,.38),0_0_0_5px_rgba(212,175,55,.20)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_24px_54px_rgba(6,21,43,.50),0_0_0_7px_rgba(212,175,55,.26)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] sm:right-6 sm:bottom-6 sm:flex sm:h-[68px] sm:w-auto sm:min-w-[238px] sm:justify-start sm:gap-3 sm:rounded-full sm:px-4 ${open ? "concierge-trigger-open" : ""}`}
      >
        <span className={`concierge-callout hidden sm:block ${open ? "opacity-0" : "opacity-100"}`}>Mau tanya paket? Kami bantu</span>
        <span className="concierge-pulse relative z-10 grid size-12 place-items-center rounded-full bg-white text-[#B8860B] shadow-[inset_0_0_0_1px_rgba(184,134,11,.08),0_6px_18px_rgba(6,21,43,.18)]"><WhatsAppMark className="concierge-heartbeat size-7" /></span>
        <span className="hidden items-center gap-2.5 text-left sm:flex">
          <span><strong className="block text-[13px] font-extrabold">Butuh Bantuan?</strong><span className="mt-0.5 block text-[10px] font-medium text-white/82">Chat langsung dengan kami</span></span>
          <span className="grid h-8 w-12 place-items-center rounded-lg bg-white px-1.5"><Image src={`${assetRoot}/logo.png`} alt="" width={500} height={116} className="h-auto w-full" /></span>
        </span>
      </button>

      <div className={`concierge-popover fixed right-3 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+5rem)] z-[84] w-[calc(100%-1.5rem)] sm:right-6 sm:bottom-[104px] sm:w-[370px] ${open ? "concierge-popover-open" : "concierge-popover-closed"}`}>
          <div
            id="whatsapp-concierge"
            ref={panelRef}
            role="dialog"
            aria-hidden={!open}
            inert={!open}
            aria-label="WhatsApp concierge Jam Wisata"
            className="max-h-[min(610px,calc(100dvh-116px))] w-full overflow-y-auto rounded-[26px] border border-white/80 bg-white shadow-[0_30px_90px_rgba(7,28,43,.28),0_0_0_1px_rgba(16,43,63,.06)]"
          >
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-gradient-to-br from-[#1E3A5F] to-[#0A1D3A] p-5 text-white">
              <span className="grid h-11 w-16 shrink-0 place-items-center rounded-[13px] bg-white px-2"><Image src={`${assetRoot}/logo.png`} alt="Logo Jam Wisata" width={500} height={116} className="h-auto w-full" /></span>
              <div className="min-w-0"><p className="font-extrabold">Jam Wisata</p><p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/78"><span className="size-1.5 rounded-full bg-[#D4AF37]" /> Biasanya membalas pada jam operasional</p></div>
              <button type="button" onClick={() => close()} aria-label="Tutup WhatsApp concierge" className="ml-auto grid size-10 shrink-0 place-items-center rounded-full bg-white/12 transition hover:bg-white/20"><X className="size-5" /></button>
            </div>
            <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <p className="text-[13px] leading-6 text-[#53636B]">Assalamu’alaikum. Ada yang bisa kami bantu? Pilih topik konsultasi di bawah ini.</p>
              <div className="mt-4 space-y-2.5">
                {topics.map(({ icon: Icon, title, detail, message }) => (
                  <a key={title} href={whatsappHref(message, `Concierge — ${title}`)} target="_blank" rel="noopener noreferrer" className="group grid min-h-[70px] grid-cols-[42px_1fr_20px] items-center gap-3 rounded-[16px] border border-[#0A1D3A]/9 p-3 transition hover:-translate-y-0.5 hover:border-[#D4AF37]/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">
                    <span className="grid size-10 place-items-center rounded-[12px] bg-[#F7F3E9] text-[#B8860B]"><Icon className="size-4.5" aria-hidden="true" /></span>
                    <span className="min-w-0"><strong className="block text-[12px] leading-snug text-[#0A1D3A]">{title}</strong><span className="mt-1 block text-[10px] leading-4 text-[#748087]">{detail}</span></span>
                    <ChevronRight className="size-4 text-[#9AA4A8] transition group-hover:translate-x-0.5 group-hover:text-[#B8860B]" aria-hidden="true" />
                  </a>
                ))}
              </div>
              <p className="mt-4 text-center text-[10px] text-[#899399]">Sen–Jum 09.00–17.00 · Sab 09.00–14.00 WIB</p>
            </div>
          </div>
        </div>
    </>
  );
}
