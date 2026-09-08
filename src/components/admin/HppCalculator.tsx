"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Calculator, CheckCircle2, ChevronDown, CircleAlert, HelpCircle, Hotel, Info, Save, Sparkles } from "lucide-react";
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
          <label className="span-two"><span>Nama paket / simulasi *</span><input name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Umrah Akhir Tahun 9 Hari" required /><small>Tulis nama paket untuk memudahkan pencarian di arsip kantor.</small></label>
          <label><span>Paket di website <i>(opsional)</i></span><select name="departureId" value={departureId} onChange={(e) => chooseDeparture(e.target.value)}><option value="">Belum dihubungkan ke paket mana pun</option>{departures.map((item) => <option value={item.id} key={item.id}>{item.package?.name ?? "Paket"} — {item.departureDate}</option>)}</select><small>Pilih jika harga ini ingin langsung dihubungkan ke paket yang sudah ada.</small></label>
          <label><span>Tanggal keberangkatan</span><input name="departureDate" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} /><small>Perkiraan tanggal rombongan berangkat.</small></label>
          <label><span>Durasi perjalanan *</span><div className="hpp-input-suffix"><input name="durationDays" type="number" min="1" max="60" value={durationDays} onChange={(e) => setDurationDays(cleanNumber(e.target.value))} required /><b>hari</b></div><small>Lama perjalanan (contoh: 9, 12, atau 16 hari).</small></label>
          <label><span>Jumlah jamaah (Pax) *</span><div className="hpp-input-suffix"><input name="paxCount" type="number" min="1" max="500" value={paxCount} onChange={(e) => setPaxCount(cleanNumber(e.target.value))} required /><b>orang</b></div><small>Biaya sewa bus dan gratis Tour Leader otomatis dibagi ke jumlah ini.</small></label>
          <label><span>Kurs USD ke Rupiah *</span><input name="usdRate" inputMode="numeric" value={usdRate} onChange={(e) => setUsdRate(cleanNumber(e.target.value))} /><small>1 Dolar AS = {currency.format(usdRate)} (contoh: Visa Saudi)</small></label>
          <label><span>Kurs SAR (Riyal) ke Rupiah *</span><input name="sarRate" inputMode="numeric" value={sarRate} onChange={(e) => setSarRate(cleanNumber(e.target.value))} /><small>1 Riyal Saudi = {currency.format(sarRate)} (contoh: Raudhah & Hotel)</small></label>
        </div>
      </section>

      <section className="management-panel hpp-la-panel">
        <header><div><small>LANGKAH 2 DARI 4</small><h2>Biaya Land Arrangement (Hotel & Makan di Saudi)</h2><p>Pilih cara yang paling mudah bagi Anda. Cara pertama (Paket LA siap pakai) paling disarankan.</p></div></header>
        <div className="hpp-mode-picker">
          <button type="button" className={laMode === "package" ? "active" : ""} onClick={() => switchLaMode("package")}><Sparkles /><span><strong>1. Paket LA siap pakai (Paling Praktis)</strong><small>Cukup 1 harga all-in dari vendor per jamaah</small></span></button>
          <button type="button" className={laMode === "hotel_detail" ? "active" : ""} onClick={() => switchLaMode("hotel_detail")}><Hotel /><span><strong>2. Hitung hotel rinci per malam</strong><small>Pilih nama hotel Makkah & Madinah per malam</small></span></button>
        </div>
        <input type="hidden" name="laMode" value={laMode} />
        {laMode === "package" ? <div className="management-form management-form-grid two">
          <label><span>Pilih contoh paket LA atau ketik manual</span><select value={laPreset} onChange={(e) => chooseLaPreset(e.target.value)}><option value="">Ketik harga sendiri di bawah</option>{masters.filter((item) => item.category === "la_package").map((item) => <option value={item.code} key={item.id}>{item.name} — {currency.format(numeric(item.amount))}</option>)}</select><small>Bisa klik contoh di atas, atau langsung isi kolom harga di sebelah kanan.</small></label>
          <label><span>Harga LA per jamaah (Rupiah) *</span><input inputMode="numeric" value={items.find((item) => item.code === "land_arrangement")?.unitAmount ?? 0} onChange={(e) => updateItem("land_arrangement", { unitAmount: cleanNumber(e.target.value) })} /><small>{currency.format(numeric(items.find((item) => item.code === "land_arrangement")?.unitAmount))} per orang</small></label>
        </div> : <div className="management-form management-form-grid two">
          <label><span>Musim keberangkatan</span><select name="season" value={season} onChange={(e) => changeSeason(e.target.value)}><option value="low">Low Season (Biasa)</option><option value="medium">Medium Season (Sedang)</option><option value="high">High Season (Ramai / Liburan)</option></select><small>Tarif hotel otomatis menyesuaikan musim yang dipilih.</small></label>
          <div />
          <HotelSelector label="Hotel Makkah" value={makkahHotel} masters={masters.filter((item) => item.category === "hotel_makkah")} onChange={(id) => chooseHotel("makkah", id)} item={items.find((item) => item.code === "hotel_makkah")} onItemChange={(patch) => updateItem("hotel_makkah", patch)} />
          <HotelSelector label="Hotel Madinah" value={madinahHotel} masters={masters.filter((item) => item.category === "hotel_madinah")} onChange={(id) => chooseHotel("madinah", id)} item={items.find((item) => item.code === "hotel_madinah")} onItemChange={(patch) => updateItem("hotel_madinah", patch)} />
        </div>}
        {laMode === "package" ? <input type="hidden" name="season" value={season} /> : null}
      </section>

      <section className="management-panel">
        <header><div><small>LANGKAH 3 DARI 4</small><h2>Rincian komponen biaya lainnya</h2><p>Semua biaya standar sudah terisi otomatis. Anda cukup membuka kelompok yang ingin diperiksa atau disesuaikan nominalnya.</p></div></header>
        <div className="hpp-cost-groups">{HPP_CATEGORIES.filter(([key]) => key !== "la").map(([key, label], index) => {
          const categoryItems = result.items.filter((item) => item.category === key);
          const total = categoryItems.reduce((sum, item) => sum + item.computedPerPax, 0);
          return <details key={key} open={index < 2}><summary><span><b>{index + 1}</b><strong>{label}</strong></span><span>{currency.format(total)}<ChevronDown /></span></summary><div>{items.filter((item) => item.category === key).map((item) => <div className="hpp-cost-row" key={item.code}><label><span>{item.name}</span><small>{item.costBasis === "group" ? "Biaya rombongan (dibagi rata ke seluruh jamaah)" : item.currency === "IDR" ? "Biaya per orang" : `Biaya ${item.currency} per orang`}</small></label><select aria-label={`Mata uang ${item.name}`} value={item.currency} onChange={(e) => updateItem(item.code, { currency: e.target.value as HppCurrency })}><option>IDR</option><option>USD</option><option>SAR</option></select><input aria-label={`Harga ${item.name}`} inputMode="decimal" value={item.unitAmount} onChange={(e) => updateItem(item.code, { unitAmount: cleanNumber(e.target.value) })} /><input aria-label={`Jumlah ${item.name}`} type="number" min="0" step="0.01" value={item.quantity} onChange={(e) => updateItem(item.code, { quantity: cleanNumber(e.target.value) })} /><strong>{currency.format(result.items.find((row) => row.code === item.code)?.computedPerPax ?? 0)}</strong></div>)}</div></details>;
        })}</div>
      </section>

      <section className="management-panel">
        <header><div><small>LANGKAH 4 DARI 4</small><h2>Target keuntungan & harga jual</h2><p>Tentukan margin keuntungan kantor dan fee agen, lalu simpan hasil perhitungan.</p></div></header>
        <div className="management-form management-form-grid two">
          <label><span>Target keuntungan kantor (per jamaah)</span><input name="profitMargin" inputMode="numeric" value={profitMargin} onChange={(e) => setProfitMargin(cleanNumber(e.target.value))} /><small>Laba bersih kantor: {currency.format(profitMargin)} / orang</small></label>
          <label><span>Alokasi komisi / fee agen (per jamaah)</span><input name="marketingFee" inputMode="numeric" value={marketingFee} onChange={(e) => setMarketingFee(cleanNumber(e.target.value))} /><small>Komisi marketing: {currency.format(marketingFee)} / orang</small></label>
          <label className="span-two"><span>Harga jual final untuk jamaah</span><input name="appliedPrice" inputMode="numeric" value={appliedPrice || roundSellingPrice(result.sellingPrice)} onChange={(e) => setAppliedPrice(cleanNumber(e.target.value))} /><small>Saran pembulatan: <strong>{currency.format(roundSellingPrice(result.sellingPrice))}</strong> (Boleh Anda ubah atau bulatkan sesuai brosur promosi).</small></label>
          <label className="span-two"><span>Catatan tambahan <i>(opsional)</i></span><textarea name="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contoh: Termasuk ziarah Thaif, hotel bintang 5 depan pelataran, dll." /></label>
        </div>
      </section>
    </div>

    <aside className="hpp-summary">
      <div className="hpp-summary-title"><span><Calculator /></span><div><small>RINGKASAN OTOMATIS</small><h2>Hasil per jamaah</h2></div></div>
      <dl>
        <div><dt>Biaya riil jamaah</dt><dd>{currency.format(result.subtotalBase)}</dd></div>
        <div><dt>Gratis Tour Leader (FOC)</dt><dd>{currency.format(result.focTourLeader)}</dd></div>
        <div className="hpp-total"><dt>HPP Bersih (Modal)</dt><dd>{currency.format(result.hppPerPax)}</dd></div>
        <div><dt>+ Keuntungan kantor</dt><dd>{currency.format(profitMargin)}</dd></div>
        <div><dt>+ Alokasi fee agen</dt><dd>{currency.format(marketingFee)}</dd></div>
      </dl>
      <div className="hpp-selling">
        <span>Harga jual hasil hitungan</span>
        <strong>{currency.format(result.sellingPrice)}</strong>
        <small>Modal HPP + Keuntungan + Fee Agen</small>
      </div>
      <div className="hpp-ready">{title.trim().length >= 3 && paxCount > 0 ? <CheckCircle2 /> : <CircleAlert />}<span><strong>{title.trim().length >= 3 && paxCount > 0 ? "Formulir siap disimpan" : "Mohon lengkapi nama & jumlah jamaah"}</strong><small>Data otomatis aman tersimpan di komputer Anda.</small></span></div>
      <div className="hpp-submit-actions">
        <button name="status" value="draft" disabled={pending}><Save />{pending ? "Menyimpan…" : "Simpan sebagai draft"}</button>
        <button name="status" value="final" disabled={pending}><CheckCircle2 />Finalkan & siap diterapkan</button>
      </div>
    </aside>
  </form>;
}

