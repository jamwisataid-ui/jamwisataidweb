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
type PlusHotel = { destination: string; hotelName: string; star: number };
type DepartureInput = {
  id?: string;
  departureDate: string;
  returnDate: string;
  price: string;
  capacity: string;
  availableSeats: string;
  status: "open" | "limited" | "full" | "closed" | "coming-soon";
};
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

const parsePlusHotels = (value: unknown): PlusHotel[] => {
  try {
    const parsed = Array.isArray(value) ? value : JSON.parse(typeof value === "string" && value.trim() ? value : "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.map((hotel) => ({
      destination: String(hotel?.destination ?? ""),
      hotelName: String(hotel?.hotelName ?? ""),
      star: Math.min(5, Math.max(3, Number(hotel?.star) || 3)),
    }));
  } catch {
    return [];
  }
};

const parseDepartures = (values: Values): DepartureInput[] => {
  try {
    const raw = values.departures;
    const parsed = Array.isArray(raw) ? raw : JSON.parse(typeof raw === "string" && raw.trim() ? raw : "[]");
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map((departure) => ({
        id: departure?.id ? String(departure.id) : undefined,
        departureDate: String(departure?.departureDate ?? ""),
        returnDate: String(departure?.returnDate ?? ""),
        price: formatRupiahInput(departure?.price ?? ""),
        capacity: String(departure?.capacity ?? ""),
        availableSeats: String(departure?.availableSeats ?? ""),
        status: departure?.status ?? "open",
      }));
    }
  } catch {}
  return [{
    id: field(values, "departureId") || undefined,
    departureDate: field(values, "departureDate"),
    returnDate: field(values, "returnDate"),
    price: formatRupiahInput(field(values, "price")),
    capacity: field(values, "capacity"),
    availableSeats: field(values, "availableSeats"),
    status: field(values, "departureStatus", "open") as DepartureInput["status"],
  }];
};

const preservedFields = [
  ["id", ""], ["departureId", ""], ["slug", ""], ["summary", ""],
  ["featured", "false"], ["sortOrder", "0"], ["detailUrl", ""],
  ["seoTitle", ""], ["seoDescription", ""], ["manasikDate", ""],
  ["departureAirport", "Jakarta"], ["arrivalAirport", ""],
  ["makkahDistance", ""], ["madinahDistance", ""],
  ["facilities", ""],
  ["destinations", ""],
] as const;

