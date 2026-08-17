import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";

import { JourneyPlanner } from "@/components/jamwisata/JourneyPlanner";
import { SiteFooter } from "@/components/jamwisata/HomePage";
import { SiteHeader } from "@/components/jamwisata/SiteHeader";
import { getSiteContent } from "@/lib/db";

export const metadata: Metadata = {
  title: "Journey Planner | Jam Wisata",
  description: "Temukan program Umrah yang lebih sesuai dengan kebutuhan perjalanan Anda bersama Journey Planner Jam Wisata.",
};

export default async function JourneyPlannerPage() {
  const { programs, plannerOptions } = await getSiteContent();
  return (
    <div className="jw-site bg-[var(--jw-cream)]">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[var(--jw-navy)] py-16 text-white sm:py-20">
          <Image src="/sites/jamwisata-com-2868cc8a/root-8a5edab2/promo.jpg" alt="Masjidil Haram" fill priority sizes="100vw" className="object-cover opacity-22" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--jw-navy)] via-[var(--jw-navy)]/92 to-[var(--jw-navy)]/55" />
          <div className="jw-pattern absolute inset-0 opacity-[0.035]" />
          <div className="jw-container relative grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div><p className="jw-eyebrow text-[var(--jw-gold)]">Journey Planner</p><h1 className="max-w-4xl font-display text-[clamp(2.6rem,5vw,4.7rem)] leading-[1.04]">Mari temukan program yang paling tepat untuk Anda.</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">Jawab beberapa pertanyaan sederhana. Kami akan membantu menyusun pilihan awal yang dapat Anda diskusikan bersama tim Jam Wisata.</p></div>
            <div className="rounded-2xl border border-white/15 bg-white/8 p-6 backdrop-blur-md">{["Dipandu dengan amanah", "Direkomendasikan dengan hati", "Dibimbing dengan sepenuh hati"].map((item) => <p key={item} className="flex items-center gap-3 py-2 text-sm text-white/75"><span className="grid size-6 place-items-center rounded-full bg-[var(--jw-gold)] text-[var(--jw-navy)]"><Check className="size-3.5" /></span>{item}</p>)}</div>
          </div>
        </section>
        <section className="jw-container relative z-10 -mt-6 pb-20 sm:-mt-9"><JourneyPlanner programs={programs} plannerOptions={plannerOptions} /></section>
      </main>
      <SiteFooter />
    </div>
  );
}
