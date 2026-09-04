import { z } from "zod";

const money = z.coerce.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
const requiredText = (label: string) => z.string().trim().min(2, `${label} wajib diisi.`);

export const pilgrimSchema = z.object({
  fullName: requiredText("Nama jamaah"),
  whatsapp: z.string().trim().min(8, "Nomor WhatsApp minimal 8 digit."),
  email: z.union([z.literal(""), z.string().trim().email("Format email tidak valid.")]).optional(),
  gender: z.enum(["", "Laki-laki", "Perempuan"]).optional(),
  birthDate: z.string().optional(),
  nationality: z.string().trim().default("Indonesia"),
  passportNumber: z.string().trim().optional(),
  passportExpiry: z.string().optional(),
  notes: z.string().trim().optional(),
});

export const agentSchema = z.object({
  name: requiredText("Nama agen"),
  whatsapp: z.string().trim().min(8, "Nomor WhatsApp minimal 8 digit."),
  email: z.union([z.literal(""), z.string().trim().email("Format email tidak valid.")]).optional(),
  referralCode: z.string().trim().min(3).regex(/^[a-z0-9-]+$/, "Kode hanya boleh huruf kecil, angka, dan strip."),
  defaultCommission: money.refine((value) => value === 500_000 || value === 1_000_000, "Komisi hanya Rp500.000 atau Rp1.000.000."),
});

export const bookingSchema = z.object({
  departureId: z.string().uuid("Paket wajib dipilih."),
  payerName: requiredText("Nama pembayar"),
  payerWhatsapp: z.string().trim().min(8, "WhatsApp pembayar wajib diisi."),
  payerEmail: z.union([z.literal(""), z.string().trim().email("Format email tidak valid.")]).optional(),
  pilgrimIds: z.array(z.string().uuid()).min(1, "Pilih minimal satu jamaah."),
  agentId: z.union([z.literal(""), z.string().uuid()]).optional(),
  agreedPrice: money.positive("Harga kesepakatan wajib diisi."),
  dpTarget: money.positive("Target DP wajib lebih dari nol."),
  discountAmount: money.default(0),
  commissionAmount: money.refine((value) => value === 0 || value === 500_000 || value === 1_000_000, "Komisi tidak valid."),
  roomType: z.enum(["quad", "triple", "double"]).default("quad"),
});

export const paymentSchema = z.object({
  bookingId: z.string().uuid(),
  invoiceId: z.string().uuid("Invoice wajib dipilih."),
  accountId: z.string().uuid(),
  paidAt: z.string().min(8),
  method: z.enum(["cash", "transfer", "card", "other"]),
  amount: money.positive("Nominal pembayaran harus lebih dari nol."),
  reference: z.string().trim().optional(),
  note: z.string().trim().optional(),
  allocations: z.array(z.object({ registrationId: z.string().uuid(), amount: money.positive() })).min(1),
});

export const cashSchema = z.object({
  accountId: z.string().uuid(),
  destinationAccountId: z.union([z.literal(""), z.string().uuid()]).optional(),
  packageId: z.string().optional(),
  categoryId: z.union([z.literal(""), z.string().uuid()]).optional(),
  direction: z.enum(["in", "out", "transfer"]),
  amount: money.positive(),
  transactionAt: z.string().min(8),
  description: requiredText("Keterangan"),
});

export const stockMovementSchema = z.object({
  itemId: z.string().uuid(),
  kind: z.enum(["in", "out", "adjustment"]),
  quantity: z.coerce.number().int().min(0),
  movedAt: z.string().min(8),
  note: z.string().trim().optional(),
});

export type ManagementActionState = { ok: boolean; message: string; errors?: Record<string, string[]>; redirectTo?: string };

export function fields(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
