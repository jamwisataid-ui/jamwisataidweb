import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { agents, auditLogs, bookings, cashTransactions, financialAccounts, inventoryItems, inventoryMovements, managementSettings, packages, paymentAllocations, payments, pilgrims, registrations, departures } from "@/db/schema";
import { withManagementTransaction } from "@/db/transaction";
import { requireAdminSession } from "@/lib/admin-session";

type ImportRow = Record<string, string>;
const allowedTypes = new Set(["jamaah", "agen", "rekening", "stok", "pendaftaran"]);
const number = (value: string) => Number(String(value || "0").replace(/\D/g, ""));

function validateRows(rows: ImportRow[]) {
  const issues: string[] = [];
  rows.forEach((row, index) => {
    const line = index + 2;
    if (!allowedTypes.has(row.type)) issues.push(`Baris ${line}: type harus jamaah, agen, rekening, stok, atau pendaftaran.`);
    if ((row.type === "jamaah" || row.type === "agen") && (!row.name?.trim() || !row.whatsapp?.trim())) issues.push(`Baris ${line}: nama dan WhatsApp wajib diisi.`);
    if (row.type === "agen" && !row.agent_code?.trim()) issues.push(`Baris ${line}: agent_code wajib diisi.`);
    if (row.type === "rekening" && !row.account_name?.trim()) issues.push(`Baris ${line}: account_name wajib diisi.`);
    if (row.type === "stok" && (!row.item_name?.trim() || !Number.isInteger(number(row.stock)))) issues.push(`Baris ${line}: item_name dan stock wajib diisi.`);
    if (row.type === "pendaftaran" && (!row.whatsapp?.trim() || !row.departure_id?.trim() || number(row.agreed_price) <= 0)) issues.push(`Baris ${line}: WhatsApp jamaah, departure_id, dan agreed_price wajib diisi.`);
  });
  return issues;
}