function HotelSelector({ label, value, masters, onChange, item, onItemChange }: { label: string; value: string; masters: Master[]; onChange: (id: string) => void; item?: HppItemInput; onItemChange: (patch: Partial<HppItemInput>) => void }) {
  return (
    <fieldset className="hpp-hotel-field">
      <legend>{label}</legend>
      <label>
        <span>Pilih nama hotel (Sekamar Berempat / Quad)</span>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">-- Pilih dari daftar {masters.length} hotel master --</option>
          {masters.map((master) => {
            const low = master.metadata?.low ? `Low ${master.metadata.low}` : "";
            const high = master.metadata?.high ? `High ${master.metadata.high} SAR` : "";
            const rateDesc = [low, high].filter(Boolean).join(" / ");
            return (
              <option value={master.id} key={master.id}>
                {master.name} {rateDesc ? `(${rateDesc})` : `(${master.amount} SAR)`}
              </option>
            );
          })}
        </select>
      </label>
      <div>
        <label>
          <span>Tarif SAR / kamar / malam</span>
          <input inputMode="numeric" value={item?.unitAmount ?? 0} onChange={(e) => onItemChange({ unitAmount: cleanNumber(e.target.value) })} />
          <small>{item?.unitAmount ? `${item.unitAmount} Riyal / malam` : "Pilih hotel atau ketik manual"}</small>
        </label>
        <label>
          <span>Jumlah malam menginap</span>
          <input type="number" min="0" max="30" value={item?.quantity ?? 0} onChange={(e) => onItemChange({ quantity: cleanNumber(e.target.value) })} />
          <small>{item?.quantity ? `${item.quantity} malam` : "Contoh: 4 malam"}</small>
        </label>
      </div>
      <small>Kamar Quad (sekamar berempat): Biaya otomatis dibagi rata 4 orang jamaah.</small>
    </fieldset>
  );
}
