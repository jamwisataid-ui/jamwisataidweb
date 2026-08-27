"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { saveEntryAction } from "@/lib/cms/actions";
import { type ActionState } from "@/lib/cms/validation";
import { AdminImageUpload } from "./AdminImageUpload";
import { DeleteButton } from "./DeleteButton";
import { FormFeedback } from "./FormFeedback";

type EntryType = "testimonial" | "gallery" | "destination" | "faq" | "service" | "homepage" | "site-settings";
type Values = Record<string, unknown>;

const config: Record<EntryType, { title: string; help: string; fields: Array<[string, string, "input" | "textarea" | "image", boolean?]> }> = {
  testimonial: { title: "Video jamaah", help: "Salin link video dari YouTube, lalu isi nama program dan tahunnya.", fields: [["primary", "Link video YouTube", "input", true], ["secondary", "Nama program", "input", true], ["tertiary", "Tahun", "input"]] },
  gallery: { title: "Foto galeri", help: "Pilih satu foto dan beri keterangan singkat agar mudah dikenali.", fields: [["primary", "Pilih foto", "image", true], ["secondary", "Keterangan foto", "input", true], ["tertiary", "Cerita singkat (boleh kosong)", "textarea"]] },
  destination: { title: "Destinasi halal", help: "Isi nama destinasi, tempat unggulan, dan fotonya.", fields: [["primary", "Nama destinasi", "input", true], ["secondary", "Tempat unggulan", "textarea"], ["tertiary", "Pilih foto", "image", true]] },
  faq: { title: "Tanya jawab", help: "Tulis pertanyaan jamaah dan jawaban yang singkat serta jelas.", fields: [["primary", "Pertanyaan", "input", true], ["secondary", "Jawaban", "textarea", true]] },
  service: { title: "Layanan", help: "Jelaskan layanan dengan bahasa yang mudah dipahami.", fields: [["primary", "Penjelasan", "textarea", true], ["secondary", "Daftar layanan (satu baris untuk satu layanan)", "textarea"]] },
  homepage: { title: "Bagian homepage", help: "Isi tulisan utama dan pilih foto yang sesuai.", fields: [["primary", "Tulisan kecil di atas judul", "input"], ["secondary", "Judul utama", "input", true], ["tertiary", "Penjelasan", "textarea"], ["quaternary", "Pilih foto", "image"]] },
  "site-settings": { title: "Informasi situs", help: "Ubah informasi kontak utama Jam Wisata.", fields: [["primary", "Nama Jam Wisata", "input", true], ["secondary", "Nomor WhatsApp", "input", true], ["tertiary", "Email", "input"], ["quaternary", "Alamat kantor", "textarea"]] },
};

const initial: ActionState = { ok: false, message: "" };
const text = (values: Values, key: string) => String(values[key] ?? "");

export function ContentEntryForm({ type, values = {} }: { type: EntryType; values?: Values }) {
  const [state, action, pending] = useActionState(saveEntryAction, initial);
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const details = config[type];

  return (
    <form action={action} className="admin-editor-form">
      <FormFeedback state={state} />
      <input type="hidden" name="type" value={type} />
      {values.id ? <input type="hidden" name="id" value={text(values, "id")} /> : null}
      <input type="hidden" name="title" value={text(values, "title")} />
      <input type="hidden" name="key" value={text(values, "key")} />
      <input type="hidden" name="sortOrder" value="0" />
      <section className="admin-form-section">
        <div><p>{details.title}</p><span>{details.help}</span></div>
        <div className="admin-form-grid">
          {details.fields.map(([name, label, kind, required]) => {
            const fieldValue = uploads[name] ?? text(values, name);
            if (kind === "textarea") return <label className="admin-span-2" key={name}><span>{label}</span><textarea name={name} rows={5} defaultValue={fieldValue} required={required} /></label>;
            if (kind === "image") {
              return (
                <AdminImageUpload
                  key={name}
                  name={name}
                  label={label}
                  value={fieldValue}
                  onChange={(nextValue) => setUploads((current) => ({ ...current, [name]: nextValue }))}
                  required={required}
                  replaceLabel="Ganti foto"
                />
              );
            }
            return <label className="admin-span-2" key={name}><span>{label}</span><input name={name} defaultValue={fieldValue} required={required} /></label>;
          })}
        </div>
      </section>

      {pending ? (
        <div className="admin-saving-banner" role="status">
          <Loader2 className="admin-spinner" />
          <span>Sedang menyimpan konten ke server, mohon tunggu sebentar...</span>
        </div>
      ) : null}

      <div className="admin-form-actions">
        {values.id && type !== "site-settings" ? (
          <DeleteButton
            id={text(values, "id")}
            name={text(values, "title") || "Konten"}
            type="entry"
            entryType={type}
            variant="form"
          />
        ) : null}
        <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
          <button name="intent" value="draft" className="admin-secondary-button" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="admin-spinner" style={{ width: 14, height: 14, marginRight: 6, display: "inline-block" }} />
                Menyimpan...
              </>
            ) : (
              "Simpan dulu"
            )}
          </button>
          <button name="intent" value="publish" className="admin-primary-button" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="admin-spinner" style={{ width: 14, height: 14, marginRight: 6, display: "inline-block" }} />
                Menyimpan...
              </>
            ) : (
              "Tampilkan di website"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
