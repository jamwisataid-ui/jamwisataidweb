"use client";

import { useState } from "react";
import { CheckCircle2, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";

export function ChangePasswordForm() {
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/admin/password/change", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ currentPassword: String(data.get("currentPassword")), password: String(data.get("password")), confirmation: String(data.get("confirmation")) }),
    });
    const result = await response.json().catch(() => null) as { message?: string } | null;
    setPending(false);
    setMessage(result?.message ?? "Kata sandi belum dapat diganti.");
    setSuccess(response.ok);
    if (response.ok) form.reset();
  }

  return <form onSubmit={submit} className="admin-editor-form admin-password-form">
    {message ? <div className={success ? "admin-form-success" : "admin-form-error"} role="status">{success ? <CheckCircle2 aria-hidden /> : null}<span>{message}</span></div> : null}
    <section className="admin-form-section"><div><p>Keamanan akun</p><span>Gunakan kata sandi yang tidak digunakan pada akun lain.</span></div><div className="admin-form-grid">
      <label className="admin-span-2"><span>Kata sandi saat ini</span><input name="currentPassword" type={visible ? "text" : "password"} autoComplete="current-password" required /></label>
      <label className="admin-span-2"><span>Kata sandi baru</span><input name="password" type={visible ? "text" : "password"} minLength={10} autoComplete="new-password" required placeholder="Minimal 10 karakter" /></label>
      <label className="admin-span-2"><span>Ulangi kata sandi baru</span><input name="confirmation" type={visible ? "text" : "password"} minLength={10} autoComplete="new-password" required /></label>
      <label className="admin-password-toggle"><input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} /><span>{visible ? <EyeOff /> : <Eye />} Tampilkan kata sandi</span></label>
    </div></section>
    <div className="admin-form-actions"><button className="admin-primary-button" type="submit" disabled={pending}>{pending ? <LoaderCircle className="animate-spin" /> : <LockKeyhole />}{pending ? "Menyimpan..." : "Ganti kata sandi"}</button></div>
  </form>;
}
