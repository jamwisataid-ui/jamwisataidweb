"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
const EMPTY_DOCUMENT = JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] });
const TITLE_MIN = 5;
const EXCERPT_MIN = 20;
const BODY_MIN = 8;
const value = (values: Values, key: string) => String(values[key] ?? "");

export function ArticleForm({ values = {} }: { values?: Values }) {
  const [state, action, pending] = useActionState(saveArticleAction, initial);
  const [title, setTitle] = useState(value(values, "title"));
  const [excerpt, setExcerpt] = useState(value(values, "excerpt"));
  const [coverUrl, setCoverUrl] = useState(value(values, "coverUrl"));
  const [contentJson, setContentJson] = useState(value(values, "contentJson") || EMPTY_DOCUMENT);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const restoredDraft = useRef(false);
  const draftKey = `jamwisata:article-draft:${value(values, "id") || "new"}`;
  const editor = useEditor({
    extensions: [StarterKit, LinkExtension.configure({ openOnClick: false }), ImageExtension],
    content: JSON.parse(contentJson),
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      setContentJson(JSON.stringify(current.getJSON()));
      setClientErrors((errors) => ({ ...errors, contentJson: "" }));
    },
  });
  const titleCount = title.trim().length;
  const excerptCount = excerpt.trim().length;
  const bodyCount = editor?.getText().trim().length ?? 0;
  const isTitleValid = titleCount >= TITLE_MIN;
  const isExcerptValid = excerptCount >= EXCERPT_MIN;
  const isBodyValid = bodyCount >= BODY_MIN;

  useEffect(() => {
    if (restoredDraft.current) return;
    restoredDraft.current = true;
    try {
      const saved = window.localStorage.getItem(draftKey);
      if (!saved) return;

      const draft = JSON.parse(saved) as { title?: string; excerpt?: string; coverUrl?: string; contentJson?: string };
      window.setTimeout(() => {
        if (draft.title && !title) setTitle(draft.title);
        if (draft.excerpt && !excerpt) setExcerpt(draft.excerpt);
        if (draft.coverUrl && !coverUrl) setCoverUrl(draft.coverUrl);
        if (draft.contentJson && contentJson === EMPTY_DOCUMENT) {
          setContentJson(draft.contentJson);
          editor?.commands.setContent(JSON.parse(draft.contentJson));
        }
      }, 0);
    } catch {
      window.localStorage.removeItem(draftKey);
    }
  }, [coverUrl, contentJson, draftKey, editor, excerpt, title]);

  useEffect(() => {
    try {
      window.localStorage.setItem(draftKey, JSON.stringify({ title, excerpt, coverUrl, contentJson }));
    } catch {
      console.warn("Draft artikel belum tersimpan otomatis.");
    }
  }, [contentJson, coverUrl, draftKey, excerpt, title]);

  useEffect(() => {
    if (!state.ok) return;
    window.localStorage.removeItem(draftKey);
  }, [draftKey, state.ok]);

  const error = (key: string) => {
    if (clientErrors[key]) return clientErrors[key];
    if (key === "title" && isTitleValid) return undefined;
    if (key === "excerpt" && isExcerptValid) return undefined;
    if (key === "contentJson" && isBodyValid) return undefined;
    return state.errors?.[key]?.[0];
  };

  const validateBeforeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const nextErrors: Record<string, string> = {};
    if (!isTitleValid) nextErrors.title = `Judul artikel minimal ${TITLE_MIN} karakter.`;
    if (!isExcerptValid) nextErrors.excerpt = `Ringkasan minimal ${EXCERPT_MIN} karakter.`;
    if (!isBodyValid) nextErrors.contentJson = `Tulisan artikel minimal ${BODY_MIN} karakter.`;

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
          <div className={`admin-smart-field admin-span-2 ${isTitleValid ? "is-valid" : "is-warning"}`}>
            <div className="admin-smart-field-head">
              <span>Judul artikel</span>
              <small>{titleCount}/{TITLE_MIN} karakter minimum</small>
            </div>
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
          </div>
          <div className={`admin-smart-field admin-span-2 ${isExcerptValid ? "is-valid" : "is-warning"}`}>
            <div className="admin-smart-field-head">
              <span>Ringkasan</span>
              <small>{excerptCount}/{EXCERPT_MIN} karakter minimum · maksimal 300</small>
            </div>
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
          </div>
          <AdminImageUpload
            name="coverUrl"
            label="Foto sampul"
            value={coverUrl}
            onChange={setCoverUrl}
            description="Pilih foto landscape untuk artikel atau tempel URL gambar."
            error={error("coverUrl")}
            replaceLabel="Ganti foto"
          />
          <div className={`admin-smart-field admin-span-2 ${isBodyValid ? "is-valid" : "is-warning"}`}>
            <div className="admin-smart-field-head">
              <span>Tulisan artikel</span>
              <small>{bodyCount}/{BODY_MIN} karakter minimum</small>
            </div>
            <div className="admin-editor-toolbar"><button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>Tebal</button><button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>Judul bagian</button><button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>Daftar</button><button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>Kutipan</button></div>
            <EditorContent editor={editor} className="admin-rich-editor" />
            {error("contentJson") ? <small className="admin-upload-error">{error("contentJson")}</small> : null}
          </div>
          <div className={`admin-article-readiness admin-span-2 ${isTitleValid && isExcerptValid && isBodyValid ? "is-ready" : "is-waiting"}`} role="status">
            <strong>{isTitleValid && isExcerptValid && isBodyValid ? "Artikel siap disimpan" : "Lengkapi bagian yang masih merah"}</strong>
            <span>Draft tersimpan otomatis di browser.</span>
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
