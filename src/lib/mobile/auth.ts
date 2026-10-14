import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { mobileAccounts, mobileSessions, pilgrims } from "@/db/schema";
import { MobileApiError } from "./api";

const ACCESS_DURATION_MS = 15 * 60 * 1000;
const REFRESH_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export const hashMobileToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const createOpaqueToken = () => randomBytes(32).toString("base64url");

export async function createMobileSession(accountId: string, metadata?: { ipAddress?: string; userAgent?: string }) {
  const database = requireDatabase();
  const accessToken = createOpaqueToken();
  const refreshToken = createOpaqueToken();
  const now = new Date();
  const accessExpiresAt = new Date(now.getTime() + ACCESS_DURATION_MS);
  const refreshExpiresAt = new Date(now.getTime() + REFRESH_DURATION_MS);
  await database.insert(mobileSessions).values({
    accountId,
    accessTokenHash: hashMobileToken(accessToken),
    refreshTokenHash: hashMobileToken(refreshToken),
    accessExpiresAt,
    refreshExpiresAt,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  });
  return { accessToken, refreshToken, accessExpiresAt: accessExpiresAt.toISOString(), refreshExpiresAt: refreshExpiresAt.toISOString() };
}

function bearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) throw new MobileApiError(401, "UNAUTHENTICATED", "Silakan masuk kembali.");
  return header.slice(7).trim();
}

export async function requireMobileSession(request: Request) {
  const database = requireDatabase();
  const token = bearerToken(request);
  const [result] = await database
    .select({ session: mobileSessions, account: mobileAccounts, pilgrim: pilgrims })
    .from(mobileSessions)
    .innerJoin(mobileAccounts, eq(mobileSessions.accountId, mobileAccounts.id))
    .innerJoin(pilgrims, eq(mobileAccounts.pilgrimId, pilgrims.id))
    .where(and(
      eq(mobileSessions.accessTokenHash, hashMobileToken(token)),
      gt(mobileSessions.accessExpiresAt, new Date()),
      isNull(mobileSessions.revokedAt),
      eq(mobileAccounts.status, "active"),
      eq(pilgrims.status, "active"),
    ))
    .limit(1);
  if (!result) throw new MobileApiError(401, "SESSION_EXPIRED", "Sesi berakhir. Silakan masuk kembali.");
  await database.update(mobileSessions).set({ lastUsedAt: new Date() }).where(eq(mobileSessions.id, result.session.id));
  return result;
}

export async function rotateMobileSession(refreshToken: string, metadata?: { ipAddress?: string; userAgent?: string }) {
  const database = requireDatabase();
  const [result] = await database
    .select({ session: mobileSessions, account: mobileAccounts })
    .from(mobileSessions)
    .innerJoin(mobileAccounts, eq(mobileSessions.accountId, mobileAccounts.id))
    .where(and(
      eq(mobileSessions.refreshTokenHash, hashMobileToken(refreshToken)),
      gt(mobileSessions.refreshExpiresAt, new Date()),
      isNull(mobileSessions.revokedAt),
      eq(mobileAccounts.status, "active"),
    ))
    .limit(1);
  if (!result) throw new MobileApiError(401, "INVALID_REFRESH_TOKEN", "Sesi berakhir. Silakan masuk kembali.");
  await database.update(mobileSessions).set({ revokedAt: new Date() }).where(eq(mobileSessions.id, result.session.id));
  return createMobileSession(result.account.id, metadata);
}

export async function revokeMobileSession(token: string) {
  await requireDatabase().update(mobileSessions).set({ revokedAt: new Date() }).where(eq(mobileSessions.accessTokenHash, hashMobileToken(token)));
}
