import { and, asc, eq, inArray } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { bookings, departures, liveMuthowifSessions, packages, registrations } from "@/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError } from "@/lib/mobile/api";
import { eligibleLiveRegistrationStatuses } from "@/lib/mobile/live-muthowif";

export async function GET(request: Request) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const database = requireDatabase();
    const registrationsForPilgrim = await database
      .select({ departureId: bookings.departureId })
      .from(registrations)
      .innerJoin(bookings, eq(registrations.bookingId, bookings.id))
      .where(and(
        eq(registrations.pilgrimId, pilgrim.id),
        inArray(registrations.status, eligibleLiveRegistrationStatuses),
      ));

    const departureIds = [...new Set(registrationsForPilgrim
      .filter((row) => row.departureId)
      .map((row) => row.departureId as string))];

    if (!departureIds.length) return mobileData([]);

    const rows = await database
      .select({ session: liveMuthowifSessions, packageName: packages.name })
      .from(liveMuthowifSessions)
      .innerJoin(departures, eq(liveMuthowifSessions.departureId, departures.id))
      .innerJoin(packages, eq(departures.packageId, packages.id))
      .where(inArray(liveMuthowifSessions.departureId, departureIds))
      .orderBy(asc(liveMuthowifSessions.startsAt));

    const unique = new Map(rows.map((row) => [row.session.id, row]));
    return mobileData([...unique.values()]
      .filter(({ session }) => session.status !== "cancelled")
      .map(({ session, packageName }) => ({
        id: session.id,
        title: session.title,
        type: session.type,
        status: session.status,
        muthowif: { name: session.muthowifName, avatar: session.muthowifAvatarUrl },
        rombonganName: packageName,
        startsAt: session.startsAt.toISOString(),
        endsAt: session.endsAt?.toISOString() ?? null,
        location: session.location,
        image: session.imageUrl,
        listenerCount: session.listenerCount,
        capacity: session.capacity,
        canJoin: session.status === "live" && session.listenerCount < session.capacity,
      })));
  } catch (error) {
    return mobileError(error, "live-muthowif-list");
  }
}
