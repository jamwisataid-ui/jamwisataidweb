"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Calculator, CheckCircle2, ChevronDown, CircleAlert, Hotel, Save, Sparkles } from "lucide-react";
import { FormFeedback } from "./FormFeedback";
import { saveHppCostingAction } from "@/lib/management/hpp-actions";
import { calculateHpp, DEFAULT_HPP_ITEMS, HPP_CATEGORIES, roundSellingPrice, type HppCostBasis, type HppCurrency, type HppItemInput, type HppLaMode } from "@/lib/management/hpp";
import type { ManagementActionState } from "@/lib/management/validation";

const initialState: ManagementActionState = { ok: false, message: "" };
const currency = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });

export type HppFormInitial = {
  id?: string; title?: string; packageId?: string | null; departureId?: string | null; departureDate?: string | null;
  season?: string; laMode?: HppLaMode; durationDays?: number; paxCount?: number; usdRate?: string | number; sarRate?: string | number;
  profitMargin?: string | number; marketingFee?: string | number; appliedPrice?: number | null; notes?: string | null;
  items?: Array<{ code: string; category: string; name: string; currency: HppCurrency; costBasis: HppCostBasis; unitAmount: string | number; quantity: string | number; metadata?: Record<string, unknown> }>;
};

type Master = { id: string; code: string; category: string; name: string; currency: HppCurrency; costBasis: HppCostBasis; amount: string; metadata: Record<string, unknown> };
type Departure = { id: string; departureDate: string; price: string; packageId: string; package?: { name: string } };

function numeric(value: unknown) { return Number(typeof value === "string" || typeof value === "number" ? value : 0) || 0; }
function cleanNumber(value: string) { return Number(value.replace(/[^\d.]/g, "")) || 0; }

