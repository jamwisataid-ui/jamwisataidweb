import { and, eq } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { mobileNotifications } from "@/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError } from "@/lib/mobile/api";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const { id } = await params;
    const [notification] = await requireDatabase().update(mobileNotifications).set({ readAt: new Date() }).where(and(eq(mobileNotifications.id, id), eq(mobileNotifications.pilgrimId, pilgrim.id))).returning();
    if (!notification) throw new MobileApiError(404, "NOTIFICATION_NOT_FOUND", "Notifikasi tidak ditemukan.");
    return mobileData(notification);
  } catch (error) {
    return mobileError(error, "notification-read");
  }
}