export async function GET() {
  await requireAdminSession();
  const csv = "type,name,whatsapp,email,agent_code,commission,account_name,account_type,opening_balance,item_name,stock,departure_id,payer_name,agreed_price,paid_amount\n" +
    "jamaah,Budi Santoso,081234567890,budi@example.com,,,,,,,,,,,\n" +
    "agen,Agen Bandung,081234567891,,agen-bandung,500000,,,,,,,,,\n" +
    "rekening,,,,,,Bank BCA,bank,0,,,,,,\n" +
    "stok,,,,,,,,,Koper bagasi,25,,,,\n" +
    "pendaftaran,,081234567890,,,,Bank BCA,,,,,UUID-KEBERANGKATAN,Budi Santoso,30000000,5000000";
  return new NextResponse(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=template-import-jamwisata.csv" } });
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    const formData = await request.formData();
    const file = formData.get("file");
    const commit = formData.get("commit") === "true";
    if (!(file instanceof File) || file.size === 0 || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Pilih CSV maksimal 5 MB." }, { status: 400 });
    const rows = parse(await file.text(), { columns: true, skip_empty_lines: true, trim: true, bom: true }) as ImportRow[];
    if (!rows.length) return NextResponse.json({ error: "CSV tidak memiliki data." }, { status: 400 });
    if (rows.length > 10_000) return NextResponse.json({ error: "Maksimal 10.000 baris per import." }, { status: 400 });
    const issues = validateRows(rows);
    if (issues.length) return NextResponse.json({ ok: false, rows: rows.length, issues: issues.slice(0, 100) }, { status: 422 });
    const summary = rows.reduce<Record<string, number>>((result, row) => ({ ...result, [row.type]: (result[row.type] ?? 0) + 1 }), {});
    if (!commit) return NextResponse.json({ ok: true, preview: true, rows: rows.length, summary, issues: [] });

    await withManagementTransaction(async (tx) => {
      const settings = await tx.query.managementSettings.findFirst({ where: eq(managementSettings.id, "default") });
      for (const row of rows.filter((item) => item.type !== "pendaftaran")) {
        if (row.type === "jamaah") {
          const existing = await tx.query.pilgrims.findFirst({ where: eq(pilgrims.whatsapp, row.whatsapp) });
          if (!existing) await tx.insert(pilgrims).values({ fullName: row.name, whatsapp: row.whatsapp, email: row.email || null, createdBy: session.user.id, updatedBy: session.user.id });
        }
        if (row.type === "agen") {
          const existing = await tx.query.agents.findFirst({ where: eq(agents.referralCode, row.agent_code) });
          if (!existing) await tx.insert(agents).values({ name: row.name, whatsapp: row.whatsapp, email: row.email || null, referralCode: row.agent_code.toLowerCase(), defaultCommission: number(row.commission) === 1_000_000 ? 1_000_000 : 500_000 });
        }
        if (row.type === "rekening") {
          let account = await tx.query.financialAccounts.findFirst({ where: eq(financialAccounts.name, row.account_name) });
          if (!account) [account] = await tx.insert(financialAccounts).values({ name: row.account_name, type: row.account_type === "cash" ? "cash" : "bank" }).returning();
          const opening = number(row.opening_balance);
          if (opening > 0) await tx.insert(cashTransactions).values({ accountId: account.id, direction: "in", kind: "opening_balance", amount: opening, transactionAt: new Date(), description: "Saldo awal hasil import", createdBy: session.user.id });
        }
        if (row.type === "stok") {
          const item = await tx.query.inventoryItems.findFirst({ where: eq(inventoryItems.name, row.item_name) });
          if (!item) throw new Error(`Barang ${row.item_name} belum tersedia pada master stok.`);
          const stock = number(row.stock);
          await tx.update(inventoryItems).set({ currentStock: stock, updatedAt: new Date() }).where(eq(inventoryItems.id, item.id));
          await tx.insert(inventoryMovements).values({ itemId: item.id, kind: "adjustment", quantity: Math.abs(stock - item.currentStock), balanceAfter: stock, movedAt: new Date(), note: "Saldo awal hasil import", createdBy: session.user.id });
        }
      }
      for (const row of rows.filter((item) => item.type === "pendaftaran")) {
        const pilgrim = await tx.query.pilgrims.findFirst({ where: eq(pilgrims.whatsapp, row.whatsapp) });
        const departure = await tx.query.departures.findFirst({ where: eq(departures.id, row.departure_id) });
        if (!pilgrim || !departure) throw new Error(`Pendaftaran ${row.whatsapp}: jamaah atau keberangkatan tidak ditemukan.`);
        const pkg = await tx.query.packages.findFirst({ where: eq(packages.id, departure.packageId) });
        const agent = row.agent_code ? await tx.query.agents.findFirst({ where: eq(agents.referralCode, row.agent_code) }) : null;
        const bookingId = randomUUID();
        const registrationId = randomUUID();
        const bookingNumber = `IMP-${bookingId.slice(0, 8).toUpperCase()}`;
        await tx.insert(bookings).values({ id: bookingId, bookingNumber, departureId: departure.id, payerName: row.payer_name || pilgrim.fullName, payerWhatsapp: pilgrim.whatsapp, agentId: agent?.id ?? null, packageSnapshot: { packageId: pkg?.id, name: pkg?.name, departureDate: departure.departureDate, dateLabel: departure.dateLabel, listPrice: Number(departure.price) }, createdBy: session.user.id });
        await tx.insert(registrations).values({ id: registrationId, bookingId, pilgrimId: pilgrim.id, agreedPrice: number(row.agreed_price), dpTarget: settings?.defaultDpAmount ?? 5_000_000, commissionAmount: agent ? (number(row.commission) === 1_000_000 ? 1_000_000 : 500_000) : 0 });
        const paid = number(row.paid_amount);
        if (paid > 0) {
          const account = await tx.query.financialAccounts.findFirst({ where: eq(financialAccounts.name, row.account_name) });
          if (!account) throw new Error(`Rekening ${row.account_name} tidak ditemukan untuk pembayaran import.`);
          const paymentId = randomUUID();
          await tx.insert(payments).values({ id: paymentId, bookingId, accountId: account.id, paidAt: new Date(), amount: paid, method: "transfer", reference: "Import data lama", createdBy: session.user.id });
          await tx.insert(paymentAllocations).values({ paymentId, registrationId, amount: paid });
          await tx.insert(cashTransactions).values({ accountId: account.id, paymentId, direction: "in", kind: "payment", amount: paid, transactionAt: new Date(), description: `Pembayaran awal ${bookingNumber}`, createdBy: session.user.id });
        }
      }
      await tx.insert(auditLogs).values({ actorId: session.user.id, action: "import", entityType: "management", entityId: randomUUID(), summary: `${rows.length} baris data lama diimport`, metadata: { summary } });
    });
    return NextResponse.json({ ok: true, preview: false, rows: rows.length, summary });
  } catch (error) {
    console.error("Management import failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Import gagal." }, { status: 500 });
  }
}
