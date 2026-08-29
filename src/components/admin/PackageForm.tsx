"use client";

import { useActionState, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";

import { savePackageAction } from "@/lib/cms/actions";
import { cleanRupiahInput, formatRupiahInput, terbilangRupiah } from "@/lib/cms/utils";
import type { ActionState } from "@/lib/cms/validation";
import { AdminImageUpload } from "./AdminImageUpload";
import { DeleteButton } from "./DeleteButton";
import { FormFeedback } from "./FormFeedback";

type Values = Record<string, unknown>;
const initialState: ActionState = { ok: false, message: "" };
const field = (values: Values, key: string, fallback = "") => String(values[key] ?? fallback);

const preservedFields = [
  ["id", ""], ["departureId", ""], ["slug", ""], ["category", "umrah"], ["summary", ""],
  ["featured", "false"], ["sortOrder", "0"], ["detailUrl", ""],
  ["seoTitle", ""], ["seoDescription", ""], ["returnDate", ""],
  ["manasikDate", ""], ["departureAirport", "Jakarta"], ["arrivalAirport", ""],
  ["capacity", ""], ["availableSeats", ""], ["departureStatus", "open"],
  ["makkahDistance", ""], ["madinahDistance", ""],
  ["facilities", ""], ["highlights", ""],
  ["includes", ""], ["excludes", ""], ["terms", ""],
  ["destinations", ""], ["itinerary", "[]"],
] as const;

export function PackageForm({ values = {} }: { values?: Values }) {
  const [state, action, pending] = useActionState(savePackageAction, initialState);
  const [imageUrl, setImageUrl] = useState(field(values, "imageUrl"));
  const [displayPrice, setDisplayPrice] = useState(() => formatRupiahInput(field(values, "price")));
  const [durationDays, setDurationDays] = useState(() => field(values, "durationDays", "9"));
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

      <section className="admin-form-section">
        <div><p>Informasi paket</p><span>Nama, jenis, dan gambar yang terlihat pada kartu homepage.</span></div>
        <div className="admin-form-grid">
          <label className="admin-span-2">
            <span>Nama paket</span>
            <input name="name" defaultValue={field(values, "name")} placeholder="Contoh: Umroh Premium 9 Hari" required />
            {error("name") ? <small className="admin-upload-error">{error("name")}</small> : null}
          </label>
          <label>
            <span>Jenis paket</span>
            <select name="packageType" defaultValue={field(values, "packageType", "reguler")}>
              <option value="reguler">Umroh Reguler</option>
              <option value="bintang-5">Umroh Bintang 5</option>
              <option value="plus">Umroh Plus</option>
              <option value="tour">Wisata Halal</option>
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
            description="Upload foto landscape untuk kartu paket atau tempel URL gambar."
            error={error("imageUrl")}
            idleLabel="Upload file"
            replaceLabel="Ganti gambar"
          />
        </div>
      </section>

      <section className="admin-form-section">
        <div><p>Detail homepage</p><span>Informasi utama yang langsung dibaca calon jamaah.</span></div>
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
        <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
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
