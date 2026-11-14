import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { isDatabaseConfigured, requireDatabase } from "@/db";
import { authRateLimits } from "@/db/schema";
import { accountDeletionRequestSchema, deletionRequestReference } from "@/lib/account-deletion";

const WINDOW_MS = 60 * 60 * 1_000;
const MAX_ATTEMPTS = 3;

function requesterIp(request: Request) {
  return request.headers.get("x-real-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ message: "Layanan permintaan belum tersedia. Silakan hubungi WhatsApp Jam Wisata." }, { status: 503 });
  }
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return NextResponse.json({ message: "Layanan email belum tersedia. Silakan hubungi WhatsApp Jam Wisata." }, { status: 503 });
  }

  const parsed = accountDeletionRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const fields = parsed.error.flatten().fieldErrors;
    return NextResponse.json({ message: "Periksa kembali data permintaan Anda.", fields }, { status: 400 });
  }

  // Honeypot: acknowledge automated submissions without forwarding them.
  if (parsed.data.website) return NextResponse.json({ ok: true, reference: deletionRequestReference() });

  const database = requireDatabase();
  const rateKey = `account-deletion|${requesterIp(request)}|${parsed.data.whatsapp}`;
  const now = Date.now();
  const existing = await database.query.authRateLimits.findFirst({ where: eq(authRateLimits.key, rateKey) });
  const active = Boolean(existing && now - existing.lastRequest < WINDOW_MS);
  if (active && existing!.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ message: "Permintaan terlalu sering. Silakan coba lagi dalam satu jam atau hubungi WhatsApp Jam Wisata." }, { status: 429 });
  }
  const count = active ? existing!.count + 1 : 1;
  await database.insert(authRateLimits).values({
    id: existing?.id ?? randomUUID(),
    key: rateKey,
    count,
    lastRequest: now,
  }).onConflictDoUpdate({ target: authRateLimits.key, set: { count, lastRequest: now } });

  const reference = deletionRequestReference();
  const destination = process.env.ACCOUNT_DELETION_EMAIL?.trim() || "jamwisata99@gmail.com";
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: destination,
    replyTo: destination,
    subject: `[${reference}] Permintaan penghapusan akun Jam Wisata`,
    text: [
      "Permintaan penghapusan akun baru dari jamwisata.id/hapus-akun.",
      "",
      `Referensi: ${reference}`,
      `Nama lengkap: ${parsed.data.fullName}`,
      `WhatsApp terdaftar: ${parsed.data.whatsapp}`,
      `Alasan: ${parsed.data.reason || "Tidak dicantumkan"}`,
      "",
      "Tindakan operasional:",
      "1. Verifikasi identitas pemohon melalui nomor WhatsApp terdaftar.",
      "2. Catat tanggal verifikasi dan ruang lingkup data yang harus dihapus.",
      "3. Selesaikan paling lambat 30 hari kerja setelah identitas terverifikasi.",
      "4. Beri konfirmasi kepada pemohon setelah proses selesai.",
    ].join("\n"),
  });

  if (error) {
    console.error("Account deletion request email failed:", error.message);
    return NextResponse.json({ message: "Permintaan belum dapat dikirim. Silakan coba lagi atau hubungi WhatsApp Jam Wisata." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    reference,
    message: "Permintaan berhasil dikirim. Tim kami akan menghubungi Anda untuk verifikasi identitas.",
  });
}
