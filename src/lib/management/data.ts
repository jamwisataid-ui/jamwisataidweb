import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { requireDatabase } from "@/db";
import {
  agents,
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
  pilgrimDocuments,
  pilgrims,
  referralLeads,
  refunds,
  registrations,
} from "@/db/schema";
import { dueDate, paymentStatus, upcomingBirthday } from "./domain";

export async function getManagementContext() {
  const db = requireDatabase();
  const [pilgrimRows, packageRows, departureRows, agentRows, accountRows, categoryRows, settingsRows, bookingRows, registrationRows, paymentRows, allocationRows, refundRows, inventoryRows, movementRows, commissionRows, documentRows, sequenceRows, leadRows, pilgrimDocumentRows, cashRows] = await Promise.all([
    db.select().from(pilgrims).orderBy(desc(pilgrims.createdAt)),
    db.select().from(packages).orderBy(desc(packages.createdAt)),
    db.select().from(departures).orderBy(asc(departures.departureDate)),
    db.select().from(agents).orderBy(asc(agents.name)),
    db.select().from(financialAccounts).orderBy(asc(financialAccounts.sortOrder), asc(financialAccounts.name)),
    db.select().from(expenseCategories).orderBy(asc(expenseCategories.name)),
    db.select().from(managementSettings).limit(1),
    db.select().from(bookings).orderBy(desc(bookings.createdAt)),
    db.select().from(registrations).orderBy(desc(registrations.createdAt)),
    db.select().from(payments).orderBy(desc(payments.paidAt)),
    db.select().from(paymentAllocations),
    db.select().from(refunds).orderBy(desc(refunds.refundedAt)),
    db.select().from(inventoryItems).orderBy(asc(inventoryItems.name)),
    db.select().from(inventoryMovements).orderBy(desc(inventoryMovements.movedAt)).limit(100),
    db.select().from(commissions).orderBy(desc(commissions.createdAt)),
    db.select().from(issuedDocuments).orderBy(desc(issuedDocuments.issuedAt)),
    db.select().from(documentSequences).orderBy(desc(documentSequences.createdAt)),
    db.select().from(referralLeads).orderBy(desc(referralLeads.createdAt)),
    db.select().from(pilgrimDocuments).orderBy(desc(pilgrimDocuments.createdAt)),
    db.select().from(cashTransactions).orderBy(desc(cashTransactions.transactionAt)).limit(500),
  ]);

  const pilgrimsById = new Map(pilgrimRows.map((item) => [item.id, item]));
  const packagesById = new Map(packageRows.map((item) => [item.id, item]));
  const departuresById = new Map(departureRows.map((item) => [item.id, item]));
  const agentsById = new Map(agentRows.map((item) => [item.id, item]));
  const bookingsById = new Map(bookingRows.map((item) => [item.id, item]));
  const registrationsById = new Map(registrationRows.map((item) => [item.id, item]));
  const validPaymentIds = new Set(paymentRows.filter((item) => item.status === "confirmed").map((item) => item.id));

  const registrationSummaries = registrationRows.map((registration) => {
    const paid = allocationRows.filter((item) => item.registrationId === registration.id && validPaymentIds.has(item.paymentId)).reduce((sum, item) => sum + item.amount, 0);
    const refunded = refundRows.filter((item) => item.registrationId === registration.id && item.status === "confirmed").reduce((sum, item) => sum + item.amount, 0);
    const booking = bookingsById.get(registration.bookingId);
    const departure = booking ? departuresById.get(booking.departureId) : undefined;
    const pkg = departure ? packagesById.get(departure.packageId) : undefined;
    return {
      ...registration,
      pilgrim: pilgrimsById.get(registration.pilgrimId),
      booking,
      departure,
      package: pkg,
      payment: paymentStatus({ agreedPrice: registration.agreedPrice, dpTarget: registration.dpTarget, paid, refunded }),
      dueAt: departure ? dueDate(departure.departureDate, settingsRows[0]?.paymentDueDays ?? 30) : null,
    };
  });

  const bookingSummaries = bookingRows.map((booking) => ({
    ...booking,
    departure: departuresById.get(booking.departureId),
    registrations: registrationSummaries.filter((item) => item.bookingId === booking.id),
    agent: booking.agentId ? agentsById.get(booking.agentId) : undefined,
  }));

  const accountBalances = accountRows.map((account) => {
    let balance = 0;
    for (const transaction of cashRows) {
      if (transaction.accountId === account.id) balance += transaction.direction === "in" ? transaction.amount : -transaction.amount;
      if (transaction.direction === "transfer" && transaction.destinationAccountId === account.id) balance += transaction.amount;
    }
    return { ...account, balance };
  });

  const packageFinancials = packageRows.map((pkg) => {
    const packageRegistrationIds = new Set(registrationSummaries.filter((item) => item.package?.id === pkg.id).map((item) => item.id));
    const income = allocationRows.filter((item) => packageRegistrationIds.has(item.registrationId) && validPaymentIds.has(item.paymentId)).reduce((sum, item) => sum + item.amount, 0);
    const refunded = refundRows.filter((item) => item.registrationId && packageRegistrationIds.has(item.registrationId) && item.status === "confirmed").reduce((sum, item) => sum + item.amount, 0);
    const directExpenses = cashRows.filter((item) => item.packageId === pkg.id && item.direction === "out" && item.kind !== "refund" && item.kind !== "commission").reduce((sum, item) => sum + item.amount, 0);
    const paidCommissions = commissionRows.filter((item) => packageRegistrationIds.has(item.registrationId) && item.status === "paid").reduce((sum, item) => sum + item.amount, 0);
    const receivables = registrationSummaries.filter((item) => item.package?.id === pkg.id).reduce((sum, item) => sum + item.payment.outstanding, 0);
    return { packageId: pkg.id, packageName: pkg.name, income, refunded, expenses: directExpenses, commissions: paidCommissions, receivables, realizedProfit: income - refunded - directExpenses - paidCommissions };
  });

  const upcomingBirthdays = pilgrimRows.flatMap((pilgrim) => {
    if (!pilgrim.birthDate || pilgrim.status !== "active") return [];
    const birthday = upcomingBirthday(pilgrim.birthDate);
    return birthday && birthday.daysUntil <= 14 ? [{ id: pilgrim.id, fullName: pilgrim.fullName, whatsapp: pilgrim.whatsapp, birthDate: pilgrim.birthDate, ...birthday }] : [];
  }).sort((a, b) => a.daysUntil - b.daysUntil || a.fullName.localeCompare(b.fullName));

  return {
    pilgrims: pilgrimRows,
    packages: packageRows,
    departures: departureRows.map((departure) => ({ ...departure, package: packagesById.get(departure.packageId) })),
    agents: agentRows,
    accounts: accountBalances,
    categories: categoryRows,
    settings: settingsRows[0] ?? null,
    bookings: bookingSummaries,
    registrations: registrationSummaries,
    payments: paymentRows.map((payment) => ({ ...payment, booking: bookingsById.get(payment.bookingId), allocations: allocationRows.filter((item) => item.paymentId === payment.id) })),
    refunds: refundRows,
    inventory: inventoryRows,
    movements: movementRows,
    commissions: commissionRows.map((commission) => ({ ...commission, agent: agentsById.get(commission.agentId), registration: registrationsById.get(commission.registrationId), pilgrim: pilgrimsById.get(registrationsById.get(commission.registrationId)?.pilgrimId ?? "") })),
    documents: documentRows,
    sequences: sequenceRows,
    leads: leadRows.map((lead) => ({ ...lead, agent: agentsById.get(lead.agentId), package: lead.packageId ? packagesById.get(lead.packageId) : undefined })),
    pilgrimDocuments: pilgrimDocumentRows,
    cashTransactions: cashRows,
    packageFinancials,
    upcomingBirthdays,
    dashboard: {
      activePilgrims: pilgrimRows.filter((item) => item.status === "active").length,
      activePackages: packageRows.filter((item) => item.status === "published").length,
      registrations: registrationRows.filter((item) => item.status === "active").length,
      netCash: accountBalances.reduce((sum, item) => sum + item.balance, 0),
      receivables: registrationSummaries.reduce((sum, item) => sum + item.payment.outstanding, 0),
      dueSoon: registrationSummaries.filter((item) => item.payment.status !== "Lunas" && item.dueAt && item.dueAt <= new Date(Date.now() + 14 * 86400000)).length,
      incompleteDocuments: pilgrimRows.filter((pilgrim) => {
        const kinds = new Set(pilgrimDocumentRows.filter((doc) => doc.pilgrimId === pilgrim.id && doc.reviewStatus !== "rejected").map((doc) => doc.kind));
        return !kinds.has("ktp") || !kinds.has("kk") || !(kinds.has("akta_lahir") || kinds.has("buku_nikah") || kinds.has("ijazah"));
      }).length,
      lowStock: inventoryRows.filter((item) => item.currentStock <= item.minimumStock).length,
      earnedCommission: commissionRows.filter((item) => item.status === "earned").reduce((sum, item) => sum + item.amount, 0),
    },
  };
}

export async function getReferralPage(code: string) {
  const db = requireDatabase();
  const agent = await db.query.agents.findFirst({ where: eq(agents.referralCode, code.toLowerCase()) });
  if (!agent || agent.status !== "active") return null;
  const packageRows = await db.select({ id: packages.id, name: packages.name }).from(packages).where(eq(packages.status, "published")).orderBy(asc(packages.name));
  return { agent, packages: packageRows };
}
