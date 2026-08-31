"use client";

import { FileText, LoaderCircle, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";

export function IssuedDocumentPreview({ id, label }: { id: string; label: string }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl = "";
    async function load() {
      try {
        const response = await fetch(`/api/admin/management/issued-documents/${id}?format=png`, { signal: controller.signal });
        if (!response.ok) throw new Error("Preview dokumen belum dapat ditampilkan.");
        objectUrl = URL.createObjectURL(await response.blob());
        setPreviewUrl(objectUrl);
      } catch (reason) {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Preview dokumen belum dapat ditampilkan.");
      }
    }
    void load();
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [id]);

  if (error) return <div className="management-preview-state error"><RotateCw /><strong>Preview gagal dimuat</strong><p>{error} Gunakan tombol download di samping untuk membuka dokumen.</p></div>;
  if (!previewUrl) return <div className="management-preview-state"><LoaderCircle className="spin" /><strong>Memuat dokumen…</strong></div>;
  return <div role="img" aria-label={label} className="management-template-preview-image" style={{ backgroundImage: `url(${previewUrl})` }}><span className="sr-only"><FileText />{label}</span></div>;
}
