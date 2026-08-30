"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";

import {
  agents,
  auditLogs,
  bookings,
  cashTransactions,
  commissions,
  departures,
  documentSequences,
  expenseCategories,
  financialAccounts,
  inventoryItems,
  inventoryMovements,
  issuedDocuments,
  managementSettings,
  packages,
  paymentAllocations,
  payments,
  pilgrims,
  refunds,
  registrations,
} from "@/db/schema";
import { withManagementTransaction } from "@/db/transaction";
import { requireAdminSession } from "@/lib/admin-session";
import { issueTransactionDocument } from "./issue-document";
import { paymentStatus } from "./domain";
import { deletePrivateObject } from "./storage";
import { agentSchema, bookingSchema, cashSchema, fields, type ManagementActionState, paymentSchema, pilgrimSchema, stockMovementSchema } from "./validation";

function raw(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function refresh() {
  revalidatePath("/admin/manajemen", "layout");
}

function managementRecordPath(entity: string, id: string) {
  const routeSegment = { pilgrim: "jamaah", agent: "agen-referral", account: "keuangan", inventory: "stok" }[entity];
  return routeSegment ? `/admin/manajemen/${routeSegment}/${id}` : "/admin/manajemen";
}

function failure(error: unknown): ManagementActionState {
  console.error("Management action failed:", error);
  return { ok: false, message: error instanceof Error ? error.message : "Terjadi kesalahan. Data belum disimpan." };
}

export async function seedManagementDefaultsAction(): Promise<ManagementActionState> {
  try {
    const session = await requireAdminSession();
    await withManagementTransaction(async (tx) => {
      await tx.insert(managementSettings).values({ id: "default" }).onConflictDoNothing();
      await tx.insert(expenseCategories).values([
        { name: "Tiket pesawat" }, { name: "Hotel" }, { name: "Visa" }, { name: "Perlengkapan" }, { name: "Transportasi" }, { name: "Konsumsi" }, { name: "Operasional lain" },
      ]).onConflictDoNothing();
      await tx.insert(inventoryItems).values([
        "Koper bagasi", "Koper kabin", "Kain ihram", "Seragam", "Kerudung", "Tas multifungsi", "ID card", "Cover koper", "Cover paspor", "Name tag",
      ].map((name) => ({ name }))).onConflictDoNothing();
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "initialize", entityType: "management", entityId: "default", summary: "Fondasi manajemen internal disiapkan" });
    });
    refresh();
    return { ok: true, message: "Data awal berhasil disiapkan.", redirectTo: "/admin/manajemen" };
  } catch (error) { return failure(error); }
}

export async function createPilgrimAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const parsed = pilgrimSchema.safeParse(raw(formData));
  if (!parsed.success) return { ok: false, message: "Periksa bagian yang ditandai.", errors: fields(parsed.error) };
  try {
    const session = await requireAdminSession();
    const id = randomUUID();
    await withManagementTransaction(async (tx) => {
      await tx.insert(pilgrims).values({
        id, ...parsed.data,
        email: parsed.data.email || null,
        gender: parsed.data.gender || null,
        birthDate: parsed.data.birthDate || null,
        passportNumber: parsed.data.passportNumber || null,
        passportExpiry: parsed.data.passportExpiry || null,
        notes: parsed.data.notes || null,
        createdBy: session.user.id,
        updatedBy: session.user.id,
      });
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "create", entityType: "pilgrim", entityId: id, summary: `Jamaah ${parsed.data.fullName} ditambahkan` });
    });
    refresh();
    return { ok: true, message: "Data jamaah berhasil disimpan.", redirectTo: `/admin/manajemen/jamaah/${id}` };
  } catch (error) { return failure(error); }
}

export async function updatePilgrimAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const id = String(formData.get("id") ?? "");
  const parsed = pilgrimSchema.safeParse(raw(formData));
  if (!id || !parsed.success) return { ok: false, message: "Periksa bagian yang ditandai.", errors: parsed.success ? undefined : fields(parsed.error) };
  try {
    const session = await requireAdminSession();
    await withManagementTransaction(async (tx) => {
      const existing = await tx.query.pilgrims.findFirst({ where: eq(pilgrims.id, id) });
      if (!existing) throw new Error("Data jamaah tidak ditemukan.");
      await tx.update(pilgrims).set({ ...parsed.data, email: parsed.data.email || null, gender: parsed.data.gender || null, birthDate: parsed.data.birthDate || null, passportNumber: parsed.data.passportNumber || null, passportExpiry: parsed.data.passportExpiry || null, notes: parsed.data.notes || null, updatedBy: session.user.id, updatedAt: new Date() }).where(eq(pilgrims.id, id));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "update", entityType: "pilgrim", entityId: id, summary: `Data jamaah ${parsed.data.fullName} diperbarui` });
    });
    refresh();
    return { ok: true, message: "Perubahan data jamaah berhasil disimpan.", redirectTo: `/admin/manajemen/jamaah/${id}` };
  } catch (error) { return failure(error); }
}

