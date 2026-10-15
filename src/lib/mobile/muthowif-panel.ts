import { and, eq } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { liveMuthowifSessions } from "@/db/schema";
import { MobileApiError } from "./api";

export async function findAssignedMuthowifSession(userId: string, sessionId: string) {
  const [session] = await requireDatabase().select().from(liveMuthowifSessions).where(and(
    eq(liveMuthowifSessions.id, sessionId),
    eq(liveMuthowifSessions.muthowifUserId, userId),
  )).limit(1);
  if (!session) throw new MobileApiError(403, "MUTHOWIF_SESSION_FORBIDDEN", "Sesi ini tidak ditugaskan kepada Anda.");
  return session;
}
