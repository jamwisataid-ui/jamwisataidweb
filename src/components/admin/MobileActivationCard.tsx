"use client";

import { useEffect, useState } from "react";
import { Copy, ExternalLink, KeyRound, RotateCcw, ShieldOff } from "lucide-react";

type Status = { status: string; activatedAt: string | null; invitationExpiresAt: string | null };

export function MobileActivationCard({ pilgrimId }: { pilgrimId: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [links, setLinks] = useState<{ activationUrl: string; whatsappUrl: string } | null>(null);
  const load = async () => { const response = await fetch(`/api/admin/mobile/activation/${pilgrimId}`); if (response.ok) setStatus(await response.json()); };
  useEffect(() => {
    let active = true;
    void fetch(`/api/admin/mobile/activation/${pilgrimId}`).then(async (response) => {
      if (active && response.ok) setStatus(await response.json());
    });
    return () => { active = false; };
  }, [pilgrimId]);
  const invite = async () => {
    setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/mobile/activation/${pilgrimId}`, { method: "POST" });
    const payload = await response.json();
    if (!response.ok) setMessage(payload.error || "Link aktivasi gagal dibuat.");
    else { setLinks(payload); setMessage("Link baru siap dikirim dan berlaku 24 jam."); await load(); }
    setBusy(false);
  };
  const revoke = async () => {
    setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/mobile/activation/${pilgrimId}`, { method: "DELETE" });
    setMessage(response.ok ? "Akses aplikasi jamaah sudah dicabut." : "Akses gagal dicabut.");
    setLinks(null); await load(); setBusy(false);
  };
  return <div className="management-mobile-activation">
    <div><span className={`management-status ${status?.status === "active" ? "good" : "pending"}`}>{status?.status === "active" ? "Aplikasi aktif" : status?.status === "revoked" ? "Akses dicabut" : "Belum aktif"}</span><p>Aktivasi menghubungkan aplikasi ke data jamaah ini. Link hanya bisa dipakai sekali.</p></div>
    <div className="management-mobile-activation-actions"><button type="button" disabled={busy} onClick={invite} className="management-primary-button">{status?.status === "active" ? <RotateCcw /> : <KeyRound />}{status?.status === "active" ? "Buat ulang link" : "Buat link aktivasi"}</button>{status?.status === "active" ? <button type="button" disabled={busy} onClick={revoke} className="management-secondary-button"><ShieldOff /> Cabut akses</button> : null}</div>
    {links ? <div className="management-mobile-activation-link"><code>{links.activationUrl}</code><button type="button" onClick={() => navigator.clipboard.writeText(links.activationUrl)}><Copy /> Salin</button><a href={links.whatsappUrl} target="_blank" rel="noreferrer"><ExternalLink /> Kirim via WhatsApp</a></div> : null}
    {message ? <small>{message}</small> : null}
  </div>;
}
