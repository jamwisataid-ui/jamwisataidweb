import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";

import { mobileAccounts, pilgrims, referralLeads } from "@/db/schema";
import { withManagementTransaction } from "@/db/transaction";
import { createMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError, requestMetadata, zodFieldErrors } from "@/lib/mobile/api";
import { mobileSelfRegistrationSchema } from "@/lib/mobile/validation";
import { hashPassword } from "@/lib/password";
import { findMatchingReferralLead } from "@/lib/management/referral-attribution";

export async function POST(request: Request) {
  try {
    const parsed = mobileSelfRegistrationSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new MobileApiError(400, "VALIDATION_ERROR", "Periksa data jamaah.", zodFieldErrors(parsed.error));

    const pilgrimId = randomUUID();
    const pinHash = await hashPassword(parsed.data.pin);
    // PIN only belongs to the mobile account; never persist it on pilgrim data.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pin: _pin, ...profile } = parsed.data;

    const account = await withManagementTransaction(async (tx) => {
      // Serializes sign-ups for the same normalized WhatsApp without changing
      // the existing dashboard schema or imposing a new global unique index.
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${profile.whatsapp}))`);
      const existingPilgrim = await tx.query.pilgrims.findFirst({ where: eq(pilgrims.whatsapp, profile.whatsapp) });
      if (existingPilgrim) {
        const existingAccount = await tx.query.mobileAccounts.findFirst({ where: eq(mobileAccounts.pilgrimId, existingPilgrim.id) });
        throw new MobileApiError(
          409,
          existingAccount ? "ACCOUNT_EXISTS" : "PILGRIM_EXISTS",
          existingAccount
            ? "Nomor WhatsApp ini sudah memiliki akun. Silakan masuk dengan PIN Anda."
            : "Nomor WhatsApp ini sudah terdaftar sebagai jamaah. Hubungi admin untuk mendapatkan link aktivasi akun.",
          { whatsapp: [existingAccount ? "Nomor sudah terdaftar. Silakan masuk." : "Data jamaah sudah ada. Aktivasi akun melalui admin."] },
        );
      }

      await tx.insert(pilgrims).values({
        id: pilgrimId,
        ...profile,
        email: profile.email ?? null,
        gender: profile.gender ?? null,
        birthDate: profile.birthDate ?? null,
        passportNumber: profile.passportNumber ?? null,
        passportExpiry: profile.passportExpiry ?? null,
        notes: profile.notes ?? null,
      });

      const openLeads = await tx.query.referralLeads.findMany({
        where: sql`${referralLeads.convertedPilgrimId} is null and ${referralLeads.status} <> 'closed'`,
        orderBy: (lead, { desc }) => [desc(lead.createdAt)],
      });
      const referralLead = findMatchingReferralLead(openLeads, profile);
      if (referralLead) {
        await tx.update(referralLeads).set({ convertedPilgrimId: pilgrimId, status: "converted", updatedAt: new Date() }).where(eq(referralLeads.id, referralLead.id));
      }

      const [created] = await tx.insert(mobileAccounts).values({
        pilgrimId,
        pinHash,
        status: "active",
        activatedAt: new Date(),
      }).returning();
      return created;
    });

    const tokens = await createMobileSession(account.id, requestMetadata(request));
    return mobileData({ tokens, user: { id: pilgrimId, fullName: profile.fullName, whatsapp: profile.whatsapp, email: profile.email ?? null } }, { status: 201 });
  } catch (error) {
    return mobileError(error, "self-register");
  }
}
