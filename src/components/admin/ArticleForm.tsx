"use client";

import { useActionState, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { CheckCircle2, ImageIcon, Loader2 } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { saveArticleAction } from "@/lib/cms/actions";
import { type ActionState } from "@/lib/cms/validation";
import { DeleteButton } from "./DeleteButton";
import { FormFeedback } from "./FormFeedback";

type Values = Record<string, unknown>;
const initial: ActionState = { ok: false, message: "" };
const value = (values: Values, key: string) => String(values[key] ?? "");

export function ArticleForm({ values = {} }: { values?: Values }) {
  const [state, action, pending] = useActionState(saveArticleAction, initial);
  const [coverUrl, setCoverUrl] = useState(value(values, "coverUrl"));
  const [contentJson, setContentJson] = useState(value(values, "contentJson") || JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] }));
  const editor = useEditor({
    extensions: [StarterKit, LinkExtension.configure({ openOnClick: false }), ImageExtension],
    content: JSON.parse(contentJson),
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => setContentJson(JSON.stringify(current.getJSON())),
  });
  return (
    <form action={action} className="admin-editor-form">
      <FormFeedback state={state} />
      {values.id ? <input type="hidden" name="id" value={value(values, "id")} /> : null}
      <input type="hidden" name="contentJson" value={contentJson} />
      <input type="hidden" name="slug" value={value(values, "slug")} />
      <input type="hidden" name="seoTitle" value={value(values, "seoTitle")} />
      <input type="hidden" name="seoDescription" value={value(values, "seoDescription")} />
      <section className="admin-form-section">
        <div><p>Isi artikel</p><span>Tulis judul, ringkasan, dan isi artikel. Pengaturan teknis dibuat otomatis.</span></div>
        <div className="admin-form-grid">
          <label className="admin-span-2"><span>Judul artikel</span><input name="title" defaultValue={value(values, "title")} required /></label>
          <label className="admin-span-2"><span>Ringkasan</span><textarea name="excerpt" rows={3} maxLength={300} defaultValue={value(values, "excerpt")} required /></label>
          <div className="admin-simple-upload admin-span-2">
            <input type="hidden" name="coverUrl" value={coverUrl} />
            <span className="admin-simple-upload-icon"><ImageIcon aria-hidden /></span>
            <div><strong>Foto sampul</strong><small>{coverUrl ? "Foto sudah dipilih." : "Pilih foto landscape untuk artikel."}</small></div>
            {coverUrl ? <span className="admin-upload-ready"><CheckCircle2 aria-hidden /> Siap</span> : null}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", width: "100%", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="Atau tempel URL gambar langsung (https://...)"
                style={{ flex: 1, minWidth: "240px", fontSize: "0.875rem", padding: "0.4rem 0.6rem", borderRadius: "0.375rem", border: "1px solid #d1d5db" }}
              />
              <UploadButton
                endpoint="cmsImage"
                content={{ button: coverUrl ? "Ganti foto" : "Pilih foto", allowedContent: "JPG, PNG, atau WebP" }}
                onClientUploadComplete={(files) => {
                  const uploaded = files[0]?.ufsUrl ?? files[0]?.url;
                  if (uploaded) setCoverUrl(uploaded);
                }}
              />
            </div>
          </div>
          <div className="admin-span-2"><span className="admin-field-label">Tulisan artikel</span><div className="admin-editor-toolbar"><button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>Tebal</button><button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>Judul bagian</button><button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>Daftar</button><button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>Kutipan</button></div><EditorContent editor={editor} className="admin-rich-editor" /></div>
        </div>
      </section>

      {pending ? (
        <div className="admin-saving-banner" role="status">
          <Loader2 className="admin-spinner" />
          <span>Sedang menyimpan artikel ke database, mohon tunggu sebentar...</span>
        </div>
      ) : null}

      <div className="admin-form-actions">
        {values.id ? (
          <DeleteButton
            id={String(values.id)}
            name={value(values, "title") || "Artikel"}
            type="article"
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
