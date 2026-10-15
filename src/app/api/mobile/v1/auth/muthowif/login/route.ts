import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireDatabase } from "@/db";
import { mobileAccounts, users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { createMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError, requestMetadata, zodFieldErrors } from "@/lib/mobile/api";

const schema = z.object({
  email: z.email("Format email tidak valid.").transform((value) => value.trim().toLowerCase()),
  password: z.string().min(10, "Kata sandi minimal 10 karakter.").max(200),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new MobileApiError(400, "VALIDATION_ERROR", "Periksa email dan kata sandi.", zodFieldErrors(parsed.error));
    const database = requireDatabase();
    const [user] = await database.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
    const valid = Boolean(user?.passwordHash) && await verifyPassword(parsed.data.password, user!.passwordHash!);
    if (!valid || user?.role !== "muthowif") throw new MobileApiError(401, "INVALID_CREDENTIALS", "Email atau kata sandi muthowif tidak sesuai.");

    let [account] = await database.select().from(mobileAccounts).where(eq(mobileAccounts.userId, user.id)).limit(1);
    if (!account) {
      [account] = await database.insert(mobileAccounts).values({ userId: user.id, role: "muthowif", status: "active", activatedAt: new Date() }).returning();
    } else if (account.role !== "muthowif") {
      throw new MobileApiError(403, "MUTHOWIF_REQUIRED", "Akun ini tidak memiliki akses panel muthowif.");
    }
    await database.update(mobileAccounts).set({ status: "active", lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(mobileAccounts.id, account.id));
    const tokens = await createMobileSession(account.id, requestMetadata(request));
    return mobileData({ tokens, user: { id: user.id, fullName: user.name, email: user.email, role: "muthowif" as const } });
  } catch (error) {
    return mobileError(error, "muthowif-login");
  }
}
