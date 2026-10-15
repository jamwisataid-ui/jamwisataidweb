import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireDatabase } from "@/db";
import { liveMuthowifSessions } from "@/db/schema";
import { requireMuthowifSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError, zodFieldErrors } from "@/lib/mobile/api";
import { findAssignedMuthowifSession } from "@/lib/mobile/muthowif-panel";
import { clampLiveListenerCount } from "@/lib/mobile/muthowif-live-policy";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("start") }),
  z.object({ action: z.literal("end") }),
  z.object({ action: z.literal("heartbeat"), listenerCount: z.number().int().min(0).max(10_000) }),
  z.object({ action: z.literal("metadata"), type: z.enum(["thawaf", "sai", "kajian", "ziarah", "briefing", "other"]), title: z.string().trim().min(3).max(100) }),
]);

export async function PATCH(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { user } = await requireMuthowifSession(request);
    const session = await findAssignedMuthowifSession(user.id, (await params).sessionId);
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new MobileApiError(400, "VALIDATION_ERROR", "Perubahan sesi tidak valid.", zodFieldErrors(parsed.error));
    const now = new Date();
    const values = parsed.data.action === "start"
      ? { status: "live" as const, liveStartedAt: session.liveStartedAt ?? now, liveEndedAt: null, updatedAt: now }
      : parsed.data.action === "end"
        ? { status: "ended" as const, liveEndedAt: now, updatedAt: now }
        : parsed.data.action === "heartbeat"
          ? { listenerCount: clampLiveListenerCount(parsed.data.listenerCount, session.capacity), updatedAt: now }
          : { type: parsed.data.type, title: parsed.data.title, updatedAt: now };
    const [updated] = await requireDatabase().update(liveMuthowifSessions).set(values).where(eq(liveMuthowifSessions.id, session.id)).returning();
    return mobileData({ id: updated.id, status: updated.status, type: updated.type, title: updated.title, listenerCount: updated.listenerCount, liveStartedAt: updated.liveStartedAt?.toISOString() ?? null, liveEndedAt: updated.liveEndedAt?.toISOString() ?? null });
  } catch (error) {
    return mobileError(error, "muthowif-session-update");
  }
}
