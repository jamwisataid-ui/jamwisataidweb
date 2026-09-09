"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { auditLogs, departures, hppCostingItems, hppCostings, hppPriceMaster } from "@/db/schema";
import { withManagementTransaction } from "@/db/transaction";
import { requireAdminSession } from "@/lib/admin-session";
import { calculateHpp, HPP_FORMULA_VERSION, HPP_MASTER_CATEGORIES, hppMasterCode, roundSellingPrice } from "./hpp";
import type { ManagementActionState } from "./validation";

const money = z.coerce.number().finite().min(0).max(Number.MAX_SAFE_INTEGER);
const masterCategories = HPP_MASTER_CATEGORIES.map(([value]) => value) as [string, ...string[]];
const masterSchema = z.object({
  name: z.string().trim().min(2, "Nama biaya minimal 2 karakter.").max(120),
  category: z.enum(masterCategories),
  currency: z.enum(["IDR", "USD", "SAR"]),
  costBasis: z.enum(["per_pax", "group", "room_per_night"]),
  amount: money,
});
const itemSchema = z.object({
  code: z.string().min(1), category: z.string().min(1), name: z.string().min(2),
  currency: z.enum(["IDR", "USD", "SAR"]), costBasis: z.enum(["per_pax", "group", "room_per_night"]),
  unitAmount: money, quantity: money, occupancy: z.number().optional(), metadata: z.record(z.string(), z.unknown()).optional(),
});
const costingSchema = z.object({
  title: z.string().trim().min(3, "Nama simulasi minimal 3 karakter."),
  packageId: z.string().optional(), departureId: z.string().optional(), departureDate: z.string().optional(),
  season: z.enum(["low", "medium", "high"]), laMode: z.enum(["package", "hotel_detail"]),
  durationDays: z.coerce.number().int().min(1, "Durasi minimal 1 hari.").max(60),
  paxCount: z.coerce.number().int().min(1, "Jumlah jamaah minimal 1 orang.").max(500),
  usdRate: money.refine((value) => value > 0, "Kurs USD wajib lebih dari 0."),
  sarRate: money.refine((value) => value > 0, "Kurs SAR wajib lebih dari 0."),
  profitMargin: money, marketingFee: money, appliedPrice: money,
  notes: z.string().trim().optional(), status: z.enum(["draft", "final"]).default("draft"),
  items: z.array(itemSchema).min(1, "Minimal ada satu komponen biaya."),
}).superRefine((value, ctx) => {
  if (value.laMode === "package" && !value.items.some((item) => item.code === "land_arrangement" && item.unitAmount > 0)) ctx.addIssue({ code: "custom", path: ["items"], message: "Harga paket LA wajib diisi." });
  if (value.laMode === "hotel_detail" && !["hotel_makkah", "hotel_madinah"].every((code) => value.items.some((item) => item.code === code && item.unitAmount > 0 && item.quantity > 0))) ctx.addIssue({ code: "custom", path: ["items"], message: "Pilih hotel Makkah dan Madinah serta isi jumlah malamnya." });
});

function fail(error: unknown): ManagementActionState {
  unstable_rethrow(error);
  console.error("HPP action failed:", error);
  return { ok: false, message: error instanceof Error ? error.message : "Data HPP belum berhasil disimpan." };
}

function parse(formData: FormData) {
  let items: unknown = [];
  try { items = JSON.parse(String(formData.get("items") ?? "[]")); } catch { items = []; }
  return costingSchema.safeParse({ ...Object.fromEntries(formData.entries()), items });
}

export async function saveHppCostingAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, message: "Periksa bagian yang ditandai.", errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  try {
    const session = await requireAdminSession();
    const id = String(formData.get("id") || randomUUID());
    const input = parsed.data;
    const result = calculateHpp(input);
    const existingId = String(formData.get("id") ?? "");
    await withManagementTransaction(async (tx) => {
      const values = {
        title: input.title, packageId: input.packageId || null, departureId: input.departureId || null,
        departureDate: input.departureDate || null, season: input.season, laMode: input.laMode,
        durationDays: input.durationDays, paxCount: input.paxCount, usdRate: String(input.usdRate), sarRate: String(input.sarRate),
        profitMargin: String(input.profitMargin), marketingFee: String(input.marketingFee), subtotalBase: result.subtotalBase.toFixed(2),
        focTourLeader: result.focTourLeader.toFixed(2), hppPerPax: result.hppPerPax.toFixed(2), sellingPrice: result.sellingPrice.toFixed(2),
        appliedPrice: Math.round(input.appliedPrice || roundSellingPrice(result.sellingPrice)), formulaVersion: HPP_FORMULA_VERSION,
        status: input.status, notes: input.notes || null, snapshot: { input, result, savedAt: new Date().toISOString() },
        updatedBy: session.user.id, updatedAt: new Date(),
      } as const;
      if (existingId) {
        const existing = await tx.query.hppCostings.findFirst({ where: eq(hppCostings.id, id) });
        if (!existing) throw new Error("Simulasi HPP tidak ditemukan.");
        if (existing.status === "applied" || existing.status === "archived") throw new Error("Simulasi yang sudah diterapkan/diarsipkan tidak dapat diedit. Duplikasi untuk membuat revisi.");
        await tx.update(hppCostings).set(values).where(eq(hppCostings.id, id));
        await tx.delete(hppCostingItems).where(eq(hppCostingItems.costingId, id));
      } else {
        await tx.insert(hppCostings).values({ id, ...values, createdBy: session.user.id });
      }
      await tx.insert(hppCostingItems).values(result.items.map((item, index) => ({
        costingId: id, code: item.code, category: item.category, name: item.name, currency: item.currency,
        costBasis: item.costBasis, unitAmount: String(item.unitAmount), quantity: String(item.quantity),
        computedPerPax: item.computedPerPax.toFixed(2), sortOrder: index,
        metadata: { ...(input.items[index]?.metadata ?? {}), occupancy: item.occupancy },
      })));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: existingId ? "update" : "create", entityType: "hpp_costing", entityId: id, summary: `Simulasi HPP ${input.title} ${existingId ? "diperbarui" : "dibuat"}` });
    });
    revalidatePath("/admin/manajemen/hpp-umroh", "layout");
    return { ok: true, message: input.status === "final" ? "Perhitungan HPP berhasil difinalkan." : "Draft HPP berhasil disimpan.", redirectTo: `/admin/manajemen/hpp-umroh/${id}` };
  } catch (error) { return fail(error); }
}

