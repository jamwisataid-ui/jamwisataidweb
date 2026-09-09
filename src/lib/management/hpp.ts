export const HPP_FORMULA_VERSION = "muhasib-v1";

export const HPP_MASTER_CATEGORIES = [
  ["ticket", "Tiket Pesawat"], ["visa", "Visa & Asuransi"], ["la", "Land Arrangement Default"],
  ["la_package", "Paket LA Siap Pakai"], ["handling", "Handling & Konsumsi"],
  ["departure_bus", "Bus Keberangkatan"], ["arrival_bus", "Bus Kedatangan"],
  ["equipment", "Perlengkapan Umrah"], ["manasik", "Bimbingan Manasik"],
  ["program", "Program Tambahan"], ["social", "Sedekah & Sosial"],
  ["other", "Biaya Lain & Operasional"], ["hotel_makkah", "Hotel Makkah"],
  ["hotel_madinah", "Hotel Madinah"],
] as const;

export function hppMasterCode(category: string, name: string, suffix: string) {
  const slug = name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42) || "item";
  return `${category}-${slug}-${suffix.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8)}`;
}

export type HppCurrency = "IDR" | "USD" | "SAR";
export type HppCostBasis = "per_pax" | "group" | "room_per_night";
export type HppLaMode = "package" | "hotel_detail";

export type HppItemInput = {
  code: string;
  category: string;
  name: string;
  currency: HppCurrency;
  costBasis: HppCostBasis;
  unitAmount: number;
  quantity: number;
  occupancy?: number;
};

export type HppInput = {
  paxCount: number;
  usdRate: number;
  sarRate: number;
  profitMargin: number;
  marketingFee: number;
  items: HppItemInput[];
};

export function currencyRate(currency: HppCurrency, input: Pick<HppInput, "usdRate" | "sarRate">) {
  if (currency === "USD") return input.usdRate;
  if (currency === "SAR") return input.sarRate;
  return 1;
}

export function itemCostPerPax(item: HppItemInput, input: Pick<HppInput, "paxCount" | "usdRate" | "sarRate">) {
  if (!Number.isFinite(item.unitAmount) || item.unitAmount < 0) throw new Error(`Harga ${item.name} tidak valid.`);
  if (!Number.isFinite(item.quantity) || item.quantity < 0) throw new Error(`Jumlah ${item.name} tidak valid.`);
  if (!Number.isInteger(input.paxCount) || input.paxCount <= 0) throw new Error("Jumlah jamaah harus lebih dari 0.");
  const converted = item.unitAmount * item.quantity * currencyRate(item.currency, input);
  if (item.costBasis === "group") return converted / input.paxCount;
  if (item.costBasis === "room_per_night") {
    const occupancy = item.occupancy ?? 4;
    if (![2, 3, 4].includes(occupancy)) throw new Error("Kapasitas kamar harus Double, Triple, atau Quad.");
    return converted / occupancy;
  }
  return converted;
}

export function calculateHpp(input: HppInput) {
  if (!Number.isFinite(input.usdRate) || input.usdRate <= 0) throw new Error("Kurs USD harus lebih dari 0.");
  if (!Number.isFinite(input.sarRate) || input.sarRate <= 0) throw new Error("Kurs SAR harus lebih dari 0.");
  const items = input.items.map((item) => ({ ...item, computedPerPax: itemCostPerPax(item, input) }));
  const subtotalBase = items.reduce((total, item) => total + item.computedPerPax, 0);
  const focTourLeader = subtotalBase / input.paxCount;
  const hppPerPax = subtotalBase + focTourLeader;
  const sellingPrice = hppPerPax + input.profitMargin + input.marketingFee;
  return { items, subtotalBase, focTourLeader, hppPerPax, sellingPrice };
}

export function roundSellingPrice(value: number, step = 100_000) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.ceil(value / step) * step;
}

export const HPP_CATEGORIES = [
  ["ticket", "Tiket Pesawat"], ["visa", "Visa & Asuransi"], ["la", "Land Arrangement"],
  ["handling", "Handling & Konsumsi"], ["departure_bus", "Bus Keberangkatan"],
  ["arrival_bus", "Bus Kedatangan"], ["equipment", "Perlengkapan Umrah"],
  ["manasik", "Bimbingan Manasik"], ["program", "Program Tambahan"],
  ["social", "Sedekah & Sosial"], ["other", "Biaya Lain & Operasional"],
] as const;

