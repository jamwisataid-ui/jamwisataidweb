import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireDatabase } from "@/db";
import { bookings, mobileNotifications, registrations } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";

const reviewSchema = z.object({ decision: z.enum(["approve", "reject"]), note: z.string().trim().max(500).optional() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  const parsed = reviewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Keputusan review tidak valid." }, { status: 400 });
  const { id } = await params;
  const database = requireDatabase();
  const booking = await database.query.bookings.findFirst({ where: eq(bookings.id, id) });
  if (!booking || booking.status !== "pending") return NextResponse.json({ error: "Pendaftaran pending tidak ditemukan." }, { status: 404 });
  const registrationRows = await database.select().from(registrations).where(eq(registrations.bookingId, id));
  const nextStatus = parsed.data.decision === "approve" ? "active" : "cancelled";
  await database.transaction(async (tx) => {
    await tx.update(bookings).set({ status: nextStatus, reviewedBy: session.user.id, reviewedAt: new Date(), reviewNote: parsed.data.note, cancellationReason: nextStatus === "cancelled" ? parsed.data.note || "Pendaftaran mobile ditolak." : null, updatedAt: new Date() }).where(eq(bookings.id, id));
    await tx.update(registrations).set({ status: nextStatus, updatedAt: new Date() }).where(eq(registrations.bookingId, id));
    for (const registration of registrationRows) await tx.insert(mobileNotifications).values({ pilgrimId: registration.pilgrimId, title: nextStatus === "active" ? "Pendaftaran dikonfirmasi" : "Pendaftaran belum dapat diproses", body: nextStatus === "active" ? `Pendaftaran ${booking.bookingNumber} sudah dikonfirmasi.` : parsed.data.note || "Silakan hubungi admin Jam Wisata untuk informasi lebih lanjut.", kind: "registration", deepLink: "/journey", createdBy: session.user.id });
  });
  return NextResponse.json({ ok: true, status: nextStatus });
}