export async function cloneHppCostingAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  try {
    const session = await requireAdminSession();
    const sourceId = String(formData.get("id") ?? "");
    const id = randomUUID();
    await withManagementTransaction(async (tx) => {
      const source = await tx.query.hppCostings.findFirst({ where: eq(hppCostings.id, sourceId) });
      if (!source) throw new Error("Simulasi asal tidak ditemukan.");
      const sourceItems = await tx.query.hppCostingItems.findMany({ where: eq(hppCostingItems.costingId, sourceId) });
      await tx.insert(hppCostings).values({
        id, title: `${source.title} - Salinan`, packageId: source.packageId, departureId: source.departureId,
        departureDate: source.departureDate, season: source.season, laMode: source.laMode, durationDays: source.durationDays,
        paxCount: source.paxCount, usdRate: source.usdRate, sarRate: source.sarRate, profitMargin: source.profitMargin,
        marketingFee: source.marketingFee, subtotalBase: source.subtotalBase, focTourLeader: source.focTourLeader,
        hppPerPax: source.hppPerPax, sellingPrice: source.sellingPrice, appliedPrice: source.appliedPrice,
        formulaVersion: source.formulaVersion, status: "draft", notes: source.notes, snapshot: source.snapshot,
        appliedAt: null, createdBy: session.user.id, updatedBy: session.user.id,
      });
      await tx.insert(hppCostingItems).values(sourceItems.map((item) => ({
        costingId: id, code: item.code, category: item.category, name: item.name, currency: item.currency,
        costBasis: item.costBasis, unitAmount: item.unitAmount, quantity: item.quantity,
        computedPerPax: item.computedPerPax, sortOrder: item.sortOrder, metadata: item.metadata,
      })));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "clone", entityType: "hpp_costing", entityId: id, summary: `Simulasi ${source.title} diduplikasi` });
    });
    revalidatePath("/admin/manajemen/hpp-umroh", "layout");
    return { ok: true, message: "Salinan simulasi berhasil dibuat.", redirectTo: `/admin/manajemen/hpp-umroh/${id}/edit` };
  } catch (error) { return fail(error); }
}

export async function applyHppPriceAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  try {
    const session = await requireAdminSession();
    const id = String(formData.get("id") ?? "");
    const departureId = String(formData.get("departureId") ?? "");
    const price = Math.round(Number(formData.get("appliedPrice") ?? 0));
    const confirmed = formData.get("confirmed") === "yes";
    if (!departureId || price <= 0) throw new Error("Pilih keberangkatan dan isi harga yang akan diterapkan.");
    if (!confirmed) throw new Error("Centang konfirmasi setelah memeriksa paket dan harga baru.");
    await withManagementTransaction(async (tx) => {
      const [costing, departure] = await Promise.all([
        tx.query.hppCostings.findFirst({ where: eq(hppCostings.id, id) }),
        tx.query.departures.findFirst({ where: eq(departures.id, departureId) }),
      ]);
      if (!costing || !departure) throw new Error("Simulasi atau keberangkatan tidak ditemukan.");
      await tx.update(departures).set({ price: String(price), updatedAt: new Date() }).where(eq(departures.id, departureId));
      await tx.update(hppCostings).set({ departureId, packageId: departure.packageId, appliedPrice: price, status: "applied", appliedAt: new Date(), updatedBy: session.user.id, updatedAt: new Date() }).where(eq(hppCostings.id, id));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "apply_price", entityType: "hpp_costing", entityId: id, summary: `Harga keberangkatan diubah dari Rp${Number(departure.price).toLocaleString("id-ID")} menjadi Rp${price.toLocaleString("id-ID")}` });
    });
    revalidatePath("/admin/manajemen/hpp-umroh", "layout");
    revalidatePath("/admin/paket", "layout");
    revalidatePath("/", "layout");
    return { ok: true, message: "Harga HPP berhasil diterapkan ke website.", redirectTo: `/admin/manajemen/hpp-umroh/${id}` };
  } catch (error) { return fail(error); }
}

