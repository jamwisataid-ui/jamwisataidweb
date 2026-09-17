"use client";

import { useActionState, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  FileText,
  Loader2,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import { savePackageAction } from "@/lib/cms/actions";
import { cleanRupiahInput, formatRupiahInput, terbilangRupiah } from "@/lib/cms/utils";
import type { ActionState } from "@/lib/cms/validation";
import { AdminImageUpload } from "./AdminImageUpload";
import { DeleteButton } from "./DeleteButton";
import { FormFeedback } from "./FormFeedback";

type Values = Record<string, unknown>;
type ItineraryDay = { day: number; title: string; description: string };
const initialState: ActionState = { ok: false, message: "" };
const field = (values: Values, key: string, fallback = "") => String(values[key] ?? fallback);

const DEFAULT_UMRAH_INCLUDES = [
  "Tiket pesawat internasional PP (CGK — JED/MED)",
  "Visa Umrah resmi & asuransi perjalanan",
  "Akomodasi hotel Makkah & Madinah sesuai program",
  "Makan 3x sehari menu prasmanan khas Indonesia",
  "Transportasi Bus AC Eksekutif terbaru selama di Saudi",
  "Ziarah kota Makkah, Madinah, dan ziarah Badar / Jabal Nur",
  "Bimbingan Muthawif / Tour Leader bersertifikasi dari Indonesia",
  "Air Zamzam (menyesuaikan regulasi maskapai)",
  "Perlengkapan umroh: koper fiber, kain ihram / mukena, batik seragam, tas paspor",
];

const DEFAULT_UMRAH_HIGHLIGHTS = [
  "Terbang nyaman dengan maskapai bintang lima",
  "Akomodasi hotel bintang 5 Makkah & bintang 4 Madinah dekat pelataran masjid",
  "Bimbingan ibadah dan manasik terstruktur berlandaskan sunnah",
  "Harga Quad All In transparan tanpa biaya tersembunyi",
];

const DEFAULT_UMRAH_EXCLUDES = [
  "Pembuatan & perpanjangan paspor",
  "Buku kuning suntik meningitis (bila dipersyaratkan)",
  "Pengeluaran pribadi (laundry, telepon, kelebihan bagasi)",
];

const DEFAULT_UMRAH_TERMS = [
  "Paspor dengan masa berlaku minimal 7 bulan sebelum tanggal keberangkatan",
  "Nama di paspor minimal 2 suku kata",
  "Foto KTP, Kartu Keluarga, dan Buku Nikah (bagi suami istri)",
  "Pembayaran uang muka (DP) pendaftaran dan pelunasan sesuai jadwal",
];

const DEFAULT_TOUR_INCLUDES = [
  "Tiket pesawat internasional PP kelas ekonomi",
  "Visa perjalanan & asuransi wisata",
  "Akomodasi hotel berbintang sesuai program",
  "Makan sesuai jadwal dengan menu halal",
  "Transportasi bus pariwisata AC modern",
  "Tiket masuk objek wisata sesuai itinerary",
  "Tour Leader dari Jakarta & Tour Guide lokal",
];

const DEFAULT_TOUR_HIGHLIGHTS = [
  "Penerbangan internasional nyaman kelas ekonomi",
  "Akomodasi hotel berbintang pilihan strategis",
  "Eksplorasi destinasi sejarah dan sajian kuliner halal",
  "Didampingi Tour Leader dari Jakarta dan Tour Guide lokal",
];

const DEFAULT_TOUR_EXCLUDES = [
  "Biaya pembuatan paspor",
  "Pengeluaran pribadi di luar program",
  "Tipping wajib tour leader, guide lokal & driver",
  "Aktivitas atau wahana opsional di lokasi wisata",
];

const DEFAULT_TOUR_TERMS = [
  "Paspor dengan masa berlaku minimal 7 bulan sebelum tanggal keberangkatan",
  "Foto KTP dan pas foto terbaru",
  "Pembayaran uang muka (DP) pendaftaran dan pelunasan sesuai jadwal",
];

const parseLines = (text: unknown): string[] => {
  if (Array.isArray(text)) return text.map((s) => String(s).trim()).filter(Boolean);
  if (typeof text !== "string") return [];
  return text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
};

const preservedFields = [
  ["id", ""], ["departureId", ""], ["slug", ""], ["summary", ""],
  ["featured", "false"], ["sortOrder", "0"], ["detailUrl", ""],
  ["seoTitle", ""], ["seoDescription", ""], ["returnDate", ""],
  ["manasikDate", ""], ["departureAirport", "Jakarta"], ["arrivalAirport", ""],
  ["capacity", ""], ["availableSeats", ""], ["departureStatus", "open"],
  ["makkahDistance", ""], ["madinahDistance", ""],
  ["facilities", ""],
  ["destinations", ""],
] as const;

export function PackageForm({ values = {} }: { values?: Values }) {
  const [state, action, pending] = useActionState(savePackageAction, initialState);
  const [imageUrl, setImageUrl] = useState(field(values, "imageUrl"));
  const [displayPrice, setDisplayPrice] = useState(() => formatRupiahInput(field(values, "price")));
  const [durationDays, setDurationDays] = useState(() => field(values, "durationDays", "9"));
  const [category, setCategory] = useState(() => field(values, "category", "umrah"));
  const [packageType, setPackageType] = useState(() => field(values, "packageType", "reguler"));
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(() => {
    try {
      const parsed = JSON.parse(field(values, "itinerary", "[]"));
      return Array.isArray(parsed) ? parsed.map((item, index) => ({ day: Number(item.day) || index + 1, title: String(item.title ?? ""), description: String(item.description ?? "") })) : [];
    } catch {
      return [];
    }
  });

  const [activeFacilityTab, setActiveFacilityTab] = useState<"includes" | "highlights" | "excludes" | "terms">("includes");

  const [includes, setIncludes] = useState<string[]>(() => {
    const parsed = parseLines(values.includes);
    if (parsed.length > 0) return parsed;
    return field(values, "category", "umrah") === "halal-tour" ? DEFAULT_TOUR_INCLUDES : DEFAULT_UMRAH_INCLUDES;
  });

  const [highlights, setHighlights] = useState<string[]>(() => {
    const parsed = parseLines(values.highlights);
    if (parsed.length > 0) return parsed;
    return field(values, "category", "umrah") === "halal-tour" ? DEFAULT_TOUR_HIGHLIGHTS : DEFAULT_UMRAH_HIGHLIGHTS;
  });

  const [excludes, setExcludes] = useState<string[]>(() => {
    const parsed = parseLines(values.excludes);
    if (parsed.length > 0) return parsed;
    return field(values, "category", "umrah") === "halal-tour" ? DEFAULT_TOUR_EXCLUDES : DEFAULT_UMRAH_EXCLUDES;
  });

  const [terms, setTerms] = useState<string[]>(() => {
    const parsed = parseLines(values.terms);
    if (parsed.length > 0) return parsed;
    return field(values, "category", "umrah") === "halal-tour" ? DEFAULT_TOUR_TERMS : DEFAULT_UMRAH_TERMS;
  });

  const getListState = (type: "includes" | "highlights" | "excludes" | "terms") => {
    if (type === "includes") return [includes, setIncludes] as const;
    if (type === "highlights") return [highlights, setHighlights] as const;
    if (type === "excludes") return [excludes, setExcludes] as const;
    return [terms, setTerms] as const;
  };

  const handleFacilityItemChange = (type: "includes" | "highlights" | "excludes" | "terms", index: number, val: string) => {
    const [list, setList] = getListState(type);
    const next = [...list];
    next[index] = val;
    setList(next);
  };

  const handleFacilityAddItem = (type: "includes" | "highlights" | "excludes" | "terms") => {
    const [list, setList] = getListState(type);
    setList([...list, ""]);
  };

  const handleFacilityRemoveItem = (type: "includes" | "highlights" | "excludes" | "terms", index: number) => {
    const [list, setList] = getListState(type);
    setList(list.filter((_, i) => i !== index));
  };

  const handleFacilityMoveUp = (type: "includes" | "highlights" | "excludes" | "terms", index: number) => {
    if (index === 0) return;
    const [list, setList] = getListState(type);
    const next = [...list];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    setList(next);
  };

  const handleFacilityMoveDown = (type: "includes" | "highlights" | "excludes" | "terms", index: number) => {
    const [list, setList] = getListState(type);
    if (index >= list.length - 1) return;
    const next = [...list];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    setList(next);
  };

  const handleFacilityResetTemplate = (type: "includes" | "highlights" | "excludes" | "terms") => {
    const isTour = category === "halal-tour";
    if (type === "includes") {
      setIncludes(isTour ? [...DEFAULT_TOUR_INCLUDES] : [...DEFAULT_UMRAH_INCLUDES]);
    } else if (type === "highlights") {
      setHighlights(isTour ? [...DEFAULT_TOUR_HIGHLIGHTS] : [...DEFAULT_UMRAH_HIGHLIGHTS]);
    } else if (type === "excludes") {
      setExcludes(isTour ? [...DEFAULT_TOUR_EXCLUDES] : [...DEFAULT_UMRAH_EXCLUDES]);
    } else {
      setTerms(isTour ? [...DEFAULT_TOUR_TERMS] : [...DEFAULT_UMRAH_TERMS]);
    }
  };

  const isPublished = field(values, "status") === "published";
  const hasDraftChanges = values.hasDraftChanges === true;

  const rawDigits = cleanRupiahInput(displayPrice);
  const terbilangText = terbilangRupiah(rawDigits);
  const error = (key: string) => state.errors?.[key]?.[0];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRupiahInput(e.target.value);
    setDisplayPrice(formatted);
  };

  return (
    <form action={action} className="admin-editor-form admin-package-simple-form">
      <FormFeedback state={state} />
      {preservedFields.map(([name, fallback]) => (
        <input key={name} type="hidden" name={name} value={field(values, name, fallback)} />
      ))}
      <input type="hidden" name="itinerary" value={JSON.stringify(itinerary)} />
      <input type="hidden" name="includes" value={includes.map((s) => s.trim()).filter(Boolean).join("\n")} />
      <input type="hidden" name="highlights" value={highlights.map((s) => s.trim()).filter(Boolean).join("\n")} />
      <input type="hidden" name="excludes" value={excludes.map((s) => s.trim()).filter(Boolean).join("\n")} />
      <input type="hidden" name="terms" value={terms.map((s) => s.trim()).filter(Boolean).join("\n")} />

      <section className="admin-form-section">
        <div>
          <p>Informasi dasar</p>
          <span>Nama paket, jenis, durasi, dan foto utama yang tampil pada kartu homepage dan header detail paket.</span>
        </div>
        <div className="admin-form-grid">
          <label className="admin-span-2">
            <span>Nama paket</span>
            <input name="name" defaultValue={field(values, "name")} placeholder="Contoh: Umroh Premium 9 Hari" required />
            {error("name") ? <small className="admin-upload-error">{error("name")}</small> : null}
          </label>
          <label>
            <span>Kategori paket</span>
            <select name="category" value={category} onChange={(event) => {
              const next = event.target.value;
              setCategory(next);
              setPackageType(next === "halal-tour" ? "tour" : packageType === "tour" ? "reguler" : packageType);
            }}>
              <option value="umrah">Umroh</option>
              <option value="halal-tour">Wisata</option>
            </select>
            <small>Menentukan daftar dan halaman publik tempat paket ditampilkan.</small>
          </label>
          <label>
            <span>Jenis program</span>
            <select name="packageType" value={packageType} onChange={(event) => setPackageType(event.target.value)}>
              {category === "halal-tour" ? (
                <option value="tour">Wisata</option>
              ) : (
                <>
                  <option value="reguler">Umroh Reguler</option>
                  <option value="bintang-5">Umroh Bintang 5</option>
                  <option value="plus">Umroh Plus</option>
                </>
              )}
            </select>
          </label>
          <label>
            <span>Durasi perjalanan</span>
            <div className="admin-input-suffix">
              <input
                name="durationDays"
                type="number"
                min="1"
                max="60"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                required
              />
              <span>hari</span>
            </div>
            <div className="admin-quick-prices" style={{ marginTop: "6px" }}>
              {[9, 10, 12, 14, 16].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setDurationDays(String(days))}
                  className={`admin-duration-chip ${durationDays === String(days) ? "is-active" : ""}`}
                >
                  {days} Hari
                </button>
              ))}
            </div>
            {error("durationDays") ? <small className="admin-upload-error">{error("durationDays")}</small> : null}
          </label>
          <label className="admin-span-2">
            <span>Badge <em>opsional</em></span>
            <input name="badge" defaultValue={field(values, "badge")} placeholder="Contoh: Pilihan Jamaah" />
          </label>
          <AdminImageUpload
            name="imageUrl"
            label="Foto paket"
            value={imageUrl}
            onChange={setImageUrl}
            description="Upload foto landscape untuk kartu paket dan banner header halaman detail."
            error={error("imageUrl")}
            idleLabel="Upload file"
            replaceLabel="Ganti gambar"
          />
        </div>
      </section>

      <section className="admin-form-section">
        <div>
          <p>Jadwal, Hotel &amp; Harga</p>
          <span>Tanggal berangkat, maskapai, kereta cepat, hotel Makkah &amp; Madinah, serta harga All In per jamaah.</span>
        </div>
        <div className="admin-form-grid">
          <label>
            <span>Tanggal keberangkatan</span>
            <input name="departureDate" type="date" defaultValue={field(values, "departureDate")} required />
            {error("departureDate") ? <small className="admin-upload-error">{error("departureDate")}</small> : null}
          </label>
          <label>
            <span>Maskapai</span>
            <input name="airline" defaultValue={field(values, "airline")} placeholder="Contoh: Qatar Airways" required />
            {error("airline") ? <small className="admin-upload-error">{error("airline")}</small> : null}
          </label>
          <label className="admin-train-field">
            <span>Kereta Cepat <em>opsional</em></span>
            <input name="highSpeedTrain" defaultValue={field(values, "highSpeedTrain")} placeholder="Contoh: Haramain High Speed Railway" />
            <small>Jika tidak digunakan, biarkan kosong dan informasi ini tidak akan tampil di website.</small>
            {error("highSpeedTrain") ? <small className="admin-upload-error">{error("highSpeedTrain")}</small> : null}
          </label>
          <label>
            <span>Hotel Makkah</span>
            <input name="makkahHotel" defaultValue={field(values, "makkahHotel")} placeholder="Nama hotel di Makkah" required />
            {error("makkahHotel") ? <small className="admin-upload-error">{error("makkahHotel")}</small> : null}
          </label>
          <label>
            <span>Bintang hotel Makkah</span>
            <select name="makkahStar" defaultValue={field(values, "makkahStar", "5")} required>
              <option value="5">Bintang 5</option>
              <option value="4">Bintang 4</option>
              <option value="3">Bintang 3</option>
            </select>
            {error("makkahStar") ? <small className="admin-upload-error">{error("makkahStar")}</small> : null}
          </label>
          <label>
            <span>Hotel Madinah</span>
            <input name="madinahHotel" defaultValue={field(values, "madinahHotel")} placeholder="Nama hotel di Madinah" required />
            {error("madinahHotel") ? <small className="admin-upload-error">{error("madinahHotel")}</small> : null}
          </label>
          <label>
            <span>Bintang hotel Madinah</span>
            <select name="madinahStar" defaultValue={field(values, "madinahStar", "4")} required>
              <option value="5">Bintang 5</option>
              <option value="4">Bintang 4</option>
              <option value="3">Bintang 3</option>
            </select>
            {error("madinahStar") ? <small className="admin-upload-error">{error("madinahStar")}</small> : null}
          </label>
          <label className="admin-span-2">
            <span>Harga per jamaah (All In)</span>
            <div className="admin-input-prefix">
              <span>Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={displayPrice}
                onChange={handlePriceChange}
                placeholder="33.000.000"
                style={{ fontSize: "1.15rem", fontWeight: "600", letterSpacing: "0.03em" }}
                required
              />
            </div>
            <input type="hidden" name="price" value={rawDigits} />
            
            {rawDigits ? (
              <div className="admin-price-badge">
                <span>💰 Terbaca: <strong>Rp {displayPrice}</strong></span>
                {terbilangText ? <small>({terbilangText})</small> : null}
              </div>
            ) : (
              <small className="admin-field-hint">
                Ketik angka saja, titik pemisah ribuan otomatis muncul (contoh: ketik 33000000 otomatis jadi 33.000.000).
              </small>
            )}

            <div className="admin-quick-prices">
              <span>Preset cepat:</span>
              {[30_000_000, 32_500_000, 33_900_000, 35_000_000, 36_900_000, 38_500_000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDisplayPrice(formatRupiahInput(preset))}
                  className="admin-price-chip"
                >
                  Rp {formatRupiahInput(preset)}
                </button>
              ))}
            </div>
            {error("price") ? <small className="admin-upload-error">{error("price")}</small> : null}
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <div><p>Detail &amp; itinerary</p><span>Di bagian ini admin bisa mengubah urutan perjalanan harian yang tampil di halaman detail paket.</span></div>
        <div className="admin-itinerary-editor">
          {itinerary.length ? itinerary.map((item, index) => (
            <div className="admin-itinerary-row" key={`${index}-${item.day}`}>
              <label>
                <span>Hari</span>
                <input type="number" min="1" value={item.day} onChange={(event) => setItinerary((current) => current.map((day, row) => row === index ? { ...day, day: Number(event.target.value) || 1 } : day))} />
              </label>
              <label>
                <span>Judul kegiatan</span>
                <input value={item.title} placeholder="Contoh: Jakarta – Madinah" onChange={(event) => setItinerary((current) => current.map((day, row) => row === index ? { ...day, title: event.target.value } : day))} />
              </label>
              <label className="admin-itinerary-description">
                <span>Keterangan</span>
                <textarea value={item.description} placeholder="Tulis kegiatan hari ini" onChange={(event) => setItinerary((current) => current.map((day, row) => row === index ? { ...day, description: event.target.value } : day))} />
              </label>
              <button type="button" className="admin-icon-button admin-itinerary-remove" aria-label={`Hapus hari ${item.day}`} onClick={() => setItinerary((current) => current.filter((_, row) => row !== index))}><Trash2 size={16} /></button>
            </div>
          )) : <p className="admin-itinerary-empty">Belum ada itinerary. Klik tombol di bawah untuk menambahkan hari perjalanan.</p>}
          <button type="button" className="admin-secondary-button admin-itinerary-add" onClick={() => setItinerary((current) => [...current, { day: current.length + 1, title: "", description: "" }])}><Plus size={16} /> Tambah hari perjalanan</button>
        </div>
      </section>

      <section className="admin-form-section">
        <div>
          <p>Detail fasilitas &amp; syarat</p>
          <span>
            Atur fasilitas All-In, highlight keunggulan paket, hal tidak termasuk, dan syarat dokumen yang tampil di halaman detail paket.
          </span>
        </div>

        <div className="admin-facility-editor">
          <div className="admin-facility-tabs">
            <button
              type="button"
              className={`admin-facility-tab-btn ${activeFacilityTab === "includes" ? "is-active" : ""}`}
              onClick={() => setActiveFacilityTab("includes")}
            >
              <Check size={16} className={activeFacilityTab === "includes" ? "text-emerald-400" : "text-emerald-600"} />
              <span>Fasilitas Termasuk (All In)</span>
              <span className="admin-tab-count">{includes.filter(Boolean).length}</span>
            </button>

            <button
              type="button"
              className={`admin-facility-tab-btn ${activeFacilityTab === "highlights" ? "is-active" : ""}`}
              onClick={() => setActiveFacilityTab("highlights")}
            >
              <Sparkles size={16} className={activeFacilityTab === "highlights" ? "text-amber-300" : "text-amber-500"} />
              <span>Highlight Keunggulan</span>
              <span className="admin-tab-count">{highlights.filter(Boolean).length}</span>
            </button>

            <button
              type="button"
              className={`admin-facility-tab-btn ${activeFacilityTab === "excludes" ? "is-active" : ""}`}
              onClick={() => setActiveFacilityTab("excludes")}
            >
              <X size={16} className={activeFacilityTab === "excludes" ? "text-rose-300" : "text-rose-500"} />
              <span>Tidak Termasuk</span>
              <span className="admin-tab-count">{excludes.filter(Boolean).length}</span>
            </button>

            <button
              type="button"
              className={`admin-facility-tab-btn ${activeFacilityTab === "terms" ? "is-active" : ""}`}
              onClick={() => setActiveFacilityTab("terms")}
            >
              <FileText size={16} className={activeFacilityTab === "terms" ? "text-blue-300" : "text-blue-500"} />
              <span>Syarat &amp; Dokumen</span>
              <span className="admin-tab-count">{terms.filter(Boolean).length}</span>
            </button>
          </div>

          <div className="admin-facility-tab-notice">
            {activeFacilityTab === "includes" && (
              <p>
                <strong>Fasilitas Termasuk (All In):</strong> Tampil di dalam kotak hijau pada halaman detail paket. Gunakan tombol panah atas/bawah untuk mengatur urutan tampilan.
              </p>
            )}
            {activeFacilityTab === "highlights" && (
              <p>
                <strong>Highlight Keunggulan Paket:</strong> Poin-poin keunggulan utama yang tampil di bawah fakta program pada halaman detail paket.
              </p>
            )}
            {activeFacilityTab === "excludes" && (
              <p>
                <strong>Tidak Termasuk:</strong> Keperluan atau biaya tambahan di luar paket yang disiapkan mandiri oleh jamaah (kotak merah).
              </p>
            )}
            {activeFacilityTab === "terms" && (
              <p>
                <strong>Syarat &amp; Dokumen Pendaftaran:</strong> Ketentuan masa berlaku paspor, berkas pendaftaran, dan termin pembayaran.
              </p>
            )}
          </div>

          <div className="admin-facility-list">
            {(activeFacilityTab === "includes"
              ? includes
              : activeFacilityTab === "highlights"
              ? highlights
              : activeFacilityTab === "excludes"
              ? excludes
              : terms
            ).map((item, index, arr) => (
              <div key={`${activeFacilityTab}-${index}`} className="admin-facility-row">
                <span className="admin-facility-num">{index + 1}</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleFacilityItemChange(activeFacilityTab, index, e.target.value)}
                  placeholder={
                    activeFacilityTab === "includes"
                      ? "Contoh: Tiket pesawat internasional PP (CGK — JED/MED)"
                      : activeFacilityTab === "highlights"
                      ? "Contoh: Terbang nyaman dengan maskapai bintang lima"
                      : activeFacilityTab === "excludes"
                      ? "Contoh: Pembuatan & perpanjangan paspor"
                      : "Contoh: Paspor berlaku minimal 7 bulan"
                  }
                  className="admin-facility-input"
                />
                <div className="admin-facility-actions">
                  <button
                    type="button"
                    onClick={() => handleFacilityMoveUp(activeFacilityTab, index)}
                    disabled={index === 0}
                    title="Geser ke atas"
                    className="admin-icon-button"
                    aria-label={`Geser item ${index + 1} ke atas`}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFacilityMoveDown(activeFacilityTab, index)}
                    disabled={index === arr.length - 1}
                    title="Geser ke bawah"
                    className="admin-icon-button"
                    aria-label={`Geser item ${index + 1} ke bawah`}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFacilityRemoveItem(activeFacilityTab, index)}
                    title="Hapus baris ini"
                    className="admin-icon-button admin-facility-remove"
                    aria-label={`Hapus item ${index + 1}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {(activeFacilityTab === "includes"
              ? includes
              : activeFacilityTab === "highlights"
              ? highlights
              : activeFacilityTab === "excludes"
              ? excludes
              : terms
            ).length === 0 && (
              <p className="admin-itinerary-empty">
                Belum ada data pada bagian ini. Klik tombol di bawah untuk menambahkan item baru atau muat template standar.
              </p>
            )}
          </div>

          <div className="admin-facility-footer">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => handleFacilityAddItem(activeFacilityTab)}
            >
              <Plus size={16} />
              <span>
                {activeFacilityTab === "includes"
                  ? "Tambah fasilitas termasuk"
                  : activeFacilityTab === "highlights"
                  ? "Tambah keunggulan paket"
                  : activeFacilityTab === "excludes"
                  ? "Tambah item tidak termasuk"
                  : "Tambah syarat pendaftaran"}
              </span>
            </button>

            <button
              type="button"
              className="admin-secondary-button admin-facility-reset-btn"
              onClick={() => {
                const label =
                  activeFacilityTab === "includes"
                    ? "Fasilitas Termasuk (All In)"
                    : activeFacilityTab === "highlights"
                    ? "Highlight Keunggulan"
                    : activeFacilityTab === "excludes"
                    ? "Tidak Termasuk"
                    : "Syarat & Dokumen";
                if (window.confirm(`Muat template standar Jam Wisata untuk daftar ${label}?`)) {
                  handleFacilityResetTemplate(activeFacilityTab);
                }
              }}
              title="Muat template standar"
            >
              <RotateCcw size={14} />
              <span>Muat template standar</span>
            </button>
          </div>
        </div>
      </section>

      {pending ? (
        <div className="admin-saving-banner" role="status">
          <Loader2 className="admin-spinner" />
          <span>Sedang memproses dan menyimpan data paket ke server, mohon tunggu sebentar...</span>
        </div>
      ) : null}

      <div className="admin-package-note">
        <UploadCloud aria-hidden />
        <p>
          <strong>{hasDraftChanges ? "Ada perubahan draft yang belum tampil di website." : "Tidak perlu mengatur hal teknis."}</strong>
          <span>
            {hasDraftChanges
              ? "Klik Simpan & update website supaya perubahan harga, hotel, maskapai, dan tanggal muncul di website publik."
              : "Link halaman, tulisan tanggal, dan pesan WhatsApp dibuat otomatis."}
          </span>
        </p>
      </div>
      <div className="admin-form-actions">
        {values.id ? (
          <DeleteButton
            id={String(values.id)}
            name={field(values, "name", "Paket")}
            type="package"
            variant="form"
          />
        ) : null}
        <div style={{ display: "flex", gap: "10px", marginLeft: "auto", alignItems: "center" }}>
          {values.slug ? (
            <a
              href={category === "halal-tour" ? `/paket-wisata/${values.slug}` : `/paket-umroh/${values.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-secondary-button"
              title="Buka halaman detail publik paket ini"
            >
              Lihat di website ↗
            </a>
          ) : null}
          {!isPublished ? (
            <button name="intent" value="draft" className="admin-secondary-button" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="admin-spinner" style={{ width: 14, height: 14, marginRight: 6, display: "inline-block" }} />
                  Menyimpan...
                </>
              ) : (
                "Simpan draft"
              )}
            </button>
          ) : null}
          <button name="intent" value="publish" className="admin-primary-button" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="admin-spinner" style={{ width: 14, height: 14, marginRight: 6, display: "inline-block" }} />
                Menyimpan...
              </>
            ) : (
              isPublished ? "Simpan & update website" : "Tampilkan di website"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
