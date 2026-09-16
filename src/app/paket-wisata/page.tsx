import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Hotel, MessageCircle, Plane, Sparkles, TrainFront } from "lucide-react";

import { HotelStarRating } from "@/components/HotelStarRating";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { WhatsAppConcierge } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/WhatsAppConcierge";
import { formatIDR, whatsappHref } from "@/data/jamwisata";
import { getPublishedPackagesByCategory, packagePublicPath } from "@/lib/cms/public";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Paket Wisata Halal dan Keluarga",
  description: "Temukan pilihan paket wisata Jam Wisata dengan jadwal, maskapai, akomodasi, dan harga yang transparan.",
  alternates: { canonical: "/paket-wisata" },
  openGraph: { title: "Paket Wisata | Jam Wisata", description: "Pilihan perjalanan wisata nyaman bersama Jam Wisata.", url: `${SITE_URL}/paket-wisata`, siteName: "Jam Wisata", locale: "id_ID", type: "website" },
};

export default async function TourPackagesPage() {
  const packages = await getPublishedPackagesByCategory("halal-tour");
  return (
    <main className="jam-page min-h-screen bg-white text-[#333333]">
      <PremiumHeader />
      <section className="relative isolate overflow-hidden bg-[#021224] pb-16 pt-32 text-white sm:pb-20 sm:pt-36 lg:pt-40">
        <Image src="/hero-makkah-cinematic.png" alt="Perjalanan wisata bersama Jam Wisata" fill priority sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#021224] via-[#021224]/90 to-[#021224]/65" />
        <div className="jam-container relative z-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-[#E8C967]"><ArrowLeft className="size-3.5" /> Beranda</Link>
          <div className="mt-6 max-w-[780px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A12B]/40 bg-[#061A2F]/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#F5D97A]"><Sparkles className="size-3.5" /> Program Wisata Jam Wisata</span>
            <h1 className="mt-4 font-[family-name:var(--font-cinzel)] text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Paket Wisata Nyaman untuk Keluarga dan Rombongan</h1>
            <p className="mt-4 max-w-[690px] text-sm leading-relaxed text-slate-200">Pilih program perjalanan dengan jadwal, transportasi, akomodasi, dan biaya yang disiapkan secara jelas oleh tim Jam Wisata.</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-20">
        <div className="jam-container">
          {packages.length ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {packages.map((pkg) => (
                <article key={pkg.id} className="overflow-hidden rounded-2xl border border-[#061A2F]/10 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Link href={packagePublicPath(pkg)} className="block">
                    <div className="relative aspect-[16/10] bg-[#061A2F]">
                      <Image src={pkg.image} alt={pkg.name} fill sizes="(min-width:1280px) 33vw,(min-width:768px) 50vw,100vw" className="object-cover" />
                      <span className="absolute left-3 top-3 rounded-md border border-[#D5A12B]/30 bg-[#061A2F]/85 px-3 py-1 text-xs font-bold text-[#F5D97A] backdrop-blur">{pkg.badge ?? "Paket Wisata"}</span>
                    </div>
                    <div className="p-6">
                      <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#061A2F]">{pkg.name}</h2>
                      <div className="mt-4 space-y-2.5 text-xs text-[#59616D]">
                        <p className="flex items-center gap-2"><CalendarDays className="size-4 shrink-0 text-[#D5A12B]" />Jadwal: <strong>{pkg.departureDate}</strong></p>
                        <p className="flex items-center gap-2"><Plane className="size-4 shrink-0 text-[#D5A12B]" />Maskapai: <strong>{pkg.airline}</strong></p>
                        {pkg.highSpeedTrain ? <p className="flex items-center gap-2"><TrainFront className="size-4 shrink-0 text-[#D5A12B]" />Kereta Cepat: <strong>{pkg.highSpeedTrain}</strong></p> : null}
                        <p className="flex items-center gap-2"><Hotel className="size-4 shrink-0 text-[#D5A12B]" /><span className="flex min-w-0 flex-1 items-center justify-between gap-3"><span>Makkah: <strong>{pkg.makkahHotel?.name}</strong></span><HotelStarRating rating={pkg.makkahHotel?.star} /></span></p>
                        <p className="flex items-center gap-2"><Hotel className="size-4 shrink-0 text-[#D5A12B]" /><span className="flex min-w-0 flex-1 items-center justify-between gap-3"><span>Madinah: <strong>{pkg.madinahHotel?.name}</strong></span><HotelStarRating rating={pkg.madinahHotel?.star} /></span></p>
                      </div>
                      <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-5"><div><small className="block text-[10px] text-slate-400">Harga All In</small><strong className="text-xl text-[#061A2F]">Rp {formatIDR(pkg.priceFrom ?? 0)}</strong></div><span className="text-xs font-extrabold text-[#D5A12B]">Lihat detail →</span></div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl rounded-2xl border border-[#D5A12B]/25 bg-white p-8 text-center shadow-xs">
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#061A2F]">Paket wisata sedang dipersiapkan</h2>
              <p className="mt-3 text-sm leading-6 text-[#59616D]">Tim kami siap membantu mencarikan program perjalanan yang sesuai kebutuhan Anda.</p>
              <a href={whatsappHref("Assalamu’alaikum, saya ingin mengetahui informasi paket wisata terbaru Jam Wisata.", "Halaman Paket Wisata")} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-gold-rich px-6 text-xs font-extrabold text-[#061A2F]"><MessageCircle className="size-4" /> Tanya Paket Wisata</a>
            </div>
          )}
        </div>
      </section>
      <ModernProofFooter />
      <WhatsAppConcierge />
    </main>
  );
}