export async function createAgentAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const parsed = agentSchema.safeParse(raw(formData));
  if (!parsed.success) return { ok: false, message: "Periksa bagian yang ditandai.", errors: fields(parsed.error) };
  try {
    const session = await requireAdminSession();
    const id = randomUUID();
    await withManagementTransaction(async (tx) => {
      await tx.insert(agents).values({ id, ...parsed.data, email: parsed.data.email || null });
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "create", entityType: "agent", entityId: id, summary: `Agen ${parsed.data.name} ditambahkan` });
    });
    refresh();
    return { ok: true, message: "Agen dan link referral berhasil dibuat.", redirectTo: `/admin/manajemen/agen-referral/${id}` };
  } catch (error) { return failure(error); }
}

export async function updateAgentAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const id = String(formData.get("id") ?? "");
  const parsed = agentSchema.safeParse(raw(formData));
  if (!id || !parsed.success) return { ok: false, message: "Periksa bagian yang ditandai.", errors: parsed.success ? undefined : fields(parsed.error) };
  try {
    const session = await requireAdminSession();
    await withManagementTransaction(async (tx) => {
      const existing = await tx.query.agents.findFirst({ where: eq(agents.id, id) });
      if (!existing) throw new Error("Agen tidak ditemukan.");
      await tx.update(agents).set({ ...parsed.data, email: parsed.data.email || null, updatedAt: new Date() }).where(eq(agents.id, id));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "update", entityType: "agent", entityId: id, summary: `Agen ${parsed.data.name} diperbarui` });
    });
    refresh();
    return { ok: true, message: "Perubahan agen berhasil disimpan.", redirectTo: `/admin/manajemen/agen-referral/${id}` };
  } catch (error) { return failure(error); }
}

export async function setManagementRecordStatusAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const id = String(formData.get("id") ?? "");
  const entity = String(formData.get("entity") ?? "");
  const status = formData.get("status") === "archived" ? "archived" : "active";
  if (!id || !["pilgrim", "agent", "account", "inventory"].includes(entity)) return { ok: false, message: "Data yang akan diubah tidak valid." };
  try {
    const session = await requireAdminSession();
    await withManagementTransaction(async (tx) => {
      if (entity === "pilgrim") await tx.update(pilgrims).set({ status, updatedBy: session.user.id, updatedAt: new Date() }).where(eq(pilgrims.id, id));
      if (entity === "agent") await tx.update(agents).set({ status, updatedAt: new Date() }).where(eq(agents.id, id));
      if (entity === "account") await tx.update(financialAccounts).set({ status, updatedAt: new Date() }).where(eq(financialAccounts.id, id));
      if (entity === "inventory") await tx.update(inventoryItems).set({ status, updatedAt: new Date() }).where(eq(inventoryItems.id, id));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: status === "archived" ? "archive" : "restore", entityType: entity, entityId: id, summary: `Status ${entity} diubah menjadi ${status}` });
    });
    refresh();
    return { ok: true, message: status === "archived" ? "Data berhasil diarsipkan." : "Data berhasil diaktifkan kembali.", redirectTo: managementRecordPath(entity, id) };
  } catch (error) { return failure(error); }
}

export async function createBookingAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const parsed = bookingSchema.safeParse({ ...raw(formData), pilgrimIds: formData.getAll("pilgrimIds") });
  if (!parsed.success) return { ok: false, message: "Periksa bagian yang ditandai.", errors: fields(parsed.error) };
  try {
    const session = await requireAdminSession();
    const bookingId = randomUUID();
    await withManagementTransaction(async (tx) => {
      const departure = await tx.query.departures.findFirst({ where: eq(departures.id, parsed.data.departureId) });
      if (!departure) throw new Error("Paket keberangkatan tidak ditemukan.");
      const pkg = await tx.query.packages.findFirst({ where: eq(packages.id, departure.packageId) });
      if (!pkg) throw new Error("Paket tidak ditemukan.");
      const settings = await tx.query.managementSettings.findFirst({ where: eq(managementSettings.id, "default") });
      const bookingNumber = `REG-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${bookingId.slice(0, 6).toUpperCase()}`;
      const finalPrice = Math.max(0, parsed.data.agreedPrice - parsed.data.discountAmount);
      await tx.insert(bookings).values({
        id: bookingId,
        bookingNumber,
        departureId: departure.id,
        payerName: parsed.data.payerName,
        payerWhatsapp: parsed.data.payerWhatsapp,
        payerEmail: parsed.data.payerEmail || null,
        agentId: parsed.data.agentId || null,
        packageSnapshot: { packageId: pkg.id, name: pkg.name, departureDate: departure.departureDate, dateLabel: departure.dateLabel, airline: departure.airline, listPrice: Number(departure.price) },
        createdBy: session.user.id,
      });
      const registrationRows = parsed.data.pilgrimIds.map((pilgrimId) => ({
        id: randomUUID(), bookingId, pilgrimId, agreedPrice: finalPrice,
        discountAmount: parsed.data.discountAmount,
        dpTarget: parsed.data.dpTarget || settings?.defaultDpAmount || 5_000_000,
        commissionAmount: parsed.data.agentId ? parsed.data.commissionAmount : 0,
      }));
      await tx.insert(registrations).values(registrationRows);
      if (parsed.data.agentId && parsed.data.commissionAmount > 0) {
        await tx.insert(commissions).values(registrationRows.map((item) => ({ agentId: parsed.data.agentId!, registrationId: item.id, amount: parsed.data.commissionAmount })));
      }
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "create", entityType: "booking", entityId: bookingId, summary: `${bookingNumber} dibuat untuk ${registrationRows.length} jamaah` });
    });
    refresh();
    return { ok: true, message: "Pendaftaran dan harga jamaah berhasil disimpan.", redirectTo: `/admin/manajemen/keberangkatan/${bookingId}` };
  } catch (error) { return failure(error); }
}

