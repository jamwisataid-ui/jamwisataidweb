"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HeartHandshake,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import { contact, formatRupiah, type PlannerOptionContent, type Program } from "@/data/site-content";

const steps = ["Tujuan", "Bersama siapa", "Gaya perjalanan", "Budget", "Waktu", "Rekomendasi"];
const companions = ["Sendiri", "Pasangan", "Orang tua", "Keluarga", "Rombongan", "Private group"];
const styles = ["Fokus ibadah", "Nyaman & santai", "Premium", "Family friendly", "Banyak aktivitas", "Plus wisata"];
const budgets = ["Di bawah Rp30 juta", "Rp30–35 juta", "Rp35–45 juta", "Rp45 juta+", "Fleksibel"];
const periods = ["Agustus 2026", "Desember 2026", "Januari 2027", "Masih fleksibel"];

export function JourneyPlanner({ programs, plannerOptions }: { programs: Program[]; plannerOptions: PlannerOptionContent[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const options = step === 0 ? plannerOptions.map((item) => item.title) : step === 1 ? companions : step === 2 ? styles : step === 3 ? budgets : periods;
  const select = (value: string) => setAnswers((current) => ({ ...current, [step]: value }));
  const canContinue = step === 5 || Boolean(answers[step]);

  return (
    <div className="jw-planner-shell">
      <div className="overflow-x-auto border-b border-[var(--jw-navy)]/10 px-5 py-5 sm:px-8">
        <ol className="flex min-w-[720px] items-center">
          {steps.map((label, index) => (
            <li key={label} className="flex flex-1 items-center last:flex-none">
              <span className="flex items-center gap-2.5"><span className={`grid size-8 place-items-center rounded-full border text-[11px] font-semibold ${index < step ? "border-[var(--jw-gold)] bg-[var(--jw-gold)] text-[var(--jw-navy)]" : index === step ? "border-[var(--jw-gold)] bg-[var(--jw-navy)] text-white" : "border-[var(--jw-navy)]/15 text-[var(--jw-muted)]"}`}>{index < step ? <Check className="size-3.5" /> : index + 1}</span><span className={`text-[10px] font-medium ${index === step ? "text-[var(--jw-navy)]" : "text-[var(--jw-muted)]"}`}>{label}</span></span>
              {index < steps.length - 1 ? <span className={`mx-3 h-px flex-1 ${index < step ? "bg-[var(--jw-gold)]" : "bg-[var(--jw-navy)]/10"}`} /> : null}
            </li>
          ))}
        </ol>
      </div>

      {step < 5 ? (
        <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-[.7fr_1.3fr] lg:p-10">
          <aside>
            <p className="jw-eyebrow">Langkah {step + 1} dari 6</p>
            <h2 className="font-editorial text-3xl leading-tight text-[var(--jw-navy)] sm:text-4xl">{[
              "Apa tujuan utama Anda berangkat Umrah?",
              "Bersama siapa Anda akan melakukan perjalanan?",
              "Pengalaman seperti apa yang Anda inginkan?",
              "Berapa anggaran yang Anda rencanakan?",
              "Kapan Anda ingin berangkat?",
            ][step]}</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--jw-muted)]">Pilih satu jawaban yang paling mendekati kebutuhan Anda. Pilihan ini masih dapat dibicarakan kembali bersama tim.</p>
          </aside>
          <div className="grid content-start gap-3 sm:grid-cols-2">
            {options.map((option) => {
              const active = answers[step] === option;
              return <button key={option} type="button" aria-pressed={active} onClick={() => select(option)} className={`flex min-h-[86px] items-center justify-between gap-4 rounded-2xl border p-5 text-left text-sm font-medium transition ${active ? "border-[var(--jw-gold)] bg-[var(--jw-navy)] text-white shadow-lg" : "border-[var(--jw-navy)]/10 bg-white text-[var(--jw-navy)] hover:-translate-y-0.5 hover:border-[var(--jw-gold)]"}`}><span>{option}</span><span className={`grid size-6 shrink-0 place-items-center rounded-full border ${active ? "border-[var(--jw-gold)] bg-[var(--jw-gold)] text-[var(--jw-navy)]" : "border-[var(--jw-navy)]/20"}`}>{active ? <Check className="size-3.5" /> : null}</span></button>;
            })}
          </div>
        </div>
      ) : <PlannerResults answers={answers} programs={programs} />}

      <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-[var(--jw-navy)]/10 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
        <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="jw-button jw-button-outline disabled:pointer-events-none disabled:opacity-35"><ArrowLeft className="size-4" /> Kembali</button>
        {step < 5 ? <button type="button" disabled={!canContinue} onClick={() => setStep((value) => Math.min(5, value + 1))} className="jw-button jw-button-navy disabled:pointer-events-none disabled:opacity-35">{step === 4 ? "Lihat rekomendasi" : "Selanjutnya"}<ArrowRight className="size-4" /></button> : <Link href="/#program" className="jw-button jw-button-navy">Lihat semua program <ArrowRight className="size-4" /></Link>}
      </div>
    </div>
  );
}

