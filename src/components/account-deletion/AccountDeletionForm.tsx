"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

type FieldErrors = Partial<Record<"fullName" | "whatsapp" | "reason", string[]>>;

export function AccountDeletionForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<FieldErrors>({});
  const [reference, setReference] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setError("");
    setFields({});
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/account-deletion-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          whatsapp: form.get("whatsapp"),
          reason: form.get("reason"),
          website: form.get("website"),
        }),
      });
      const result = await response.json() as { message?: string; reference?: string; fields?: FieldErrors };
      if (!response.ok) {
        setFields(result.fields ?? {});
        throw new Error(result.message || "Permintaan belum dapat dikirim.");
      }
      setReference(result.reference || "Diterima");
      formElement.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Permintaan belum dapat dikirim.");
    } finally {
      setBusy(false);
    }
  }

  if (reference) {
    return (
      <div className="rounded-3xl border border-[#D8C28C] bg-white p-7 shadow-[0_18px_55px_rgba(6,21,43,0.08)] sm:p-9" role="status">
        <CheckCircle2 className="size-10 text-[#8C6708]" />
        <h2 className="mt-5 text-2xl font-semibold text-[#06152B]">Permintaan berhasil dikirim</h2>
        <p className="mt-3 leading-7 text-[#526078]">Tim Jam Wisata akan memverifikasi identitas melalui nomor WhatsApp terdaftar sebelum memproses penghapusan.</p>
        <p className="mt-5 rounded-xl bg-[#F7F1E2] px-4 py-3 text-sm text-[#06152B]">Nomor referensi: <strong>{reference}</strong></p>
        <button type="button" onClick={() => setReference("")} className="mt-6 font-semibold text-[#8C6708] underline underline-offset-4">Kirim permintaan lain</button>
      </div>
    );
  }

  const inputClass = "mt-2 w-full rounded-xl border border-[#D9CCAD] bg-white px-4 py-3 text-[#06152B] outline-none transition focus:border-[#A67C23] focus:ring-2 focus:ring-[#D8C28C]/45";
  return (
    <form onSubmit={submit} className="rounded-3xl border border-[#D8C28C] bg-white p-7 shadow-[0_18px_55px_rgba(6,21,43,0.08)] sm:p-9" noValidate>
      <h2 className="text-2xl font-semibold text-[#06152B]">Ajukan penghapusan akun</h2>
      <p className="mt-2 text-sm leading-6 text-[#667387]">Gunakan nomor WhatsApp yang terdaftar agar tim kami dapat memverifikasi bahwa permintaan berasal dari pemilik akun.</p>
      <div className="mt-7 space-y-5">
        <label className="block text-sm font-semibold text-[#223047]">
          Nama lengkap
          <input className={inputClass} name="fullName" autoComplete="name" maxLength={120} required />
          {fields.fullName?.[0] && <span className="mt-1 block text-xs text-red-700">{fields.fullName[0]}</span>}
        </label>
        <label className="block text-sm font-semibold text-[#223047]">
          Nomor WhatsApp terdaftar
          <input className={inputClass} name="whatsapp" autoComplete="tel" inputMode="tel" placeholder="Contoh: 081234567890" required />
          {fields.whatsapp?.[0] && <span className="mt-1 block text-xs text-red-700">{fields.whatsapp[0]}</span>}
        </label>
        <label className="block text-sm font-semibold text-[#223047]">
          Alasan <span className="font-normal text-[#7A8595]">(opsional)</span>
          <textarea className={`${inputClass} min-h-28 resize-y`} name="reason" maxLength={1_000} />
          {fields.reason?.[0] && <span className="mt-1 block text-xs text-red-700">{fields.reason[0]}</span>}
        </label>
        <label className="absolute -left-[9999px]" aria-hidden="true">
          Situs web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
      <button disabled={busy} className="mt-7 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B78618] via-[#F0D17B] to-[#A9770F] px-5 py-3.5 font-bold text-[#06152B] shadow-[0_12px_30px_rgba(166,124,35,0.24)] disabled:cursor-not-allowed disabled:opacity-60" type="submit">
        {busy ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-5" />}
        {busy ? "Mengirim permintaan…" : "Kirim permintaan"}
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-[#7A8595]">Mengirim formulir tidak langsung menghapus akun. Kami akan melakukan verifikasi identitas terlebih dahulu.</p>
    </form>
  );
}