export async function cancelBookingAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const bookingId = String(formData.get("bookingId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!bookingId || reason.length < 3) return { ok: false, message: "Alasan pembatalan wajib diisi minimal 3 karakter." };
  try {
    const session = await requireAdminSession();
    await withManagementTransaction(async (tx) => {
      const booking = await tx.query.bookings.findFirst({ where: eq(bookings.id, bookingId) });
      if (!booking) throw new Error("Pendaftaran tidak ditemukan.");
      if (booking.status !== "active") throw new Error("Pendaftaran ini sudah tidak aktif.");
      await tx.update(bookings).set({ status: "cancelled", cancellationReason: reason, updatedAt: new Date() }).where(eq(bookings.id, bookingId));
      await tx.update(registrations).set({ status: "cancelled", updatedAt: new Date() }).where(eq(registrations.bookingId, bookingId));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "cancel", entityType: "booking", entityId: bookingId, summary: `${booking.bookingNumber} dibatalkan: ${reason}` });
    });
    refresh();
    return { ok: true, message: "Pendaftaran berhasil dibatalkan. Catat refund terpisah jika ada pembayaran yang dikembalikan.", redirectTo: `/admin/manajemen/keberangkatan/${bookingId}` };
  } catch (error) { return failure(error); }
}

export async function recordPaymentAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  let allocations: unknown = [];
  try { allocations = JSON.parse(String(formData.get("allocations") ?? "[]")); } catch {}
  const parsed = paymentSchema.safeParse({ ...raw(formData), allocations });
  if (!parsed.success) return { ok: false, message: "Periksa nominal dan alokasi pembayaran.", errors: fields(parsed.error) };
  const allocatedTotal = parsed.data.allocations.reduce((total, item) => total + item.amount, 0);
  if (allocatedTotal !== parsed.data.amount) return { ok: false, message: "Total alokasi harus sama dengan nominal pembayaran.", errors: { allocations: ["Periksa kembali pembagian nominal per jamaah."] } };
  try {
    const session = await requireAdminSession();
    const paymentId = randomUUID();
    await withManagementTransaction(async (tx) => {
      const booking = await tx.query.bookings.findFirst({ where: eq(bookings.id, parsed.data.bookingId) });
      if (!booking) throw new Error("Pendaftaran tidak ditemukan.");
      if (booking.status !== "active") throw new Error("Pembayaran tidak dapat dicatat karena pendaftaran sudah dibatalkan atau selesai.");
      const invoice = await tx.query.issuedDocuments.findFirst({ where: and(eq(issuedDocuments.kind, "invoice"), eq(issuedDocuments.bookingId, parsed.data.bookingId), eq(issuedDocuments.status, "issued")) });
      if (!invoice) throw new Error("Invoice belum diterbitkan. Buat invoice terlebih dahulu sebelum mencatat pembayaran.");
      const registrationIds = parsed.data.allocations.map((item) => item.registrationId);
      const registrationRows = await tx.select().from(registrations).where(and(eq(registrations.bookingId, parsed.data.bookingId), inArray(registrations.id, registrationIds)));
      if (registrationRows.length !== registrationIds.length) throw new Error("Ada alokasi jamaah yang tidak sesuai dengan booking.");
      const existingAllocations = await tx.select({ registrationId: paymentAllocations.registrationId, amount: paymentAllocations.amount })
        .from(paymentAllocations).innerJoin(payments, eq(paymentAllocations.paymentId, payments.id))
        .where(and(inArray(paymentAllocations.registrationId, registrationIds), eq(payments.status, "confirmed")));
      const existingRefunds = await tx.select({ registrationId: refunds.registrationId, amount: refunds.amount }).from(refunds)
        .where(and(inArray(refunds.registrationId, registrationIds), eq(refunds.status, "confirmed")));
      for (const allocation of parsed.data.allocations) {
        const registration = registrationRows.find((item) => item.id === allocation.registrationId)!;
        const paid = existingAllocations.filter((item) => item.registrationId === registration.id).reduce((sum, item) => sum + item.amount, 0);
        const refunded = existingRefunds.filter((item) => item.registrationId === registration.id).reduce((sum, item) => sum + item.amount, 0);
        const current = paymentStatus({ agreedPrice: registration.agreedPrice, dpTarget: registration.dpTarget, paid, refunded });
        if (allocation.amount > current.outstanding) throw new Error(`Alokasi melebihi sisa tagihan salah satu jamaah (${current.outstanding.toLocaleString("id-ID")}).`);
      }
      const paidAt = new Date(parsed.data.paidAt);
      await tx.insert(payments).values({ id: paymentId, bookingId: parsed.data.bookingId, accountId: parsed.data.accountId, paidAt, amount: parsed.data.amount, method: parsed.data.method, reference: parsed.data.reference || null, note: parsed.data.note || null, createdBy: session.user.id });
      await tx.insert(paymentAllocations).values(parsed.data.allocations.map((item) => ({ paymentId, ...item })));
      await tx.insert(cashTransactions).values({ accountId: parsed.data.accountId, paymentId, direction: "in", kind: "payment", amount: parsed.data.amount, transactionAt: paidAt, description: `Pembayaran booking ${parsed.data.bookingId}`, createdBy: session.user.id });
      for (const allocation of parsed.data.allocations) {
        const registration = registrationRows.find((item) => item.id === allocation.registrationId)!;
        const paidBefore = existingAllocations.filter((item) => item.registrationId === registration.id).reduce((sum, item) => sum + item.amount, 0);
        const refunded = existingRefunds.filter((item) => item.registrationId === registration.id).reduce((sum, item) => sum + item.amount, 0);
        if (paymentStatus({ agreedPrice: registration.agreedPrice, dpTarget: registration.dpTarget, paid: paidBefore + allocation.amount, refunded }).status === "Lunas") {
          await tx.update(commissions).set({ status: "earned", earnedAt: paidAt, updatedAt: new Date() }).where(and(eq(commissions.registrationId, registration.id), eq(commissions.status, "pending")));
        }
      }
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "create", entityType: "payment", entityId: paymentId, summary: `Pembayaran Rp${parsed.data.amount.toLocaleString("id-ID")} dicatat` });
    });
    let receipt: Awaited<ReturnType<typeof issueTransactionDocument>> | null = null;
    let receiptError = "";
    try {
      receipt = await issueTransactionDocument({ kind: "receipt", bookingId: parsed.data.bookingId, paymentId, actorId: session.user.id });
    } catch (error) {
      console.error("Automatic receipt issue failed:", error);
      receiptError = error instanceof Error ? error.message : "Kwitansi otomatis gagal dibuat.";
    }
    refresh();
    if (receipt) return { ok: true, message: `Pembayaran berhasil dicatat. Kwitansi ${receipt.number} otomatis dibuat.`, redirectTo: `/admin/manajemen/invoice-kwitansi/${receipt.id}` };
    return { ok: true, message: `Pembayaran berhasil dicatat, tetapi kwitansi belum dibuat: ${receiptError}`, redirectTo: `/admin/manajemen/pembayaran/${paymentId}` };
  } catch (error) { return failure(error); }
}

