import { randomBytes } from "node:crypto";
import { and, desc, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireDatabase } from "@/db";
import { mobileAccounts, mobileActivationTokens, mobileSessions, pilgrims } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";
import { normalizeWhatsapp } from "@/lib/management/validation";
import { hashMobileToken } from "@/lib/mobile/auth";

type Context = { params: Promise<{ pilgrimId: string }> };

export async function GET(_request: Request, { params }: Context) {
  await requireAdminSession();
  const { pilgrimId } = await params;
  const database = requireDatabase();
  const account = await database.query.mobileAccounts.findFirst({ where: eq(mobileAccounts.pilgrimId, pilgrimId) });
  const token = await database.query.mobileActivationTokens.findFirst({ where: and(eq(mobileActivationTokens.pilgrimId, pilgrimId), isNull(mobileActivationTokens.usedAt), isNull(mobileActivationTokens.revokedAt)), orderBy: [desc(mobileActivationTokens.createdAt)] });
  return NextResponse.json({ status: account?.status ?? "not_activated", activatedAt: account?.activatedAt ?? null, invitationExpiresAt: token?.expiresAt ?? null });
}

export async function POST(_request: Request, { params }: Context) {
  const session = await requireAdminSession();
  const { pilgrimId } = await params;
  const database = requireDatabase();
  const pilgrim = await database.query.pilgrims.findFirst({ where: eq(pilgrims.id, pilgrimId) });
  if (!pilgrim || pilgrim.status !== "active") return NextResponse.json({ error: "Jamaah aktif tidak ditemukan." }, { status: 404 });
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await database.update(mobileActivationTokens).set({ revokedAt: new Date() }).where(and(eq(mobileActivationTokens.pilgrimId, pilgrimId), isNull(mobileActivationTokens.usedAt), isNull(mobileActivationTokens.revokedAt)));
  await database.insert(mobileActivationTokens).values({ pilgrimId, tokenHash: hashMobileToken(token), expiresAt, createdBy: session.user.id });
  const activationBase = process.env.NEXT_PUBLIC_MOBILE_ACTIVATION_URL?.trim() || "jamwisata://activate";
  const activationUrl = `${activationBase}${activationBase.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
  const message = `Assalamu'alaikum ${pilgrim.fullName}, silakan aktifkan aplikasi Jam Wisata melalui link berikut (berlaku 24 jam):\n\n${activationUrl}\n\nSetelah terbuka, buat PIN 6 angka yang mudah diingat.`;
  const whatsappUrl = `https://wa.me/${normalizeWhatsapp(pilgrim.whatsapp)}?text=${encodeURIComponent(message)}`;
  return NextResponse.json({ activationUrl, whatsappUrl, expiresAt });
}

export async function DELETE(_request: Request, { params }: Context) {
  await requireAdminSession();
  const { pilgrimId } = await params;
  const database = requireDatabase();
  const account = await database.query.mobileAccounts.findFirst({ where: eq(mobileAccounts.pilgrimId, pilgrimId) });
  await database.update(mobileActivationTokens).set({ revokedAt: new Date() }).where(and(eq(mobileActivationTokens.pilgrimId, pilgrimId), isNull(mobileActivationTokens.revokedAt)));
  if (account) {
    await database.update(mobileAccounts).set({ status: "revoked", updatedAt: new Date() }).where(eq(mobileAccounts.id, account.id));
    await database.update(mobileSessions).set({ revokedAt: new Date() }).where(eq(mobileSessions.accountId, account.id));
  }
  return NextResponse.json({ ok: true });
}
