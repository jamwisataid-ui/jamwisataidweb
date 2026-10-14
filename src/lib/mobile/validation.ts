import { z } from "zod";

import { normalizeWhatsapp } from "../management/validation";

export const pinSchema = z.string().regex(/^\d{6}$/, "PIN harus terdiri dari 6 angka.");
export const whatsappSchema = z.string().transform(normalizeWhatsapp).refine((value) => /^62\d{8,13}$/.test(value), "Nomor WhatsApp tidak valid.");

export const activationSchema = z.object({ token: z.string().min(32).max(200), pin: pinSchema });
export const mobileLoginSchema = z.object({ whatsapp: whatsappSchema, pin: pinSchema });
export const refreshSchema = z.object({ refreshToken: z.string().min(32).max(200) });
