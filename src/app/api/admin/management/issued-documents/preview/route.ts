import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { bookings, documentSequences, financialAccounts, issuedDocuments, managementSettings, paymentAllocations, payments, registrations } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";
import { formatDocumentNumber } from "@/lib/management/domain";
import { renderTransactionPdf, renderTransactionPng, type TransactionPdfSnapshot } from "@/lib/management/document-renderer";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = await request.json() as { kind?: string; bookingId?: string; paymentId?: string };
    const kind = body.kind === "receipt" ? "receipt" : body.kind === "invoice" ? "invoice" : null;
    if (!kind || !body.bookingId) return NextResponse.json({ error: "Jenis dokumen atau booking tidak valid." }, { status: 400 });

    const db = requireDatabase();
    const sequence = await db.query.documentSequences.findFirst({ where: and(eq(documentSequences.kind, kind), eq(documentSequences.active, true)) });
    if (!sequence) throw new Error(`Format nomor ${kind === "invoice" ? "invoice" : "kwitansi"} belum diaktifkan.`);
    const booking = await db.query.bookings.findFirst({ where: eq(bookings.id, body.bookingId) });
    if (!booking) throw new Error("Booking tidak ditemukan.");
    const linkedInvoice = kind === "receipt"
      ? await db.query.issuedDocuments.findFirst({ where: and(eq(issuedDocuments.kind, "invoice"), eq(issuedDocuments.bookingId, booking.id), eq(issuedDocuments.status, "issued")) })
      : undefined;
    if (kind === "receipt" && !linkedInvoice) throw new Error("Kwitansi wajib terhubung ke invoice yang sudah diterbitkan.");

    const registrationRows = await db.select().from(registrations).where(eq(registrations.bookingId, booking.id));
    const settings = await db.query.managementSettings.findFirst({ where: eq(managementSettings.id, "default") });
    const accountRows = await db.select().from(financialAccounts).where(and(eq(financialAccounts.showOnInvoice, true), eq(financialAccounts.status, "active")));
    const issuedAt = new Date();
    const formatted = formatDocumentNumber(sequence, issuedAt);
    let payment: typeof payments.$inferSelect | undefined;
    let total: number;
    let items: TransactionPdfSnapshot["items"];

    if (kind === "receipt") {
      if (!body.paymentId) throw new Error("Pilih pembayaran yang akan dibuatkan kwitansi.");
      payment = await db.query.payments.findFirst({ where: and(eq(payments.id, body.paymentId), eq(payments.bookingId, booking.id)) });
      if (!payment || payment.status !== "confirmed") throw new Error("Pembayaran belum terkonfirmasi.");
      const allocations = await db.select().from(paymentAllocations).where(eq(paymentAllocations.paymentId, payment.id));
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
      company: {
        name: settings?.companyName ?? "Jam Wisata",
        address: settings?.companyAddress ?? "",
        phone: settings?.companyPhone ?? "",
        email: settings?.companyEmail ?? "",
        signerName: settings?.financeSignerName ?? "",
        signerTitle: settings?.financeSignerTitle ?? "Keuangan",
      },
    };
    const wantsPng = request.headers.get("accept")?.includes("image/png");
    const document = wantsPng ? await renderTransactionPng(snapshot) : await renderTransactionPdf(snapshot);
    return new Response(new Uint8Array(document), {
      headers: {
        "content-type": wantsPng ? "image/png" : "application/pdf",
        "content-disposition": `inline; filename="preview-${kind}.${wantsPng ? "png" : "pdf"}"`,
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("Document preview failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Preview PDF gagal dibuat." }, { status: 500 });
  }
}
