import { count, countDistinct, desc, gte, sql } from "drizzle-orm";

import { isDatabaseConfigured, requireDatabase } from "@/db";
import { analyticsPageViews, analyticsSessions } from "@/db/schema";

export type TrafficEvent = {
  type: "pageview" | "heartbeat";
  sessionId: string;
  visitorId: string;
  path: string;
  referrer?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
};

export type TrafficSnapshot = {
  liveVisitors: number;
  visitorsToday: number;
  visitors7Days: number;
  visitors30Days: number;
  pageViewsToday: number;
  pagesPerVisit: number;
  updatedAt: string;
  timeline: Array<{ label: string; value: number }>;
  popularPages: Array<{ path: string; views: number }>;
  devices: Array<{ device: string; visitors: number }>;
  recentVisitors: Array<{ sessionId: string; path: string; device: string; lastSeenAt: string; utmSource: string | null; utmCampaign: string | null }>;
};

const BOT_PATTERN = /bot|crawler|spider|headless|preview|facebookexternalhit|whatsapp|slurp/i;

function detectDevice(userAgent: string) {
  if (/tablet|ipad/i.test(userAgent)) return "tablet";
  if (/mobile|android|iphone/i.test(userAgent)) return "mobile";
  return "desktop";
}

function jakartaDayStart(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(`${values.year}-${values.month}-${values.day}T00:00:00+07:00`);
}

export function isTrackableUserAgent(userAgent: string) {
  return userAgent.length > 0 && !BOT_PATTERN.test(userAgent);
}

export async function recordTrafficEvent(event: TrafficEvent, userAgent: string) {
  if (!isDatabaseConfigured || !isTrackableUserAgent(userAgent)) return;

  const database = requireDatabase();
  const now = new Date();
  const device = detectDevice(userAgent);
  const nextPageViews = event.type === "pageview"
    ? sql`${analyticsSessions.pageViews} + 1`
    : analyticsSessions.pageViews;

  await database
    .insert(analyticsSessions)
    .values({
      sessionId: event.sessionId,
      visitorId: event.visitorId,
      currentPath: event.path,
      referrer: event.referrer || null,
      utmSource: event.utmSource || null,
      utmCampaign: event.utmCampaign || null,
      utmContent: event.utmContent || null,
      device,
      pageViews: event.type === "pageview" ? 1 : 0,
      firstSeenAt: now,
      lastSeenAt: now,
    })
    .onConflictDoUpdate({
      target: analyticsSessions.sessionId,
      set: {
        currentPath: event.path,
        lastSeenAt: now,
        pageViews: nextPageViews,
        utmSource: event.utmSource || undefined,
        utmCampaign: event.utmCampaign || undefined,
        utmContent: event.utmContent || undefined,
      },
    });

  if (event.type === "pageview") {
    await database.insert(analyticsPageViews).values({
      sessionId: event.sessionId,
      visitorId: event.visitorId,
      path: event.path,
      referrer: event.referrer || null,
      utmSource: event.utmSource || null,
      utmCampaign: event.utmCampaign || null,
      utmContent: event.utmContent || null,
      createdAt: now,
    });
  }
}

const emptySnapshot = (): TrafficSnapshot => ({
  liveVisitors: 0,
  visitorsToday: 0,
  visitors7Days: 0,
  visitors30Days: 0,
  pageViewsToday: 0,
  pagesPerVisit: 0,
  updatedAt: new Date().toISOString(),
  timeline: Array.from({ length: 12 }, (_, index) => ({ label: `${(index - 11) * 5}m`, value: 0 })),
  popularPages: [],
  devices: [],
  recentVisitors: [],
});

