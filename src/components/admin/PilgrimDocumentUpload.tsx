"use client";

import { useRef, useState } from "react";
import { CheckCircle2, FileUp, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function PilgrimDocumentUpload({ pilgrims }: { pilgrims: Array<{ id: string; fullName: string }> }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<"idle" | "signing" | "uploading" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(formData: FormData) {
    const file = formData.get("file");
    if (!(file instanceof File) || !file.size) return;
    const payload = { pilgrimId: String(formData.get("pilgrimId")), kind: String(formData.get("kind")), fileName: file.name, mimeType: file.type, sizeBytes: file.size };
    try {
      setMessage(""); setProgress("signing");
      const signed = await fetch("/api/admin/management/documents", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "sign", ...payload }) });
      const signedData = await signed.json();
      if (!signed.ok) throw new Error(signedData.error || "Tidak bisa menyiapkan upload.");
      setProgress("uploading");
      const uploaded = await fetch(signedData.uploadUrl, { method: "PUT", headers: { "content-type": file.type }, body: file });
      if (!uploaded.ok) throw new Error("File gagal dikirim. Coba lagi.");
      setProgress("saving");
      const completed = await fetch("/api/admin/management/documents", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "complete", ...payload, objectKey: signedData.objectKey }) });
      const completedData = await completed.json();
      if (!completed.ok) throw new Error(completedData.error || "File terkirim tetapi gagal dicatat.");
      setProgress("done"); setMessage("Dokumen berhasil disimpan secara private.");
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (error) { setProgress("error"); setMessage(error instanceof Error ? error.message : "Upload gagal."); }
  }
  const busy = progress === "signing" || progress === "uploading" || progress === "saving";
  return <form action={submit} className="management-form"><div className="management-form-grid two"><label><span>Jamaah *</span><select name="pilgrimId" required>{pilgrims.map((item) => <option key={item.id} value={item.id}>{item.fullName}</option>)}</select></label><label><span>Jenis dokumen *</span><select name="kind"><option value="ktp">KTP</option><option value="kk">Kartu Keluarga</option><option value="akta_lahir">Akta Lahir</option><option value="buku_nikah">Buku Nikah</option><option value="ijazah">Ijazah</option><option value="paspor">Paspor</option><option value="other">Dokumen lain</option></select></label><label className="span-two"><span>Pilih file *</span><input ref={inputRef} name="file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required /><small>JPG, PNG, WebP, atau PDF. Maksimal 10 MB.</small></label></div>{message ? <div className={`management-feedback ${progress === "done" ? "success" : "error"}`}>{progress === "done" ? <CheckCircle2 /> : <FileUp />}<span>{message}</span></div> : null}<button disabled={busy || !pilgrims.length} className="management-primary-button" type="submit">{busy ? <LoaderCircle className="spin" /> : <FileUp />}{progress === "signing" ? "Menyiapkan…" : progress === "uploading" ? "Mengunggah…" : progress === "saving" ? "Menyimpan…" : "Upload dokumen"}</button></form>;
}
