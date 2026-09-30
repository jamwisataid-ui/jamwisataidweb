export type ProfitLossTransaction = {
  id: string;
  transactionAt: Date | string;
  description: string;
  direction: string;
  kind: string;
  amount: number;
  isReversal: boolean;
  isIncludedInReports?: boolean;
  resolvedPackageId?: string | null;
  packageName?: string | null;
  categoryName?: string | null;
};

export type ProfitLossFilters = {
  from?: string;
  to?: string;
  packageId?: string;
};

export type ProfitLossOutcome = {
  kind: "profit" | "break-even" | "loss";
  label: "Laba" | "Impas" | "Rugi";
  amount: number;
};

export function getProfitLossOutcome(netProfit: number): ProfitLossOutcome {
  if (netProfit > 0) return { kind: "profit", label: "Laba", amount: netProfit };
  if (netProfit < 0) return { kind: "loss", label: "Rugi", amount: Math.abs(netProfit) };
  return { kind: "break-even", label: "Impas", amount: 0 };
}

export type ProfitLossRow = ProfitLossTransaction & {
  dateKey: string;
  categoryLabel: string;
  revenue: number;
  expense: number;
};

function jakartaDateKey(value: Date | string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function categoryLabel(transaction: ProfitLossTransaction) {
  if (transaction.kind === "payment") return "Pendapatan pembayaran";
  if (transaction.kind === "refund") return "Refund jamaah";
  if (transaction.kind === "commission") return "Komisi agen";
  if (transaction.kind === "expense") return transaction.categoryName || "Biaya operasional";
  if (transaction.kind === "manual") return transaction.direction === "in" ? "Pendapatan lain" : "Biaya lain";
  return transaction.categoryName || transaction.kind;
}

export function computeProfitLoss(transactions: ProfitLossTransaction[], filters: ProfitLossFilters = {}) {
  const rows: ProfitLossRow[] = transactions.flatMap((transaction) => {
    if (transaction.isIncludedInReports === false || transaction.isReversal) return [];
    if (transaction.direction === "transfer" || transaction.kind === "opening_balance") return [];
    if (transaction.direction !== "in" && transaction.direction !== "out") return [];
    if (filters.packageId && transaction.resolvedPackageId !== filters.packageId) return [];
    const dateKey = jakartaDateKey(transaction.transactionAt);
    if (filters.from && dateKey < filters.from) return [];
    if (filters.to && dateKey > filters.to) return [];
    return [{
      ...transaction,
      dateKey,
      categoryLabel: categoryLabel(transaction),
      revenue: transaction.direction === "in" ? transaction.amount : 0,
      expense: transaction.direction === "out" ? transaction.amount : 0,
    }];
  });

  const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
  const refunds = rows.filter((row) => row.kind === "refund").reduce((sum, row) => sum + row.expense, 0);
  const commissions = rows.filter((row) => row.kind === "commission").reduce((sum, row) => sum + row.expense, 0);
  const operatingExpenses = rows
    .filter((row) => row.direction === "out" && row.kind !== "refund" && row.kind !== "commission")
    .reduce((sum, row) => sum + row.expense, 0);
  const netRevenue = revenue - refunds;
  const netProfit = netRevenue - operatingExpenses - commissions;

  return { rows, revenue, refunds, netRevenue, operatingExpenses, commissions, netProfit };
}
