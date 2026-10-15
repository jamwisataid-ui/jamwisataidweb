import { and, desc, eq, ne } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { bookings, departures, pilgrims, registrations } from "@/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError, zodFieldErrors } from "@/lib/mobile/api";
import { mobilePilgrimProfileSchema } from "@/lib/mobile/validation";

export async function GET(request: Request) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const database = requireDatabase();
    const [journey] = await database
      .select({
        bookingNumber: bookings.bookingNumber,
        status: registrations.status,
        departureDate: departures.departureDate,
        departureLabel: departures.dateLabel,
      })
      .from(registrations)
      .innerJoin(bookings, eq(registrations.bookingId, bookings.id))
      .innerJoin(departures, eq(bookings.departureId, departures.id))
      .where(eq(registrations.pilgrimId, pilgrim.id))
      .orderBy(desc(departures.departureDate), desc(registrations.createdAt))
      .limit(1);
    return mobileData({
      id: pilgrim.id,
      fullName: pilgrim.fullName,
      whatsapp: pilgrim.whatsapp,
      email: pilgrim.email,
      gender: pilgrim.gender,
      birthDate: pilgrim.birthDate,
      nationality: pilgrim.nationality,
      passportNumber: pilgrim.passportNumber,
      passportExpiry: pilgrim.passportExpiry,
      jamaahNumber: journey?.bookingNumber ?? null,
      journey: journey ? {
        departureDate: journey.departureDate,
        departureLabel: journey.departureLabel,
        status: journey.status,
      } : null,
    });
  } catch (error) {
    return mobileError(error, "me");
  }
}

export async function PATCH(request: Request) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const parsed = mobilePilgrimProfileSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new MobileApiError(400, "VALIDATION_ERROR", "Periksa data jamaah.", zodFieldErrors(parsed.error));
    const database = requireDatabase();
    const duplicate = await database.query.pilgrims.findFirst({ where: and(eq(pilgrims.whatsapp, parsed.data.whatsapp), ne(pilgrims.id, pilgrim.id)) });
    if (duplicate) throw new MobileApiError(409, "WHATSAPP_EXISTS", "Nomor WhatsApp sudah digunakan jamaah lain.", { whatsapp: ["Nomor WhatsApp sudah terdaftar."] });
    const [updated] = await database.update(pilgrims).set({
      ...parsed.data,
      email: parsed.data.email ?? null,
      gender: parsed.data.gender ?? null,
      birthDate: parsed.data.birthDate ?? null,
      passportNumber: parsed.data.passportNumber ?? null,
      passportExpiry: parsed.data.passportExpiry ?? null,
      notes: parsed.data.notes ?? null,
      updatedAt: new Date(),
    }).where(eq(pilgrims.id, pilgrim.id)).returning();
    return mobileData({
      id: updated.id,
      fullName: updated.fullName,
      whatsapp: updated.whatsapp,
      email: updated.email,
      gender: updated.gender,
      birthDate: updated.birthDate,
      nationality: updated.nationality,
      passportNumber: updated.passportNumber,
      passportExpiry: updated.passportExpiry,
    });
  } catch (error) {
    return mobileError(error, "me-update");
  }
}
