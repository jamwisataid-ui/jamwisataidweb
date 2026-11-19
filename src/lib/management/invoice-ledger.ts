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
