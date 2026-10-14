import { and, desc, eq, lt } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { mobileNotifications } from "@/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError } from "@/lib/mobile/api";

export async function GET(request: Request) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || 20)));
    const rows = await requireDatabase().select().from(mobileNotifications)
      .where(cursor ? and(eq(mobileNotifications.pilgrimId, pilgrim.id), lt(mobileNotifications.createdAt, new Date(cursor))) : eq(mobileNotifications.pilgrimId, pilgrim.id))
      .orderBy(desc(mobileNotifications.createdAt)).limit(limit + 1);
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit);
    return mobileData(items, { meta: { nextCursor: hasMore ? items.at(-1)?.createdAt.toISOString() : null, unread: items.filter((item) => !item.readAt).length } });
  } catch (error) {
    return mobileError(error, "notifications-list");
  }
}
