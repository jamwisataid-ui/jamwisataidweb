"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, ImageIcon, UploadCloud } from "lucide-react";

import { savePackageAction } from "@/lib/cms/actions";
import type { ActionState } from "@/lib/cms/validation";
import { UploadButton } from "@/lib/uploadthing";
import { FormFeedback } from "./FormFeedback";

type Values = Record<string, unknown>;
const initialState: ActionState = { ok: false, message: "" };
const field = (values: Values, key: string, fallback = "") => String(values[key] ?? fallback);

const preservedFields = [
  ["id", ""], ["slug", ""], ["category", "umrah"], ["summary", ""],
  ["featured", "false"], ["sortOrder", "0"], ["detailUrl", ""],
  ["seoTitle", ""], ["seoDescription", ""], ["returnDate", ""],
  ["manasikDate", ""], ["departureAirport", "Jakarta"], ["arrivalAirport", ""],
  ["capacity", ""], ["availableSeats", ""], ["departureStatus", "open"],
  ["makkahStar", "5"], ["makkahDistance", ""], ["madinahStar", "4"],
  ["madinahDistance", ""], ["facilities", ""], ["highlights", ""],
  ["includes", ""], ["excludes", ""], ["terms", ""],
  ["destinations", ""], ["itinerary", "[]"],
] as const;

export function PackageForm({ values = {} }: { values?: Values }) {
  const [state, action, pending] = useActionState(savePackageAction, initialState);
  const [imageUrl, setImageUrl] = useState(field(values, "imageUrl"));
  const error = (key: string) => state.errors?.[key]?.[0];

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
              <input name="durationDays" type="number" min="1" max="60" defaultValue={field(values, "durationDays", "9")} required />
              <span>hari</span>
            </div>
            {error("durationDays") ? <small className="admin-upload-error">{error("durationDays")}</small> : null}
          </label>
          <label className="admin-span-2">
            <span>Badge <em>opsional</em></span>
            <input name="badge" defaultValue={field(values, "badge")} placeholder="Contoh: Pilihan Jamaah" />
          </label>
          <div className="admin-simple-upload admin-span-2">
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <span className="admin-simple-upload-icon"><ImageIcon aria-hidden /></span>
            <div>
              <strong>Foto paket</strong>
              <small>{imageUrl ? "Gambar sudah dipilih dan siap digunakan." : "Upload foto landscape atau masukkan link foto untuk kartu paket."}</small>
            </div>
            {imageUrl ? <span className="admin-upload-ready"><CheckCircle2 aria-hidden /> Siap</span> : null}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", width: "100%", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Atau tempel URL gambar langsung (https://...)"
                style={{ flex: 1, minWidth: "240px", fontSize: "0.875rem", padding: "0.4rem 0.6rem", borderRadius: "0.375rem", border: "1px solid #d1d5db" }}
              />
              <UploadButton
                endpoint="cmsImage"
                content={{ button: imageUrl ? "Ganti gambar" : "Upload file", allowedContent: "JPG, PNG, atau WebP" }}
                onClientUploadComplete={(files) => {
                  const uploaded = files[0]?.ufsUrl ?? files[0]?.url;
                  if (uploaded) setImageUrl(uploaded);
                }}
                onUploadError={(uploadError) => {
                  console.error("Upload error:", uploadError);
                }}
              />
            </div>
            {error("imageUrl") ? <small className="admin-upload-error">{error("imageUrl")}</small> : null}
          </div>
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
            <span>Hotel Madinah</span>
            <input name="madinahHotel" defaultValue={field(values, "madinahHotel")} placeholder="Nama hotel di Madinah" required />
            {error("madinahHotel") ? <small className="admin-upload-error">{error("madinahHotel")}</small> : null}
          </label>
          <label className="admin-span-2">
            <span>Harga per jamaah</span>
            <div className="admin-input-prefix">
              <span>Rp</span>
              <input name="price" type="number" min="1000" step="1000" defaultValue={field(values, "price")} placeholder="33900000" required />
            </div>
            <small className="admin-field-hint">Masukkan angka saja, contoh 33900000.</small>
            {error("price") ? <small className="admin-upload-error">{error("price")}</small> : null}
          </label>
        </div>
      </section>

      <div className="admin-package-note">
        <UploadCloud aria-hidden />
        <p><strong>Tidak perlu mengatur hal teknis.</strong><span>Link halaman, tulisan tanggal, dan pesan WhatsApp dibuat otomatis.</span></p>
      </div>
      <div className="admin-form-actions">
        <button name="intent" value="draft" className="admin-secondary-button" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan dulu"}
        </button>
        <button name="intent" value="publish" className="admin-primary-button" disabled={pending}>
          {pending ? "Menyimpan..." : "Tampilkan di website"}
        </button>
      </div>
    </form>
  );
}
