import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { requireDatabase } from "@/db";
import { mobileDevices } from "@/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError, zodFieldErrors } from "@/lib/mobile/api";

const deviceSchema = z.object({ platform: z.enum(["android", "ios"]), pushToken: z.string().min(20).max(500), deviceName: z.string().trim().max(100).optional() });

export async function POST(request: Request) {
  try {
    const { account } = await requireMobileSession(request);
    const parsed = deviceSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new MobileApiError(400, "VALIDATION_ERROR", "Data perangkat tidak valid.", zodFieldErrors(parsed.error));
    const [device] = await requireDatabase().insert(mobileDevices).values({ accountId: account.id, ...parsed.data }).onConflictDoUpdate({ target: mobileDevices.pushToken, set: { accountId: account.id, platform: parsed.data.platform, deviceName: parsed.data.deviceName, lastSeenAt: new Date(), updatedAt: new Date() } }).returning();
    return mobileData(device);
  } catch (error) {
    return mobileError(error, "device-register");
  }
}

export async function DELETE(request: Request) {
  try {
    const { account } = await requireMobileSession(request);
    const token = new URL(request.url).searchParams.get("token");
    if (token) await requireDatabase().delete(mobileDevices).where(and(eq(mobileDevices.pushToken, token), eq(mobileDevices.accountId, account.id)));
    return mobileData({ success: true, accountId: account.id });
  } catch (error) {
    return mobileError(error, "device-delete");
  }
}
