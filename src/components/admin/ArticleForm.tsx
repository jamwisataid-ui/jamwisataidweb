"use client";

import { useActionState, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { Loader2 } from "lucide-react";
import { saveArticleAction } from "@/lib/cms/actions";
import { type ActionState } from "@/lib/cms/validation";
import { AdminImageUpload } from "./AdminImageUpload";
import { DeleteButton } from "./DeleteButton";
import { FormFeedback } from "./FormFeedback";

type Values = Record<string, unknown>;
const initial: ActionState = { ok: false, message: "" };
const value = (values: Values, key: string) => String(values[key] ?? "");

export function ArticleForm({ values = {} }: { values?: Values }) {
  const [state, action, pending] = useActionState(saveArticleAction, initial);
  const [title, setTitle] = useState(value(values, "title"));
  const [excerpt, setExcerpt] = useState(value(values, "excerpt"));
  const [coverUrl, setCoverUrl] = useState(value(values, "coverUrl"));
  const [contentJson, setContentJson] = useState(value(values, "contentJson") || JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] }));
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const editor = useEditor({
    extensions: [StarterKit, LinkExtension.configure({ openOnClick: false }), ImageExtension],
    content: JSON.parse(contentJson),
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      setContentJson(JSON.stringify(current.getJSON()));
      setClientErrors((errors) => ({ ...errors, contentJson: "" }));
    },
  });

  const error = (key: string) => {
    if (clientErrors[key]) return clientErrors[key];
    if (key === "title" && title.trim().length >= 5) return undefined;
    if (key === "excerpt" && excerpt.trim().length >= 20) return undefined;
    if (key === "contentJson" && (editor?.getText().trim().length ?? 0) >= 8) return undefined;
    return state.errors?.[key]?.[0];
  };

  const validateBeforeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const nextErrors: Record<string, string> = {};
    if (title.trim().length < 5) nextErrors.title = "Judul artikel minimal 5 karakter.";
    if (excerpt.trim().length < 20) nextErrors.excerpt = "Ringkasan minimal 20 karakter.";
    if ((editor?.getText().trim().length ?? 0) < 8) nextErrors.contentJson = "Tulisan artikel minimal 8 karakter.";

    setClientErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      event.preventDefault();
      event.currentTarget.querySelector(".admin-upload-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <form action={action} className="admin-editor-form" onSubmit={validateBeforeSubmit}>
      <FormFeedback state={state} />
      {values.id ? <input type="hidden" name="id" value={value(values, "id")} /> : null}
      <input type="hidden" name="contentJson" value={contentJson} />
      <input type="hidden" name="slug" value={value(values, "slug")} />
      <input type="hidden" name="seoTitle" value={value(values, "seoTitle")} />
      <input type="hidden" name="seoDescription" value={value(values, "seoDescription")} />
      <section className="admin-form-section">
        <div><p>Isi artikel</p><span>Tulis judul, ringkasan, dan isi artikel. Pengaturan teknis dibuat otomatis.</span></div>
        <div className="admin-form-grid">
          <label className="admin-span-2">
            <span>Judul artikel</span>
            <input
              name="title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setClientErrors((current) => ({ ...current, title: "" }));
              }}
              required
            />
            {error("title") ? <small className="admin-upload-error">{error("title")}</small> : null}
          </label>
          <label className="admin-span-2">
            <span>Ringkasan</span>
            <textarea
              name="excerpt"
              rows={3}
              maxLength={300}
              value={excerpt}
              onChange={(event) => {
                setExcerpt(event.target.value);
                setClientErrors((current) => ({ ...current, excerpt: "" }));
              }}
              required
            />
            {error("excerpt") ? <small className="admin-upload-error">{error("excerpt")}</small> : null}
          </label>
          <AdminImageUpload
            name="coverUrl"
            label="Foto sampul"
            value={coverUrl}
            onChange={setCoverUrl}
            description="Pilih foto landscape untuk artikel atau tempel URL gambar."
            error={error("coverUrl")}
            replaceLabel="Ganti foto"
          />
          <div className="admin-span-2">
            <span className="admin-field-label">Tulisan artikel</span>
            <div className="admin-editor-toolbar"><button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>Tebal</button><button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>Judul bagian</button><button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>Daftar</button><button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>Kutipan</button></div>
            <EditorContent editor={editor} className="admin-rich-editor" />
            {error("contentJson") ? <small className="admin-upload-error">{error("contentJson")}</small> : null}
          </div>
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