export async function archiveHppCostingAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  try {
    const session = await requireAdminSession();
    const id = String(formData.get("id") ?? "");
    await withManagementTransaction(async (tx) => {
      const costing = await tx.query.hppCostings.findFirst({ where: eq(hppCostings.id, id) });
      if (!costing) throw new Error("Simulasi tidak ditemukan.");
      await tx.update(hppCostings).set({ status: "archived", updatedBy: session.user.id, updatedAt: new Date() }).where(eq(hppCostings.id, id));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "archive", entityType: "hpp_costing", entityId: id, summary: `Simulasi ${costing.title} diarsipkan` });
    });
    revalidatePath("/admin/manajemen/hpp-umroh", "layout");
    return { ok: true, message: "Simulasi dipindahkan ke arsip.", redirectTo: "/admin/manajemen/hpp-umroh" };
  } catch (error) { return fail(error); }
}

export async function saveHppMasterAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  try {
    const session = await requireAdminSession();
    const id = String(formData.get("id") ?? "");
    const amount = Number(formData.get("amount") ?? 0);
    const currency = String(formData.get("currency") ?? "IDR") as "IDR" | "USD" | "SAR";
    if (!id || !Number.isFinite(amount) || amount < 0 || !["IDR", "USD", "SAR"].includes(currency)) throw new Error("Harga master tidak valid.");
    await withManagementTransaction(async (tx) => {
      const item = await tx.query.hppPriceMaster.findFirst({ where: eq(hppPriceMaster.id, id) });
      if (!item) throw new Error("Item master tidak ditemukan.");
      await tx.update(hppPriceMaster).set({ amount: String(amount), currency, updatedBy: session.user.id, updatedAt: new Date() }).where(eq(hppPriceMaster.id, id));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "update", entityType: "hpp_price_master", entityId: id, summary: `Harga default ${item.name} diperbarui` });
    });
    revalidatePath("/admin/manajemen/hpp-umroh", "layout");
    return { ok: true, message: "Harga default berhasil diperbarui." };
  } catch (error) { return fail(error); }
}

export async function createHppMasterAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const parsed = masterSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "Periksa data master yang ditandai.", errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  try {
    const session = await requireAdminSession();
    const id = randomUUID();
    const input = parsed.data;
    await withManagementTransaction(async (tx) => {
      const duplicate = await tx.query.hppPriceMaster.findFirst({ where: and(eq(hppPriceMaster.category, input.category), eq(hppPriceMaster.name, input.name)) });
      if (duplicate?.status === "active") throw new Error("Nama master tersebut sudah ada pada kategori yang sama.");
      const [last] = await tx.select({ sortOrder: hppPriceMaster.sortOrder }).from(hppPriceMaster).where(eq(hppPriceMaster.category, input.category)).orderBy(desc(hppPriceMaster.sortOrder)).limit(1);
      await tx.insert(hppPriceMaster).values({
        id,
        code: hppMasterCode(input.category, input.name, id),
        category: input.category,
        name: input.name,
        currency: input.currency,
        costBasis: input.costBasis,
        amount: String(input.amount),
        sortOrder: (last?.sortOrder ?? 0) + 10,
        updatedBy: session.user.id,
      });
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "create", entityType: "hpp_price_master", entityId: id, summary: `Master HPP ${input.name} ditambahkan` });
    });
    revalidatePath("/admin/manajemen/hpp-umroh", "layout");
    return { ok: true, message: "Master harga baru berhasil ditambahkan.", redirectTo: "/admin/manajemen/hpp-umroh/master-harga" };
  } catch (error) { return fail(error); }
}

export async function deleteHppMasterAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  try {
    const session = await requireAdminSession();
    const id = String(formData.get("id") ?? "");
    if (!id) throw new Error("Master harga tidak ditemukan.");
    await withManagementTransaction(async (tx) => {
      const item = await tx.query.hppPriceMaster.findFirst({ where: eq(hppPriceMaster.id, id) });
      if (!item) throw new Error("Master harga tidak ditemukan.");
      await tx.update(hppPriceMaster).set({ status: "archived", updatedBy: session.user.id, updatedAt: new Date() }).where(eq(hppPriceMaster.id, id));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "archive", entityType: "hpp_price_master", entityId: id, summary: `Master HPP ${item.name} dihapus dari pilihan` });
    });
    revalidatePath("/admin/manajemen/hpp-umroh", "layout");
    return { ok: true, message: "Master harga dihapus dari pilihan perhitungan.", redirectTo: "/admin/manajemen/hpp-umroh/master-harga" };
  } catch (error) { return fail(error); }
}
