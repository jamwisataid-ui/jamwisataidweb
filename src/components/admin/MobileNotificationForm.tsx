"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";

export function MobileNotificationForm({ pilgrimId }: { pilgrimId: string }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const submit = async () => {
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/mobile/notifications", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pilgrimId, title, body }) });
    const payload = await response.json();
    if (response.ok) { setTitle(""); setBody(""); setMessage("Notifikasi sudah masuk ke aplikasi jamaah."); }
    else setMessage(payload.error || "Notifikasi gagal dibuat.");
    setBusy(false);
  };
  return <div className="management-mobile-notification"><strong>Kirim notifikasi aplikasi</strong><div><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} placeholder="Judul notifikasi" /><textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={500} rows={3} placeholder="Isi informasi untuk jamaah" /></div><button type="button" disabled={busy || title.trim().length < 3 || body.trim().length < 3} onClick={submit} className="management-primary-button"><BellRing /> {busy ? "Mengirim…" : "Kirim notifikasi"}</button>{message ? <small>{message}</small> : null}</div>;
}
