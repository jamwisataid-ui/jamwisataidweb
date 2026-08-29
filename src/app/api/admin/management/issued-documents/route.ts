import { NextResponse } from "next/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { auditLogs, bookings, documentSequences, financialAccounts, issuedDocuments, managementSettings, paymentAllocations, payments, pilgrims, registrations } from "@/db/schema";
import { withManagementTransaction } from "@/db/transaction";
import { requireAdminSession } from "@/lib/admin-session";
import { formatDocumentNumber } from "@/lib/management/domain";
import { renderTransactionPdf, type TransactionPdfSnapshot } from "@/lib/management/pdf";
import { privateObjectKey, putPrivateObject } from "@/lib/management/storage";

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    const body = await request.json() as { kind?: string; bookingId?: string; paymentId?: string };
    const kind = body.kind === "receipt" ? "receipt" : body.kind === "invoice" ? "invoice" : null;
    if (!kind || !body.bookingId) return NextResponse.json({ error: "Jenis dokumen atau booking tidak valid." }, { status: 400 });
    const result = await withManagementTransaction(async (tx) => {
      await tx.execute(sql`select id from document_sequences where kind = ${kind} and active = true for update`);
      const sequence = await tx.query.documentSequences.findFirst({ where: and(eq(documentSequences.kind, kind), eq(documentSequences.active, true)) });
      if (!sequence) throw new Error(`Format nomor ${kind === "invoice" ? "invoice" : "kwitansi"} belum diaktifkan.`);
      const booking = await tx.query.bookings.findFirst({ where: eq(bookings.id, body.bookingId!) });
      if (!booking) throw new Error("Booking tidak ditemukan.");
      const registrationRows = await tx.select().from(registrations).where(eq(registrations.bookingId, booking.id));
      const pilgrimRows = registrationRows.length ? await tx.select().from(pilgrims).where(inArray(pilgrims.id, registrationRows.map((item) => item.pilgrimId))) : [];
      const settings = await tx.query.managementSettings.findFirst({ where: eq(managementSettings.id, "default") });
      const accountRows = await tx.select().from(financialAccounts).where(and(eq(financialAccounts.showOnInvoice, true), eq(financialAccounts.status, "active")));
      const issuedAt = new Date();
      const formatted = formatDocumentNumber(sequence, issuedAt);
      let payment: typeof payments.$inferSelect | undefined;
      let total: number;
      let items: TransactionPdfSnapshot["items"];
      if (kind === "receipt") {
        if (!body.paymentId) throw new Error("Kwitansi wajib terhubung ke pembayaran.");
        payment = await tx.query.payments.findFirst({ where: and(eq(payments.id, body.paymentId), eq(payments.bookingId, booking.id)) });
        if (!payment || payment.status !== "confirmed") throw new Error("Pembayaran belum terkonfirmasi.");
        const allocations = await tx.select().from(paymentAllocations).where(eq(paymentAllocations.paymentId, payment.id));
        items = allocations.map((allocation) => {
          const registration = registrationRows.find((row) => row.id === allocation.registrationId);
          return { description: `Pembayaran ${String(booking.packageSnapshot.name ?? "paket umroh")} — ${pilgrimRows.find((p) => p.id === registration?.pilgrimId)?.fullName ?? "Jamaah"}`, qty: 1, unitPrice: allocation.amount, total: allocation.amount };
        });
        total = payment.amount;
      } else {
        const grouped = new Map<number, number>();
        for (const registration of registrationRows) grouped.set(registration.agreedPrice, (grouped.get(registration.agreedPrice) ?? 0) + 1);
        items = Array.from(grouped, ([unitPrice, qty]) => ({ description: `${String(booking.packageSnapshot.name ?? "Paket umroh")} — ${String(booking.packageSnapshot.dateLabel ?? booking.packageSnapshot.departureDate ?? "")}`, qty, unitPrice, total: qty * unitPrice }));
        total = items.reduce((sum, item) => sum + item.total, 0);
      }
      const snapshot: TransactionPdfSnapshot = {
        kind, number: formatted.number, issuedAt: issuedAt.toISOString(),
        customer: { name: booking.payerName, whatsapp: booking.payerWhatsapp, email: booking.payerEmail },
        items, total, method: payment?.method, reference: payment?.reference,
        accounts: accountRows.map(({ bankName, accountNumber, accountHolder }) => ({ bankName, accountNumber, accountHolder })),
        company: { name: settings?.companyName ?? "Jam Wisata", address: settings?.companyAddress ?? "", phone: settings?.companyPhone ?? "", email: settings?.companyEmail ?? "", signerName: settings?.financeSignerName ?? "", signerTitle: settings?.financeSignerTitle ?? "Keuangan" },
      };
      const id = randomUUID();
      const objectKey = privateObjectKey("documents", id, "pdf");
      const pdf = await renderTransactionPdf(snapshot);
      await putPrivateObject(objectKey, new Uint8Array(pdf), "application/pdf");
      await tx.insert(issuedDocuments).values({ id, kind, number: formatted.number, bookingId: booking.id, paymentId: payment?.id ?? null, sequenceId: sequence.id, snapshot, objectKey, issuedAt, createdBy: session.user.id });
      await tx.update(documentSequences).set({ nextNumber: formatted.nextNumber, currentPeriod: formatted.period, updatedAt: new Date() }).where(eq(documentSequences.id, sequence.id));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "issue", entityType: kind, entityId: id, summary: `${kind === "invoice" ? "Invoice" : "Kwitansi"} ${formatted.number} diterbitkan` });
      return { id, number: formatted.number };
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Document issue failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "PDF gagal diterbitkan." }, { status: 500 });
  }
}