function PlannerResults({ answers, programs }: { answers: Record<number, string>; programs: Program[] }) {
  const ranked = [...programs].sort((a, b) => {
    const plus = answers[0]?.includes("plus") || answers[2]?.includes("wisata");
    if (plus) return a.category === "Plus" ? -1 : b.category === "Plus" ? 1 : 0;
    return a.price - b.price;
  });
  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="jw-eyebrow">Rekomendasi untuk Anda</p><h2 className="font-editorial text-4xl text-[var(--jw-navy)]">3 program yang paling mendekati.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--jw-muted)]">Rekomendasi ini adalah titik awal. Tim kami akan memeriksa kebutuhan detail sebelum Anda menentukan pilihan.</p></div><a href={contact.whatsapp} target="_blank" rel="noreferrer" className="jw-button jw-button-outline"><MessageCircle className="size-4" /> Diskusikan hasil</a></div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {ranked.map((program, index) => <article key={program.slug} className={`flex flex-col rounded-2xl border bg-white p-6 ${index === 0 ? "border-[var(--jw-gold)] shadow-[0_18px_45px_rgba(10,29,58,.1)]" : "border-[var(--jw-navy)]/10"}`}><p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.1em] text-[var(--jw-gold-dark)] uppercase">{index === 0 ? <Sparkles className="size-3.5" /> : null}{index === 0 ? "Paling sesuai" : `Pilihan ${index + 1}`}</p><h3 className="mt-4 font-editorial text-2xl text-[var(--jw-navy)]">{program.name}</h3><p className="mt-3 text-xs leading-5 text-[var(--jw-muted)]">{index === 0 ? "Sesuai dengan jawaban utama, waktu, dan kisaran kebutuhan Anda." : "Alternatif yang dapat dipertimbangkan bersama tim konsultasi."}</p><div className="mt-5 space-y-2 border-y border-[var(--jw-navy)]/10 py-4 text-xs text-[var(--jw-muted)]"><p>{program.departureDate}</p><p>{program.airline}</p><p>{program.duration}</p></div><p className="mt-5 font-editorial text-2xl text-[var(--jw-gold-dark)]">Rp{formatRupiah(program.price)}</p><Link href={`/program/${program.slug}`} className="jw-button jw-button-navy mt-5">Lihat detail <ArrowRight className="size-4" /></Link></article>)}
      </div>
      <div className="mt-6 flex gap-4 rounded-2xl bg-[var(--jw-cream)] p-5"><HeartHandshake className="size-6 shrink-0 text-[var(--jw-gold-dark)]" /><div><p className="text-sm font-semibold text-[var(--jw-navy)]">Masih belum yakin?</p><p className="mt-1 text-xs leading-5 text-[var(--jw-muted)]">Konsultasi tidak mengikat. Tim kami akan membantu membaca kebutuhan Anda dengan lebih personal.</p></div></div>
    </div>
  );
}