export async function recordCashAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const parsed = cashSchema.safeParse(raw(formData));
  if (!parsed.success) return { ok: false, message: "Periksa data transaksi.", errors: fields(parsed.error) };
  if (parsed.data.direction === "transfer" && (!parsed.data.destinationAccountId || parsed.data.destinationAccountId === parsed.data.accountId)) {
    return { ok: false, message: "Rekening tujuan transfer harus berbeda." };
  }
  try {
    const session = await requireAdminSession();
    const id = randomUUID();
    await withManagementTransaction(async (tx) => {
      await tx.insert(cashTransactions).values({ id, accountId: parsed.data.accountId, destinationAccountId: parsed.data.destinationAccountId || null, packageId: parsed.data.packageId || null, categoryId: parsed.data.categoryId || null, direction: parsed.data.direction, kind: "manual", amount: parsed.data.amount, transactionAt: new Date(parsed.data.transactionAt), description: parsed.data.description, createdBy: session.user.id });
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "create", entityType: "cash_transaction", entityId: id, summary: `${parsed.data.direction === "in" ? "Kas masuk" : parsed.data.direction === "out" ? "Kas keluar" : "Transfer"} dicatat` });
    });
    refresh();
    return { ok: true, message: "Transaksi kas berhasil dicatat.", redirectTo: `/admin/manajemen/keuangan/${id}` };
  } catch (error) { return failure(error); }
}

