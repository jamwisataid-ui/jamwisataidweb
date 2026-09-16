import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPinned, Plane } from "lucide-react";

import { formatIDR } from "@/data/jamwisata";
import { packagePublicPath } from "@/lib/cms/public";
import type { TravelPackage } from "@/types/jamwisata";

export function TourPackagesSection({ packages }: { packages: TravelPackage[] }) {
  return (
    <section id="paket-wisata" className="relative overflow-hidden bg-[#0A1D3A] py-20 text-white sm:py-24">
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_80%_15%,#D5A12B_0,transparent_28%)]" />
      <div className="jam-container relative">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-eyebrow !text-[#E8C967]">Paket Wisata</p>
            <h2 className="section-title max-w-[700px] !text-white">Jelajahi Dunia dengan Nyaman dan Halal.</h2>
          </div>
          <div className="max-w-[520px]">
            <p className="text-sm leading-6 text-white/65">Pilihan perjalanan untuk keluarga dan kelompok dengan jadwal, akomodasi, serta biaya yang jelas.</p>
            <Link href="/paket-wisata" className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-[#F5D97A] hover:text-white">Lihat semua paket <ArrowRight className="size-3.5" /></Link>
          </div>
        </div>

        {packages.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg) => (
              <article key={pkg.id} className="group overflow-hidden rounded-[22px] border border-white/10 bg-[#06152B] shadow-[0_18px_45px_rgba(0,0,0,.22)] transition duration-300 hover:-translate-y-1 hover:border-[#D5A12B]/45">
                <Link href={packagePublicPath(pkg)} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={pkg.image} alt={pkg.name} fill sizes="(min-width:1280px) 33vw,(min-width:768px) 50vw,100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06152B] via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-[#D5A12B]/45 bg-[#06152B]/85 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#F5D97A] backdrop-blur">{pkg.durationDays ? `${pkg.durationDays} Hari` : "Paket Wisata"}</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white group-hover:text-[#F5D97A]">{pkg.name}</h3>
                    <div className="mt-4 space-y-2 text-xs text-white/65">
                      {pkg.departureDate ? <p className="flex items-center gap-2"><CalendarDays className="size-3.5 text-[#D5A12B]" />{pkg.departureDate}</p> : null}
                      {pkg.airline ? <p className="flex items-center gap-2"><Plane className="size-3.5 text-[#D5A12B]" />{pkg.airline}</p> : null}
                      <p className="flex items-center gap-2"><MapPinned className="size-3.5 text-[#D5A12B]" />{pkg.destination?.slice(0, 2).join(" · ") || "Perjalanan bersama Jam Wisata"}</p>
                    </div>
                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
                      <div><small className="block text-[10px] text-white/45">Mulai dari</small><strong className="text-lg text-[#F5D97A]">Rp {formatIDR(pkg.priceFrom ?? 0)}</strong></div>
                      <span className="grid size-10 place-items-center rounded-full bg-gradient-gold-rich text-[#0A1D3A]"><ArrowRight className="size-4" /></span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[22px] border border-[#D5A12B]/25 bg-white/5 p-8 text-center backdrop-blur-sm">
            <p className="font-[family-name:var(--font-cinzel)] text-xl font-bold">Paket wisata sedang dipersiapkan.</p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">Hubungi tim Jam Wisata untuk mendapatkan informasi program wisata terbaru.</p>
            <Link href="/paket-wisata" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-gold-rich px-5 py-3 text-xs font-extrabold text-[#061A2F]">Informasi Paket Wisata <ArrowRight className="size-4" /></Link>
          </div>
        )}
      </div>
    </section>
  );
}
