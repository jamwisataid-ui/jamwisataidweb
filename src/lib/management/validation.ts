import { z } from "zod";

const money = z.coerce.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
const requiredText = (label: string) => z.string().trim().min(2, `${label} wajib diisi.`);

export function normalizeWhatsapp(value: string) {
  const input = value.trim();
  if (!/^\+?[\d\s().-]+$/.test(input)) return input;
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export const indonesianWhatsappSchema = z.preprocess(
  (value) => typeof value === "string" ? normalizeWhatsapp(value) : value,
  z.string().regex(/^628\d{7,12}$/, "Nomor WhatsApp harus berupa nomor Indonesia yang valid, misalnya 081234567890 atau 6281234567890."),
);

const optionalEmail = z.preprocess(
  (value) => typeof value === "string" ? value.trim() || undefined : value,
  z.string().email("Format email tidak valid.").optional(),
);

const referralCode = z.preprocess(
  (value) => typeof value === "string" ? value.trim().toLowerCase() : value,
  z.string()
    .min(3, "Kode referral minimal 3 karakter.")
    .max(60, "Kode referral maksimal 60 karakter.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Gunakan huruf kecil, angka, dan strip di antara kata; contoh: nama-agen."),
);

export const pilgrimSchema = z.object({
  fullName: requiredText("Nama jamaah"),
  whatsapp: indonesianWhatsappSchema,
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
  whatsapp: indonesianWhatsappSchema,
  email: optionalEmail,
  referralCode,
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
  recipientName: z.string().trim().max(160).optional(),
  recipientBank: z.string().trim().max(120).optional(),
  recipientAccountNumber: z.string().trim().max(80).optional(),
  recipientAccountHolder: z.string().trim().max(160).optional(),
}).superRefine((data, context) => {
  if (data.direction === "transfer" && (!data.destinationAccountId || data.destinationAccountId === data.accountId)) {
    context.addIssue({ code: "custom", path: ["destinationAccountId"], message: "Pilih rekening tujuan internal yang berbeda." });
  }
  if (data.direction === "out" && !data.categoryId) {
    context.addIssue({ code: "custom", path: ["categoryId"], message: "Kategori biaya wajib dipilih untuk kas keluar." });
  }
});

export const expenseCategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: requiredText("Nama kategori").pipe(z.string().max(120, "Nama kategori maksimal 120 karakter.")),
});

export const stockMovementSchema = z.object({
  itemId: z.string().uuid(),
  kind: z.enum(["in", "out", "adjustment"]),
  quantity: z.coerce.number().int().min(0),
  movedAt: z.string().min(8),
  note: z.string().trim().optional(),
});

export type ManagementActionState = { ok: boolean; message: string; errors?: Record<string, string[]>; redirectTo?: string; createdCategory?: { id: string; name: string } };

export function fields(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