export const DEFAULT_HPP_ITEMS: HppItemInput[] = [
  { code: "main_ticket", category: "ticket", name: "Tiket pesawat utama PP", currency: "IDR", costBasis: "per_pax", unitAmount: 14_400_000, quantity: 1 },
  { code: "domestic_ticket", category: "ticket", name: "Tiket domestik tambahan", currency: "IDR", costBasis: "per_pax", unitAmount: 1_250_000, quantity: 1 },
  { code: "other_flight", category: "ticket", name: "Penerbangan negara lain", currency: "USD", costBasis: "per_pax", unitAmount: 0, quantity: 1 },
  { code: "saudi_visa", category: "visa", name: "Visa Arab Saudi", currency: "USD", costBasis: "per_pax", unitAmount: 135, quantity: 1 },
  { code: "other_visa", category: "visa", name: "Visa transit/lainnya", currency: "USD", costBasis: "per_pax", unitAmount: 0, quantity: 1 },
  { code: "insurance", category: "visa", name: "Asuransi perjalanan", currency: "IDR", costBasis: "per_pax", unitAmount: 75_000, quantity: 1 },
  { code: "tasreh", category: "visa", name: "Tasreh Raudhah", currency: "SAR", costBasis: "per_pax", unitAmount: 25, quantity: 1 },
  { code: "land_arrangement", category: "la", name: "Paket LA Makkah & Madinah", currency: "IDR", costBasis: "per_pax", unitAmount: 6_400_000, quantity: 1 },
  { code: "handling_jakarta", category: "handling", name: "Handling Jakarta", currency: "IDR", costBasis: "per_pax", unitAmount: 140_000, quantity: 1 },
  { code: "handling_domestic", category: "handling", name: "Handling domestik", currency: "IDR", costBasis: "per_pax", unitAmount: 25_000, quantity: 1 },
  { code: "domestic_meal", category: "handling", name: "Konsumsi transit domestik", currency: "IDR", costBasis: "per_pax", unitAmount: 35_000, quantity: 2 },
  { code: "lounge", category: "handling", name: "Lounge", currency: "IDR", costBasis: "per_pax", unitAmount: 0, quantity: 1 },
  { code: "departure_bus", category: "departure_bus", name: "Sewa bus keberangkatan", currency: "IDR", costBasis: "group", unitAmount: 0, quantity: 1 },
  { code: "departure_snack", category: "departure_bus", name: "Snack bus keberangkatan", currency: "IDR", costBasis: "per_pax", unitAmount: 15_000, quantity: 1 },
  { code: "arrival_bus", category: "arrival_bus", name: "Sewa bus kedatangan", currency: "IDR", costBasis: "group", unitAmount: 13_000_000, quantity: 1 },
  { code: "arrival_snack", category: "arrival_bus", name: "Snack bus kedatangan", currency: "IDR", costBasis: "per_pax", unitAmount: 15_000, quantity: 1 },
  { code: "mandatory_equipment", category: "equipment", name: "Perlengkapan wajib", currency: "IDR", costBasis: "per_pax", unitAmount: 250_000, quantity: 1 },
  { code: "optional_equipment", category: "equipment", name: "Perlengkapan opsional", currency: "IDR", costBasis: "per_pax", unitAmount: 675_000, quantity: 1 },
  { code: "manasik", category: "manasik", name: "Manasik teori, praktik & MCU", currency: "IDR", costBasis: "per_pax", unitAmount: 275_000, quantity: 1 },
  { code: "speaker", category: "manasik", name: "Fee pemateri", currency: "IDR", costBasis: "per_pax", unitAmount: 50_000, quantity: 1 },
  { code: "haramain", category: "program", name: "Kereta cepat Haramain", currency: "SAR", costBasis: "per_pax", unitAmount: 0, quantity: 1 },
  { code: "taif", category: "program", name: "City Tour Thaif", currency: "SAR", costBasis: "per_pax", unitAmount: 0, quantity: 1 },
  { code: "other_tour", category: "program", name: "Program/tour lainnya", currency: "SAR", costBasis: "per_pax", unitAmount: 0, quantity: 1 },
  { code: "social", category: "social", name: "Sedekah & sosial", currency: "IDR", costBasis: "per_pax", unitAmount: 250_000, quantity: 1 },
  { code: "office", category: "other", name: "Operasional kantor", currency: "IDR", costBasis: "per_pax", unitAmount: 0, quantity: 1 },
  { code: "tour_leader", category: "other", name: "Uang saku & data Tour Leader", currency: "IDR", costBasis: "per_pax", unitAmount: 100_000, quantity: 1 },
  { code: "fixed_cost", category: "other", name: "Fixed cost cadangan", currency: "IDR", costBasis: "per_pax", unitAmount: 250_000, quantity: 1 },
];
