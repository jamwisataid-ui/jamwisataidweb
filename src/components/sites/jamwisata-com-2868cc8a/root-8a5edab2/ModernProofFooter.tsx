"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { whatsappHref } from "@/data/jamwisata";

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";

function InstagramMark({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
type TestimonialVideo = {
  id: string;
  youtubeId: string;
  title: string;
  program?: string;
  year?: string;
  orientation: "portrait" | "landscape";
  focalPoint?: string;
};
const testimonialVideos: TestimonialVideo[] = [
  {
    id: "video-1",
    youtubeId: "8vJae3mZooI",
    title: "Testimoni Ust. Mega & Ust. Ahsan",
    program: "Cerita jamaah Jam Wisata",
    orientation: "portrait",
    focalPoint: "center",
  },
  {
    id: "video-2",
    youtubeId: "W6DJ7sZAiso",
    title: "Testimoni Jamaah",
    program: "Cerita jamaah Jam Wisata",
    orientation: "portrait",
    focalPoint: "center",
  },
  {
    id: "video-3",
    youtubeId: "KivXY7zX4JU",
    title: "Testimoni Keluarga Ibu Della",
    program: "Cerita jamaah Jam Wisata",
    orientation: "portrait",
    focalPoint: "center",
  },
  {
    id: "video-4",
    youtubeId: "K3qRoKJGYzc",
    title: "Testimoni Keluarga Ibu Inggit Bandung",
    program: "Cerita jamaah Jam Wisata",
    orientation: "portrait",
    focalPoint: "center",
  },
  {
    id: "video-5",
    youtubeId: "YYBBUrcDAhs",
    title: "Testimoni Keluarga Pak Richie",
    program: "Cerita jamaah Jam Wisata",
    orientation: "portrait",
    focalPoint: "center",
  },
];

const gallery = [
  {
    image: "about.jpg",
    alt: "Suasana jamaah di Masjidil Haram",
    caption: "Perjalanan di tanah suci",
    width: "w-[320px]",
  },
  {
    image: "umrah-1.png",
    alt: "Dokumentasi paket Umroh Bintang 5",
    caption: "Program umrah",
    width: "w-[270px]",
  },
  {
    image: "umrah-2.png",
    alt: "Dokumentasi perjalanan umrah plus",
    caption: "Perjalanan jamaah",
    width: "w-[350px]",
  },
  {
    image: "umrah-3.png",
    alt: "Dokumentasi umrah awal tahun",
    caption: "Makkah dan Madinah",
    width: "w-[290px]",
  },
  {
    image: "hero.jpg",
    alt: "Suasana Masjidil Haram bersama jamaah",
    caption: "Menuju Baitullah",
    width: "w-[360px]",
  },
  {
    image: "tour-1.png",
    alt: "Dokumentasi wisata halal Turki",
    caption: "Wisata halal Turki",
    width: "w-[300px]",
  },
  {
    image: "tour-2.png",
    alt: "Dokumentasi wisata halal Jepang",
    caption: "Wisata halal Jepang",
    width: "w-[340px]",
  },
  {
    image: "promo.jpg",
    alt: "Suasana ibadah di Masjidil Haram",
    caption: "Momen ibadah jamaah",
    width: "w-[280px]",
  },
  {
    image: "tour-3.png",
    alt: "Dokumentasi wisata halal Asia",
    caption: "Perjalanan wisata halal",
    width: "w-[320px]",
  },
  {
    image: "tour-4.png",
    alt: "Dokumentasi wisata halal Eropa",
    caption: "Wisata halal Eropa",
    width: "w-[360px]",
  },
] as const;
const galleryRows = [gallery.slice(0, 5), gallery.slice(5)] as const;

const faqs = [
  [
    "Apa saja yang termasuk dalam paket umrah?",
    "Fasilitas berbeda pada setiap program. Umumnya paket dapat mencakup tiket, visa, hotel, transportasi, konsumsi, perlengkapan, dan pendampingan. Periksa detail paket sebelum mendaftar.",
  ],
  [
    "Bagaimana cara mendapatkan jadwal terbaru?",
    "Hubungi tim Jam Wisata melalui WhatsApp untuk mendapatkan jadwal keberangkatan dan informasi program terbaru.",
  ],
  [
    "Apakah tersedia pilihan tipe kamar?",
    "Pilihan kamar double, triple, atau quad mengikuti paket dan ketersediaan pada jadwal yang dipilih.",
  ],
  [
    "Apa saja dokumen yang perlu disiapkan?",
    "Dokumen dapat mencakup paspor, KTP, kartu keluarga, pas foto, dan dokumen pendukung sesuai ketentuan. Tim akan memberikan checklist setelah pemilihan paket.",
  ],
  [
    "Apakah tersedia bimbingan manasik?",
    "Jam Wisata menyediakan persiapan dan bimbingan manasik sesuai program sebelum keberangkatan.",
  ],
  [
    "Bagaimana cara berkonsultasi?",
    "Klik tombol WhatsApp, lalu sampaikan paket, jadwal, atau kebutuhan perjalanan yang ingin ditanyakan.",
  ],
] as const;

function MediaModal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("button")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab" && dialog) {
        const focusable = [
          ...dialog.querySelectorAll<HTMLElement>(
            'button, a[href], iframe, [tabindex]:not([tabindex="-1"])',
          ),
        ];
        if (!focusable.length) return;
        const first = focusable[0],
          last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [close]);
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#06152B]/92 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-5xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Tutup"
          className="lift-soft absolute -top-12 right-0 grid size-11 place-items-center rounded-full bg-gradient-gold-rich text-[#0A1D3A] shadow-[0_10px_24px_rgba(184,134,11,.32),inset_0_1px_0_rgba(255,235,170,.55)]"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function VideoSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  useEffect(() => {
    void import("lite-youtube-embed");
  }, []);
  const move = (direction: number) =>
    trackRef.current?.scrollBy({
      left: direction * trackRef.current.clientWidth * 0.78,
      behavior: "smooth",
    });
  const updateActive = () => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    setActiveIndex(Math.min(testimonialVideos.length - 1, Math.max(0, Math.round(track.scrollLeft / (first.offsetWidth + 20)))));
  };
  return (
    <section id="testimoni" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="jam-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-eyebrow">Testimoni Jamaah</p>
            <h2 className="section-title max-w-[760px]">
              Pengalaman Ibadah Bersama Jam Wisata.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#68707A]">
              Kisah nyata jamaah yang telah mempercayakan perjalanan ibadah mereka bersama Jam Wisata.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Video sebelumnya"
              className="lift-soft grid size-12 place-items-center rounded-full border border-[#0A1D3A]/15 text-[#0A1D3A] transition-all duration-400 hover:border-[#C0C0C0]/55 hover:text-[#1E3A5F] hover:shadow-[0_8px_22px_-6px_rgba(192,192,192,.40)]"
            >
              <ArrowLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Video berikutnya"
              className="lift-soft sheen-gold grid size-12 place-items-center rounded-full bg-gradient-gold-rich text-[#0A1D3A] shadow-[0_10px_26px_rgba(184,134,11,.32),inset_0_1px_0_rgba(255,235,170,.55)]"
            >
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
        <div
          ref={trackRef}
          tabIndex={0}
          aria-label="Carousel video testimoni"
          onScroll={updateActive}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") move(-1);
            if (event.key === "ArrowRight") move(1);
          }}
          onPointerDown={(event) => {
            const track = trackRef.current;
            if (!track) return;
            dragRef.current = { active: true, startX: event.clientX, scrollLeft: track.scrollLeft, moved: false };
          }}
          onPointerMove={(event) => {
            const track = trackRef.current;
            const drag = dragRef.current;
            if (!track || !drag.active) return;
            const distance = event.clientX - drag.startX;
            if (Math.abs(distance) > 5) drag.moved = true;
            track.scrollLeft = drag.scrollLeft - distance;
          }}
          onPointerUp={(event) => {
            if (dragRef.current.moved) event.preventDefault();
            dragRef.current.active = false;
          }}
          onPointerLeave={() => { dragRef.current.active = false; }}
          className="mt-10 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto pb-5 select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] active:cursor-grabbing [scrollbar-width:none]"
        >
          {testimonialVideos.map((video) => (
            <article
              key={video.id}
              className="lift-soft group shrink-0 snap-start self-start overflow-hidden rounded-[24px] bg-white shadow-[0_18px_48px_rgba(10,29,58,.11)] ring-1 ring-[#0A1D3A]/7 transition-all duration-500 hover:shadow-[0_28px_64px_rgba(10,29,58,.18),0_0_0_1px_rgba(192,192,192,.20)] w-[76vw] max-w-[280px] sm:w-[270px] lg:w-[286px]"
            >
              <lite-youtube
                ref={(element) => {
                  if (element) {
                    element.style.backgroundImage = `url("https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg")`;
                    element.style.backgroundPosition = video.focalPoint ?? "center";
                  }
                }}
                videoid={video.youtubeId}
                playlabel={`Putar video: ${video.title}`}
                params="rel=0&modestbranding=1"
                className="testimonial-lite-youtube"
              >
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  className="lyt-playbtn"
                  aria-label={`Putar video: ${video.title}`}
                >
                  <span className="lyt-visually-hidden">Putar video: {video.title}</span>
                </a>
              </lite-youtube>
              <div className="relative p-5">
                <span className="absolute -top-4 right-4 grid size-8 place-items-center rounded-full bg-white text-[9px] font-black tracking-[-.04em] text-[#d73333] shadow-md" aria-hidden="true">YT</span>
                <strong className="block pr-7 text-[14px] leading-snug text-[#0A1D3A]">{video.title}</strong>
                <span className="mt-1.5 block text-[11px] text-[#68707A]">{video.program}{video.year ? ` · ${video.year}` : ""}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-1.5">
          {testimonialVideos.map((video, index) => (
            <span
              key={video.id}
              className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${index === activeIndex ? "w-7 bg-gradient-gold shadow-[0_0_8px_rgba(184,134,11,.45)]" : "w-1.5 bg-[#C0C0C0]/45"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStart = useRef(0);
  const close = useCallback(() => setActiveIndex(null), []);
  const move = useCallback(
    (direction: number) =>
      setActiveIndex((current) =>
        current === null
          ? null
          : (current + direction + gallery.length) % gallery.length,
      ),
    [],
  );
  useEffect(() => {
    if (activeIndex === null) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [activeIndex, move]);
  return (
    <section
      id="galeri"
      className="overflow-x-clip bg-white py-20 sm:py-24"
      aria-labelledby="gallery-title"
    >
      <div className="jam-container text-center">
        <p className="section-eyebrow justify-center">Galeri Perjalanan</p>
        <h2 id="gallery-title" className="section-title">
          Dokumentasi Perjalanan Suci.
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#68707A]">
          Momen penuh makna jamaah Jam Wisata selama di Makkah, Madinah, dan destinasi pilihan.
        </p>
      </div>
      <div className="gallery-mask mt-10 space-y-3 sm:space-y-4">
        {galleryRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="marquee-row overflow-hidden"
            role="region"
            aria-label={`Baris galeri ${rowIndex + 1}`}
          >
            <div
              className={`marquee-track ${rowIndex === 0 ? "marquee-right" : "marquee-left"}`}
            >
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  aria-hidden={copy === 1}
                  className="marquee-group"
                >
                  {row.map((item, itemIndex) => {
                    const originalIndex = rowIndex * 5 + itemIndex;
                    return (
                      <button
                        type="button"
                        key={`${copy}-${item.image}`}
                        tabIndex={copy === 1 ? -1 : 0}
                        onClick={() => setActiveIndex(originalIndex)}
                        className={`group relative h-[145px] shrink-0 overflow-hidden rounded-[16px] bg-slate-100 text-left ring-1 ring-[#0A1D3A]/8 transition-all duration-500 hover:ring-[#D4AF37]/45 hover:shadow-[0_18px_38px_rgba(10,29,58,.22)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C0C0C0] sm:h-[195px] ${item.width}`}
                      >
                        <Image
                          src={`${assetRoot}/${item.image}`}
                          alt={copy === 0 ? item.alt : ""}
                          fill
                          sizes="360px"
                          className="object-cover transition duration-[700ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
                        />
                        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[#0A1D3A]/92 via-[#0A1D3A]/55 to-transparent px-4 pt-10 pb-3 text-xs font-bold text-white transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0">
                          {item.caption}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {activeIndex !== null ? (
        <MediaModal title={gallery[activeIndex].caption} close={close}>
          <div
            className="relative h-[75vh] max-h-[780px] overflow-hidden rounded-[22px] bg-[#0A1D3A]"
            onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const delta = e.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
            }}
          >
            <Image
              src={`${assetRoot}/${gallery[activeIndex].image}`}
              alt={gallery[activeIndex].alt}
              fill
              sizes="95vw"
              className="object-contain"
            />
            <button
              type="button"
              aria-label="Gambar sebelumnya"
              onClick={() => move(-1)}
              className="lift-soft group absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#0A1D3A] shadow-[0_8px_22px_rgba(0,0,0,.18)]"
            >
              <ArrowLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>
            <button
              type="button"
              aria-label="Gambar berikutnya"
              onClick={() => move(1)}
              className="lift-soft group absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#0A1D3A] shadow-[0_8px_22px_rgba(0,0,0,.18)]"
            >
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <p className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-[#06152B] px-6 pt-12 pb-5 text-center text-sm font-bold text-white">
              {gallery[activeIndex].caption}
            </p>
          </div>
        </MediaModal>
      ) : null}
    </section>
  );
}

export function ModernProofFooter() {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <>
      <VideoSection />
      <GallerySection />
      <section id="faq" className="scroll-mt-20 bg-white py-20 sm:py-24">
        <div className="jam-container grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="section-eyebrow">Pertanyaan Umum</p>
            <h2 className="section-title">Informasi Sebelum Berangkat.</h2>
            <p className="mt-4 text-sm leading-6 text-[#68707A]">
              Jawaban ringkas untuk membantu Anda mempersiapkan perjalanan.
            </p>
          </div>
          <div className="divide-y divide-[#0A1D3A]/10 border-y border-[#0A1D3A]/10">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index;
              return (
                <div key={question}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="group flex min-h-[66px] w-full items-center justify-between gap-5 py-4 text-left text-sm font-extrabold text-[#0A1D3A] transition-colors duration-300 hover:text-[#1E3A5F]"
                    >
                      <span>{question}</span>
                      <span className={`grid size-8 place-items-center rounded-full bg-gradient-gold-soft text-[#0A1D3A] shadow-[0_4px_10px_rgba(184,134,11,.18)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${isOpen ? "rotate-180" : ""}`}>
                        <ChevronDown className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${index}`}
                    className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[720px] pb-5 text-sm leading-6 text-[#68707A]">
                        {answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Full-Width Closing CTA Banner (Connected to Footer, Rounded Top Only, Left Image Full Bleed) */}
      <section
        id="kontak"
        className="relative isolate overflow-hidden w-full bg-[#021224] text-white rounded-t-[32px] sm:rounded-t-[44px] lg:rounded-t-[52px] border-t border-[#D5A12B]/35 shadow-[0_-16px_48px_rgba(2,18,36,0.30)]"
        aria-label="Ajakan Konsultasi Umrah"
      >
        {/* Subtle Background Radial Gold Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(213,161,43,0.12)_0%,transparent_60%)] pointer-events-none" />

        {/* 1. Kiri — Visual Image (Full Bleed to the Left edge of the screen on Desktop & Tablet) */}
        <div className="relative lg:absolute lg:inset-y-0 lg:left-0 lg:w-[38vw] xl:w-[34vw] min-h-[220px] sm:min-h-[280px] lg:min-h-full overflow-hidden pointer-events-none">
          <Image
            src="/why-choose-kabah.jpg"
            alt="Ka'bah dan Jamaah Umrah Jam Wisata"
            fill
            sizes="(min-width:1024px) 40vw, 100vw"
            className="object-cover object-[center_28%]"
          />
          {/* Directional Blend Gradient - smooth fade to navy rightwards */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#021224]/50 to-[#021224] lg:bg-gradient-to-r lg:from-transparent lg:via-[#021224]/60 lg:to-[#021224]" />
          <div className="absolute inset-0 bg-[#021224]/15" />
        </div>

        {/* Content Container (Center and Right aligned properly inside container) */}
        <div className="jam-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[300px] lg:min-h-[310px]">
            {/* Spacer for the Left Image in desktop grid */}
            <div className="hidden lg:block lg:col-span-4" />

            {/* 2. Tengah — Headline + Subheadline + CTA Button */}
            <div className="lg:col-span-5 flex flex-col justify-center px-2 py-8 sm:px-4 sm:py-10 lg:py-11 lg:px-6">
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl xs:text-[27px] sm:text-3xl lg:text-[32px] font-bold leading-[1.15] text-white tracking-tight">
                Siap Berangkat ke Baitullah?
              </h2>

              <p className="mt-3 font-[family-name:var(--font-montserrat)] text-xs sm:text-[13.5px] leading-relaxed text-slate-200/90 max-w-[440px]">
                Wujudkan impian suci Anda bersama Jam Wisata.<br className="hidden sm:inline" />
                {" "}Konsultasikan rencana perjalanan Anda sekarang juga!
              </p>

              <div className="mt-6">
                <a
                  href={whatsappHref(
                    "Assalamu’alaikum, saya ingin berkonsultasi mengenai rencana perjalanan ibadah umrah bersama Jam Wisata.",
                    "Banner CTA Bawah",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lift-soft sheen-gold group inline-flex w-full xs:w-auto items-center justify-between xs:justify-center gap-3.5 rounded-xl bg-gradient-gold-rich px-5 sm:px-6 py-3.5 text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-[#061A2F] shadow-[0_10px_28px_rgba(212,175,55,0.35)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                >
                  <span>KONSULTASI GRATIS SEKARANG</span>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#061A2F] text-[#F5D97A] shadow-xs transition-transform group-hover:scale-110">
                    <svg className="size-4 fill-current" viewBox="0 0 256 256" aria-hidden="true">
                      <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,218.35a16,16,0,0,0,19.78,19.78l41.47-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6-1l-34,9.3,9.3-34a8,8,0,0,0-1-6A88,88,0,1,1,128,216Zm47.6-67.6-21.72-10.86a16.09,16.09,0,0,0-17.76,3.13l-6.84,6.84a56.44,56.44,0,0,1-27.47-27.47l6.84-6.84a16.09,16.09,0,0,0,3.13-17.76L100.92,73.72A16,16,0,0,0,84,64.22a16.27,16.27,0,0,0-12,5.78C61.45,81.42,60.6,98.66,74.75,123.63S132.37,195.4,157.34,209.55c7.58,4.3,16,6.45,24.44,6.45a27.63,27.63,0,0,0,15.78-4.8,20.48,20.48,0,0,0,9.22-13.88,16,16,0,0,0-9.18-16.72Z" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>

            {/* 3. Kanan — List Benefit / Trust Points dengan Divider Vertikal */}
            <div className="relative z-10 lg:col-span-3 flex flex-col justify-center px-2 pb-8 pt-3 sm:px-4 sm:pb-10 lg:py-11 lg:pl-6 lg:pr-2 border-t border-white/12 lg:border-t-0 lg:border-l lg:border-white/15">
              <ul className="space-y-3.5 sm:space-y-4">
                {[
                  {
                    text: "Konsultasi Cepat & Gratis",
                    icon: (
                      <svg className="size-4.5 shrink-0" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M45.42,186.25A96,96,0,1,1,96,224a95.39,95.39,0,0,1-27.42-4L32,224Z" />
                        <line x1="88" y1="128" x2="168" y2="128" />
                        <line x1="88" y1="96" x2="168" y2="96" />
                      </svg>
                    ),
                  },
                  {
                    text: "Tim Profesional & Amanah",
                    icon: (
                      <svg className="size-4.5 shrink-0" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91.25,124.39a15.54,15.54,0,0,0,9.5,0c15.43-5.05,91.25-34.78,91.25-124.39V56A16,16,0,0,0,208,40Z" />
                        <polyline points="88 136 112 160 168 104" />
                      </svg>
                    ),
                  },
                  {
                    text: "Harga Kompetitif & Transparan",
                    icon: (
                      <svg className="size-4.5 shrink-0" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,144H32V64H224V192Z" />
                        <circle cx="128" cy="128" r="24" />
                      </svg>
                    ),
                  },
                  {
                    text: "Keberangkatan Terjadwal",
                    icon: (
                      <svg className="size-4.5 shrink-0" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="40" y="40" width="176" height="176" rx="16" />
                        <line x1="176" y1="24" x2="176" y2="56" />
                        <line x1="80" y1="24" x2="80" y2="56" />
                        <line x1="40" y1="88" x2="216" y2="88" />
                        <polyline points="92 148 116 172 164 124" />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-xs sm:text-[13px] font-semibold text-white/95 leading-tight">
                    <span className="grid size-7.5 sm:size-8 shrink-0 place-items-center rounded-lg bg-white/6 border border-white/14 text-[#E8C967] shadow-2xs">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#021224] text-white border-t border-white/10">
        <div className="jam-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.25fr_.75fr_.75fr_1.25fr]">
          <div>
            <Image
              src={`${assetRoot}/logo-footer.png`}
              alt="Jam Wisata"
              width={500}
              height={150}
              className="h-auto w-[250px] sm:w-[290px] object-contain drop-shadow-md"
            />
            <p className="mt-4 text-sm font-bold text-[#E8C967]">
              Setiap Waktu Bernilai Ibadah
            </p>
            <p className="mt-3 max-w-[310px] text-sm leading-6 text-white/55">
              Biro perjalanan umrah dan wisata halal amanah, profesional, dan berlandaskan sunnah.
            </p>
            <a href="https://www.instagram.com/jamwisata/" target="_blank" rel="noopener noreferrer" className="lift-soft mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/12 bg-white/4 px-4 text-sm font-bold text-white/72 transition-all duration-400 hover:border-[#C0C0C0]/55 hover:bg-white/8 hover:text-white hover:shadow-[0_8px_24px_-6px_rgba(192,192,192,.4)]">
              <InstagramMark className="size-4 text-[#E8C967]" /> @jamwisata
            </a>
          </div>
          <nav aria-label="Navigasi footer">
            <h2 className="text-sm font-bold">Navigasi</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/55">
              {[
                ["Paket Umrah", "paket-umrah"],
                ["Mengapa Kami", "tentang-kami"],
                ["Testimoni", "testimoni"],
                ["Galeri", "galeri"],
                ["FAQ", "faq"],
              ].map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className="silver-underline transition-colors duration-300 hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Layanan">
            <h2 className="text-sm font-bold">Layanan</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/55">
              <li>
                <a
                  href="https://jamwisata.com/transaksi/paket-umrah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="silver-underline transition-colors duration-300 hover:text-white"
                >
                  Paket Umrah
                </a>
              </li>
              <li>
                <a
                  href="https://jamwisata.com/transaksi/paket-wisata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="silver-underline transition-colors duration-300 hover:text-white"
                >
                  Wisata Halal
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref(
                    "Assalamu’alaikum, saya ingin bertanya mengenai layanan Jam Wisata.",
                    "Footer — Layanan",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="silver-underline transition-colors duration-300 hover:text-white"
                >
                  Konsultasi Perjalanan
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="text-sm font-bold">Kontak</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-white/55">
              <a
                href="tel:+6281809627499"
                className="silver-underline flex gap-3 transition-colors duration-300 hover:text-white"
              >
                <Phone className="mt-1 size-4 shrink-0 text-[#E8C967]" />
                +62 818-0962-7499
              </a>
              <a
                href="mailto:jamwisata99@gmail.com"
                className="silver-underline flex gap-3 transition-colors duration-300 hover:text-white"
              >
                <Mail className="mt-1 size-4 shrink-0 text-[#E8C967]" />
                jamwisata99@gmail.com
              </a>
              <a href="https://maps.app.goo.gl/gVK4okTQSEtzyX9w5" target="_blank" rel="noopener noreferrer" className="silver-underline flex gap-3 transition-colors duration-300 hover:text-white">
                <MapPin className="mt-1 size-4 shrink-0 text-[#E8C967]" />
                Jl. Cibangkong No. 28A, Bandung 40273
              </a>
              <p className="flex gap-3">
                <Clock3 className="mt-1 size-4 shrink-0 text-[#E8C967]" />
                Senin–Jumat 09.00–17.00
                <br />
                Sabtu 09.00–14.00 WIB
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/8">
          <div className="jam-container flex flex-col gap-2 py-5 text-sm text-white/38 sm:flex-row sm:justify-between">
            <p>
              © {new Date().getFullYear()} Jam Wisata. Seluruh hak dilindungi.
            </p>
            <a
              href="https://jamwisata.com"
              target="_blank"
              rel="noopener noreferrer"
              className="silver-underline transition-colors duration-300 hover:text-white"
            >
              Portal paket: jamwisata.com
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