export async function recordStockMovementAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const parsed = stockMovementSchema.safeParse(raw(formData));
  if (!parsed.success) return { ok: false, message: "Periksa data pergerakan stok.", errors: fields(parsed.error) };
  if (parsed.data.kind !== "adjustment" && parsed.data.quantity === 0) return { ok: false, message: "Jumlah stok masuk atau keluar harus lebih dari nol." };
  try {
    const session = await requireAdminSession();
    await withManagementTransaction(async (tx) => {
      const item = await tx.query.inventoryItems.findFirst({ where: eq(inventoryItems.id, parsed.data.itemId) });
      if (!item) throw new Error("Barang tidak ditemukan.");
      const delta = parsed.data.kind === "in" ? parsed.data.quantity : parsed.data.kind === "out" ? -parsed.data.quantity : parsed.data.quantity - item.currentStock;
      const balanceAfter = item.currentStock + delta;
      if (balanceAfter < 0) throw new Error(`Stok ${item.name} tidak cukup. Tersedia ${item.currentStock}.`);
      const id = randomUUID();
      await tx.update(inventoryItems).set({ currentStock: balanceAfter, updatedAt: new Date() }).where(eq(inventoryItems.id, item.id));
      await tx.insert(inventoryMovements).values({ id, itemId: item.id, kind: parsed.data.kind, quantity: Math.abs(delta), balanceAfter, movedAt: new Date(parsed.data.movedAt), note: parsed.data.note || null, createdBy: session.user.id });
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "create", entityType: "inventory_movement", entityId: id, summary: `Stok ${item.name} menjadi ${balanceAfter}` });
    });
    refresh();
    return { ok: true, message: "Stok dan histori berhasil diperbarui.", redirectTo: `/admin/manajemen/stok/${parsed.data.itemId}` };
  } catch (error) { return failure(error); }
}

export async function createAccountAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  try {
    const session = await requireAdminSession();
    const name = String(formData.get("name") ?? "").trim();
    if (name.length < 2) return { ok: false, message: "Nama rekening/kas wajib diisi." };
    const id = randomUUID();
    await withManagementTransaction(async (tx) => {
      await tx.insert(financialAccounts).values({ id, name, type: String(formData.get("type")) === "cash" ? "cash" : "bank", bankName: String(formData.get("bankName") || "") || null, accountNumber: String(formData.get("accountNumber") || "") || null, accountHolder: String(formData.get("accountHolder") || "") || null, showOnInvoice: formData.get("showOnInvoice") === "on" });
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "create", entityType: "financial_account", entityId: id, summary: `Akun ${name} ditambahkan` });
    });
    refresh();
    return { ok: true, message: "Rekening/kas berhasil ditambahkan.", redirectTo: "/admin/manajemen/keuangan" };
  } catch (error) { return failure(error); }
}

export async function updateAccountAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || name.length < 2) return { ok: false, message: "Nama rekening/kas wajib diisi." };
  try {
    const session = await requireAdminSession();
    await withManagementTransaction(async (tx) => {
      const existing = await tx.query.financialAccounts.findFirst({ where: eq(financialAccounts.id, id) });
      if (!existing) throw new Error("Rekening atau kas tidak ditemukan.");
      await tx.update(financialAccounts).set({ name, type: formData.get("type") === "cash" ? "cash" : "bank", bankName: String(formData.get("bankName") || "") || null, accountNumber: String(formData.get("accountNumber") || "") || null, accountHolder: String(formData.get("accountHolder") || "") || null, showOnInvoice: formData.get("showOnInvoice") === "on", updatedAt: new Date() }).where(eq(financialAccounts.id, id));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "update", entityType: "financial_account", entityId: id, summary: `Akun ${name} diperbarui` });
    });
    refresh();
    return { ok: true, message: "Rekening/kas berhasil diperbarui.", redirectTo: `/admin/manajemen/keuangan/${id}` };
  } catch (error) { return failure(error); }
}

export async function saveInventoryItemAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const unit = String(formData.get("unit") ?? "pcs").trim();
  const minimumStock = Number(formData.get("minimumStock"));
  if (name.length < 2 || unit.length < 1 || !Number.isInteger(minimumStock) || minimumStock < 0) return { ok: false, message: "Nama, satuan, atau batas minimum stok tidak valid." };
  try {
    const session = await requireAdminSession();
    const entityId = id || randomUUID();
    await withManagementTransaction(async (tx) => {
      if (id) {
        const existing = await tx.query.inventoryItems.findFirst({ where: eq(inventoryItems.id, id) });
        if (!existing) throw new Error("Barang tidak ditemukan.");
        await tx.update(inventoryItems).set({ name, unit, minimumStock, updatedAt: new Date() }).where(eq(inventoryItems.id, id));
      } else {
        await tx.insert(inventoryItems).values({ id: entityId, name, unit, minimumStock });
      }
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: id ? "update" : "create", entityType: "inventory_item", entityId, summary: `Barang ${name} ${id ? "diperbarui" : "ditambahkan"}` });
    });
    refresh();
    return { ok: true, message: id ? "Data barang berhasil diperbarui." : "Barang berhasil ditambahkan.", redirectTo: `/admin/manajemen/stok/${entityId}` };
  } catch (error) { return failure(error); }
}