export function PackageForm({ values = {} }: { values?: Values }) {
  const [state, action, pending] = useActionState(savePackageAction, initialState);
  const [imageUrl, setImageUrl] = useState(field(values, "imageUrl"));
  const [departures, setDepartures] = useState<DepartureInput[]>(() => parseDepartures(values));
  const [durationDays, setDurationDays] = useState(() => field(values, "durationDays", "9"));
  const [category, setCategory] = useState(() => field(values, "category", "umrah"));
  const [packageType, setPackageType] = useState(() => field(values, "packageType", "reguler"));
  const [plusHotels, setPlusHotels] = useState<PlusHotel[]>(() => parsePlusHotels(values.plusHotels));
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

  const error = (key: string) => state.errors?.[key]?.[0];

  const updateDeparture = (index: number, patch: Partial<DepartureInput>) => {
    setDepartures((current) => current.map((departure, itemIndex) => itemIndex === index ? { ...departure, ...patch } : departure));
  };

  return (
    <form action={action} className="admin-editor-form admin-package-simple-form">
      <FormFeedback state={state} />
      {preservedFields.map(([name, fallback]) => (
        <input key={name} type="hidden" name={name} value={field(values, name, fallback)} />
      ))}
      <input type="hidden" name="itinerary" value={JSON.stringify(itinerary)} />
      <input type="hidden" name="departures" value={JSON.stringify(departures.map((departure) => ({ ...departure, price: cleanRupiahInput(departure.price) })))} />
      <input type="hidden" name="departureDate" value={departures[0]?.departureDate ?? ""} />
      <input type="hidden" name="returnDate" value={departures[0]?.returnDate ?? ""} />
      <input type="hidden" name="price" value={cleanRupiahInput(departures[0]?.price ?? "")} />
      <input type="hidden" name="capacity" value={departures[0]?.capacity ?? ""} />
      <input type="hidden" name="availableSeats" value={departures[0]?.availableSeats ?? ""} />
      <input type="hidden" name="departureStatus" value={departures[0]?.status ?? "open"} />
      <input type="hidden" name="plusHotels" value={JSON.stringify(plusHotels)} />
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
          <span>Satu paket dapat memiliki banyak keberangkatan. Harga, kuota, tanggal pulang, dan status dapat berbeda pada setiap jadwal.</span>
        </div>
        <div className="admin-form-grid">
          <div className="admin-span-2 admin-departure-editor">
            <div className="admin-departure-editor__heading">
              <div><strong>Keberangkatan</strong><small>Urutan di website otomatis dari tanggal terdekat.</small></div>
              <button type="button" className="admin-secondary-button" onClick={() => setDepartures((current) => [...current, { departureDate: "", returnDate: "", price: current.at(-1)?.price ?? "", capacity: "", availableSeats: "", status: "open" }])}>
                <Plus className="size-4" /> Tambah Keberangkatan
              </button>
            </div>
            {departures.map((departure, index) => (
              <div className="admin-departure-row" key={departure.id ?? `new-${index}`}>
                <div className="admin-departure-row__title"><strong>Keberangkatan {index + 1}</strong>{departures.length > 1 ? <button type="button" onClick={() => setDepartures((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="size-4" /> Hapus</button> : null}</div>
                <label><span>Tanggal</span><input type="date" value={departure.departureDate} onChange={(event) => updateDeparture(index, { departureDate: event.target.value })} required /></label>
                <label><span>Tanggal pulang <em>opsional</em></span><input type="date" value={departure.returnDate} onChange={(event) => updateDeparture(index, { returnDate: event.target.value })} /></label>
                <label><span>Harga per jamaah</span><div className="admin-input-prefix"><span>Rp</span><input inputMode="numeric" value={departure.price} onChange={(event) => updateDeparture(index, { price: formatRupiahInput(event.target.value) })} placeholder="33.900.000" required /></div></label>
                <label><span>Kuota <em>opsional</em></span><input type="number" min="1" value={departure.capacity} onChange={(event) => updateDeparture(index, { capacity: event.target.value })} placeholder="45" /></label>
                <label><span>Sisa kuota <em>opsional</em></span><input type="number" min="0" value={departure.availableSeats} onChange={(event) => updateDeparture(index, { availableSeats: event.target.value })} placeholder="45" /></label>
                <label><span>Status</span><select value={departure.status} onChange={(event) => updateDeparture(index, { status: event.target.value as DepartureInput["status"] })}><option value="open">Tersedia</option><option value="limited">Hampir penuh</option><option value="full">Kuota penuh</option><option value="coming-soon">Segera dibuka</option><option value="closed">Ditutup</option></select></label>
                {departure.price ? <small className="admin-departure-row__amount">Rp {departure.price} · {terbilangRupiah(cleanRupiahInput(departure.price))}</small> : null}
              </div>
            ))}
            {error("departures") ? <small className="admin-upload-error">{error("departures")}</small> : null}
          </div>
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
        </div>
      </section>

      {category === "umrah" && packageType === "plus" ? (
        <section className="admin-form-section admin-plus-hotels-section">
          <div>
            <p>Hotel Program Plus</p>
            <span>Tambahkan hotel di setiap kota atau destinasi tambahan di luar Makkah dan Madinah.</span>
          </div>
          <div className="admin-plus-hotels-editor">
            {plusHotels.length ? plusHotels.map((hotel, index) => (
              <div className="admin-plus-hotel-row" key={index}>
                <label><span>Kota / destinasi</span><input value={hotel.destination} onChange={(event) => setPlusHotels((current) => current.map((item, row) => row === index ? { ...item, destination: event.target.value } : item))} placeholder="Contoh: Istanbul" required /></label>
                <label><span>Nama hotel</span><input value={hotel.hotelName} onChange={(event) => setPlusHotels((current) => current.map((item, row) => row === index ? { ...item, hotelName: event.target.value } : item))} placeholder="Contoh: Ramada Plaza Istanbul" required /></label>
                <label><span>Bintang hotel</span><select value={hotel.star} onChange={(event) => setPlusHotels((current) => current.map((item, row) => row === index ? { ...item, star: Number(event.target.value) } : item))}>{[5, 4, 3].map((star) => <option value={star} key={star}>Bintang {star}</option>)}</select></label>
                <button type="button" className="admin-icon-button admin-plus-hotel-remove" aria-label={`Hapus hotel ${index + 1}`} onClick={() => setPlusHotels((current) => current.filter((_, row) => row !== index))}><Trash2 size={16} /></button>
              </div>
            )) : <p className="admin-itinerary-empty">Belum ada hotel Program Plus. Tambahkan minimal satu hotel untuk menerbitkan paket ini.</p>}
            {error("plusHotels") ? <small className="admin-upload-error">{error("plusHotels")}</small> : null}
            <button type="button" className="admin-secondary-button admin-itinerary-add" onClick={() => setPlusHotels((current) => [...current, { destination: "", hotelName: "", star: 4 }])}><Plus size={16} /> Tambah hotel / destinasi</button>
          </div>
        </section>
      ) : null}

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
