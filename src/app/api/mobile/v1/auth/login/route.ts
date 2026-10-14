import { eq } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { mobileAccounts, pilgrims } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { createMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError, requestMetadata, zodFieldErrors } from "@/lib/mobile/api";
import { mobileLoginSchema } from "@/lib/mobile/validation";
import { normalizeWhatsapp } from "@/lib/management/validation";

const LOCK_AFTER_ATTEMPTS = 5;
const LOCK_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const parsed = mobileLoginSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new MobileApiError(400, "VALIDATION_ERROR", "Periksa nomor WhatsApp dan PIN.", zodFieldErrors(parsed.error));
    const database = requireDatabase();
    const candidates = await database.select({ account: mobileAccounts, pilgrim: pilgrims })
      .from(mobileAccounts)
      .innerJoin(pilgrims, eq(mobileAccounts.pilgrimId, pilgrims.id))
      .where(eq(pilgrims.status, "active"));
    const result = candidates.find((candidate) => normalizeWhatsapp(candidate.pilgrim.whatsapp) === parsed.data.whatsapp);
    if (!result?.account.pinHash || result.account.status === "revoked") {
      throw new MobileApiError(401, "INVALID_CREDENTIALS", "Nomor WhatsApp atau PIN tidak sesuai.");
    }
    if (result.account.lockedUntil && result.account.lockedUntil > new Date()) {
      throw new MobileApiError(429, "ACCOUNT_LOCKED", "Terlalu banyak percobaan. Coba lagi dalam 10 menit.");
    }
    const valid = await verifyPassword(parsed.data.pin, result.account.pinHash);
    if (!valid) {
      const attempts = result.account.failedLoginAttempts + 1;
      await database.update(mobileAccounts).set({
        failedLoginAttempts: attempts >= LOCK_AFTER_ATTEMPTS ? 0 : attempts,
        lockedUntil: attempts >= LOCK_AFTER_ATTEMPTS ? new Date(Date.now() + LOCK_MS) : null,
        status: attempts >= LOCK_AFTER_ATTEMPTS ? "locked" : result.account.status,
        updatedAt: new Date(),
      }).where(eq(mobileAccounts.id, result.account.id));
      throw new MobileApiError(attempts >= LOCK_AFTER_ATTEMPTS ? 429 : 401, attempts >= LOCK_AFTER_ATTEMPTS ? "ACCOUNT_LOCKED" : "INVALID_CREDENTIALS", attempts >= LOCK_AFTER_ATTEMPTS ? "Terlalu banyak percobaan. Coba lagi dalam 10 menit." : "Nomor WhatsApp atau PIN tidak sesuai.");
    }
    await database.update(mobileAccounts).set({ status: "active", failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(mobileAccounts.id, result.account.id));
    const tokens = await createMobileSession(result.account.id, requestMetadata(request));
    return mobileData({ tokens, user: { id: result.pilgrim.id, fullName: result.pilgrim.fullName, whatsapp: result.pilgrim.whatsapp } });
  } catch (error) {
    return mobileError(error, "login");
  }
}
