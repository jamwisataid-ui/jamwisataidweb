import type { TransactionPdfSnapshot } from "./document-renderer";

type InvoiceRegistration = {
  agreedPrice: number;
  dpTarget: number;
};

export function invoiceTotals(registrations: InvoiceRegistration[]) {
  return registrations.reduce((totals, registration) => ({
    totalPrice: totals.totalPrice + registration.agreedPrice,
    totalDp: totals.totalDp + Math.min(registration.dpTarget, registration.agreedPrice),
  }), { totalPrice: 0, totalDp: 0 });
}

export function resolveInvoiceAmount(value: unknown, maximum: number) {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error("Nominal invoice wajib diisi lebih dari Rp0.");
  }
  if (amount > maximum) {
    throw new Error("Nominal invoice tidak boleh melebihi total harga pendaftaran.");
  }
  return amount;
}

export function buildInvoiceItems({
  registrations,
  invoiceAmount,
  packageName,
  departureLabel,
}: {
  registrations: InvoiceRegistration[];
  invoiceAmount: number;
  packageName: string;
  departureLabel: string;
}): TransactionPdfSnapshot["items"] {
  const { totalPrice, totalDp } = invoiceTotals(registrations);
  const amount = resolveInvoiceAmount(invoiceAmount, totalPrice);
  const suffix = departureLabel ? ` — ${departureLabel}` : "";

  if (amount === totalPrice) {
    const grouped = new Map<number, number>();
    for (const registration of registrations) {
      grouped.set(registration.agreedPrice, (grouped.get(registration.agreedPrice) ?? 0) + 1);
    }
    return Array.from(grouped, ([unitPrice, qty]) => ({
      description: `${packageName}${suffix}`,
      qty,
      unitPrice,
      total: qty * unitPrice,
    }));
  }

  const equalDp = registrations.length > 0 && registrations.every((registration) => Math.min(registration.dpTarget, registration.agreedPrice) === Math.min(registrations[0].dpTarget, registrations[0].agreedPrice));
  if (amount === totalDp && equalDp) {
    const unitPrice = Math.min(registrations[0].dpTarget, registrations[0].agreedPrice);
    return [{ description: `Tagihan DP ${packageName}${suffix}`, qty: registrations.length, unitPrice, total: amount }];
  }

  return [{ description: `Tagihan ${packageName}${suffix}`, qty: 1, unitPrice: amount, total: amount }];
}
