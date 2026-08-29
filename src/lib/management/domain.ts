export type PaymentDisplayStatus = "Belum Bayar" | "DP" | "Cicilan" | "Lunas" | "Refund";

export function paymentStatus(input: { agreedPrice: number; dpTarget: number; paid: number; refunded: number }) {
  const netPaid = Math.max(0, input.paid - input.refunded);
  const partialRefund = input.refunded > 0 && netPaid > 0;
  let status: PaymentDisplayStatus;
  if (input.refunded >= input.paid && input.paid > 0) status = "Refund";
  else if (netPaid <= 0) status = "Belum Bayar";
  else if (netPaid >= input.agreedPrice) status = "Lunas";
  else if (netPaid < input.dpTarget) status = "DP";
  else status = "Cicilan";
  return { status, netPaid, outstanding: Math.max(0, input.agreedPrice - netPaid), partialRefund };
}

export function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

const NUMBER_WORDS = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];

function spellNumber(value: number): string {
  if (value < 12) return NUMBER_WORDS[value] ?? "";
  if (value < 20) return `${spellNumber(value - 10)} belas`;
  if (value < 100) return `${spellNumber(Math.floor(value / 10))} puluh ${spellNumber(value % 10)}`;
  if (value < 200) return `seratus ${spellNumber(value - 100)}`;
  if (value < 1_000) return `${spellNumber(Math.floor(value / 100))} ratus ${spellNumber(value % 100)}`;
  if (value < 2_000) return `seribu ${spellNumber(value - 1_000)}`;
  if (value < 1_000_000) return `${spellNumber(Math.floor(value / 1_000))} ribu ${spellNumber(value % 1_000)}`;
  if (value < 1_000_000_000) return `${spellNumber(Math.floor(value / 1_000_000))} juta ${spellNumber(value % 1_000_000)}`;
  if (value < 1_000_000_000_000) return `${spellNumber(Math.floor(value / 1_000_000_000))} miliar ${spellNumber(value % 1_000_000_000)}`;
  return `${spellNumber(Math.floor(value / 1_000_000_000_000))} triliun ${spellNumber(value % 1_000_000_000_000)}`;
}

export function terbilang(value: number) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error("Nominal terbilang tidak valid.");
  if (value === 0) return "Nol rupiah";
  const words = spellNumber(value).replace(/\s+/g, " ").trim();
  return `${words.charAt(0).toUpperCase()}${words.slice(1)} rupiah`;
}

export type NumberingConfig = {
  pattern: string;
  padding: number;
  nextNumber: number;
  reset: "never" | "monthly" | "yearly";
  currentPeriod: string | null;
};

export function documentPeriod(reset: NumberingConfig["reset"], date: Date) {
  if (reset === "never") return "all";
  const year = date.getFullYear().toString();
  return reset === "yearly" ? year : `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatDocumentNumber(config: NumberingConfig, issuedAt: Date) {
  const period = documentPeriod(config.reset, issuedAt);
  const sequence = config.currentPeriod && config.currentPeriod !== period ? 1 : config.nextNumber;
  const replacements: Record<string, string> = {
    "{seq}": String(sequence).padStart(config.padding, "0"),
    "{DD}": String(issuedAt.getDate()).padStart(2, "0"),
    "{MM}": String(issuedAt.getMonth() + 1).padStart(2, "0"),
    "{YY}": String(issuedAt.getFullYear()).slice(-2),
    "{YYYY}": String(issuedAt.getFullYear()),
  };
  return {
    number: Object.entries(replacements).reduce((result, [token, replacement]) => result.replaceAll(token, replacement), config.pattern),
    period,
    nextNumber: sequence + 1,
  };
}

export function dueDate(departureDate: string, days = 30) {
  const date = new Date(`${departureDate}T00:00:00+07:00`);
  date.setDate(date.getDate() - days);
  return date;
}
