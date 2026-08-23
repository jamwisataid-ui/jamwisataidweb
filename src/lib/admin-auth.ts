import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt, lt } from "drizzle-orm";

import { isDatabaseConfigured, requireDatabase } from "@/db";
import { sessions, users } from "@/db/schema";

const SESSION_COOKIE = "jamwisata_admin_session";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createAdminSession(userId: string, metadata?: { ipAddress?: string; userAgent?: string }) {
  const database = requireDatabase();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await database.delete(sessions).where(lt(sessions.expiresAt, new Date()));
  await database.insert(sessions).values({
    id: randomUUID(),
    userId,
    token: hashToken(token),
    expiresAt,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function readAdminSession() {
  if (!isDatabaseConfigured) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const database = requireDatabase();
  const [result] = await database
    .select({
      session: sessions,
      user: { id: users.id, name: users.name, email: users.email, role: users.role },
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);

  return result?.user.role === "admin" ? result : null;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token && isDatabaseConfigured) {
    await requireDatabase().delete(sessions).where(eq(sessions.token, hashToken(token)));
  }
  cookieStore.delete(SESSION_COOKIE);
}