export async function saveSequenceAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  try {
    const session = await requireAdminSession();
    const kind = formData.get("kind") === "receipt" ? "receipt" : "invoice";
    const fullNumber = String(formData.get("nextDocumentNumber") ?? "").trim();
    const numberParts = /^(\d{1,12})(.+)$/.exec(fullNumber);
    if (!numberParts) return { ok: false, message: `Nomor ${kind === "invoice" ? "invoice" : "kwitansi"} harus diawali angka, contohnya ${kind === "invoice" ? "9933/jamw/300828" : "0066/jamw/300826"}.` };
    const [, sequenceDigits, suffix] = numberParts;
    const nextNumber = Number(sequenceDigits);
    const padding = sequenceDigits.length;
    const pattern = `{seq}${suffix}`;
    if (!Number.isSafeInteger(nextNumber) || nextNumber < 1 || fullNumber.length > 100) return { ok: false, message: "Nomor berikutnya tidak valid." };
    await withManagementTransaction(async (tx) => {
      await tx.update(documentSequences).set({ active: false, updatedAt: new Date() }).where(eq(documentSequences.kind, kind));
      const id = randomUUID();
      await tx.insert(documentSequences).values({ id, kind, name: kind === "invoice" ? "Nomor invoice aktif" : "Nomor kwitansi aktif", pattern, padding, nextNumber, reset: "never", active: true });
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "activate", entityType: "document_sequence", entityId: id, summary: `Nomor ${kind} berikutnya diatur ke ${fullNumber}` });
    });
    refresh();
    return { ok: true, message: `Nomor ${kind === "invoice" ? "invoice" : "kwitansi"} berikutnya berhasil disimpan.`, redirectTo: "/admin/manajemen/invoice-kwitansi/baru" };
  } catch (error) { return failure(error); }
}

export async function recordRefundAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const paymentId = String(formData.get("paymentId") ?? "");
  const registrationId = String(formData.get("registrationId") ?? "");
  const accountId = String(formData.get("accountId") ?? "");
  const amount = Number(String(formData.get("amount") ?? "").replace(/\D/g, ""));
  const reason = String(formData.get("reason") ?? "").trim();
  if (!paymentId || !registrationId || !accountId || !Number.isSafeInteger(amount) || amount <= 0 || reason.length < 3) return { ok: false, message: "Pembayaran, jamaah, rekening, nominal, dan alasan refund wajib diisi." };
  try {
    const session = await requireAdminSession();
    await withManagementTransaction(async (tx) => {
      const payment = await tx.query.payments.findFirst({ where: and(eq(payments.id, paymentId), eq(payments.status, "confirmed")) });
      if (!payment) throw new Error("Pembayaran tidak ditemukan.");
      const allocation = await tx.query.paymentAllocations.findFirst({ where: and(eq(paymentAllocations.paymentId, paymentId), eq(paymentAllocations.registrationId, registrationId)) });
      if (!allocation) throw new Error("Pembayaran tidak dialokasikan ke jamaah tersebut.");
      const existing = await tx.select().from(refunds).where(and(eq(refunds.paymentId, paymentId), eq(refunds.registrationId, registrationId), eq(refunds.status, "confirmed")));
      const refundable = allocation.amount - existing.reduce((sum, item) => sum + item.amount, 0);
      if (amount > refundable) throw new Error(`Refund maksimal ${refundable.toLocaleString("id-ID")}.`);
      const id = randomUUID();
      const refundedAt = new Date();
      await tx.insert(refunds).values({ id, paymentId, registrationId, accountId, refundedAt, amount, reason, createdBy: session.user.id });
      await tx.insert(cashTransactions).values({ accountId, refundId: id, direction: "out", kind: "refund", amount, transactionAt: refundedAt, description: `Refund: ${reason}`, createdBy: session.user.id });
      const registration = await tx.query.registrations.findFirst({ where: eq(registrations.id, registrationId) });
      if (registration) {
        const allPaid = await tx.select({ amount: paymentAllocations.amount }).from(paymentAllocations).innerJoin(payments, eq(paymentAllocations.paymentId, payments.id)).where(and(eq(paymentAllocations.registrationId, registrationId), eq(payments.status, "confirmed")));
        const allRefunded = [...existing, { amount }].reduce((sum, item) => sum + item.amount, 0);
        const nowStatus = paymentStatus({ agreedPrice: registration.agreedPrice, dpTarget: registration.dpTarget, paid: allPaid.reduce((sum, item) => sum + item.amount, 0), refunded: allRefunded }).status;
        if (nowStatus !== "Lunas") {
          const commission = await tx.query.commissions.findFirst({ where: eq(commissions.registrationId, registrationId) });
          if (commission?.status === "paid") await tx.update(commissions).set({ status: "reversed", reversedAt: refundedAt, note: `Dibalik karena refund ${id}`, updatedAt: new Date() }).where(eq(commissions.id, commission.id));
          else if (commission?.status === "earned") await tx.update(commissions).set({ status: "pending", earnedAt: null, updatedAt: new Date() }).where(eq(commissions.id, commission.id));
        }
      }
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "refund", entityType: "payment", entityId: paymentId, summary: `Refund Rp${amount.toLocaleString("id-ID")} dicatat` });
    });
    refresh();
    return { ok: true, message: "Refund berhasil dicatat dan status diperbarui.", redirectTo: `/admin/manajemen/pembayaran/${paymentId}` };
  } catch (error) { return failure(error); }
}

