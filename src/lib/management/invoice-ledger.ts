type PaymentRecord = { id: string; invoiceId: string | null; amount: number; status: string };
type RefundRecord = { paymentId: string; amount: number; status: string };

export function netPaidForInvoiceIds(invoiceIds: Iterable<string>, payments: PaymentRecord[], refunds: RefundRecord[]) {
  const ids = new Set(invoiceIds);
  const confirmedPayments = payments.filter((payment) => payment.invoiceId && ids.has(payment.invoiceId) && payment.status === "confirmed");
  const paymentIds = new Set(confirmedPayments.map((payment) => payment.id));
  const paid = confirmedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const refunded = refunds
    .filter((refund) => paymentIds.has(refund.paymentId) && refund.status === "confirmed")
    .reduce((sum, refund) => sum + refund.amount, 0);
  return Math.max(0, paid - refunded);
}

export function invoiceOutstanding(total: number, netPaid: number) {
  return Math.max(0, total - netPaid);
}

/** A child invoice that clears the whole remainder is a "Pelunasan"; anything smaller is a numbered termin. */
export function installmentLineDescription({ packageName, departureLabel, amount, remaining, installmentNumber }: { packageName: string; departureLabel?: string; amount: number; remaining: number; installmentNumber: number }) {
  const suffix = departureLabel ? ` — ${departureLabel}` : "";
  return amount >= remaining ? `Pelunasan ${packageName}${suffix}` : `Pembayaran termin ${installmentNumber} ${packageName}${suffix}`;
}

export function childInvoiceLabel(snapshot: unknown) {
  const items = (snapshot as { items?: Array<{ description?: unknown }> } | null | undefined)?.items;
  return String(items?.[0]?.description ?? "").startsWith("Pembayaran termin") ? "Invoice Termin" : "Invoice Pelunasan";
}
