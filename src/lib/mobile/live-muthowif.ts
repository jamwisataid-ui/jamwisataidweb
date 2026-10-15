import { and, eq, inArray } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { bookings, departures, liveMuthowifSessions, packages, registrations } from "@/db/schema";
import { MobileApiError } from "./api";

const ELIGIBLE_REGISTRATION_STATUSES = ["pending", "active"] as const;

export async function findAuthorizedLiveSession(pilgrimId: string, sessionId: string) {
  const database = requireDatabase();
  const [row] = await database
    .select({ session: liveMuthowifSessions, packageName: packages.name })
    .from(liveMuthowifSessions)
    .innerJoin(bookings, eq(liveMuthowifSessions.departureId, bookings.departureId))
    .innerJoin(registrations, eq(bookings.id, registrations.bookingId))
    .innerJoin(departures, eq(bookings.departureId, departures.id))
    .innerJoin(packages, eq(departures.packageId, packages.id))
    .where(and(
      eq(liveMuthowifSessions.id, sessionId),
      eq(registrations.pilgrimId, pilgrimId),
      inArray(registrations.status, [...ELIGIBLE_REGISTRATION_STATUSES]),
    ))
    .limit(1);

  if (!row) throw new MobileApiError(403, "LIVE_SESSION_FORBIDDEN", "Sesi ini tidak tersedia untuk rombongan Anda.");
  return row;
}

export const eligibleLiveRegistrationStatuses = [...ELIGIBLE_REGISTRATION_STATUSES];
