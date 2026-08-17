"use client";

import Image from "next/image";
import {
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";
const whatsapp =
  "https://wa.me/6281809627499?text=Assalamu%E2%80%99alaikum%2C%20saya%20ingin%20berkonsultasi%20mengenai%20paket%20perjalanan%20Jam%20Wisata.";

const links = [
  ["beranda", "Beranda"],
  ["tentang-kami", "Tentang"],
  ["paket-umrah", "Paket Umrah"],
  ["paket-wisata", "Wisata Halal"],
  ["testimoni", "Testimoni"],
  ["galeri", "Galeri"],
  ["faq", "FAQ"],
] as const;

export function PremiumHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("beranda");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = links
      .map(([id]) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-24% 0px -64% 0px", threshold: [0, 0.12, 0.3] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
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
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  return (
    <header className="sticky inset-x-0 top-0 z-[70] bg-white">
      <div className="bg-[#0A1D3A] text-white">
        <div className="jam-container flex h-8 items-center justify-between gap-4 text-[11px] font-medium text-white/82">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <a className="flex shrink-0 items-center gap-1.5 hover:text-white" href="tel:+6281809627499">
              <Phone className="size-3.5" aria-hidden="true" />
              <span className="sm:hidden">WhatsApp</span>
              <span className="hidden sm:inline">+62 818-0962-7499</span>
            </a>
            <a className="hidden items-center gap-1.5 border-l border-white/15 pl-4 hover:text-white md:flex" href="mailto:jamwisata99@gmail.com">
              <Mail className="size-3.5" aria-hidden="true" /> jamwisata99@gmail.com
            </a>
            <span className="hidden items-center gap-1.5 border-l border-white/15 pl-4 lg:flex">
              <MapPin className="size-3.5" aria-hidden="true" /> Bandung, Jawa Barat
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="flex items-center gap-1.5">
              <Clock3 className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Sen–Jum 09.00–17.00 · Sab 09.00–14.00 WIB</span>
              <span className="sm:hidden">09.00–17.00 WIB</span>
            </span>
            <a className="hidden items-center gap-1.5 border-l border-white/15 pl-3 hover:text-white xl:flex" href="https://jamwisata.com" target="_blank" rel="noopener noreferrer">
              Portal Jamaah <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-[#0A1D3A]/8 bg-[#FFFDF8] shadow-[0_7px_24px_rgba(16,43,63,.07)]">
        <div className="jam-container flex h-[76px] items-center justify-between">
          <a href="#beranda" aria-label="Jam Wisata, kembali ke beranda" className="shrink-0">
            <Image src={`${assetRoot}/logo.png`} alt="Jam Wisata" width={500} height={184} priority className="h-auto w-[160px] sm:w-[190px]" />
          </a>
          <nav aria-label="Navigasi utama" className="hidden items-center xl:flex">
            {links.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
                className={`relative flex min-h-11 items-center px-3 text-[12px] font-bold transition-colors after:absolute after:right-3 after:bottom-1.5 after:left-3 after:h-0.5 after:origin-left after:rounded-full after:bg-[#D4AF37] after:transition-transform ${active === id ? "text-[#D4AF37] after:scale-x-100" : "text-[#43535C] after:scale-x-0 hover:text-[#0A1D3A] hover:after:scale-x-100"}`}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="lift-soft sheen-gold hidden min-h-11 items-center gap-2 rounded-[14px] bg-gradient-gold-rich px-5 text-xs font-extrabold text-[#0A1D3A] shadow-[0_10px_28px_rgba(184,134,11,.32),inset_0_1px_0_rgba(255,235,170,.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] sm:inline-flex">
              <MessageCircle className="size-4" aria-hidden="true" /> Konsultasi Umrah
            </a>
            <a href={whatsapp} aria-label="Konsultasi cepat via WhatsApp" target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center rounded-[13px] bg-gradient-gold-rich text-[#0A1D3A] shadow-[0_8px_22px_rgba(184,134,11,.30),inset_0_1px_0_rgba(255,235,170,.55)] sm:hidden">
              <MessageCircle className="size-5" aria-hidden="true" />
            </a>
            <button ref={triggerRef} type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Tutup menu" : "Buka menu"} onClick={() => setMenuOpen((value) => !value)} className="grid size-11 place-items-center rounded-[13px] border border-[#0A1D3A]/12 text-[#0A1D3A] xl:hidden">
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-x-0 top-[108px] bottom-0 z-50 bg-[#06152B]/45 backdrop-blur-[2px] xl:hidden" onMouseDown={(event) => event.target === event.currentTarget && closeMenu()}>
          <div id="mobile-navigation" ref={drawerRef} role="dialog" aria-modal="true" aria-label="Menu navigasi" className="ml-auto flex h-full w-[min(88vw,390px)] flex-col bg-[#FFFDF8] p-5 shadow-[-20px_0_50px_rgba(7,28,43,.18)]">
            <div className="flex items-center justify-between border-b border-[#0A1D3A]/9 pb-4">
              <span className="text-xs font-extrabold tracking-[.12em] text-[#D4AF37] uppercase">Navigasi</span>
              <button type="button" onClick={closeMenu} aria-label="Tutup menu navigasi" className="grid size-11 place-items-center rounded-full bg-white text-[#0A1D3A] shadow-sm"><X className="size-5" /></button>
            </div>
            <nav aria-label="Navigasi mobile" className="mt-3">
              {links.map(([id, label]) => (
                <a key={id} href={`#${id}`} onClick={closeMenu} className={`flex min-h-12 items-center justify-between border-b border-[#0A1D3A]/8 text-sm font-bold ${active === id ? "text-[#D4AF37]" : "text-[#0A1D3A]"}`}>
                  {label}<span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
            <div className="mt-auto rounded-[18px] bg-[#F7F3E9] p-4 text-xs leading-5 text-[#59616D]">
              <p className="font-bold text-[#0A1D3A]">Butuh bantuan memilih paket?</p>
              <p className="mt-1">Sen–Jum 09.00–17.00 · Sab 09.00–14.00 WIB</p>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="lift-soft sheen-gold mt-4 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-gold-rich px-4 font-extrabold text-[#0A1D3A] shadow-[0_8px_22px_rgba(184,134,11,.30),inset_0_1px_0_rgba(255,235,170,.55)]"><MessageCircle className="size-4" /> Konsultasi Umrah</a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
