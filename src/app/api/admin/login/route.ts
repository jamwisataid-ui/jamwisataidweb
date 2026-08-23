import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { isDatabaseConfigured, requireDatabase } from "@/db";
import { authRateLimits, users } from "@/db/schema";
import { createAdminSession } from "@/lib/admin-auth";
import { verifyPassword } from "@/lib/password";

const loginSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(10).max(200),
});

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ message: "Database belum dikonfigurasi." }, { status: 503 });
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Data login tidak valid." }, { status: 400 });

  const database = requireDatabase();
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ipAddress = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const rateKey = `${ipAddress}|${parsed.data.email}`;
  const now = Date.now();
  const rate = await database.query.authRateLimits.findFirst({ where: eq(authRateLimits.key, rateKey) });

  if (rate && now - rate.lastRequest < WINDOW_MS && rate.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ message: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." }, { status: 429 });
  }

  const user = await database.query.users.findFirst({ where: eq(users.email, parsed.data.email) });
  const valid = Boolean(user?.passwordHash) && await verifyPassword(parsed.data.password, user!.passwordHash!);

  if (!valid || user?.role !== "admin") {
    const count = rate && now - rate.lastRequest < WINDOW_MS ? rate.count + 1 : 1;
    await database.insert(authRateLimits).values({ id: rate?.id ?? randomUUID(), key: rateKey, count, lastRequest: now }).onConflictDoUpdate({
      target: authRateLimits.key,
      set: { count, lastRequest: now },
    });
    return NextResponse.json({ message: "Email atau kata sandi tidak sesuai." }, { status: 401 });
  }

  await database.delete(authRateLimits).where(eq(authRateLimits.key, rateKey));
  await createAdminSession(user.id, { ipAddress, userAgent: request.headers.get("user-agent") ?? undefined });
  return NextResponse.json({ ok: true });
}
