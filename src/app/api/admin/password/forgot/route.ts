import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { z } from "zod";

import { isDatabaseConfigured, requireDatabase } from "@/db";
import { authRateLimits, passwordResetTokens, users } from "@/db/schema";
import { createPasswordResetToken, hashResetToken } from "@/lib/password-reset";

const schema = z.object({ email: z.email().transform((value) => value.trim().toLowerCase()) });
const WINDOW_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const GENERIC_MESSAGE = "Jika email terdaftar, tautan pengaturan ulang sudah dikirim.";

export async function POST(request: Request) {
  if (!isDatabaseConfigured) return NextResponse.json({ message: "Database belum dikonfigurasi." }, { status: 503 });
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return NextResponse.json({ message: "Layanan email belum dikonfigurasi." }, { status: 503 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Masukkan alamat email yang benar." }, { status: 400 });

  const database = requireDatabase();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const rateKey = `password-reset|${ip}|${parsed.data.email}`;
  const now = Date.now();
  const rate = await database.query.authRateLimits.findFirst({ where: eq(authRateLimits.key, rateKey) });
  if (rate && now - rate.lastRequest < WINDOW_MS && rate.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ message: "Permintaan terlalu sering. Coba lagi dalam 30 menit." }, { status: 429 });
  }

  const count = rate && now - rate.lastRequest < WINDOW_MS ? rate.count + 1 : 1;
  await database.insert(authRateLimits).values({ id: rate?.id ?? randomUUID(), key: rateKey, count, lastRequest: now }).onConflictDoUpdate({
    target: authRateLimits.key,
    set: { count, lastRequest: now },
  });

  const user = await database.query.users.findFirst({ where: eq(users.email, parsed.data.email) });
  if (!user || user.role !== "admin") return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });

  const { token } = await createPasswordResetToken(user.id);
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  const requestOrigin = new URL(request.url).origin;
  const configuredHost = configuredUrl ? new URL(configuredUrl).hostname : "";
  const baseUrl = process.env.NODE_ENV === "production" && ["localhost", "127.0.0.1"].includes(configuredHost)
    ? requestOrigin
    : configuredUrl || requestOrigin;
  const resetUrl = `${baseUrl}/admin/reset-password?token=${encodeURIComponent(token)}`;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Atur ulang kata sandi Admin Jam Wisata",
    text: `Gunakan tautan berikut untuk membuat kata sandi baru: ${resetUrl}\n\nTautan berlaku selama 30 menit dan hanya dapat digunakan satu kali.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#17243a"><div style="background:#071a35;padding:24px;text-align:center"><strong style="color:#fff;font-size:22px">JAM WISATA</strong></div><div style="padding:30px;border:1px solid #dedbd2"><h1 style="font-size:24px;color:#071a35">Atur ulang kata sandi</h1><p style="font-size:16px;line-height:1.7">Halo Admin Jam Wisata, kami menerima permintaan untuk membuat kata sandi admin yang baru.</p><p style="margin:28px 0"><a href="${resetUrl}" style="display:inline-block;background:#bd8d1b;color:#fff;text-decoration:none;padding:14px 22px;border-radius:8px;font-weight:700">Buat kata sandi baru</a></p><p style="font-size:14px;line-height:1.6;color:#6f7887">Tautan berlaku selama 30 menit dan hanya dapat digunakan satu kali. Abaikan email ini jika Anda tidak meminta perubahan.</p></div></div>`,
  });

  if (error) {
    await database.delete(passwordResetTokens).where(eq(passwordResetTokens.tokenHash, hashResetToken(token)));
    console.error("Password reset email failed:", error.message);
    return NextResponse.json({ message: "Email belum dapat dikirim. Silakan coba kembali." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
}
