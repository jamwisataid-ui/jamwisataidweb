"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
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
      className="fixed inset-0 z-[100] grid place-items-center bg-[#071923]/92 p-4 backdrop-blur-sm"
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
          className="absolute -top-12 right-0 grid size-11 place-items-center rounded-full bg-white text-[#0A1D3A]"
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
            <p className="section-eyebrow">Cerita Jamaah</p>
            <h2 className="section-title max-w-[760px]">
              Pengalaman Jamaah, Diceritakan Langsung oleh Mereka.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#66737B]">
              Saksikan pengalaman jamaah selama menjalani perjalanan bersama Jam Wisata.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Video sebelumnya"
              className="grid size-12 place-items-center rounded-full border border-[#0A1D3A]/15 text-[#0A1D3A] hover:border-[#B8860B] hover:text-[#B8860B]"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Video berikutnya"
              className="grid size-12 place-items-center rounded-full bg-[#0A1D3A] text-white hover:bg-[#1E3A5F]"
            >
              <ArrowRight className="size-5" />
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
              className="group shrink-0 snap-start self-start overflow-hidden rounded-[20px] bg-white shadow-[0_18px_48px_rgba(10,29,58,.11)] ring-1 ring-[#0A1D3A]/7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(10,29,58,.16)] w-[76vw] max-w-[280px] sm:w-[270px] lg:w-[286px]"
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
                <span className="mt-1.5 block text-[11px] text-[#748087]">{video.program}{video.year ? ` · ${video.year}` : ""}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-1.5">
          {testimonialVideos.map((video, index) => (
            <span
              key={video.id}
              className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-7 bg-[#D4AF37]" : "w-1.5 bg-[#0A1D3A]/18"}`}
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
      className="overflow-x-clip bg-[#F7F4ED] py-20 sm:py-24"
      aria-labelledby="gallery-title"
    >
      <div className="jam-container text-center">
        <p className="section-eyebrow justify-center">Galeri Perjalanan</p>
        <h2 id="gallery-title" className="section-title">
          Momen Perjalanan Jamaah.
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#66737B]">
          Dokumentasi nyata dari persiapan, keberangkatan, hingga perjalanan di
          tanah suci.
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
                        className={`group relative h-[145px] shrink-0 overflow-hidden rounded-[16px] bg-[#E8E4DB] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] sm:h-[195px] ${item.width}`}
                      >
                        <Image
                          src={`${assetRoot}/${item.image}`}
                          alt={copy === 0 ? item.alt : ""}
                          fill
                          sizes="360px"
                          className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[#0A1D3A]/88 to-transparent px-4 pt-10 pb-3 text-xs font-bold text-white transition group-hover:translate-y-0">
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
            className="relative h-[75vh] max-h-[780px] overflow-hidden rounded-[20px] bg-[#0A1D3A]"
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
              className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0A1D3A]"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Gambar berikutnya"
              onClick={() => move(1)}
              className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0A1D3A]"
            >
              <ArrowRight className="size-5" />
            </button>
            <p className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-[#071923] px-6 pt-12 pb-5 text-center text-sm font-bold text-white">
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
            <p className="mt-4 text-sm leading-6 text-[#66737B]">
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
                      className="flex min-h-[66px] w-full items-center justify-between gap-5 py-4 text-left text-sm font-extrabold text-[#0A1D3A]"
                    >
                      <span>{question}</span>
                      <ChevronDown
                        className={`size-5 shrink-0 text-[#B8860B] transition ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${index}`}
                    className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[720px] pb-5 text-sm leading-6 text-[#66737B]">
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

      <section
        id="kontak"
        className="scroll-mt-20 bg-white px-4 pb-12 sm:px-0 sm:pb-16"
      >
        <div className="jam-container relative overflow-hidden rounded-[24px] bg-[#0A1D3A] px-7 py-12 text-white sm:px-12 lg:px-16 lg:py-16">
          <Image
            src={`${assetRoot}/promo.jpg`}
            alt=""
            fill
            sizes="1280px"
            className="object-cover opacity-28"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D3A] via-[#0A1D3A]/90 to-[#0A1D3A]/58" />
          <div className="relative max-w-[780px]">
            <p className="section-eyebrow !text-[#D4AF37]">
              Rencanakan Perjalanan
            </p>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.04] font-extrabold tracking-[-.045em]">
              Siap Merencanakan Perjalanan Bersama Jam Wisata?
            </h2>
            <p className="mt-5 max-w-[660px] text-sm leading-7 text-white/68">
              Konsultasikan kebutuhan Anda, pilih program yang sesuai, dan tim
              kami akan membantu proses persiapannya.
            </p>
            <a
              href={whatsappHref(
                "Assalamu’alaikum, saya ingin berkonsultasi mengenai paket perjalanan Jam Wisata.",
                "Final CTA",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-13 items-center justify-center gap-3 rounded-[12px] bg-[#D4AF37] px-6 text-sm font-bold text-[#0A1D3A]"
            >
              <MessageCircle className="size-4" /> Konsultasi via WhatsApp
            </a>
            <p className="mt-3 text-xs text-white/48">
              Admin melayani sesuai jam operasional Jam Wisata.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-[#06152B] text-white">
        <div className="jam-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.25fr_.75fr_.75fr_1.25fr]">
          <div>
            <Image
              src={`${assetRoot}/logo.png`}
              alt="Jam Wisata"
              width={500}
              height={116}
              className="h-auto w-[190px] brightness-0 invert"
            />
            <p className="mt-4 text-sm font-bold text-[#D4AF37]">
              Setiap Waktu Bernilai Ibadah
            </p>
            <p className="mt-3 max-w-[310px] text-sm leading-6 text-white/55">
              Partner perjalanan umrah dan wisata halal dengan pendampingan
              penuh perhatian.
            </p>
            <a href="https://www.instagram.com/jamwisata/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-sm font-bold text-white/72 transition hover:border-[#D4AF37]/50 hover:text-white">
              <InstagramMark className="size-4 text-[#D4AF37]" /> @jamwisata
            </a>
          </div>
          <nav aria-label="Navigasi footer">
            <h2 className="text-sm font-bold">Navigasi</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/55">
              {[
                ["Tentang", "tentang-kami"],
                ["Paket Umrah", "paket-umrah"],
                ["Fasilitas", "fasilitas"],
                ["Testimoni", "testimoni"],
                ["FAQ", "faq"],
              ].map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className="hover:text-white">
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
                  className="hover:text-white"
                >
                  Paket Umrah
                </a>
              </li>
              <li>
                <a
                  href="https://jamwisata.com/transaksi/paket-wisata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
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
                  className="hover:text-white"
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
                className="flex gap-3 hover:text-white"
              >
                <Phone className="mt-1 size-4 shrink-0 text-[#D4AF37]" />
                +62 818-0962-7499
              </a>
              <a
                href="mailto:jamwisata99@gmail.com"
                className="flex gap-3 hover:text-white"
              >
                <Mail className="mt-1 size-4 shrink-0 text-[#D4AF37]" />
                jamwisata99@gmail.com
              </a>
              <a href="https://maps.app.goo.gl/gVK4okTQSEtzyX9w5" target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-white">
                <MapPin className="mt-1 size-4 shrink-0 text-[#D4AF37]" />
                Jl. Cibangkong No. 28A, Bandung 40273
              </a>
              <p className="flex gap-3">
                <Clock3 className="mt-1 size-4 shrink-0 text-[#D4AF37]" />
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
              className="hover:text-white"
            >
              Portal paket: jamwisata.com
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
