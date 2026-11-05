import { z } from "zod";

import { normalizeWhatsapp } from "../management/validation";

export const pinSchema = z.string().regex(/^\d{6}$/, "PIN harus terdiri dari 6 angka.");
export const whatsappSchema = z.string().transform(normalizeWhatsapp).refine((value) => /^62\d{8,13}$/.test(value), "Nomor WhatsApp tidak valid.");

export const activationSchema = z.object({ token: z.string().min(32).max(200), pin: pinSchema });
export const mobileLoginSchema = z.object({ whatsapp: whatsappSchema, pin: pinSchema });
export const refreshSchema = z.object({ refreshToken: z.string().min(32).max(200) });

const optionalEmail = z.preprocess(
  (value) => typeof value === "string" ? value.trim() || undefined : value,
  z.string().email("Format email tidak valid.").optional(),
);

function normalizeDateInput(value: unknown) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const local = /^(\d{2})[-/]?(\d{2})[-/]?(\d{4})$/.exec(trimmed);
  return local ? `${local[3]}-${local[2]}-${local[1]}` : trimmed;
}

function isRealIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

const todayIso = () => new Date().toISOString().slice(0, 10);
const optionalDate = (formatMessage: string, temporalMessage: string, temporalCheck: (value: string) => boolean) => z.preprocess(
  normalizeDateInput,
  z.string()
    .refine(isRealIsoDate, formatMessage)
    .refine((value) => !isRealIsoDate(value) || temporalCheck(value), temporalMessage)
    .optional(),
);

export const mobilePilgrimProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Nama jamaah wajib diisi.").max(160),
  whatsapp: whatsappSchema,
  email: optionalEmail,
  gender: z.enum(["Laki-laki", "Perempuan"]).optional(),
  birthDate: optionalDate(
    "Format tanggal lahir tidak valid (contoh: 10-02-1977).",
    "Tanggal lahir tidak boleh di masa depan.",
    (value) => value <= todayIso(),
  ),
  nationality: z.string().trim().min(2, "Kewarganegaraan wajib diisi.").max(80).default("Indonesia"),
  passportNumber: z.preprocess(
    (value) => typeof value === "string" ? value.trim().toUpperCase() || undefined : value,
    z.string().max(40).optional(),
  ),
  passportExpiry: optionalDate(
    "Format masa berlaku paspor tidak valid (contoh: 10-02-2030).",
    "Masa berlaku paspor harus setelah hari ini.",
    (value) => value > todayIso(),
  ),
  notes: z.preprocess(
    (value) => typeof value === "string" ? value.trim() || undefined : value,
    z.string().max(500).optional(),
  ),
});

export const mobileSelfRegistrationSchema = mobilePilgrimProfileSchema.extend({
  pin: pinSchema,
});

export const mobileRegistrationSchema = z.object({
  departureId: z.uuid("Keberangkatan tidak valid."),
  roomType: z.enum(["quad", "triple", "double"]).optional(),
  payerName: z.string().trim().min(2, "Nama pembayar wajib diisi.").max(160),
  payerWhatsapp: z.string().trim().min(8, "WhatsApp pembayar wajib diisi.").max(30),
  payerEmail: z.preprocess((value) => typeof value === "string" ? value.trim() || undefined : value, z.email("Format email pembayar tidak valid.").optional()),
  note: z.string().trim().max(500).optional(),
});
