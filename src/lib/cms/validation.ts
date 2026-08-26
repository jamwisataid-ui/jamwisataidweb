import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(3, "Slug minimal 3 karakter.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.");

export const packageFormSchema = z.object({
  id: z.string().trim().min(3),
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
  departureAirport: z.string().trim().min(2, "Bandara keberangkatan wajib diisi."),
  arrivalAirport: z.string().trim().optional(),
  price: z.preprocess(
    (val) => (typeof val === "string" ? Number(val.replace(/\D/g, "")) : typeof val === "number" ? val : NaN),
    z.number().int().positive("Harga harus lebih dari 0.")
  ),
  capacity: z.union([z.coerce.number().int().positive(), z.literal(""), z.null()]).optional(),
  availableSeats: z.union([z.coerce.number().int().min(0), z.literal(""), z.null()]).optional(),
  departureStatus: z.enum(["open", "limited", "full", "closed", "coming-soon"]).default("open"),
  makkahHotel: z.string().trim().min(2, "Hotel Makkah wajib diisi."),
  makkahStar: z.coerce.number().int().min(1).max(5).default(5),
  makkahDistance: z.string().trim().optional(),
  madinahHotel: z.string().trim().min(2, "Hotel Madinah wajib diisi."),
  madinahStar: z.coerce.number().int().min(1).max(5).default(4),
  madinahDistance: z.string().trim().optional(),
  facilities: z.string().default(""),
  highlights: z.string().default(""),
  includes: z.string().default(""),
  excludes: z.string().default(""),
  terms: z.string().default(""),
  destinations: z.string().default(""),
  itinerary: z.string().default("[]"),
});

export const entryFormSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["testimonial", "gallery", "destination", "faq", "service", "homepage", "site-settings"]),
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
  title: z.string().trim().min(5),
  excerpt: z.string().trim().min(20).max(300),
  coverUrl: z.string().trim().optional(),
  contentJson: z.string().min(2),
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
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0] || null;
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/")[2] || null;
      if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] || null;
      return url.searchParams.get("v");
    }
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
