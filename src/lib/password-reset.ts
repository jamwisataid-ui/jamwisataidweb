import { createHash, randomBytes, randomUUID } from "node:crypto";
import { and, eq, gt, isNull, lt, or } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { passwordResetTokens } from "@/db/schema";

export const PASSWORD_RESET_DURATION_MS = 30 * 60 * 1000;

export const hashResetToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function createPasswordResetToken(userId: string) {
  const database = requireDatabase();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_DURATION_MS);

  await database.delete(passwordResetTokens).where(
    or(eq(passwordResetTokens.userId, userId), lt(passwordResetTokens.expiresAt, new Date())),
  );
  await database.insert(passwordResetTokens).values({
    id: randomUUID(),
    userId,
    tokenHash: hashResetToken(token),
    expiresAt,
  });

  return { token, expiresAt };
}

export async function findValidPasswordResetToken(token: string) {
  return requireDatabase().query.passwordResetTokens.findFirst({
    where: and(
      eq(passwordResetTokens.tokenHash, hashResetToken(token)),
      gt(passwordResetTokens.expiresAt, new Date()),
      isNull(passwordResetTokens.usedAt),
    ),
  });
}
