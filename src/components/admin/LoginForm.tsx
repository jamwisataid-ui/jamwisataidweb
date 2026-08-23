"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: String(form.get("email")), password: String(form.get("password")) }),
    });
    setPending(false);
    if (!response.ok) {
      const result = await response.json().catch(() => null) as { message?: string } | null;
      setMessage(result?.message ?? "Login gagal. Silakan coba kembali.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="admin-login-form">
      {!configured ? <p className="admin-alert">DATABASE_URL belum dikonfigurasi.</p> : null}
      <label><span>Email admin</span><span className="admin-input-icon"><Mail className="size-4" /><input name="email" type="email" autoComplete="email" required placeholder="admin@jamwisata.id" /></span></label>
      <label><span>Kata sandi</span><span className="admin-input-icon"><LockKeyhole className="size-4" /><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required minLength={10} placeholder="Masukkan kata sandi" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>
      {message ? <p className="admin-form-error" role="alert">{message}</p> : null}
      <button className="admin-primary-button" type="submit" disabled={pending || !configured}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : null}{pending ? "Memeriksa..." : "Masuk ke CMS"}</button>
      <p className="admin-login-help">Akses khusus pengelola resmi Jam Wisata.</p>
    </form>
  );
}
