"use client";

import { useActionState, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { UploadButton } from "@/lib/uploadthing";
import { saveArticleAction } from "@/lib/cms/actions";
import { type ActionState } from "@/lib/cms/validation";
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
  return <form action={action} className="admin-editor-form">
    <FormFeedback state={state} />
    {values.id ? <input type="hidden" name="id" value={value(values, "id")} /> : null}
    <input type="hidden" name="contentJson" value={contentJson} />
    <section className="admin-form-section"><div><p>Artikel</p><span>Tulis panduan yang jelas, bermanfaat, dan menenangkan jamaah.</span></div><div className="admin-form-grid">
      <label><span>Judul</span><input name="title" defaultValue={value(values, "title")} required /></label>
      <label><span>Slug</span><input name="slug" defaultValue={value(values, "slug")} required /></label>
      <label className="admin-span-2"><span>Ringkasan</span><textarea name="excerpt" rows={3} maxLength={300} defaultValue={value(values, "excerpt")} required /></label>
      <div className="admin-span-2 admin-image-control"><label><span>Cover</span><input name="coverUrl" value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} /></label><UploadButton endpoint="cmsImage" onClientUploadComplete={(files) => { if (files[0]?.url) setCoverUrl(files[0].url); }} /></div>
      <div className="admin-span-2"><span className="admin-field-label">Isi artikel</span><div className="admin-editor-toolbar"><button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button><button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button><button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>List</button><button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>Quote</button></div><EditorContent editor={editor} className="admin-rich-editor" /></div>
      <label><span>SEO title</span><input name="seoTitle" maxLength={70} defaultValue={value(values, "seoTitle")} /></label>
      <label><span>SEO description</span><textarea name="seoDescription" maxLength={170} rows={3} defaultValue={value(values, "seoDescription")} /></label>
    </div></section>
    <div className="admin-form-actions"><button name="intent" value="draft" className="admin-secondary-button" disabled={pending}>Simpan Draft</button><button name="intent" value="publish" className="admin-primary-button" disabled={pending}>{pending ? "Menyimpan..." : "Terbitkan Artikel"}</button></div>
  </form>;
}
