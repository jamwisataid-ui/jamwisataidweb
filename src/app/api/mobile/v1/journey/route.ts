import { asc, desc, eq, inArray } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { accommodations, bookings, departures, itineraryDays, packages, registrations } from "@/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError } from "@/lib/mobile/api";

export async function GET(request: Request) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const database = requireDatabase();
    const rows = await database.select({ registration: registrations, booking: bookings, departure: departures, package: packages })
      .from(registrations)
      .innerJoin(bookings, eq(registrations.bookingId, bookings.id))
      .innerJoin(departures, eq(bookings.departureId, departures.id))
      .innerJoin(packages, eq(departures.packageId, packages.id))
      .where(eq(registrations.pilgrimId, pilgrim.id))
      .orderBy(desc(departures.departureDate));
    const packageIds = [...new Set(rows.map((row) => row.package.id))];
    const departureIds = [...new Set(rows.map((row) => row.departure.id))];
    const [days, hotels] = await Promise.all([
      packageIds.length ? database.select().from(itineraryDays).where(inArray(itineraryDays.packageId, packageIds)).orderBy(asc(itineraryDays.day)) : [],
      departureIds.length ? database.select().from(accommodations).where(inArray(accommodations.departureId, departureIds)).orderBy(asc(accommodations.sortOrder)) : [],
    ]);
    return mobileData(rows.map((row) => ({
      registrationId: row.registration.id,
      bookingNumber: row.booking.bookingNumber,
      status: row.registration.status,
      source: row.booking.source,
      package: { id: row.package.id, slug: row.package.slug, name: row.package.name, image: row.package.imageUrl, durationDays: row.package.durationDays },
      departure: row.departure,
      rooms: { makkah: row.registration.makkahRoomNumber, madinah: row.registration.madinahRoomNumber, type: row.registration.roomType },
      hotels: hotels.filter((hotel) => hotel.departureId === row.departure.id),
      itinerary: days.filter((day) => day.packageId === row.package.id),
    })));
  } catch (error) {
    return mobileError(error, "journey");
  }
}
