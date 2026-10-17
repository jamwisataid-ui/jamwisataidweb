import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(3, "Slug minimal 3 karakter.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.");

const plusHotelSchema = z.object({
  destination: z.string().trim().min(2, "Kota atau destinasi hotel plus wajib diisi."),
  hotelName: z.string().trim().min(2, "Nama hotel program plus wajib diisi."),
  star: z.coerce.number().int().min(3, "Bintang hotel minimal 3.").max(5, "Bintang hotel maksimal 5."),
});

const plusHotels = z.preprocess((input) => {
  if (Array.isArray(input)) return input;
  if (typeof input !== "string" || !input.trim()) return [];
  try {
    return JSON.parse(input);
  } catch {
    return [];
  }
}, z.array(plusHotelSchema).max(10, "Maksimal 10 hotel program plus."));

const departureSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  departureDate: z.string().trim().min(4, "Tanggal keberangkatan wajib diisi."),
  returnDate: z.string().trim().optional(),
  price: z.preprocess(
    (val) => (typeof val === "string" ? Number(val.replace(/\D/g, "")) : typeof val === "number" ? val : NaN),
    z.number().int().positive("Harga harus lebih dari 0."),
  ),
  capacity: z.union([z.coerce.number().int().positive(), z.literal(""), z.null()]).optional(),
  availableSeats: z.union([z.coerce.number().int().min(0), z.literal(""), z.null()]).optional(),
  status: z.enum(["open", "limited", "full", "closed", "coming-soon"]).default("open"),
});

const packageDepartures = z.preprocess((input) => {
  if (Array.isArray(input)) return input;
  if (typeof input !== "string" || !input.trim()) return [];
  try { return JSON.parse(input); } catch { return []; }
}, z.array(departureSchema).min(1, "Tambahkan minimal satu tanggal keberangkatan."));

