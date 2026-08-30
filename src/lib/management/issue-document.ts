import "server-only";

import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";

import { auditLogs, bookings, documentSequences, financialAccounts, issuedDocuments, managementSettings, paymentAllocations, payments, registrations } from "@/db/schema";
import { withManagementTransaction } from "@/db/transaction";
import { formatDocumentNumber } from "./domain";
import { renderTransactionPdf, type TransactionPdfSnapshot } from "./pdf";
import { privateObjectKey, putPrivateObject } from "./storage";

export async function issueTransactionDocument({ kind, bookingId, paymentId, actorId }: {
  kind: "invoice" | "receipt";
  bookingId: string;
  paymentId?: string;
  actorId: string;
}) {
  return withManagementTransaction(async (tx) => {
    if (kind === "receipt" && !paymentId) throw new Error("Kwitansi wajib terhubung ke pembayaran.");
    await tx.execute(sql`select id from document_sequences where kind = ${kind} and active = true for update`);
    if (kind === "receipt") {
      const existing = await tx.query.issuedDocuments.findFirst({ where: and(eq(issuedDocuments.kind, "receipt"), eq(issuedDocuments.paymentId, paymentId!), eq(issuedDocuments.status, "issued")) });
      if (existing) return { id: existing.id, number: existing.number, existing: true };
    }
    const sequence = await tx.query.documentSequences.findFirst({ where: and(eq(documentSequences.kind, kind), eq(documentSequences.active, true)) });
    if (!sequence) throw new Error(`Format nomor ${kind === "invoice" ? "invoice" : "kwitansi"} belum diaktifkan.`);
    const booking = await tx.query.bookings.findFirst({ where: eq(bookings.id, bookingId) });
    if (!booking) throw new Error("Booking tidak ditemukan.");
    const linkedInvoice = kind === "receipt"
      ? await tx.query.issuedDocuments.findFirst({ where: and(eq(issuedDocuments.kind, "invoice"), eq(issuedDocuments.bookingId, booking.id), eq(issuedDocuments.status, "issued")) })
      : undefined;
    if (kind === "receipt" && !linkedInvoice) throw new Error("Kwitansi wajib terhubung ke invoice yang sudah diterbitkan.");
    const registrationRows = await tx.select().from(registrations).where(eq(registrations.bookingId, booking.id));
    const settings = await tx.query.managementSettings.findFirst({ where: eq(managementSettings.id, "default") });
    const accountRows = await tx.select().from(financialAccounts).where(and(eq(financialAccounts.showOnInvoice, true), eq(financialAccounts.status, "active")));
    const issuedAt = new Date();
    const formatted = formatDocumentNumber(sequence, issuedAt);
    let payment: typeof payments.$inferSelect | undefined;
    let total: number;
    let items: TransactionPdfSnapshot["items"];

    if (kind === "receipt") {
      payment = await tx.query.payments.findFirst({ where: and(eq(payments.id, paymentId!), eq(payments.bookingId, booking.id)) });
      if (!payment || payment.status !== "confirmed") throw new Error("Pembayaran belum terkonfirmasi.");
      const allocations = await tx.select().from(paymentAllocations).where(eq(paymentAllocations.paymentId, payment.id));
      const equalAllocations = allocations.length > 0 && allocations.every((allocation) => allocation.amount === allocations[0].amount);
      const qty = equalAllocations ? allocations.length : 1;
      items = [{ description: `Pembayaran ${String(booking.packageSnapshot.name ?? "paket umroh")}${allocations.length ? ` untuk ${allocations.length} jamaah` : ""}`, qty, unitPrice: equalAllocations ? allocations[0].amount : payment.amount, total: payment.amount }];
      total = payment.amount;
    } else {
      const grouped = new Map<number, number>();
      for (const registration of registrationRows) grouped.set(registration.agreedPrice, (grouped.get(registration.agreedPrice) ?? 0) + 1);
      items = Array.from(grouped, ([unitPrice, qty]) => ({ description: `${String(booking.packageSnapshot.name ?? "Paket umroh")} — ${String(booking.packageSnapshot.dateLabel ?? booking.packageSnapshot.departureDate ?? "")}`, qty, unitPrice, total: qty * unitPrice }));
      total = items.reduce((sum, item) => sum + item.total, 0);
    }

    const snapshot: TransactionPdfSnapshot = {
      kind,
      number: formatted.number,
      issuedAt: issuedAt.toISOString(),
      customer: { name: booking.payerName, whatsapp: booking.payerWhatsapp, email: booking.payerEmail },
      items,
      total,
      method: payment?.method,
      reference: payment?.reference,
      invoiceNumber: linkedInvoice?.number,
      accounts: accountRows.map(({ bankName, accountNumber, accountHolder }) => ({ bankName, accountNumber, accountHolder })),
      company: { name: settings?.companyName ?? "Jam Wisata", address: settings?.companyAddress ?? "", phone: settings?.companyPhone ?? "", email: settings?.companyEmail ?? "", signerName: settings?.financeSignerName ?? "", signerTitle: settings?.financeSignerTitle ?? "Keuangan" },
    };
    const id = randomUUID();
    const objectKey = privateObjectKey("documents", id, "pdf");
    const pdf = await renderTransactionPdf(snapshot);
    await putPrivateObject(objectKey, new Uint8Array(pdf), "application/pdf");
    await tx.insert(issuedDocuments).values({ id, kind, number: formatted.number, bookingId: booking.id, paymentId: payment?.id ?? null, sequenceId: sequence.id, snapshot, objectKey, issuedAt, createdBy: actorId });
    await tx.update(documentSequences).set({ nextNumber: formatted.nextNumber, currentPeriod: formatted.period, updatedAt: new Date() }).where(eq(documentSequences.id, sequence.id));
    await tx.insert(auditLogs).values({ actorId, action: "issue", entityType: kind, entityId: id, summary: `${kind === "invoice" ? "Invoice" : "Kwitansi"} ${formatted.number} diterbitkan` });
    return { id, number: formatted.number, existing: false };
  });
}