export async function getTrafficSnapshot(): Promise<TrafficSnapshot> {
  if (!isDatabaseConfigured) return emptySnapshot();

  const database = requireDatabase();
  const now = new Date();
  const liveSince = new Date(now.getTime() - 5 * 60 * 1000);
  const hourSince = new Date(now.getTime() - 60 * 60 * 1000);
  const todaySince = jakartaDayStart(now);
  const sevenDaysSince = new Date(now.getTime() - 7 * 86400000);
  const thirtyDaysSince = new Date(now.getTime() - 30 * 86400000);
  const bucket = sql<Date>`date_bin('5 minutes', ${analyticsPageViews.createdAt}, TIMESTAMPTZ '2001-01-01 00:00:00+00')`;
  const viewCount = count();

  const [liveRows, todayRows, sevenDayRows, thirtyDayRows, sessionRows, timelineRows, popularRows, deviceRows, recentRows] = await Promise.all([
    database
      .select({ value: countDistinct(analyticsSessions.visitorId) })
      .from(analyticsSessions)
      .where(gte(analyticsSessions.lastSeenAt, liveSince)),
    database
      .select({ visitors: countDistinct(analyticsPageViews.visitorId), views: count() })
      .from(analyticsPageViews)
      .where(gte(analyticsPageViews.createdAt, todaySince)),
    database.select({ value: countDistinct(analyticsPageViews.visitorId) }).from(analyticsPageViews).where(gte(analyticsPageViews.createdAt, sevenDaysSince)),
    database.select({ value: countDistinct(analyticsPageViews.visitorId) }).from(analyticsPageViews).where(gte(analyticsPageViews.createdAt, thirtyDaysSince)),
    database
      .select({ value: countDistinct(analyticsPageViews.sessionId) })
      .from(analyticsPageViews)
      .where(gte(analyticsPageViews.createdAt, todaySince)),
    database
      .select({ bucket, value: count() })
      .from(analyticsPageViews)
      .where(gte(analyticsPageViews.createdAt, hourSince))
      .groupBy(bucket)
      .orderBy(bucket),
    database
      .select({ path: analyticsPageViews.path, views: viewCount })
      .from(analyticsPageViews)
      .where(gte(analyticsPageViews.createdAt, todaySince))
      .groupBy(analyticsPageViews.path)
      .orderBy(desc(viewCount))
      .limit(5),
    database
      .select({ device: analyticsSessions.device, visitors: countDistinct(analyticsSessions.visitorId) })
      .from(analyticsSessions)
      .where(gte(analyticsSessions.lastSeenAt, todaySince))
      .groupBy(analyticsSessions.device),
    database.select({ sessionId: analyticsSessions.sessionId, path: analyticsSessions.currentPath, device: analyticsSessions.device, lastSeenAt: analyticsSessions.lastSeenAt, utmSource: analyticsSessions.utmSource, utmCampaign: analyticsSessions.utmCampaign }).from(analyticsSessions).orderBy(desc(analyticsSessions.lastSeenAt)).limit(8),
  ]);

  const bucketValues = new Map(
    timelineRows.map((row) => [new Date(row.bucket).getTime(), Number(row.value)]),
  );
  const currentBucket = Math.floor(now.getTime() / 300_000) * 300_000;
  const timeline = Array.from({ length: 12 }, (_, index) => {
    const time = currentBucket - (11 - index) * 300_000;
    return {
      label: new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(time),
      value: bucketValues.get(time) ?? 0,
    };
  });

  const visitorsToday = Number(todayRows[0]?.visitors ?? 0);
  const pageViewsToday = Number(todayRows[0]?.views ?? 0);
  const sessionsToday = Number(sessionRows[0]?.value ?? 0);

  return {
    liveVisitors: Number(liveRows[0]?.value ?? 0),
    visitorsToday,
    visitors7Days: Number(sevenDayRows[0]?.value ?? 0),
    visitors30Days: Number(thirtyDayRows[0]?.value ?? 0),
    pageViewsToday,
    pagesPerVisit: sessionsToday ? pageViewsToday / sessionsToday : 0,
    updatedAt: now.toISOString(),
    timeline,
    popularPages: popularRows.map((row) => ({ path: row.path, views: Number(row.views) })),
    devices: deviceRows.map((row) => ({ device: row.device, visitors: Number(row.visitors) })),
    recentVisitors: recentRows.map((row) => ({ ...row, lastSeenAt: row.lastSeenAt.toISOString() })),
  };
}
