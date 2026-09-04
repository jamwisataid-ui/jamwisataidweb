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

export const DEFAULT_BIRTHDAY_MESSAGE = "Assalamu'alaikum Kak [NAMA], selamat ulang tahun yang ke-[UMUR]. Semoga Allah senantiasa memberikan kesehatan, keberkahan usia, dan kemudahan dalam setiap ibadah. Salam hangat dari Jam Wisata.";

export function upcomingBirthday(birthDate: string, now = new Date()) {
  const [birthYear, birthMonth, birthDay] = birthDate.split("-").map(Number);
  if (!birthYear || !birthMonth || !birthDay) return null;
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const current = Object.fromEntries(parts.map((part) => [part.type, Number(part.value)]));
  const today = Date.UTC(current.year, current.month - 1, current.day);
  let birthdayYear = current.year;
  let nextBirthday = Date.UTC(birthdayYear, birthMonth - 1, birthDay);
  if (nextBirthday < today) {
    birthdayYear += 1;
    nextBirthday = Date.UTC(birthdayYear, birthMonth - 1, birthDay);
  }
  return { daysUntil: Math.round((nextBirthday - today) / 86400000), age: birthdayYear - birthYear, date: new Date(nextBirthday).toISOString().slice(0, 10) };
}

export type RoomCity = "makkah" | "madinah";
export type RoomType = "quad" | "triple" | "double";

export const ROOM_CAPACITIES: Record<RoomType, number> = {
  quad: 4,
  triple: 3,
  double: 2,
};

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  quad: "Quad · 4 orang",
  triple: "Triple · 3 orang",
  double: "Double · 2 orang",
};

export function cleanHotelSlug(hotelName?: string | null): string {
  if (!hotelName) return "Hotel";
  const cleaned = hotelName.replace(/^(hotel|akomodasi)\s+/i, "").trim().split(/\s+/)[0];
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : "Hotel";
}

export function generateDefaultRoomNumber({
  city,
  hotelName,
  roomType,
  roomIndex,
}: {
  city: RoomCity;
  hotelName?: string | null;
  roomType: RoomType;
  roomIndex: number;
}): string {
  const cityCode = city === "makkah" ? "MKH" : "MDN";
  const hotel = cleanHotelSlug(hotelName);
  const typeLabel = roomType.charAt(0).toUpperCase() + roomType.slice(1);
  const numStr = String(roomIndex).padStart(2, "0");
  return `${cityCode}-${hotel}-${typeLabel}-${numStr}`;
}

export type DepartureReportItem = {
  departureId: string;
  departureDate: string;
  dateLabel: string;
  packageId: string;
  packageName: string;
  airline: string;
  totalPilgrims: number;
  totalReceivables: number;
  totalAgreedPrice: number;
  totalPaid: number;
  totalRefunded: number;
  directExpenses: number;
  paidCommissions: number;
  realizedProfit: number;
  status: string;
  pilgrims: Array<{
    registrationId: string;
    fullName: string;
    gender: string;
    whatsapp: string;
    passportNumber: string;
    agentName: string;
    roomType: string;
    makkahRoom: string;
    madinahRoom: string;
    agreedPrice: number;
    paid: number;
    outstanding: number;
    paymentStatus: string;
  }>;
};

export function computeDepartureReports({
  departures,
  registrations,
  payments,
  cashTransactions,
  commissions,
  refunds,
}: {
  departures: Array<{
    id: string;
    departureDate: string;
    dateLabel: string;
    packageId: string;
    package?: { id: string; name: string };
    airline?: string;
    status?: string;
  }>;
  registrations: Array<any>;
  payments: Array<any>;
  cashTransactions: Array<any>;
  commissions: Array<any>;
  refunds: Array<any>;
}): DepartureReportItem[] {
  return departures.map((dep) => {
    const depRegs = registrations.filter(
      (r) => r.departure?.id === dep.id && r.status === "active"
    );
    const regIds = new Set(depRegs.map((r) => r.id));

    const validPayments = payments.filter((p) => p.status === "confirmed" && (p as any).isIncludedInReports !== false);
    let totalPaid = 0;
    validPayments.forEach((p) => {
      (p.allocations || []).forEach((alloc: any) => {
        if (regIds.has(alloc.registrationId)) {
          totalPaid += alloc.amount;
        }
      });
    });

    const totalRefunded = refunds
      .filter((rf) => rf.registrationId && regIds.has(rf.registrationId) && rf.status === "confirmed")
      .reduce((sum, rf) => sum + rf.amount, 0);

    const directExpenses = cashTransactions
      .filter(
        (c) =>
          c.packageId === dep.packageId &&
          c.direction === "out" &&
          c.kind !== "refund" &&
          c.kind !== "commission" &&
          !c.isReversal &&
          (c as any).isIncludedInReports !== false
      )
      .reduce((sum, c) => sum + c.amount, 0);

    const paidCommissions = commissions
      .filter((cm) => regIds.has(cm.registrationId) && cm.status === "paid")
      .reduce((sum, cm) => sum + cm.amount, 0);

    const totalAgreedPrice = depRegs.reduce((sum, r) => sum + (r.agreedPrice || 0), 0);
    const totalReceivables = depRegs.reduce((sum, r) => sum + (r.payment?.outstanding || 0), 0);
    const realizedProfit = totalPaid - totalRefunded - directExpenses - paidCommissions;

    const pilgrimList = depRegs.map((r) => ({
      registrationId: r.id,
      fullName: r.pilgrim?.fullName || "—",
      gender: r.pilgrim?.gender || "—",
      whatsapp: r.pilgrim?.whatsapp || "—",
      passportNumber: r.pilgrim?.passportNumber || "—",
      agentName: r.agent?.name || "Langsung",
      roomType: r.roomType ? r.roomType.charAt(0).toUpperCase() + r.roomType.slice(1) : "Quad",
      makkahRoom: r.makkahRoomNumber || r.roomNumber || "—",
      madinahRoom: r.madinahRoomNumber || "—",
      agreedPrice: r.agreedPrice,
      paid: r.payment?.netPaid || 0,
      outstanding: r.payment?.outstanding || 0,
      paymentStatus: r.payment?.status || "Belum Bayar",
    }));

    return {
      departureId: dep.id,
      departureDate: dep.departureDate,
      dateLabel: dep.dateLabel,
      packageId: dep.packageId,
      packageName: dep.package?.name || "Paket Umrah",
      airline: dep.airline || "—",
      totalPilgrims: depRegs.length,
      totalAgreedPrice,
      totalReceivables,
      totalPaid,
      totalRefunded,
      directExpenses,
      paidCommissions,
      realizedProfit,
      status: dep.status || "open",
      pilgrims: pilgrimList,
    };
  });
}