export async function payCommissionAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const commissionId = String(formData.get("commissionId") ?? "");
  const accountId = String(formData.get("accountId") ?? "");
  if (!commissionId || !accountId) return { ok: false, message: "Komisi dan rekening pembayaran wajib dipilih." };
  try {
    const session = await requireAdminSession();
    let agentId = "";
    await withManagementTransaction(async (tx) => {
      const commission = await tx.query.commissions.findFirst({ where: and(eq(commissions.id, commissionId), eq(commissions.status, "earned")) });
      if (!commission) throw new Error("Komisi belum sah atau sudah dibayar.");
      agentId = commission.agentId;
      const agent = await tx.query.agents.findFirst({ where: eq(agents.id, commission.agentId) });
      const transactionId = randomUUID();
      const paidAt = new Date();
      await tx.insert(cashTransactions).values({ id: transactionId, accountId, direction: "out", kind: "commission", amount: commission.amount, transactionAt: paidAt, description: `Pembayaran komisi ${agent?.name ?? "agen"}`, createdBy: session.user.id });
      await tx.update(commissions).set({ status: "paid", paidAt, payoutTransactionId: transactionId, updatedAt: new Date() }).where(eq(commissions.id, commission.id));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "pay", entityType: "commission", entityId: commission.id, summary: `Komisi ${agent?.name ?? "agen"} dibayar` });
    });
    refresh();
    return { ok: true, message: "Komisi berhasil ditandai sudah dibayar.", redirectTo: agentId ? `/admin/manajemen/agen-referral/${agentId}` : "/admin/manajemen/agen-referral" };
  } catch (error) { return failure(error); }
}

export async function saveManagementSettingsAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const companyName = String(formData.get("companyName") ?? "").trim();
  const defaultDpAmount = Number(String(formData.get("defaultDpAmount") ?? "").replace(/\D/g, ""));
  const paymentDueDays = Number(formData.get("paymentDueDays"));
  const birthdayMessageTemplate = String(formData.get("birthdayMessageTemplate") ?? "").trim();
  if (companyName.length < 2 || !Number.isSafeInteger(defaultDpAmount) || defaultDpAmount <= 0 || !Number.isInteger(paymentDueDays) || paymentDueDays < 1 || paymentDueDays > 180 || birthdayMessageTemplate.length < 10 || birthdayMessageTemplate.length > 1000) return { ok: false, message: "Nama perusahaan, nominal DP, batas pelunasan, atau template ucapan tidak valid." };
  try {
    const session = await requireAdminSession();
    await withManagementTransaction(async (tx) => {
      await tx.insert(managementSettings).values({
        id: "default", companyName, defaultDpAmount, paymentDueDays, birthdayMessageTemplate,
        companyAddress: String(formData.get("companyAddress") ?? "").trim(),
        companyPhone: String(formData.get("companyPhone") ?? "").trim(),
        companyEmail: String(formData.get("companyEmail") ?? "").trim(),
        financeSignerName: String(formData.get("financeSignerName") ?? "").trim(),
        financeSignerTitle: String(formData.get("financeSignerTitle") ?? "Keuangan").trim(),
      }).onConflictDoUpdate({ target: managementSettings.id, set: {
        companyName, defaultDpAmount, paymentDueDays, birthdayMessageTemplate,
        companyAddress: String(formData.get("companyAddress") ?? "").trim(), companyPhone: String(formData.get("companyPhone") ?? "").trim(), companyEmail: String(formData.get("companyEmail") ?? "").trim(), financeSignerName: String(formData.get("financeSignerName") ?? "").trim(), financeSignerTitle: String(formData.get("financeSignerTitle") ?? "Keuangan").trim(), updatedAt: new Date(),
      } });
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "update", entityType: "management_settings", entityId: "default", summary: "Pengaturan manajemen diperbarui" });
    });
    refresh();
    return { ok: true, message: "Pengaturan berhasil disimpan.", redirectTo: "/admin/manajemen/pengaturan" };
  } catch (error) { return failure(error); }
}

