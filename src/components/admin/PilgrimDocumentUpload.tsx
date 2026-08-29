"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileCheck2, FileUp, LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DRAFT_KEY = "jamwisata:management-document-upload-draft";

type UploadProgress = "idle" | "uploading" | "saving" | "done" | "error";

function uploadDocument(formData: FormData, onProgress: (progress: number) => void, onSaving: () => void) {
  return new Promise<{ documentId: string }>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/management/documents");
    request.responseType = "json";
    request.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;
      const nextProgress = Math.min(100, Math.round((event.loaded / event.total) * 100));
      onProgress(nextProgress);
      if (nextProgress === 100) onSaving();
    });
    request.addEventListener("load", () => {
      const payload = request.response as { documentId?: string; error?: string } | null;
      if (request.status >= 200 && request.status < 300 && payload?.documentId) resolve({ documentId: payload.documentId });
      else reject(new Error(payload?.error || "Dokumen gagal disimpan. Silakan coba lagi."));
    });
    request.addEventListener("error", () => reject(new Error("Koneksi terputus saat upload. File belum tersimpan.")));
    request.addEventListener("abort", () => reject(new Error("Upload dibatalkan. File belum tersimpan.")));
    request.send(formData);
  });
}

function fileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PilgrimDocumentUpload({ pilgrims }: { pilgrims: Array<{ id: string; fullName: string }> }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadProgress>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [pilgrimId, setPilgrimId] = useState(pilgrims[0]?.id ?? "");
  const [kind, setKind] = useState("ktp");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [restoredFileName, setRestoredFileName] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState("");
  const [draftDirty, setDraftDirty] = useState(false);

  useEffect(() => {
    let draft: { pilgrimId?: string; kind?: string; fileName?: string; updatedAt?: number } | null = null;
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (saved) draft = JSON.parse(saved) as { pilgrimId?: string; kind?: string; fileName?: string; updatedAt?: number };
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }
    const restoreDraft = window.setTimeout(() => {
      if (draft) {
        if (draft.pilgrimId && pilgrims.some((item) => item.id === draft.pilgrimId)) setPilgrimId(draft.pilgrimId);
        if (draft.kind) setKind(draft.kind);
        if (draft.fileName) setRestoredFileName(draft.fileName);
        if (draft.updatedAt) setDraftSavedAt(new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date(draft.updatedAt)));
      }
      setDraftReady(true);
    }, 0);
    return () => window.clearTimeout(restoreDraft);
  }, [pilgrims]);

  useEffect(() => {
    if (!draftReady || !draftDirty || status === "done") return;
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ pilgrimId, kind, fileName: selectedFile?.name || restoredFileName, updatedAt: Date.now() }));
      setDraftSavedAt(new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
      setDraftDirty(false);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [draftDirty, draftReady, kind, pilgrimId, restoredFileName, selectedFile, status]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = selectedFile ?? inputRef.current?.files?.[0];
    if (!file) {
      setStatus("error");
      setMessage("Pilih file terlebih dahulu sebelum menekan upload.");
      toast.error("Pilih file yang ingin diunggah.");
      return;
    }
    const formData = new FormData();
    formData.set("pilgrimId", pilgrimId);
    formData.set("kind", kind);
    formData.set("file", file);
    try {
      setMessage("Dokumen sedang diunggah. Jangan tutup halaman ini.");
      setUploadProgress(2);
      setStatus("uploading");
      await uploadDocument(formData, setUploadProgress, () => {
        setStatus("saving");
        setMessage("Upload selesai. Dokumen sedang disimpan secara private.");
      });
      setStatus("done");
      setUploadProgress(100);
      setMessage("Dokumen berhasil disimpan secara private.");
      window.localStorage.removeItem(DRAFT_KEY);
      if (inputRef.current) inputRef.current.value = "";
      toast.success("Dokumen berhasil diunggah.");
      router.replace(`/admin/manajemen/jamaah/${pilgrimId}`);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload gagal. File belum tersimpan.";
      setStatus("error");
      setUploadProgress(0);
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  }
  const busy = status === "uploading" || status === "saving";
  const fileName = selectedFile?.name || restoredFileName;
  return <form onSubmit={submit} className="management-form management-document-upload">
    <div className="management-form-grid two">
      <label><span>Jamaah *</span><select name="pilgrimId" value={pilgrimId} onChange={(event) => { setPilgrimId(event.target.value); setDraftSavedAt(""); setDraftDirty(true); }} required disabled={busy}>{pilgrims.map((item) => <option key={item.id} value={item.id}>{item.fullName}</option>)}</select></label>
      <label><span>Jenis dokumen *</span><select name="kind" value={kind} onChange={(event) => { setKind(event.target.value); setDraftSavedAt(""); setDraftDirty(true); }} disabled={busy}><option value="ktp">KTP</option><option value="kk">Kartu Keluarga</option><option value="akta_lahir">Akta Lahir</option><option value="buku_nikah">Buku Nikah</option><option value="ijazah">Ijazah</option><option value="paspor">Paspor</option><option value="other">Dokumen lain</option></select></label>
    </div>
    <label className={`management-upload-picker ${fileName ? "has-file" : ""}`}>
      <span className="management-upload-icon">{fileName ? <FileCheck2 /> : <FileUp />}</span>
      <span className="management-upload-copy"><strong>{fileName || "Pilih dokumen jamaah"}</strong><small>{selectedFile ? `${fileSize(selectedFile.size)} · siap diunggah` : restoredFileName ? "Pilihan draft dipulihkan. Pilih ulang file ini demi keamanan browser." : "JPG, PNG, WebP, atau PDF · maksimal 10 MB"}</small></span>
      <span className="management-upload-choose">{fileName ? "Ganti file" : "Pilih file"}</span>
      <input ref={inputRef} name="file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" disabled={busy} onChange={(event) => {
        const file = event.target.files?.[0] ?? null;
        setSelectedFile(file);
        setRestoredFileName(file?.name ?? "");
        setDraftSavedAt("");
        setDraftDirty(true);
        setStatus("idle");
        setUploadProgress(0);
        setMessage(file ? "File siap. Tekan Upload dokumen untuk menyimpan." : "");
      }} />
    </label>
    <div className="management-draft-status"><Save /><span>{draftDirty ? "Menyimpan draft pilihan…" : draftSavedAt ? `Draft pilihan tersimpan otomatis pukul ${draftSavedAt}` : draftReady ? "Draft akan tersimpan otomatis saat ada perubahan" : "Memulihkan draft pilihan…"}</span></div>
    {busy ? <div className="management-upload-progress" aria-label={`Progress upload ${uploadProgress}%`}><span><strong>{status === "saving" ? "Menyimpan dokumen…" : "Mengunggah dokumen…"}</strong><small>{status === "saving" ? "Hampir selesai" : `${uploadProgress}%`}</small></span><div><i style={{ width: `${uploadProgress}%` }} /></div></div> : null}
    {message ? <div className={`management-feedback ${status === "done" ? "success" : status === "error" ? "error" : "info"}`} role="status" aria-live="polite">{status === "done" ? <CheckCircle2 /> : status === "error" ? <AlertCircle /> : <FileUp />}<span>{message}</span></div> : null}
    <button disabled={busy || !pilgrims.length} className="management-primary-button" type="submit">{busy ? <LoaderCircle className="spin" /> : <FileUp />}{status === "uploading" ? `Mengunggah ${uploadProgress}%` : status === "saving" ? "Menyimpan dokumen…" : status === "error" ? "Coba upload lagi" : "Upload dokumen"}</button>
  </form>;
}
