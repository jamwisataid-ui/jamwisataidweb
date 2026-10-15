import { and, asc, count, eq, inArray } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { bookings, departures, liveMuthowifSessions, packages, registrations } from "@/db/schema";
import { requireMuthowifSession } from "@/lib/mobile/auth";
import { mobileData, mobileError } from "@/lib/mobile/api";

export async function GET(request: Request) {
  try {
    const { user } = await requireMuthowifSession(request);
    const database = requireDatabase();
    const rows = await database.select({ session: liveMuthowifSessions, departure: departures, packageName: packages.name })
      .from(liveMuthowifSessions)
      .innerJoin(departures, eq(liveMuthowifSessions.departureId, departures.id))
      .innerJoin(packages, eq(departures.packageId, packages.id))
      .where(eq(liveMuthowifSessions.muthowifUserId, user.id))
      .orderBy(asc(liveMuthowifSessions.startsAt));
    const result = await Promise.all(rows.filter(({ session }) => session.status !== "cancelled").map(async ({ session, departure, packageName }) => {
      const [registered] = await database.select({ value: count() }).from(registrations)
        .innerJoin(bookings, eq(registrations.bookingId, bookings.id))
        .where(and(eq(bookings.departureId, departure.id), inArray(registrations.status, ["pending", "active"])));
      return {
        id: session.id,
        title: session.title,
        type: session.type,
        status: session.status,
        roomName: session.roomName,
        startsAt: session.startsAt.toISOString(),
        liveStartedAt: session.liveStartedAt?.toISOString() ?? null,
        liveEndedAt: session.liveEndedAt?.toISOString() ?? null,
        location: session.location,
        listenerCount: session.listenerCount,
        capacity: session.capacity || departure.capacity || 45,
        rombongan: { id: departure.id, name: `${packageName} · ${departure.dateLabel}`, totalJamaah: registered?.value ?? 0 },
        muthowifName: session.muthowifName,
      };
    }));
    return mobileData(result);
  } catch (error) {
    return mobileError(error, "muthowif-sessions");
  }
}
