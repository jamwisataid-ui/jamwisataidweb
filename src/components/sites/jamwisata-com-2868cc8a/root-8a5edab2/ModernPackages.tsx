import Image from "next/image";
import {
  ArrowRight,
  BookOpenCheck,
  FileCheck2,
  Hotel,
  Plane,
  UsersRound,
} from "lucide-react";

import { whatsappHref } from "@/data/jamwisata";

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";
const facilityGroups = [
  [FileCheck2, "Dokumen & Keberangkatan", ["Visa umrah", "Asuransi perjalanan", "Handling bandara"], "bg-white"],
  [Plane, "Penerbangan & Transportasi", ["Tiket pesawat PP", "Transportasi bus AC", "Penanganan bagasi"], "bg-white"],
  [Hotel, "Hotel & Konsumsi", ["Hotel Makkah", "Hotel Madinah", "Konsumsi sesuai program"], "bg-white"],
  [BookOpenCheck, "Ibadah & Pendampingan", ["Manasik", "Tour leader & muthawif", "Perlengkapan umrah"], "bg-white"],
] as const;
const tours = [
  ["Turki", "Istanbul · Bursa · Cappadocia", "tour-1.png"],
  ["Jepang", "Tokyo · Osaka · Kyoto", "tour-2.png"],
  ["Eropa Barat", "Paris · Amsterdam · Brussels", "tour-4.png"],
] as const;

export function ModernPackages() {
  return (
    <>
      <section
        id="fasilitas"
        className="scroll-mt-20 bg-white py-20 sm:py-24"
      >
        <div className="jam-container">
          <div className="mx-auto max-w-[850px] text-center">
            <p className="section-eyebrow justify-center">
              Fasilitas Perjalanan
            </p>
            <h2 className="section-title">
              Semua yang Anda Butuhkan, Dipersiapkan untuk Perjalanan yang Nyaman.
            </h2>
            <p className="mt-4 text-sm text-[#68707A] sm:text-base">
              Fasilitas dapat berbeda pada setiap program. Lihat detail paket untuk informasi lengkap.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[.41fr_.59fr]">
            <div className="group relative min-h-[390px] overflow-hidden rounded-[26px] bg-[#0A1D3A] sm:min-h-[460px] lg:min-h-0">
              <Image
                src={`${assetRoot}/promo.jpg`}
                alt="Pendampingan perjalanan jamaah Jam Wisata"
                fill
                sizes="(min-width:1024px) 40vw,100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06152B]/95 via-[#06152B]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <h3 className="max-w-[390px] text-[26px] leading-tight font-extrabold tracking-[-.035em] sm:text-[31px]">
                  Pendampingan dari Persiapan hingga Kepulangan
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/12 px-3 py-2 text-[11px] font-bold backdrop-blur-sm"><BookOpenCheck className="size-4 text-[#E8C967]" /> Manasik Terarah</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/12 px-3 py-2 text-[11px] font-bold backdrop-blur-sm"><UsersRound className="size-4 text-[#E8C967]" /> Tim Pendamping</span>
                </div>
              </div>
            </div>
            <div className="grid gap-4 min-[430px]:grid-cols-2">
              {facilityGroups.map(([Icon, title, items, surface]) => (
                <article key={title} className={`lift-soft group rounded-[22px] border border-[#0A1D3A]/10 p-5 transition-all duration-400 hover:-translate-y-1 hover:border-[#C0C0C0]/60 hover:shadow-[0_22px_50px_rgba(10,29,58,.16),0_0_0_1px_rgba(192,192,192,.18)] sm:p-6 ${surface}`}>
                  <span className="grid size-11 place-items-center rounded-[14px] bg-gradient-gold-rich text-[#0A1D3A] shadow-[0_10px_22px_rgba(184,134,11,.30),inset_0_1px_0_rgba(255,235,170,.55)] transition-transform duration-500 group-hover:rotate-[8deg]"><Icon className="size-5" strokeWidth={1.7} /></span>
                  <h3 className="mt-4 text-[15px] leading-snug font-extrabold text-[#0A1D3A] transition-colors duration-300 group-hover:text-[#1E3A5F]">{title}</h3>
                  <ul className="mt-4 space-y-2 border-t border-[#0A1D3A]/10 pt-4">
                    {items.map((item) => <li key={item} className="flex items-start gap-2 text-[12px] leading-5 text-[#59616D] transition-colors duration-300 group-hover:text-[#333333]"><span className="mt-2 size-1 shrink-0 rounded-full bg-gradient-gold" />{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="paket-wisata"
        className="relative overflow-hidden bg-[#0A1D3A] py-20 text-white sm:py-24"
      >
        <div className="jam-container relative">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-eyebrow !text-[#E8C967]">
                Paket Wisata Halal
              </p>
              <h2 className="section-title max-w-[700px] !text-white">
                Jelajahi Dunia dengan Nyaman dan Halal.
              </h2>
            </div>
            <p className="max-w-[520px] text-sm leading-6 text-white/60">
              Pilihan perjalanan halal untuk keluarga dan kelompok ke berbagai
              destinasi.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {tours.map(([name, place, image]) => (
              <a
                key={name}
                href={whatsappHref(
                  `Assalamu’alaikum, saya ingin mengetahui informasi paket wisata halal ${name}.`,
                  `Wisata Halal — ${name}`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="lift-soft sheen-gold group relative aspect-[16/11] overflow-hidden rounded-[22px] ring-1 ring-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0C0C0]"
              >
                <Image
                  src={`${assetRoot}/${image}`}
                  alt={`Wisata halal ${name}`}
                  fill
                  sizes="(min-width:768px) 33vw,100vw"
                  className="object-cover transition duration-[700ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06152B]/92 via-[#06152B]/35 to-transparent transition-opacity duration-500 group-hover:from-[#06152B]/85" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[11px] font-bold tracking-[.04em] text-[#E8C967] uppercase">{place}</p>
                  <div className="mt-1 flex items-end justify-between gap-4">
                    <h3 className="text-[25px] font-extrabold tracking-[-.03em] text-white">
                      {name}
                    </h3>
                    <span className="grid size-10 place-items-center rounded-full bg-gradient-gold-rich text-[#0A1D3A] shadow-[0_6px_14px_rgba(184,134,11,.32),inset_0_1px_0_rgba(255,235,170,.55)] transition-transform duration-500 group-hover:translate-x-1 group-hover:scale-105">
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