export async function assignRoomAction(_state: ManagementActionState, formData: FormData): Promise<ManagementActionState> {
  const registrationId = String(formData.get("registrationId") ?? "");
  const roomType = String(formData.get("roomType") ?? "").toLowerCase();
  const roomNumber = String(formData.get("roomNumber") ?? "").trim();
  const capacities: Record<string, number> = { double: 2, triple: 3, quad: 4 };
  if (!registrationId || !capacities[roomType] || !roomNumber) return { ok: false, message: "Jamaah, tipe kamar, dan nomor kamar wajib diisi." };
  try {
    const session = await requireAdminSession();
    await withManagementTransaction(async (tx) => {
      const registration = await tx.query.registrations.findFirst({ where: eq(registrations.id, registrationId) });
      if (!registration) throw new Error("Pendaftaran jamaah tidak ditemukan.");
      const pilgrim = await tx.query.pilgrims.findFirst({ where: eq(pilgrims.id, registration.pilgrimId) });
      if (!pilgrim?.gender) throw new Error("Jenis kelamin jamaah wajib diisi sebelum mengatur kamar.");
      const booking = await tx.query.bookings.findFirst({ where: eq(bookings.id, registration.bookingId) });
      if (!booking) throw new Error("Booking tidak ditemukan.");
      const sameRoom = await tx.select().from(registrations).where(eq(registrations.roomNumber, roomNumber));
      const relevantRoom = [] as typeof sameRoom;
      for (const occupant of sameRoom) {
        if (occupant.id === registration.id) continue;
        const occupantBooking = await tx.query.bookings.findFirst({ where: eq(bookings.id, occupant.bookingId) });
        if (occupantBooking?.departureId === booking.departureId) relevantRoom.push(occupant);
      }
      const conflictingType = relevantRoom.find((occupant) => occupant.roomType !== roomType);
      if (conflictingType) throw new Error(`Kamar ${roomNumber} sudah terdaftar sebagai tipe ${conflictingType.roomType}.`);
      if (relevantRoom.length >= capacities[roomType]) throw new Error(`Kamar ${roomNumber} sudah penuh untuk tipe ${roomType}.`);
      for (const occupant of relevantRoom) {
        const occupantPilgrim = await tx.query.pilgrims.findFirst({ where: eq(pilgrims.id, occupant.pilgrimId) });
        if (occupantPilgrim?.gender && occupantPilgrim.gender !== pilgrim.gender) throw new Error(`Kamar ${roomNumber} sudah dipakai jamaah ${occupantPilgrim.gender.toLowerCase()}.`);
      }
      await tx.update(registrations).set({ roomType, roomNumber, updatedAt: new Date() }).where(eq(registrations.id, registration.id));
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "assign-room", entityType: "registration", entityId: registration.id, summary: `${pilgrim.fullName} ditempatkan di kamar ${roomNumber} (${roomType})` });
    });
    refresh();
    return { ok: true, message: "Room List berhasil diperbarui.", redirectTo: `/admin/manajemen/manifest-room-list/${registrationId}` };
  } catch (error) { return failure(error); }
}

export async function deleteIssuedDocumentAction(formData: FormData): Promise<ManagementActionState> {
  const id = String(formData.get("id") ?? "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { ok: false, message: "Dokumen tidak valid." };
  }
  try {
    const session = await requireAdminSession();
    let objectKey = "";
    let label = "dokumen";
    await withManagementTransaction(async (tx) => {
      const document = await tx.query.issuedDocuments.findFirst({ where: eq(issuedDocuments.id, id) });
      if (!document) throw new Error("Invoice atau kwitansi tidak ditemukan.");
      if (document.kind === "invoice") {
        const linkedReceipt = await tx.query.issuedDocuments.findFirst({
          where: and(eq(issuedDocuments.kind, "receipt"), eq(issuedDocuments.bookingId, document.bookingId), eq(issuedDocuments.status, "issued")),
        });
        if (linkedReceipt) throw new Error(`Hapus kwitansi ${linkedReceipt.number} terlebih dahulu sebelum menghapus invoice ini.`);
      }
      objectKey = document.objectKey;
      label = document.kind === "invoice" ? "Invoice" : "Kwitansi";
      await tx.delete(issuedDocuments).where(eq(issuedDocuments.id, document.id));
      await tx.insert(auditLogs).values({
        actorId: session.user.id,
        action: "delete",
        entityType: "issued_document",
        entityId: document.id,
        summary: `${label} ${document.number} dihapus`,
      });
    });
    if (objectKey) {
      try { await deletePrivateObject(objectKey); }
      catch (storageError) { console.error("Issued document object cleanup failed:", storageError); }
    }
    refresh();
    return { ok: true, message: `${label} berhasil dihapus.`, redirectTo: "/admin/manajemen/invoice-kwitansi" };
  } catch (error) { return failure(error); }
}
