import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { requireDatabase } from "@/db";
import { bookings, departures, managementSettings, mobileNotifications, packages, registrations } from "@/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError, zodFieldErrors } from "@/lib/mobile/api";

const registrationSchema = z.object({
  departureId: z.uuid("Keberangkatan tidak valid."),
  roomType: z.enum(["quad", "triple", "double"]).optional(),
  note: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const parsed = registrationSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new MobileApiError(400, "VALIDATION_ERROR", "Periksa pilihan pendaftaran.", zodFieldErrors(parsed.error));
    const database = requireDatabase();
    const [selected] = await database.select({ departure: departures, package: packages }).from(departures).innerJoin(packages, eq(departures.packageId, packages.id)).where(and(eq(departures.id, parsed.data.departureId), eq(packages.status, "published"))).limit(1);
    const todayJakarta = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    if (!selected || selected.departure.departureDate < todayJakarta || !["open", "limited"].includes(selected.departure.status)) throw new MobileApiError(400, "DEPARTURE_UNAVAILABLE", "Keberangkatan ini belum tersedia untuk pendaftaran.");
    const existingRegistrations = await database.select({ registration: registrations, booking: bookings }).from(registrations).innerJoin(bookings, eq(registrations.bookingId, bookings.id)).where(and(eq(registrations.pilgrimId, pilgrim.id), eq(bookings.departureId, selected.departure.id), inArray(registrations.status, ["pending", "active"])));
    if (existingRegistrations.length) throw new MobileApiError(409, "REGISTRATION_EXISTS", "Anda sudah memiliki pendaftaran untuk keberangkatan ini.");
    const settings = await database.query.managementSettings.findFirst({ where: eq(managementSettings.id, "default") });
    const bookingId = randomUUID();
    const registrationId = randomUUID();
    const bookingNumber = `APP-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${bookingId.slice(0, 6).toUpperCase()}`;
    const price = Number(selected.departure.price);
    await database.transaction(async (tx) => {
      await tx.insert(bookings).values({
        id: bookingId,
        bookingNumber,
        departureId: selected.departure.id,
        payerName: pilgrim.fullName,
        payerWhatsapp: pilgrim.whatsapp,
        payerEmail: pilgrim.email,
        packageSnapshot: { id: selected.package.id, slug: selected.package.slug, name: selected.package.name, departureDate: selected.departure.departureDate, price, currency: selected.package.currency },
        status: "pending",
        source: "mobile",
        reviewNote: parsed.data.note,
      });
      await tx.insert(registrations).values({ id: registrationId, bookingId, pilgrimId: pilgrim.id, agreedPrice: price, dpTarget: Math.min(price, settings?.defaultDpAmount ?? 5_000_000), roomType: parsed.data.roomType, status: "pending" });
      await tx.insert(mobileNotifications).values({ pilgrimId: pilgrim.id, title: "Pendaftaran diterima", body: `Permintaan pendaftaran ${selected.package.name} sudah diterima dan menunggu konfirmasi admin.`, kind: "registration", deepLink: "/journey" });
    });
    return mobileData({ bookingId, registrationId, bookingNumber, status: "pending" }, { status: 201 });
  } catch (error) {
    return mobileError(error, "registration-create");
  }
}
