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

const optionalDate = z.preprocess(
  (value) => typeof value === "string" ? value.trim() || undefined : value,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid.").optional(),
);

export const mobilePilgrimProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Nama jamaah wajib diisi.").max(160),
  whatsapp: whatsappSchema,
  email: optionalEmail,
  gender: z.enum(["Laki-laki", "Perempuan"]).optional(),
  birthDate: optionalDate,
  nationality: z.string().trim().min(2, "Kewarganegaraan wajib diisi.").max(80).default("Indonesia"),
  passportNumber: z.preprocess(
    (value) => typeof value === "string" ? value.trim().toUpperCase() || undefined : value,
    z.string().max(40).optional(),
  ),
  passportExpiry: optionalDate,
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
