import { desc, eq, inArray } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { bookings, paymentAllocations, payments, refunds, registrations } from "@/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError } from "@/lib/mobile/api";

export async function GET(request: Request) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const database = requireDatabase();
    const registrationRows = await database.select().from(registrations).where(eq(registrations.pilgrimId, pilgrim.id));
    const registrationIds = registrationRows.map((row) => row.id);
    if (!registrationIds.length) return mobileData({ summary: { billed: 0, paid: 0, refunded: 0, outstanding: 0 }, bills: [], transactions: [] });
    const allocations = await database.select().from(paymentAllocations).where(inArray(paymentAllocations.registrationId, registrationIds));
    const paymentIds = [...new Set(allocations.map((row) => row.paymentId))];
    const [paymentRows, refundRows, bookingRows] = await Promise.all([
      paymentIds.length ? database.select().from(payments).where(inArray(payments.id, paymentIds)).orderBy(desc(payments.paidAt)) : [],
      database.select().from(refunds).where(inArray(refunds.registrationId, registrationIds)).orderBy(desc(refunds.refundedAt)),
      database.select().from(bookings).where(inArray(bookings.id, registrationRows.map((row) => row.bookingId))),
    ]);
    const confirmedIds = new Set(paymentRows.filter((row) => row.status === "confirmed").map((row) => row.id));
    const billed = registrationRows.filter((row) => row.status !== "cancelled").reduce((sum, row) => sum + row.agreedPrice - row.discountAmount, 0);
    const paid = allocations.filter((row) => confirmedIds.has(row.paymentId)).reduce((sum, row) => sum + row.amount, 0);
    const refunded = refundRows.filter((row) => row.status === "confirmed").reduce((sum, row) => sum + row.amount, 0);
    const bills = registrationRows
      .filter((registration) => registration.status !== "cancelled")
      .map((registration) => {
        const booking = bookingRows.find((row) => row.id === registration.bookingId);
        const registrationAllocations = allocations.filter((row) => row.registrationId === registration.id);
        const registrationPaid = registrationAllocations
          .filter((row) => confirmedIds.has(row.paymentId))
          .reduce((sum, row) => sum + row.amount, 0);
        const registrationRefunded = refundRows
          .filter((row) => row.registrationId === registration.id && row.status === "confirmed")
          .reduce((sum, row) => sum + row.amount, 0);
        const total = Math.max(0, registration.agreedPrice - registration.discountAmount);
        const netPaid = Math.max(0, registrationPaid - registrationRefunded);
        const outstanding = Math.max(0, total - netPaid);
        const snapshot = booking?.packageSnapshot as { name?: unknown } | undefined;
        return {
          registrationId: registration.id,
          bookingNumber: booking?.bookingNumber ?? "Pendaftaran",
          packageName: typeof snapshot?.name === "string" ? snapshot.name : "Paket Umroh",
          total,
          paid: netPaid,
          outstanding,
          status: outstanding === 0 ? "paid" : netPaid > 0 ? "partial" : "unpaid",
          selectedMethod: booking?.preferredPaymentMethod ?? null,
        };
      });
    return mobileData({ summary: { billed, paid, refunded, outstanding: Math.max(0, billed - paid + refunded) }, bills, transactions: paymentRows.map((payment) => ({ ...payment, allocatedAmount: allocations.filter((row) => row.paymentId === payment.id).reduce((sum, row) => sum + row.amount, 0), bookingNumber: bookingRows.find((row) => row.id === payment.bookingId)?.bookingNumber })) });
  } catch (error) {
    return mobileError(error, "payments");
  }
}
