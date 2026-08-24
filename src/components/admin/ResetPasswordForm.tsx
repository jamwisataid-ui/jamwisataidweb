"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";

export function ResetPasswordForm({ token }: { token: string }) {
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/password/reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password: String(form.get("password")), confirmation: String(form.get("confirmation")) }),
    });
    const result = await response.json().catch(() => null) as { message?: string } | null;
    setPending(false);
    setMessage(result?.message ?? "Kata sandi belum dapat diperbarui.");
    setSuccess(response.ok);
  }

  if (success) return <div className="admin-auth-success"><CheckCircle2 aria-hidden /><strong>Kata sandi sudah diperbarui</strong><p>Silakan masuk menggunakan kata sandi baru.</p><Link href="/admin/login">Masuk ke dashboard</Link></div>;
  if (!token) return <div className="admin-auth-success is-error"><LockKeyhole aria-hidden /><strong>Tautan tidak lengkap</strong><p>Minta tautan pengaturan ulang yang baru melalui email.</p><Link href="/admin/lupa-password">Minta tautan baru</Link></div>;

  return <form onSubmit={submit} className="admin-login-form">
    <label><span>Kata sandi baru</span><span className="admin-input-icon"><LockKeyhole /><input name="password" type={visible ? "text" : "password"} minLength={10} autoComplete="new-password" required placeholder="Minimal 10 karakter" /><button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>{visible ? <EyeOff /> : <Eye />}</button></span></label>
    <label><span>Ulangi kata sandi baru</span><span className="admin-input-icon"><LockKeyhole /><input name="confirmation" type={visible ? "text" : "password"} minLength={10} autoComplete="new-password" required placeholder="Ketik ulang kata sandi" /></span></label>
    {message ? <p className="admin-form-error" role="alert">{message}</p> : null}
    <button className="admin-primary-button" type="submit" disabled={pending}>{pending ? <LoaderCircle className="animate-spin" /> : null}{pending ? "Menyimpan..." : "Simpan kata sandi baru"}</button>
  </form>;
}