export const packageFormSchema = z.object({
  id: z.string().trim().min(3),
  departureId: z.string().uuid().optional().or(z.literal("")),
  slug,
  name: z.string().trim().min(3, "Nama paket minimal 3 karakter."),
  category: z.enum(["umrah", "hajj", "halal-tour"]).default("umrah"),
  packageType: z.enum(["bintang-5", "plus", "reguler", "tour"]).default("reguler"),
  badge: z.string().trim().optional(),
  summary: z.string().trim().optional(),
  imageUrl: z.string().trim().min(1, "Foto paket wajib dipilih atau diisi."),
  durationDays: z.coerce.number().int().min(1, "Durasi minimal 1 hari.").max(60, "Durasi maksimal 60 hari."),
  detailUrl: z.string().trim().optional(),
  whatsappMessage: z.string().trim().min(5, "Pesan WhatsApp wajib diisi."),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(170).optional(),
  featured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  departureDate: z.string().trim().min(4, "Tanggal keberangkatan wajib diisi."),
  departureLabel: z.string().trim().min(1, "Label keberangkatan wajib diisi."),
  returnDate: z.string().trim().optional(),
  manasikDate: z.string().trim().optional(),
  airline: z.string().trim().min(2, "Maskapai wajib diisi."),
  highSpeedTrain: z.string().trim().max(120, "Kereta Cepat maksimal 120 karakter.").optional(),
  departureAirport: z.string().trim().min(2, "Bandara keberangkatan wajib diisi."),
  arrivalAirport: z.string().trim().optional(),
  price: z.preprocess(
    (val) => (typeof val === "string" ? Number(val.replace(/\D/g, "")) : typeof val === "number" ? val : NaN),
    z.number().int().positive("Harga harus lebih dari 0.")
  ),
  capacity: z.union([z.coerce.number().int().positive(), z.literal(""), z.null()]).optional(),
  availableSeats: z.union([z.coerce.number().int().min(0), z.literal(""), z.null()]).optional(),
  departureStatus: z.enum(["open", "limited", "full", "closed", "coming-soon"]).default("open"),
  departures: packageDepartures.optional().default([]),
  makkahHotel: z.string().trim().min(2, "Hotel Makkah wajib diisi."),
  makkahStar: z.coerce.number().int().refine((value) => value === 3 || value === 4 || value === 5, "Bintang hotel Makkah hanya boleh 3, 4, atau 5.").default(5),
  makkahDistance: z.string().trim().optional(),
  madinahHotel: z.string().trim().min(2, "Hotel Madinah wajib diisi."),
  madinahStar: z.coerce.number().int().refine((value) => value === 3 || value === 4 || value === 5, "Bintang hotel Madinah hanya boleh 3, 4, atau 5.").default(4),
  madinahDistance: z.string().trim().optional(),
  plusHotels,
  facilities: z.string().default(""),
  highlights: z.string().default(""),
  includes: z.string().default(""),
  excludes: z.string().default(""),
  terms: z.string().default(""),
  destinations: z.string().default(""),
  itinerary: z.string().default("[]"),
}).superRefine((data, context) => {
  if (data.packageType === "plus" && data.plusHotels.length === 0) {
    context.addIssue({ code: "custom", path: ["plusHotels"], message: "Tambahkan minimal satu hotel untuk Program Umroh Plus." });
  }
  if (data.departures.length === 0 && !data.departureDate) {
    context.addIssue({ code: "custom", path: ["departures"], message: "Tambahkan minimal satu tanggal keberangkatan." });
  }
  const dates = data.departures.map((departure) => departure.departureDate);
  if (new Set(dates).size !== dates.length) {
    context.addIssue({ code: "custom", path: ["departures"], message: "Tanggal keberangkatan dalam satu paket tidak boleh duplikat." });
  }
  data.departures.forEach((departure, index) => {
    if (typeof departure.capacity === "number" && typeof departure.availableSeats === "number" && departure.availableSeats > departure.capacity) {
      context.addIssue({ code: "custom", path: ["departures", index, "availableSeats"], message: "Sisa kuota tidak boleh melebihi kuota." });
    }
  });
}).transform((data) => ({
  ...(data.packageType === "plus" ? data : { ...data, plusHotels: [] }),
  departures: data.departures.length ? data.departures : [{
    id: data.departureId,
    departureDate: data.departureDate,
    returnDate: data.returnDate,
    price: data.price,
    capacity: data.capacity,
    availableSeats: data.availableSeats,
    status: data.departureStatus,
  }],
}));

export const entryFormSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["testimonial", "gallery", "destination", "faq", "service", "homepage", "site-settings", "mobile-onboarding"]),
  key: slug,
  title: z.string().trim().min(2),
  sortOrder: z.coerce.number().int().min(0).default(0),
  primary: z.string().trim().optional(),
  secondary: z.string().trim().optional(),
  tertiary: z.string().trim().optional(),
  quaternary: z.string().trim().optional(),
});

export const articleFormSchema = z.object({
  id: z.string().uuid().optional(),
  slug,
  title: z.string().trim().min(5, "Judul artikel minimal 5 karakter."),
  excerpt: z.string().trim().min(20, "Ringkasan minimal 20 karakter.").max(300, "Ringkasan maksimal 300 karakter."),
  coverUrl: z.string().trim().optional(),
  contentJson: z.string().min(2, "Isi artikel wajib diisi."),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(170).optional(),
});

export const lines = (value: string) =>
  value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractYoutubeId(value: string) {
  const direct = value.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(direct)) return direct;

  try {
    const url = new URL(direct);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname.toLowerCase();
    const isYoutube = host === "youtube.com" || host.endsWith(".youtube.com");
    const isShort = host === "youtu.be" || host === "www.youtu.be";
    if (!isYoutube && !isShort) return null;
    const id = isShort
      ? url.pathname.slice(1).split("/")[0]
      : url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")
        ? url.pathname.split("/")[2]
        : url.searchParams.get("v");
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
  return null;
}

export type ActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
  redirectTo?: string;
};
