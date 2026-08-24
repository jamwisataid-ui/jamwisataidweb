"use client";

import { useActionState, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { saveEntryAction } from "@/lib/cms/actions";
import { type ActionState } from "@/lib/cms/validation";
import { FormFeedback } from "./FormFeedback";

type EntryType = "testimonial" | "gallery" | "destination" | "faq" | "service" | "homepage" | "site-settings";
type Values = Record<string, unknown>;

const config: Record<EntryType, { title: string; fields: Array<[string, string, "input" | "textarea" | "image"]> }> = {
  testimonial: { title: "Testimonial video", fields: [["primary", "URL YouTube", "input"], ["secondary", "Nama program", "input"], ["tertiary", "Tahun", "input"]] },
  gallery: { title: "Foto galeri", fields: [["primary", "Foto", "image"], ["secondary", "Alt text", "input"], ["tertiary", "Caption", "textarea"]] },
  destination: { title: "Destinasi halal", fields: [["primary", "Nama destinasi", "input"], ["secondary", "Tempat unggulan", "textarea"], ["tertiary", "Foto", "image"]] },
  faq: { title: "Pertanyaan umum", fields: [["primary", "Pertanyaan", "input"], ["secondary", "Jawaban", "textarea"], ["tertiary", "Lingkup", "input"]] },
  service: { title: "Layanan", fields: [["primary", "Deskripsi", "textarea"], ["secondary", "Daftar layanan (satu per baris)", "textarea"]] },
  homepage: { title: "Bagian homepage", fields: [["primary", "Eyebrow", "input"], ["secondary", "Headline", "input"], ["tertiary", "Deskripsi", "textarea"], ["quaternary", "Foto", "image"]] },
  "site-settings": { title: "Pengaturan situs", fields: [["primary", "Nama brand", "input"], ["secondary", "WhatsApp", "input"], ["tertiary", "Email", "input"], ["quaternary", "Alamat", "textarea"]] },
};

const initial: ActionState = { ok: false, message: "" };
const text = (values: Values, key: string) => String(values[key] ?? "");

export function ContentEntryForm({ type, values = {} }: { type: EntryType; values?: Values }) {
  const [state, action, pending] = useActionState(saveEntryAction, initial);
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const details = config[type];

  return <form action={action} className="admin-editor-form">
    <FormFeedback state={state} />
    <input type="hidden" name="type" value={type} />
    {values.id ? <input type="hidden" name="id" value={text(values, "id")} /> : null}
    <section className="admin-form-section">
      <div><p>{details.title}</p><span>Konten terbaru otomatis tampil paling depan.</span></div>
      <div className="admin-form-grid">
        <label><span>Judul internal</span><input name="title" defaultValue={text(values, "title")} required /></label>
        <label><span>Key unik</span><input name="key" defaultValue={text(values, "key")} placeholder="nama-konten" required /></label>
        <input type="hidden" name="sortOrder" value="0" />
        {details.fields.map(([name, label, kind]) => {
          const fieldValue = uploads[name] ?? text(values, name);
          if (kind === "textarea") return <label className="admin-span-2" key={name}><span>{label}</span><textarea name={name} rows={5} defaultValue={fieldValue} /></label>;
          if (kind === "image") return <div className="admin-span-2 admin-image-control" key={name}><label><span>{label}</span><input name={name} value={fieldValue} onChange={(event) => setUploads((current) => ({ ...current, [name]: event.target.value }))} /></label><UploadButton endpoint="cmsImage" onClientUploadComplete={(files) => { if (files[0]?.url) setUploads((current) => ({ ...current, [name]: files[0].url })); }} /></div>;
          return <label key={name}><span>{label}</span><input name={name} defaultValue={fieldValue} /></label>;
        })}
      </div>
    </section>
    <div className="admin-form-actions"><button name="intent" value="draft" className="admin-secondary-button" disabled={pending}>Simpan Draft</button><button name="intent" value="publish" className="admin-primary-button" disabled={pending}>{pending ? "Menyimpan..." : "Terbitkan"}</button></div>
  </form>;
}
