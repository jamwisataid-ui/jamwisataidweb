"use client";

import Image from "next/image";
import { Eye, FileText, X } from "lucide-react";
import { useEffect, useState } from "react";

export function PrivateDocumentPreview({ id, name, mimeType }: { id: string; name: string; mimeType: string }) {
  const [open, setOpen] = useState(false);
  const previewUrl = `/api/admin/management/documents/${id}?mode=preview`;
  const isImage = mimeType.startsWith("image/");

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return <>
    <button className={`management-document-preview-trigger ${isImage ? "has-thumbnail" : ""}`} type="button" onClick={() => setOpen(true)} aria-label={`Preview ${name}`}>
      {isImage ? <span><Image src={previewUrl} alt="" fill sizes="64px" unoptimized /></span> : <span><FileText /></span>}
      <i><Eye /> Preview</i>
    </button>
    {open ? <div className="management-document-preview-modal" role="dialog" aria-modal="true" aria-label={`Preview ${name}`} onMouseDown={(event) => { if (event.currentTarget === event.target) setOpen(false); }}>
      <div>
        <header><span><strong>Preview dokumen</strong><small>{name}</small></span><button type="button" onClick={() => setOpen(false)} aria-label="Tutup preview"><X /></button></header>
        <section>{isImage ? <Image src={previewUrl} alt={name} fill sizes="90vw" unoptimized /> : <iframe src={previewUrl} title={`Preview ${name}`} />}</section>
        <footer><a href={`/api/admin/management/documents/${id}`}><FileText /> Download dokumen</a></footer>
      </div>
    </div> : null}
  </>;
}
