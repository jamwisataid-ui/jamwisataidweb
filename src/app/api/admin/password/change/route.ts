import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireDatabase } from "@/db";
import { sessions, users } from "@/db/schema";
import { createAdminSession } from "@/lib/admin-auth";
import { requireAdminSession } from "@/lib/admin-session";
import { hashPassword, verifyPassword } from "@/lib/password";

const schema = z.object({
  currentPassword: z.string().min(1),
  password: z.string().min(10, "Kata sandi baru minimal 10 karakter.").max(200),
  confirmation: z.string(),
}).refine((data) => data.password === data.confirmation, { message: "Kata sandi baru tidak sama.", path: ["confirmation"] });

export async function POST(request: Request) {
  const session = await requireAdminSession();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Data tidak valid." }, { status: 400 });

  const database = requireDatabase();
  const user = await database.query.users.findFirst({ where: eq(users.id, session.user.id) });
  if (!user?.passwordHash || !await verifyPassword(parsed.data.currentPassword, user.passwordHash)) {
    return NextResponse.json({ message: "Kata sandi saat ini tidak sesuai." }, { status: 400 });
  }
  if (await verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ message: "Kata sandi baru harus berbeda dari kata sandi saat ini." }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await database.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));
  await database.delete(sessions).where(eq(sessions.userId, user.id));
  await createAdminSession(user.id, {
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  return NextResponse.json({ ok: true, message: "Kata sandi berhasil diganti." });
}
