import { randomUUID } from "node:crypto";

import { z } from "zod";

import { indonesianWhatsappSchema } from "@/lib/management/validation";

export const accountDeletionRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Nama lengkap wajib diisi.").max(120, "Nama lengkap terlalu panjang."),
  whatsapp: indonesianWhatsappSchema,
  reason: z.string().trim().max(1_000, "Alasan maksimal 1.000 karakter.").optional().default(""),
  website: z.string().max(200).optional().default(""),
});

export type AccountDeletionRequest = z.infer<typeof accountDeletionRequestSchema>;

export function deletionRequestReference(now = new Date(), suffix = randomUUID().slice(0, 6)) {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `DEL-${date}-${suffix.toUpperCase()}`;
}
