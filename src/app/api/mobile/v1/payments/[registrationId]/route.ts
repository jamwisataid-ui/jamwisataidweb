import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { requireDatabase } from "@/db";
import { bookings, departures, financialAccounts, managementSettings, packages, paymentAllocations, payments, refunds, registrations } from "@/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError, zodFieldErrors } from "@/lib/mobile/api";

const preferenceSchema = z.object({ method: z.enum(["bank_transfer", "virtual_account", "card", "ewallet"]) });

async function contextFor(registrationId: string, pilgrimId: string) {
  const database = requireDatabase();
  const [context] = await database.select({ registration: registrations, booking: bookings, departure: departures, package: packages })
    .from(registrations)
    .innerJoin(bookings, eq(registrations.bookingId, bookings.id))
    .innerJoin(departures, eq(bookings.departureId, departures.id))
    .innerJoin(packages, eq(departures.packageId, packages.id))
    .where(and(eq(registrations.id, registrationId), eq(registrations.pilgrimId, pilgrimId)))
    .limit(1);
  if (!context) throw new MobileApiError(404, "REGISTRATION_NOT_FOUND", "Pendaftaran tidak ditemukan.");
  return context;
}

async function paymentDetail(registrationId: string, pilgrimId: string) {
  const database = requireDatabase();
  const context = await contextFor(registrationId, pilgrimId);
  const allocations = await database.select().from(paymentAllocations).where(eq(paymentAllocations.registrationId, registrationId));
  const paymentIds = allocations.map((row) => row.paymentId);
  const [paymentRows, refundRows, bankAccounts, settings] = await Promise.all([
    paymentIds.length ? database.select().from(payments).where(inArray(payments.id, paymentIds)) : [],
    database.select().from(refunds).where(eq(refunds.registrationId, registrationId)),
    database.select({ id: financialAccounts.id, name: financialAccounts.name, bankName: financialAccounts.bankName, accountNumber: financialAccounts.accountNumber, accountHolder: financialAccounts.accountHolder }).from(financialAccounts).where(and(eq(financialAccounts.status, "active"), eq(financialAccounts.showOnInvoice, true))),
    database.query.managementSettings.findFirst({ where: eq(managementSettings.id, "default") }),
  ]);
  const confirmedIds = new Set(paymentRows.filter((row) => row.status === "confirmed").map((row) => row.id));
  const paid = allocations.filter((row) => confirmedIds.has(row.paymentId)).reduce((sum, row) => sum + row.amount, 0);
  const refunded = refundRows.filter((row) => row.status === "confirmed").reduce((sum, row) => sum + row.amount, 0);
  const total = Math.max(0, context.registration.agreedPrice - context.registration.discountAmount);
  const netPaid = Math.max(0, paid - refunded);
  const outstanding = Math.max(0, total - netPaid);
  const status = outstanding === 0 ? "paid" : netPaid > 0 ? "partial" : "unpaid";
  const methods = [
    { id: "bank_transfer", name: "Transfer Bank", type: "bank_transfer", enabled: bankAccounts.length > 0 },
    { id: "virtual_account", name: "Virtual Account", type: "virtual_account", enabled: false, description: "Belum tersedia" },
    { id: "card", name: "Kartu Kredit / Debit", type: "card", enabled: false, description: "Belum tersedia" },
    { id: "ewallet", name: "E-Wallet", type: "ewallet", enabled: false, description: "DANA, OVO, GoPay, ShopeePay · belum tersedia" },
  ];
  return {
    registrationId,
    bookingNumber: context.booking.bookingNumber,
    packageName: context.package.name,
    total,
    paid: netPaid,
    outstanding,
    status,
    selectedMethod: context.booking.preferredPaymentMethod,
    methods,
    bankAccounts,
    paymentContactWhatsapp: settings?.companyPhone || "6281809627499",
  };
}

export async function GET(request: Request, { params }: { params: Promise<{ registrationId: string }> }) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const { registrationId } = await params;
    return mobileData(await paymentDetail(registrationId, pilgrim.id));
  } catch (error) { return mobileError(error, "payment-detail"); }
}

export async function POST(request: Request, { params }: { params: Promise<{ registrationId: string }> }) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const { registrationId } = await params;
    const parsed = preferenceSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new MobileApiError(400, "VALIDATION_ERROR", "Pilih metode pembayaran.", zodFieldErrors(parsed.error));
    const context = await contextFor(registrationId, pilgrim.id);
    if (parsed.data.method !== "bank_transfer") throw new MobileApiError(400, "METHOD_UNAVAILABLE", "Metode pembayaran ini belum tersedia.");
    const accounts = await requireDatabase().select({ id: financialAccounts.id }).from(financialAccounts).where(and(eq(financialAccounts.status, "active"), eq(financialAccounts.showOnInvoice, true))).limit(1);
    if (!accounts.length) throw new MobileApiError(400, "METHOD_UNAVAILABLE", "Rekening transfer belum tersedia. Silakan hubungi admin Jam Wisata.");
    await requireDatabase().update(bookings).set({ preferredPaymentMethod: parsed.data.method, updatedAt: new Date() }).where(eq(bookings.id, context.booking.id));
    return mobileData(await paymentDetail(registrationId, pilgrim.id));
  } catch (error) { return mobileError(error, "payment-preference"); }
}
