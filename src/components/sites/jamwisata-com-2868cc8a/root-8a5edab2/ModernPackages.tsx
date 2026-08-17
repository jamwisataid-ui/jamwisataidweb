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
  [FileCheck2, "Dokumen & Keberangkatan", ["Visa umrah", "Asuransi perjalanan", "Handling bandara"], "bg-[#EAF4F1]"],
  [Plane, "Penerbangan & Transportasi", ["Tiket pesawat PP", "Transportasi bus AC", "Penanganan bagasi"], "bg-white"],
  [Hotel, "Hotel & Konsumsi", ["Hotel Makkah", "Hotel Madinah", "Konsumsi sesuai program"], "bg-[#FBF9F4]"],
  [BookOpenCheck, "Ibadah & Pendampingan", ["Manasik", "Tour leader & muthawif", "Perlengkapan umrah"], "bg-[#F5EFE3]"],
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
        className="scroll-mt-20 bg-[#F7F4ED] py-20 sm:py-24"
      >
        <div className="jam-container">
          <div className="mx-auto max-w-[850px] text-center">
            <p className="section-eyebrow justify-center">
              Fasilitas Perjalanan
            </p>
            <h2 className="section-title">
              Semua yang Anda Butuhkan, Dipersiapkan untuk Perjalanan yang Nyaman.
            </h2>
            <p className="mt-4 text-sm text-[#66737B] sm:text-base">
              Fasilitas dapat berbeda pada setiap program. Lihat detail paket untuk informasi lengkap.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[.41fr_.59fr]">
            <div className="group relative min-h-[390px] overflow-hidden rounded-[26px] bg-[#102B3F] sm:min-h-[460px] lg:min-h-0">
              <Image
                src={`${assetRoot}/promo.jpg`}
                alt="Pendampingan perjalanan jamaah Jam Wisata"
                fill
                sizes="(min-width:1024px) 40vw,100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071c2b]/95 via-[#071c2b]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <h3 className="max-w-[390px] text-[26px] leading-tight font-extrabold tracking-[-.035em] sm:text-[31px]">
                  Pendampingan dari Persiapan hingga Kepulangan
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/12 px-3 py-2 text-[11px] font-bold backdrop-blur-sm"><BookOpenCheck className="size-4 text-[#D5B77A]" /> Manasik Terarah</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/12 px-3 py-2 text-[11px] font-bold backdrop-blur-sm"><UsersRound className="size-4 text-[#D5B77A]" /> Tim Pendamping</span>
                </div>
              </div>
            </div>
            <div className="grid gap-4 min-[430px]:grid-cols-2">
              {facilityGroups.map(([Icon, title, items, surface]) => (
                <article key={title} className={`rounded-[22px] border border-[#102B3F]/8 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#147D73]/45 sm:p-6 ${surface}`}>
                  <span className="grid size-11 place-items-center rounded-[14px] bg-[#147D73] text-white shadow-[0_8px_18px_rgba(20,125,115,.16)]"><Icon className="size-5" strokeWidth={1.7} /></span>
                  <h3 className="mt-4 text-[15px] leading-snug font-extrabold text-[#102B3F]">{title}</h3>
                  <ul className="mt-4 space-y-2 border-t border-[#102B3F]/8 pt-4">
                    {items.map((item) => <li key={item} className="flex items-start gap-2 text-[12px] leading-5 text-[#596970]"><span className="mt-2 size-1 shrink-0 rounded-full bg-[#147D73]" />{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="paket-wisata"
        className="relative overflow-hidden bg-[#0B2233] py-20 text-white sm:py-24"
      >
        <div className="jam-container relative">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-eyebrow !text-[#D5B77A]">
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
                className="group relative aspect-[16/11] overflow-hidden rounded-[22px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D5B77A]"
              >
                <Image
                  src={`${assetRoot}/${image}`}
                  alt={`Wisata halal ${name}`}
                  fill
                  sizes="(min-width:768px) 33vw,100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061923]/92 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[11px] text-[#D5B77A]">{place}</p>
                  <div className="mt-1 flex items-end justify-between gap-4">
                    <h3 className="text-[25px] font-extrabold tracking-[-.03em]">
                      {name}
                    </h3>
                    <ArrowRight className="size-5 transition group-hover:translate-x-1" />
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
