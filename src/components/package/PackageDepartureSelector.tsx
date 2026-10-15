"use client";

import { useMemo, useState } from "react";
import { Calendar, MessageCircle } from "lucide-react";

import { formatIDR, whatsappHref } from "@/data/jamwisata";
import type { PackageDeparture } from "@/types/jamwisata";

export function PackageDepartureSelector({ packageName, departures }: { packageName: string; departures: PackageDeparture[] }) {
  const selectable = departures.filter((departure) => departure.selectable);
  const [selectedId, setSelectedId] = useState(selectable.length === 1 ? selectable[0].id : "");
  const selected = useMemo(() => departures.find((departure) => departure.id === selectedId), [departures, selectedId]);
  const message = selected
    ? `Assalamu’alaikum Jam Wisata, saya tertarik dengan:\n\nPaket: ${packageName}\nKeberangkatan: ${selected.dateLabel}\nHarga: Rp${formatIDR(selected.price ?? 0)}\n\nMohon informasi selengkapnya.`
    : "";

  return (
    <div id="pilih-keberangkatan" className="mt-6 scroll-mt-32 border-t border-white/10 pt-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white"><Calendar className="size-4 text-[#E8C967]" /> Pilih Keberangkatan</div>
      <div className="space-y-2" role="radiogroup" aria-label="Pilihan tanggal keberangkatan">
        {departures.length ? departures.map((departure) => (
          <label key={departure.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${selectedId === departure.id ? "border-[#E8C967] bg-[#E8C967]/12" : "border-white/15 bg-white/5"} ${departure.selectable ? "" : "cursor-not-allowed opacity-55"}`}>
            <input type="radio" name="departure" value={departure.id} checked={selectedId === departure.id} disabled={!departure.selectable} onChange={() => setSelectedId(departure.id)} className="mt-1 accent-[#D5A12B]" />
            <span className="min-w-0 flex-1">
              <strong className="block text-sm text-white">{departure.dateLabel}</strong>
              <span className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                <span>{departure.price ? `Rp ${formatIDR(departure.price)}` : "Harga menyusul"}</span>
                <span className={departure.status === "limited" ? "text-amber-300" : departure.selectable ? "text-emerald-300" : "text-rose-300"}>{departure.status === "available" ? "Tersedia" : departure.status === "limited" ? "Hampir penuh" : departure.status === "coming-soon" ? "Segera dibuka" : "Tidak tersedia"}</span>
              </span>
            </span>
          </label>
        )) : <p className="text-xs text-slate-300">Belum ada jadwal keberangkatan aktif.</p>}
      </div>
      <a href={selected ? whatsappHref(message, `Paket Detail — ${packageName}`) : undefined} target={selected ? "_blank" : undefined} rel="noopener noreferrer" aria-disabled={!selected} className={`mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition ${selected ? "sheen-gold bg-gradient-gold-rich text-[#061A2F] shadow-lg hover:scale-[1.02]" : "cursor-not-allowed bg-slate-600 text-slate-300"}`}>
        <MessageCircle className="size-4" /><span>{selectable.length > 1 && !selected ? "Pilih tanggal dahulu" : "Konsultasi WhatsApp"}</span>
      </a>
    </div>
  );
}
