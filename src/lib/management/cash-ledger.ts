export type CashLedgerTransaction = {
  accountId: string;
  destinationAccountId?: string | null;
  direction: "in" | "out" | "transfer";
  amount: number;
  isIncludedInReports?: boolean;
};

export function calculateAccountBalance(accountId: string, transactions: readonly CashLedgerTransaction[]) {
  return transactions.reduce((balance, transaction) => {
    if (transaction.isIncludedInReports === false) return balance;
    if (transaction.accountId === accountId) {
      balance += transaction.direction === "in" ? transaction.amount : -transaction.amount;
    }
    if (transaction.direction === "transfer" && transaction.destinationAccountId === accountId) {
      balance += transaction.amount;
    }
    return balance;
  }, 0);
}
