import { and, eq, gt, isNull } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { mobileAccounts, mobileActivationTokens, pilgrims } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { createMobileSession, hashMobileToken } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError, requestMetadata, zodFieldErrors } from "@/lib/mobile/api";
import { activationSchema } from "@/lib/mobile/validation";

export async function POST(request: Request) {
  try {
    const parsed = activationSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new MobileApiError(400, "VALIDATION_ERROR", "Periksa data aktivasi.", zodFieldErrors(parsed.error));
    const database = requireDatabase();
    const [activation] = await database.select({ token: mobileActivationTokens, pilgrim: pilgrims })
      .from(mobileActivationTokens)
      .innerJoin(pilgrims, eq(mobileActivationTokens.pilgrimId, pilgrims.id))
      .where(and(
        eq(mobileActivationTokens.tokenHash, hashMobileToken(parsed.data.token)),
        gt(mobileActivationTokens.expiresAt, new Date()),
        isNull(mobileActivationTokens.usedAt),
        isNull(mobileActivationTokens.revokedAt),
        eq(pilgrims.status, "active"),
      )).limit(1);
    if (!activation) throw new MobileApiError(400, "INVALID_ACTIVATION", "Link aktivasi tidak valid atau sudah kedaluwarsa.");

    const pinHash = await hashPassword(parsed.data.pin);
    const [account] = await database.insert(mobileAccounts).values({
      pilgrimId: activation.pilgrim.id,
      pinHash,
      status: "active",
      activatedAt: new Date(),
    }).onConflictDoUpdate({
      target: mobileAccounts.pilgrimId,
      set: { pinHash, status: "active", activatedAt: new Date(), failedLoginAttempts: 0, lockedUntil: null, updatedAt: new Date() },
    }).returning();
    await database.update(mobileActivationTokens).set({ usedAt: new Date() }).where(eq(mobileActivationTokens.id, activation.token.id));
    const tokens = await createMobileSession(account.id, requestMetadata(request));
    return mobileData({ tokens, user: { id: activation.pilgrim.id, fullName: activation.pilgrim.fullName, whatsapp: activation.pilgrim.whatsapp } });
  } catch (error) {
    return mobileError(error, "activate");
  }
}
