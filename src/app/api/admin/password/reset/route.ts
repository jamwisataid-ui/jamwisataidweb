import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireDatabase } from "@/db";
import { passwordResetTokens, sessions, users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { findValidPasswordResetToken } from "@/lib/password-reset";

const schema = z.object({
  token: z.string().min(20),
  password: z.string().min(10, "Kata sandi minimal 10 karakter.").max(200),
  confirmation: z.string(),
}).refine((data) => data.password === data.confirmation, { message: "Kata sandi tidak sama.", path: ["confirmation"] });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Data tidak valid." }, { status: 400 });

  const resetToken = await findValidPasswordResetToken(parsed.data.token);
  if (!resetToken) return NextResponse.json({ message: "Tautan sudah tidak berlaku. Minta tautan baru." }, { status: 400 });

  const database = requireDatabase();
  const passwordHash = await hashPassword(parsed.data.password);
  await database.transaction(async (tx) => {
    await tx.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, resetToken.userId));
    await tx.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, resetToken.id));
    await tx.delete(sessions).where(eq(sessions.userId, resetToken.userId));
  });

  return NextResponse.json({ ok: true, message: "Kata sandi berhasil diperbarui." });
}