export function HppCalculator({ initial, masters, departures }: { initial?: HppFormInitial; masters: Master[]; departures: Departure[] }) {
  const masterMap = useMemo(() => new Map(masters.map((item) => [item.code, item])), [masters]);
  const startingItems = useMemo<HppItemInput[]>(() => {
    if (initial?.items?.length) return initial.items.map((item) => ({ ...item, unitAmount: numeric(item.unitAmount), quantity: numeric(item.quantity), occupancy: numeric(item.metadata?.occupancy) || undefined }));
    return DEFAULT_HPP_ITEMS.map((item) => {
      const master = masterMap.get(item.code);
      return master ? { ...item, name: master.name, currency: master.currency, costBasis: master.costBasis, unitAmount: numeric(master.amount), quantity: numeric(master.metadata?.defaultQuantity) || item.quantity } : { ...item };
    });
  }, [initial, masterMap]);
  const [state, action, pending] = useActionState(saveHppCostingAction, initialState);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [departureId, setDepartureId] = useState(initial?.departureId ?? "");
  const [departureDate, setDepartureDate] = useState(initial?.departureDate ?? "");
  const [season, setSeason] = useState(initial?.season ?? "high");
  const [laMode, setLaMode] = useState<HppLaMode>(initial?.laMode ?? "package");
  const [durationDays, setDurationDays] = useState(numeric(initial?.durationDays) || 9);
  const [paxCount, setPaxCount] = useState(numeric(initial?.paxCount) || 35);
  const [usdRate, setUsdRate] = useState(numeric(initial?.usdRate) || 17649);
  const [sarRate, setSarRate] = useState(numeric(initial?.sarRate) || 4817);
  const [profitMargin, setProfitMargin] = useState(numeric(initial?.profitMargin) || 1_000_000);
  const [marketingFee, setMarketingFee] = useState(numeric(initial?.marketingFee) || 1_000_000);
  const [appliedPrice, setAppliedPrice] = useState(numeric(initial?.appliedPrice));
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [items, setItems] = useState(startingItems);
  const [saveLabel, setSaveLabel] = useState("Belum ada perubahan");
  const [laPreset, setLaPreset] = useState("");
  const [makkahHotel, setMakkahHotel] = useState("");
  const [madinahHotel, setMadinahHotel] = useState("");
  const storageKey = `jamwisata-hpp-draft-${initial?.id ?? "new"}`;

  const result = useMemo(() => {
    try { return calculateHpp({ paxCount, usdRate, sarRate, profitMargin, marketingFee, items }); }
    catch { return { items: [], subtotalBase: 0, focTourLeader: 0, hppPerPax: 0, sellingPrice: 0 }; }
  }, [items, marketingFee, paxCount, profitMargin, sarRate, usdRate]);

  useEffect(() => {
    if (initial?.id) return;
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    const timer = window.setTimeout(() => {
      try {
        const draft = JSON.parse(saved);
        if (draft.title) setTitle(draft.title);
        if (Array.isArray(draft.items)) setItems(draft.items);
        setDepartureId(draft.departureId ?? ""); setDepartureDate(draft.departureDate ?? "");
        setSeason(draft.season ?? "high"); setLaMode(draft.laMode ?? "package");
        setDurationDays(numeric(draft.durationDays) || 9); setPaxCount(numeric(draft.paxCount) || 35);
        setUsdRate(numeric(draft.usdRate) || 17649); setSarRate(numeric(draft.sarRate) || 4817);
        setProfitMargin(numeric(draft.profitMargin)); setMarketingFee(numeric(draft.marketingFee));
        setAppliedPrice(numeric(draft.appliedPrice)); setNotes(draft.notes ?? ""); setSaveLabel("Draft dipulihkan dari perangkat");
      } catch { localStorage.removeItem(storageKey); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initial?.id, storageKey]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify({ title, departureId, departureDate, season, laMode, durationDays, paxCount, usdRate, sarRate, profitMargin, marketingFee, appliedPrice, notes, items }));
      setSaveLabel("Draft aman di perangkat");
    }, 650);
    return () => window.clearTimeout(timer);
  }, [appliedPrice, departureDate, departureId, durationDays, items, laMode, marketingFee, notes, paxCount, profitMargin, sarRate, season, storageKey, title, usdRate]);

  function updateItem(code: string, patch: Partial<HppItemInput>) { setItems((current) => current.map((item) => item.code === code ? { ...item, ...patch } : item)); }
  function chooseDeparture(id: string) {
    setDepartureId(id);
    const selected = departures.find((item) => item.id === id);
    if (selected) setDepartureDate(selected.departureDate);
  }
  function chooseLaPreset(code: string) {
    setLaPreset(code);
    const selected = masters.find((item) => item.code === code);
    if (!selected) return;
    updateItem("land_arrangement", { name: selected.name, currency: selected.currency, unitAmount: numeric(selected.amount), costBasis: "per_pax" });
  }
  function chooseHotel(city: "makkah" | "madinah", id: string) {
    if (city === "makkah") setMakkahHotel(id);
    else setMadinahHotel(id);
    const selected = masters.find((item) => item.id === id);
    if (!selected) return;
    const rate = numeric(selected.metadata[season] ?? selected.amount);
    const code = `hotel_${city}`;
    setItems((current) => {
      const withoutLa = current.filter((item) => item.code !== "land_arrangement" && item.code !== code);
      return [...withoutLa, { code, category: "la", name: selected.name, currency: "SAR", costBasis: "room_per_night", unitAmount: rate, quantity: 4, occupancy: 4 }];
    });
  }
  function changeSeason(value: string) {
    setSeason(value);
    const updateSelected = (city: "makkah" | "madinah", id: string) => {
      const selected = masters.find((item) => item.id === id);
      if (selected) updateItem(`hotel_${city}`, { unitAmount: numeric(selected.metadata[value] ?? selected.amount) });
    };
    if (makkahHotel) updateSelected("makkah", makkahHotel);
    if (madinahHotel) updateSelected("madinah", madinahHotel);
  }
  function switchLaMode(mode: HppLaMode) {
    setLaMode(mode);
    if (mode === "package") {
      setItems((current) => [...current.filter((item) => !item.code.startsWith("hotel_")), DEFAULT_HPP_ITEMS.find((item) => item.code === "land_arrangement")!]);
    } else setItems((current) => current.filter((item) => item.code !== "land_arrangement"));
  }

  const fieldLabels = { title: "Nama simulasi", durationDays: "Durasi", paxCount: "Jumlah jamaah", usdRate: "Kurs USD", sarRate: "Kurs SAR", items: "Komponen biaya" };
  return <form action={action} className="hpp-builder">
    <FormFeedback state={state} fieldLabels={fieldLabels} />
    {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
    <input type="hidden" name="packageId" value={departures.find((item) => item.id === departureId)?.packageId ?? initial?.packageId ?? ""} />
    <input type="hidden" name="items" value={JSON.stringify(items)} />
    <div className="hpp-builder-main">
      <section className="management-panel hpp-intro-panel">
        <header><div><small>LANGKAH 1 DARI 4</small><h2>Informasi paket & rombongan</h2><p>Isi data dasarnya dulu. Semua hasil di sebelah kanan akan dihitung otomatis.</p></div><span className="hpp-save-state"><Save />{pending ? "Menyimpan ke server…" : saveLabel}</span></header>
        <div className="management-form management-form-grid two">
          <label className="span-two"><span>Nama simulasi *</span><input name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Umrah Akhir Tahun 9 Hari" required /><small>Nama ini hanya untuk catatan internal.</small></label>
          <label><span>Paket keberangkatan <i>opsional</i></span><select name="departureId" value={departureId} onChange={(e) => chooseDeparture(e.target.value)}><option value="">Belum dihubungkan</option>{departures.map((item) => <option value={item.id} key={item.id}>{item.package?.name ?? "Paket"} — {item.departureDate}</option>)}</select><small>Bisa dipilih sekarang atau ketika harga akan diterapkan.</small></label>
          <label><span>Tanggal keberangkatan</span><input name="departureDate" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} /></label>
          <label><span>Durasi perjalanan *</span><div className="hpp-input-suffix"><input name="durationDays" type="number" min="1" max="60" value={durationDays} onChange={(e) => setDurationDays(cleanNumber(e.target.value))} required /><b>hari</b></div></label>
          <label><span>Jumlah jamaah *</span><div className="hpp-input-suffix"><input name="paxCount" type="number" min="1" max="500" value={paxCount} onChange={(e) => setPaxCount(cleanNumber(e.target.value))} required /><b>orang</b></div><small>Biaya bus dan FOC otomatis dibagi jumlah ini.</small></label>
          <label><span>Kurs USD ke Rupiah *</span><input name="usdRate" inputMode="numeric" value={usdRate} onChange={(e) => setUsdRate(cleanNumber(e.target.value))} /></label>
          <label><span>Kurs SAR ke Rupiah *</span><input name="sarRate" inputMode="numeric" value={sarRate} onChange={(e) => setSarRate(cleanNumber(e.target.value))} /></label>
        </div>
      </section>

      <section className="management-panel hpp-la-panel">
        <header><div><small>LANGKAH 2 DARI 4</small><h2>Biaya Land Arrangement</h2><p>Pilih cara yang paling mudah. Mode paket LA direkomendasikan untuk perhitungan cepat.</p></div></header>
        <div className="hpp-mode-picker">
          <button type="button" className={laMode === "package" ? "active" : ""} onClick={() => switchLaMode("package")}><Sparkles /><span><strong>Paket LA siap pakai</strong><small>Satu harga per jamaah</small></span></button>
          <button type="button" className={laMode === "hotel_detail" ? "active" : ""} onClick={() => switchLaMode("hotel_detail")}><Hotel /><span><strong>Hitung hotel rinci</strong><small>Hotel, musim, dan malam</small></span></button>
        </div>
        <input type="hidden" name="laMode" value={laMode} />
        {laMode === "package" ? <div className="management-form management-form-grid two">
          <label><span>Pilih referensi paket LA</span><select value={laPreset} onChange={(e) => chooseLaPreset(e.target.value)}><option value="">Ketik harga sendiri</option>{masters.filter((item) => item.category === "la_package").map((item) => <option value={item.code} key={item.id}>{item.name} — {currency.format(numeric(item.amount))}</option>)}</select></label>
          <label><span>Harga LA per jamaah *</span><input inputMode="numeric" value={items.find((item) => item.code === "land_arrangement")?.unitAmount ?? 0} onChange={(e) => updateItem("land_arrangement", { unitAmount: cleanNumber(e.target.value) })} /><small>Harga tetap bebas disesuaikan untuk simulasi ini.</small></label>
        </div> : <div className="management-form management-form-grid two">
          <label><span>Musim hotel</span><select name="season" value={season} onChange={(e) => changeSeason(e.target.value)}><option value="low">Low Season</option><option value="medium">Medium Season</option><option value="high">High Season</option></select></label>
          <div />
          <HotelSelector label="Hotel Makkah" value={makkahHotel} masters={masters.filter((item) => item.category === "hotel_makkah")} onChange={(id) => chooseHotel("makkah", id)} item={items.find((item) => item.code === "hotel_makkah")} onItemChange={(patch) => updateItem("hotel_makkah", patch)} />
          <HotelSelector label="Hotel Madinah" value={madinahHotel} masters={masters.filter((item) => item.category === "hotel_madinah")} onChange={(id) => chooseHotel("madinah", id)} item={items.find((item) => item.code === "hotel_madinah")} onItemChange={(patch) => updateItem("hotel_madinah", patch)} />
        </div>}
        {laMode === "package" ? <input type="hidden" name="season" value={season} /> : null}
      </section>

      <section className="management-panel">
        <header><div><small>LANGKAH 3 DARI 4</small><h2>Rincian komponen biaya</h2><p>Harga default sudah terisi. Buka kelompok yang ingin diperiksa atau diubah.</p></div></header>
        <div className="hpp-cost-groups">{HPP_CATEGORIES.filter(([key]) => key !== "la").map(([key, label], index) => {
          const categoryItems = result.items.filter((item) => item.category === key);
          const total = categoryItems.reduce((sum, item) => sum + item.computedPerPax, 0);
          return <details key={key} open={index < 2}><summary><span><b>{index + 1}</b><strong>{label}</strong></span><span>{currency.format(total)}<ChevronDown /></span></summary><div>{items.filter((item) => item.category === key).map((item) => <div className="hpp-cost-row" key={item.code}><label><span>{item.name}</span><small>{item.costBasis === "group" ? "Total rombongan, otomatis dibagi jamaah" : item.currency === "IDR" ? "Harga per jamaah" : `Harga ${item.currency} per jamaah`}</small></label><select aria-label={`Mata uang ${item.name}`} value={item.currency} onChange={(e) => updateItem(item.code, { currency: e.target.value as HppCurrency })}><option>IDR</option><option>USD</option><option>SAR</option></select><input aria-label={`Harga ${item.name}`} inputMode="decimal" value={item.unitAmount} onChange={(e) => updateItem(item.code, { unitAmount: cleanNumber(e.target.value) })} /><input aria-label={`Jumlah ${item.name}`} type="number" min="0" step="0.01" value={item.quantity} onChange={(e) => updateItem(item.code, { quantity: cleanNumber(e.target.value) })} /><strong>{currency.format(result.items.find((row) => row.code === item.code)?.computedPerPax ?? 0)}</strong></div>)}</div></details>;
        })}</div>
      </section>

      <section className="management-panel">
        <header><div><small>LANGKAH 4 DARI 4</small><h2>Profit & harga jual</h2><p>Atur keuntungan, periksa hasil, lalu simpan sebagai draft atau final.</p></div></header>
        <div className="management-form management-form-grid two">
          <label><span>Profit per jamaah</span><input name="profitMargin" inputMode="numeric" value={profitMargin} onChange={(e) => setProfitMargin(cleanNumber(e.target.value))} /><small>{currency.format(profitMargin)}</small></label>
          <label><span>Fee marketing per jamaah</span><input name="marketingFee" inputMode="numeric" value={marketingFee} onChange={(e) => setMarketingFee(cleanNumber(e.target.value))} /><small>{currency.format(marketingFee)}</small></label>
          <label className="span-two"><span>Harga yang akan diterapkan ke website</span><input name="appliedPrice" inputMode="numeric" value={appliedPrice || roundSellingPrice(result.sellingPrice)} onChange={(e) => setAppliedPrice(cleanNumber(e.target.value))} /><small>Disarankan dari hasil perhitungan dan tetap boleh disesuaikan manual.</small></label>
          <label className="span-two"><span>Catatan <i>opsional</i></span><textarea name="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        </div>
      </section>
    </div>

    <aside className="hpp-summary">
      <div className="hpp-summary-title"><span><Calculator /></span><div><small>RINGKASAN OTOMATIS</small><h2>Hasil per jamaah</h2></div></div>
      <dl><div><dt>Biaya riil</dt><dd>{currency.format(result.subtotalBase)}</dd></div><div><dt>FOC Tour Leader</dt><dd>{currency.format(result.focTourLeader)}</dd></div><div className="hpp-total"><dt>HPP Bersih</dt><dd>{currency.format(result.hppPerPax)}</dd></div><div><dt>Profit</dt><dd>{currency.format(profitMargin)}</dd></div><div><dt>Fee marketing</dt><dd>{currency.format(marketingFee)}</dd></div></dl>
      <div className="hpp-selling"><span>Harga jual hasil hitung</span><strong>{currency.format(result.sellingPrice)}</strong><small>Nilai presisi: Rp{number.format(result.sellingPrice)}</small></div>
      <div className="hpp-ready">{title.trim().length >= 3 && paxCount > 0 ? <CheckCircle2 /> : <CircleAlert />}<span><strong>{title.trim().length >= 3 && paxCount > 0 ? "Siap disimpan" : "Data belum lengkap"}</strong><small>Input tidak akan hilang jika ada validasi yang salah.</small></span></div>
      <div className="hpp-submit-actions"><button name="status" value="draft" disabled={pending}><Save />{pending ? "Menyimpan…" : "Simpan draft"}</button><button name="status" value="final" disabled={pending}><CheckCircle2 />Finalkan HPP</button></div>
    </aside>
  </form>;
}

function HotelSelector({ label, value, masters, onChange, item, onItemChange }: { label: string; value: string; masters: Master[]; onChange: (id: string) => void; item?: HppItemInput; onItemChange: (patch: Partial<HppItemInput>) => void }) {
  return <fieldset className="hpp-hotel-field"><legend>{label}</legend><label><span>Pilih hotel Quad</span><select value={value} onChange={(e) => onChange(e.target.value)}><option value="">Pilih hotel</option>{masters.map((master) => <option value={master.id} key={master.id}>{master.name}</option>)}</select></label><div><label><span>Tarif SAR/kamar/malam</span><input inputMode="numeric" value={item?.unitAmount ?? 0} onChange={(e) => onItemChange({ unitAmount: cleanNumber(e.target.value) })} /></label><label><span>Jumlah malam</span><input type="number" min="0" value={item?.quantity ?? 0} onChange={(e) => onItemChange({ quantity: cleanNumber(e.target.value) })} /></label></div><small>Harga dibagi otomatis untuk 4 jamaah. Triple/Double dapat ditambahkan lewat Master Harga.</small></fieldset>;
}
