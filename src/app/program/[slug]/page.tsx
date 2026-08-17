import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, Clock3, Hotel, MessageCircle, Plane, UsersRound } from "lucide-react";

import { SiteFooter } from "@/components/jamwisata/HomePage";
import { SiteHeader } from "@/components/jamwisata/SiteHeader";
import { contact, formatRupiah } from "@/data/site-content";
import { getProgramBySlug, getPrograms } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: "Program tidak ditemukan | Jam Wisata" };
  return { title: `${program.name} | Jam Wisata`, description: program.summary };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  return (
    <div className="jw-site bg-[var(--jw-cream)]">
      <SiteHeader />
      <main>
        <section className="relative min-h-[560px] overflow-hidden bg-[var(--jw-navy)] text-white">
          <Image src={program.image} alt={`Program ${program.name}`} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--jw-navy)] via-[var(--jw-navy)]/84 to-[var(--jw-navy)]/25" />
          <div className="jw-container relative flex min-h-[560px] items-end py-16">
            <div className="max-w-3xl"><Link href="/#program" className="mb-8 inline-flex items-center gap-2 text-xs text-white/65 hover:text-white"><ArrowLeft className="size-4" /> Kembali ke program</Link><p className="jw-eyebrow text-[var(--jw-gold)]">{program.category} · {program.badge}</p><h1 className="font-display text-[clamp(2.8rem,6vw,5.2rem)] leading-[1.02]">{program.name}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">{program.summary}</p></div>
          </div>
        </section>

        <section className="jw-container relative z-10 -mt-8 pb-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="space-y-8">
              <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--jw-navy)]/10 bg-[var(--jw-navy)]/10 sm:grid-cols-2 xl:grid-cols-4">
                {[[CalendarDays, "Keberangkatan", program.departureDate], [Clock3, "Durasi", program.duration], [Plane, "Maskapai", program.airline], [UsersRound, "Pendamping", program.mentor]].map(([Icon, label, value]) => <div key={String(label)} className="bg-white p-5"><Icon className="size-5 text-[var(--jw-gold-dark)]" /><p className="mt-4 text-[9px] font-semibold tracking-[0.1em] text-[var(--jw-muted)] uppercase">{String(label)}</p><p className="mt-1 text-xs font-semibold text-[var(--jw-navy)]">{String(value)}</p></div>)}
              </div>
              <Section title="Ringkasan perjalanan"><p>{program.summary}</p><p>Rangkaian akhir, jadwal penerbangan, dan ketentuan perjalanan akan dijelaskan oleh tim Jam Wisata dalam dokumen program resmi.</p></Section>
              <Section title="Hotel & akomodasi"><div className="grid gap-4 sm:grid-cols-2"><InfoCard icon={Hotel} label="Makkah" value={program.makkahHotel} /><InfoCard icon={Hotel} label="Madinah" value={program.madinahHotel} /></div></Section>
              <Section title="Fasilitas perjalanan"><div className="grid gap-3 sm:grid-cols-2">{["Manasik dan bimbingan ibadah", "Pendamping jamaah", "Pengurusan dokumen sesuai program", "Transportasi selama program", "Akomodasi sesuai rincian", "Informasi perjalanan terarah"].map((item) => <p key={item} className="flex gap-3 rounded-xl bg-[var(--jw-cream)] p-4 text-xs text-[var(--jw-charcoal)]"><Check className="size-4 shrink-0 text-[var(--jw-gold-dark)]" />{item}</p>)}</div></Section>
              <Section title="Itinerary & ketentuan"><p>Itinerary rinci, cakupan harga, ketentuan pembayaran, serta komponen yang termasuk dan tidak termasuk akan diberikan dalam penawaran resmi. Hal ini menjaga agar informasi yang Anda terima tetap akurat.</p></Section>
            </div>
            <aside className="rounded-2xl border border-[var(--jw-gold)]/35 bg-white p-6 shadow-[0_20px_55px_rgba(10,29,58,.1)] lg:sticky lg:top-[142px]">
              <p className="jw-eyebrow !text-[9px]">Ringkasan program</p><h2 className="font-editorial text-2xl text-[var(--jw-navy)]">{program.name}</h2><p className="mt-4 text-[10px] font-medium tracking-wide text-[var(--jw-muted)] uppercase">Harga mulai</p><p className="mt-1 font-editorial text-4xl text-[var(--jw-gold-dark)]">Rp{formatRupiah(program.price)}<span className="ml-1 font-sans text-[10px] text-[var(--jw-muted)]">/pax</span></p><div className="mt-5 border-y border-[var(--jw-navy)]/10 py-5 text-xs leading-6 text-[var(--jw-muted)]"><p>{program.departureDate}</p><p>{program.airline}</p><p>{program.capacity}</p></div><a href={contact.whatsapp} target="_blank" rel="noreferrer" className="jw-button jw-button-gold mt-5 w-full"><MessageCircle className="size-4" /> Konsultasikan program</a><p className="mt-4 text-center text-[10px] leading-4 text-[var(--jw-muted)]">Harga, ketersediaan, dan ketentuan akhir dikonfirmasi oleh tim Jam Wisata.</p>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-[var(--jw-navy)]/10 bg-white p-6 sm:p-8"><h2 className="font-editorial text-3xl text-[var(--jw-navy)]">{title}</h2><div className="mt-5 space-y-4 text-sm leading-7 text-[var(--jw-muted)]">{children}</div></section>;
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Hotel; label: string; value: string }) {
  return <div className="rounded-xl border border-[var(--jw-navy)]/10 p-5"><Icon className="size-5 text-[var(--jw-gold-dark)]" /><p className="mt-4 text-[9px] font-semibold tracking-[0.1em] text-[var(--jw-muted)] uppercase">{label}</p><p className="mt-1 text-sm font-semibold text-[var(--jw-navy)]">{value}</p></div>;
}
