import "server-only";

import { and, eq, inArray, isNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import type * as schema from "@/db/schema";
import { bookings, issuedDocuments, payments, refunds } from "@/db/schema";
import type { TransactionPdfSnapshot } from "./document-renderer";
import { resolveInvoiceAmount } from "./invoice";
import { installmentLineDescription, invoiceOutstanding, netPaidForInvoiceIds } from "./invoice-ledger";

type Executor = Pick<NodePgDatabase<typeof schema>, "select" | "query">;
type Booking = typeof bookings.$inferSelect;
type IssuedDocument = typeof issuedDocuments.$inferSelect;

/**
 * Resolve a termin/pelunasan invoice derived from a parent invoice. The parent
 * keeps the full billed amount; children only split the outstanding balance so
 * reports never count the package price twice. Only one unpaid child may be
 * open at a time.
 */
export async function resolveSettlementInvoice(executor: Executor, booking: Booking, parentInvoiceId: string, invoiceAmount: unknown): Promise<
  | { openSettlement: IssuedDocument }
  | { openSettlement?: undefined; parentInvoice: IssuedDocument; total: number; installmentNumber: number; items: TransactionPdfSnapshot["items"] }
> {
  const parentInvoice = await executor.query.issuedDocuments.findFirst({
    where: and(
      eq(issuedDocuments.id, parentInvoiceId),
      eq(issuedDocuments.kind, "invoice"),
      eq(issuedDocuments.bookingId, booking.id),
      eq(issuedDocuments.status, "issued"),
      isNull(issuedDocuments.parentInvoiceId),
    ),
  });
  if (!parentInvoice) throw new Error("Invoice awal tidak ditemukan atau bukan invoice utama yang aktif.");
  const children = await executor.select().from(issuedDocuments).where(and(
    eq(issuedDocuments.parentInvoiceId, parentInvoice.id),
    eq(issuedDocuments.kind, "invoice"),
    eq(issuedDocuments.status, "issued"),
  ));
  const invoiceIds = [parentInvoice.id, ...children.map((document) => document.id)];
  const invoicePayments = await executor.select().from(payments).where(and(inArray(payments.invoiceId, invoiceIds), eq(payments.status, "confirmed")));
  const paymentIds = invoicePayments.map((item) => item.id);
  const invoiceRefunds = paymentIds.length
    ? await executor.select().from(refunds).where(and(inArray(refunds.paymentId, paymentIds), eq(refunds.status, "confirmed")))
    : [];
  const openSettlement = children.find((child) => invoiceOutstanding(Number(child.snapshot.total ?? 0), netPaidForInvoiceIds([child.id], invoicePayments, invoiceRefunds)) > 0);
  if (openSettlement) return { openSettlement };

  const remaining = invoiceOutstanding(Number(parentInvoice.snapshot.total ?? 0), netPaidForInvoiceIds(invoiceIds, invoicePayments, invoiceRefunds));
  if (remaining <= 0) throw new Error("Invoice ini sudah lunas dan tidak memerlukan invoice termin.");
  const total = invoiceAmount === undefined || invoiceAmount === null ? remaining : resolveInvoiceAmount(invoiceAmount, remaining);
  const installmentNumber = children.length + 1;
  const suffix = String(booking.packageSnapshot.dateLabel ?? booking.packageSnapshot.departureDate ?? "");
  const description = installmentLineDescription({ packageName: String(booking.packageSnapshot.name ?? "Paket umroh"), departureLabel: suffix, amount: total, remaining, installmentNumber });
  return { parentInvoice, total, installmentNumber, items: [{ description, qty: 1, unitPrice: total, total }] };
}
