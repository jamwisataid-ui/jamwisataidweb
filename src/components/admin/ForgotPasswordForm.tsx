"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, LoaderCircle, Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/password/forgot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: String(form.get("email")) }),
    });
    const result = await response.json().catch(() => null) as { message?: string } | null;
    setPending(false);
    setMessage(result?.message ?? "Permintaan belum dapat diproses.");
    setSuccess(response.ok);
  }

  if (success) return <div className="admin-auth-success"><CheckCircle2 aria-hidden /><strong>Periksa email Anda</strong><p>{message}</p><Link href="/admin/login"><ArrowLeft aria-hidden /> Kembali ke halaman masuk</Link></div>;

  return <form onSubmit={submit} className="admin-login-form">
    <label><span>Email admin</span><span className="admin-input-icon"><Mail /><input name="email" type="email" autoComplete="email" required placeholder="jamwisata.id@gmail.com" /></span></label>
    {message ? <p className="admin-form-error" role="alert">{message}</p> : null}
    <button className="admin-primary-button" type="submit" disabled={pending}>{pending ? <LoaderCircle className="animate-spin" /> : <Mail />}{pending ? "Mengirim..." : "Kirim tautan ke email"}</button>
    <Link className="admin-auth-back" href="/admin/login"><ArrowLeft aria-hidden /> Kembali ke halaman masuk</Link>
  </form>;
}
