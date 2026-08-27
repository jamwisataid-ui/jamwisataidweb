"use client";

import { AlertCircle, CheckCircle2, ImageIcon, Link2, Loader2, UploadCloud } from "lucide-react";
import { useState } from "react";

import { UploadButton } from "@/lib/uploadthing";

type UploadStatus = "idle" | "uploading" | "success" | "error";

type AdminImageUploadProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  required?: boolean;
  error?: string;
  idleLabel?: string;
  replaceLabel?: string;
};

export function AdminImageUpload({
  name,
  label,
  value,
  onChange,
  description = "Upload foto JPG, PNG, atau WebP. Bisa juga tempel URL gambar langsung.",
  required,
  error,
  idleLabel = "Pilih foto",
  replaceLabel = "Ganti foto",
}: AdminImageUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const isUploading = status === "uploading";
  const hasImage = value.trim().length > 0;
  const statusText = isUploading
    ? "Mengunggah"
    : status === "error"
      ? "Gagal"
      : hasImage
        ? "Siap"
        : "Belum ada foto";

  return (
    <div className={`admin-image-upload admin-span-2 is-${status}`}>
      <input type="hidden" name={name} value={value} required={required} />

      <div className="admin-image-upload-preview" aria-hidden>
        {hasImage ? <i style={{ backgroundImage: `url("${value}")` }} /> : <ImageIcon />}
        {isUploading ? (
          <span>
            <Loader2 className="admin-spinner" />
          </span>
        ) : null}
      </div>

      <div className="admin-image-upload-body">
        <div className="admin-image-upload-copy">
          <strong>{label}</strong>
          <small>{message || (hasImage ? "Foto sudah terpasang dan siap disimpan." : description)}</small>
        </div>

        <div className="admin-image-upload-control">
          <label>
            <Link2 aria-hidden />
            <input
              type="url"
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
                setStatus(event.target.value ? "success" : "idle");
                setMessage(event.target.value ? "URL foto siap digunakan." : "");
                setProgress(event.target.value ? 100 : 0);
              }}
              placeholder="https://..."
              disabled={isUploading}
            />
          </label>

          <UploadButton
            endpoint="cmsImage"
            content={{
              button: isUploading ? "Mengunggah..." : hasImage ? replaceLabel : idleLabel,
              allowedContent: "JPG, PNG, atau WebP",
            }}
            onUploadBegin={() => {
              setStatus("uploading");
              setProgress(8);
              setMessage("Sedang mengunggah foto. Jangan tutup halaman dulu.");
            }}
            onUploadProgress={(uploadProgress) => {
              setProgress(Math.max(8, uploadProgress));
            }}
            onClientUploadComplete={(files) => {
              const uploaded = files[0]?.ufsUrl ?? files[0]?.url;
              if (!uploaded) {
                setStatus("error");
                setProgress(0);
                setMessage("Upload selesai, tapi URL foto tidak terbaca. Coba upload ulang.");
                return;
              }
              onChange(uploaded);
              setStatus("success");
              setProgress(100);
              setMessage("Upload berhasil. Foto sudah siap disimpan.");
            }}
            onUploadError={(uploadError) => {
              setStatus("error");
              setProgress(0);
              setMessage(uploadError.message || "Upload gagal. Periksa koneksi atau ukuran file, lalu coba lagi.");
            }}
          />
        </div>

        <div className="admin-image-upload-footer">
          <span className={`admin-image-upload-status is-${status}`}>
            {isUploading ? <Loader2 className="admin-spinner" /> : status === "error" ? <AlertCircle /> : <CheckCircle2 />}
            {statusText}
          </span>
          <span>{hasImage ? "Link foto tersimpan di form" : "Maks. 4MB per foto"}</span>
        </div>

        {isUploading ? (
          <div className="admin-image-upload-progress" aria-label={`Progress upload ${progress}%`}>
            <i style={{ width: `${progress}%` }} />
          </div>
        ) : null}
        {error ? <small className="admin-upload-error">{error}</small> : null}
      </div>

      <UploadCloud className="admin-image-upload-mark" aria-hidden />
    </div>
  );
}
