import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { authRateLimits, mobileAccounts, pilgrims } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { createMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError, requestMetadata, zodFieldErrors } from "@/lib/mobile/api";
import { mobileLoginSchema } from "@/lib/mobile/validation";
import { normalizeWhatsapp } from "@/lib/management/validation";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const DUMMY_PIN_HASH = "scrypt:4c6f67696e44756d6d7953616c743031:67ab827b1c17333d8b0fceb0878e54d2c243221b48410e03d5d5f7a2478421f604e8a5f0b7c6cb974b3216a5286513158114e603c096c64f2a52b83147cb3093";
const INVALID_MESSAGE = "Nomor WhatsApp atau PIN tidak sesuai.";

export async function POST(request: Request) {
  try {
    const parsed = mobileLoginSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new MobileApiError(400, "VALIDATION_ERROR", "Periksa nomor WhatsApp dan PIN.", zodFieldErrors(parsed.error));
    const database = requireDatabase();
    const metadata = requestMetadata(request);
    const rateKey = `mobile-login|${metadata.ipAddress ?? "unknown"}|${parsed.data.whatsapp}`;
    const now = Date.now();
    const rate = await database.query.authRateLimits.findFirst({ where: eq(authRateLimits.key, rateKey) });
    const activeRate = Boolean(rate && now - rate.lastRequest < WINDOW_MS);
    if (activeRate && rate!.count >= MAX_ATTEMPTS) {
      throw new MobileApiError(429, "TOO_MANY_ATTEMPTS", "Terlalu banyak percobaan. Coba lagi dalam 10 menit.");
    }
    const candidates = await database.select({ account: mobileAccounts, pilgrim: pilgrims })
      .from(mobileAccounts)
      .innerJoin(pilgrims, eq(mobileAccounts.pilgrimId, pilgrims.id))
      .where(eq(pilgrims.status, "active"));
    const result = candidates.find((candidate) => normalizeWhatsapp(candidate.pilgrim.whatsapp) === parsed.data.whatsapp);
    const valid = await verifyPassword(parsed.data.pin, result?.account.pinHash ?? DUMMY_PIN_HASH);
    if (!result || !valid || result.account.status === "revoked") {
      const count = activeRate ? rate!.count + 1 : 1;
      await database.insert(authRateLimits).values({ id: rate?.id ?? randomUUID(), key: rateKey, count, lastRequest: now }).onConflictDoUpdate({
        target: authRateLimits.key,
        set: { count, lastRequest: now },
      });
      // Keep the external response identical for existing and unknown users.
      throw new MobileApiError(401, "INVALID_CREDENTIALS", INVALID_MESSAGE);
    }
    await database.delete(authRateLimits).where(eq(authRateLimits.key, rateKey));
    await database.update(mobileAccounts).set({ status: "active", failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(mobileAccounts.id, result.account.id));
    const tokens = await createMobileSession(result.account.id, metadata);
    return mobileData({ tokens, user: { id: result.pilgrim.id, fullName: result.pilgrim.fullName, whatsapp: result.pilgrim.whatsapp } });
  } catch (error) {
    return mobileError(error, "login");
  }
}
