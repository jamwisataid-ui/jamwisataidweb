"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

export function ReferralLeadForm({ code, packages }: { code: string; packages: Array<{ id: string; name: string }> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/referral-leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ referralCode: code, name: formData.get("name"), whatsapp: formData.get("whatsapp"), email: formData.get("email"), packageId: formData.get("packageId") }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Data belum tersimpan.");
      window.location.href = data.redirectUrl;
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Terjadi kesalahan."); setBusy(false); }
  }
  return <form action={submit} className="referral-form"><label><span>Nama lengkap *</span><input name="name" autoComplete="name" required /></label><label><span>Nomor WhatsApp *</span><input name="whatsapp" inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" required /></label><label><span>Paket yang diminati</span><select name="packageId"><option value="">Belum menentukan paket</option>{packages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label><span>Email <i>opsional</i></span><input name="email" type="email" autoComplete="email" /></label>{error ? <p role="alert">{error}</p> : null}<button type="submit" disabled={busy}>{busy ? <LoaderCircle /> : <ArrowRight />}{busy ? "Menyimpan…" : "Lanjut konsultasi WhatsApp"}</button><small>Dengan melanjutkan, data Anda akan diteruskan ke tim Jam Wisata untuk keperluan konsultasi.</small></form>;
}
