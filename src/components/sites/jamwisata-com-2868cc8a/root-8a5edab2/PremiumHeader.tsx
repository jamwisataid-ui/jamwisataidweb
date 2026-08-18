"use client";

import Image from "next/image";
import Link from "next/link";
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
  ["paket-umrah", "Paket Umrah"],
  ["tentang-kami", "Mengapa Kami"],
  ["testimoni", "Testimoni"],
  ["galeri", "Galeri"],
  ["faq", "FAQ"],
] as const;

export function PremiumHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("beranda");
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header className="fixed inset-x-0 top-0 z-[70] transition-all duration-300">
      {/* Top Bar - Subtle dark luxury info strip */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "h-0 overflow-hidden border-transparent opacity-0"
            : "border-white/10 bg-[#061A2F]/60 backdrop-blur-[2px] opacity-100"
        }`}
      >
        <div className="jam-container flex h-7 items-center justify-between gap-4 text-[10.5px] font-medium text-white/75">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <a className="flex shrink-0 items-center gap-1.5 hover:text-[#E8C967] transition" href="tel:+6281809627499">
              <Phone className="size-2.5 text-[#E8C967]" aria-hidden="true" />
              <span>+62 818-0962-7499</span>
            </a>
            <a className="hidden items-center gap-1.5 border-l border-white/15 pl-3 hover:text-[#E8C967] transition md:flex" href="mailto:jamwisata99@gmail.com">
              <Mail className="size-2.5 text-[#E8C967]" aria-hidden="true" /> jamwisata99@gmail.com
            </a>
            <span className="hidden items-center gap-1.5 border-l border-white/15 pl-3 lg:flex text-white/60">
              <MapPin className="size-2.5 text-[#E8C967]" aria-hidden="true" /> Bandung, Jawa Barat
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-white/65">
            <span className="hidden sm:flex items-center gap-1.5">
              <Clock3 className="size-2.5 text-[#E8C967]" aria-hidden="true" />
              <span>Sen–Jum 09.00–17.00 · Sab 09.00–14.00 WIB</span>
            </span>
            <a className="hidden items-center gap-1.5 border-l border-white/15 pl-3 hover:text-white transition xl:flex text-white/80" href="https://jamwisata.com" target="_blank" rel="noopener noreferrer">
              Portal Jamaah <ExternalLink className="size-2.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-[#D5A12B]/20 bg-[#061A2F]/95 shadow-[0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-md"
            : "border-b border-white/10 bg-gradient-to-b from-[#061A2F]/90 via-[#061A2F]/45 to-transparent backdrop-blur-[1px]"
        }`}
      >
        <div className="jam-container flex h-[70px] sm:h-[76px] lg:h-[82px] items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="Jam Wisata, kembali ke beranda" className="shrink-0 flex items-center">
            <Image
              src={`${assetRoot}/logo.png`}
              alt="Jam Wisata"
              width={537}
              height={161}
              priority
              className="h-11 sm:h-13 lg:h-[52px] w-auto max-w-[175px] sm:max-w-[210px] lg:max-w-[250px] object-contain drop-shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </Link>

          {/* Navigation Links */}
          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
            {links.map(([id, label]) => (
              <a
                key={id}
                href={id === "beranda" ? "/" : `/#${id}`}
                aria-current={active === id ? "location" : undefined}
                className={`relative px-3 py-1.5 text-[13px] font-semibold tracking-wide transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:origin-left after:rounded-full after:bg-gradient-gold-rich after:transition-transform ${
                  active === id
                    ? "text-[#E8C967] font-bold after:scale-x-100"
                    : "text-white/85 after:scale-x-0 hover:text-white hover:after:scale-x-100"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA Area */}
          <div className="flex items-center gap-3">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="lift-soft sheen-gold hidden sm:inline-flex items-center gap-2 rounded-[8px] bg-gradient-gold-rich px-4.5 py-2 text-[11.5px] font-extrabold uppercase tracking-wider text-[#061A2F] shadow-[0_6px_18px_rgba(184,134,11,.32)] transition duration-300 hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="size-3.5 shrink-0" aria-hidden="true" />
              <span>Konsultasi Gratis</span>
            </a>

            {/* Mobile Menu Trigger */}
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              onClick={() => setMenuOpen((value) => !value)}
              className="grid size-9 place-items-center rounded-lg border border-white/20 bg-[#061A2F]/60 text-white backdrop-blur-sm transition-colors hover:bg-white/10 lg:hidden cursor-pointer"
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {menuOpen ? (
        <div
          className="fixed inset-0 top-[64px] sm:top-[68px] z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onMouseDown={(event) => event.target === event.currentTarget && closeMenu()}
        >
          <div
            id="mobile-navigation"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            className="ml-auto flex h-full w-[min(85vw,340px)] flex-col border-l border-[#D5A12B]/20 bg-[#061A2F] p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-extrabold tracking-[.15em] text-[#E8C967] uppercase">Menu Navigasi</span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Tutup menu"
                className="grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-4" />
              </button>
            </div>

            <nav aria-label="Navigasi mobile" className="mt-4 space-y-1">
              {links.map(([id, label]) => (
                <a
                  key={id}
                  href={id === "beranda" ? "/" : `/#${id}`}
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    active === id
                      ? "bg-[#D5A12B]/20 text-[#E8C967] font-bold"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {label}
                  <span className="text-xs text-white/40">↗</span>
                </a>
              ))}
            </nav>

            <div className="mt-auto rounded-2xl border border-[#D5A12B]/20 bg-[#0A2745]/60 p-4 text-xs">
              <p className="font-bold text-white">Konsultasi Jadwal Umrah</p>
              <p className="mt-1 text-slate-300">Tim kami siap melayani informasi keberangkatan dan pilihan paket.</p>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="lift-soft sheen-gold mt-3.5 flex items-center justify-center gap-2 rounded-xl bg-gradient-gold-rich py-2.5 font-bold text-[#061A2F] shadow-md"
              >
                <MessageCircle className="size-4" /> Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
