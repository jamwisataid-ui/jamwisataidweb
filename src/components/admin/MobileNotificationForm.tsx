"use client";

import { useState } from "react";
import { BellRing, Download } from "lucide-react";

export function MobileNotificationForm({ pilgrimId }: { pilgrimId: string }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [includeDownload, setIncludeDownload] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/admin/mobile/notifications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pilgrimId, title, body, deepLink: includeDownload ? "/download-app" : undefined }),
    });
    const payload = await response.json();
    if (response.ok) {
      setTitle("");
      setBody("");
      setIncludeDownload(false);
      setMessage("Notifikasi sudah masuk ke aplikasi jamaah.");
    } else {
      setMessage(payload.error || "Notifikasi gagal dibuat.");
    }
    setBusy(false);
  };

  return (
    <div className="management-mobile-notification">
      <strong>Kirim notifikasi aplikasi</strong>
      <div>
        <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} placeholder="Judul notifikasi" />
        <textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={500} rows={3} placeholder="Isi informasi untuk jamaah" />
        <label className="management-notification-action">
          <input type="checkbox" checked={includeDownload} onChange={(event) => setIncludeDownload(event.target.checked)} />
          <span>
            <Download />
            <span>
              <strong>Sertakan tombol Unduh APK</strong>
              <small>Jamaah dapat mengunduh build Android terbaru langsung dari notifikasi.</small>
            </span>
          </span>
        </label>
      </div>
      <button type="button" disabled={busy || title.trim().length < 3 || body.trim().length < 3} onClick={submit} className="management-primary-button">
        <BellRing /> {busy ? "Mengirim…" : "Kirim notifikasi"}
      </button>
      {message ? <small>{message}</small> : null}
    </div>
  );
}
