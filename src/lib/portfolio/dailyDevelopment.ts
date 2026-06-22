import { format } from "date-fns";
import type { DailyDevelopmentEntry, MonthlyDevelopmentEntry, NormalizedTransaction } from "@/types/portfolio";

function empty(date: string): DailyDevelopmentEntry {
  return { date, netBuySell: 0, deposits: 0, withdrawals: 0, realizedPnl: 0, dividends: 0, fees: 0, taxes: 0, openCostBasisChange: 0 };
}

export function calculateDailyDevelopment(transactions: NormalizedTransaction[]) {
  const map = new Map<string, DailyDevelopmentEntry>();
  for (const tx of transactions.filter((t) => t.includedInCalculations && !t.duplicate)) {
    const item = map.get(tx.date) ?? empty(tx.date);
    const amount = Math.abs(tx.amount ?? (tx.shares ?? 0) * (tx.price ?? 0));
    if (tx.type === "Buy" || tx.type === "Savings plan") {
      item.netBuySell -= amount;
      item.openCostBasisChange += amount + tx.fee;
    }
    if (tx.type === "Sell") {
      item.netBuySell += amount;
      item.openCostBasisChange -= amount;
    }
    if (tx.type === "Deposit") item.deposits += amount;
    if (tx.type === "Withdrawal") item.withdrawals += amount;
    if (tx.type === "Distribution" || tx.type === "Interest") item.dividends += amount;
    item.fees += tx.fee;
    item.taxes += tx.tax;
    map.set(tx.date, item);
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateMonthlyDevelopment(daily: DailyDevelopmentEntry[]): MonthlyDevelopmentEntry[] {
  const map = new Map<string, MonthlyDevelopmentEntry>();
  for (const day of daily) {
    const month = format(new Date(`${day.date}T00:00:00`), "yyyy-MM");
    const item = map.get(month) ?? { ...empty(day.date), month };
    item.netBuySell += day.netBuySell;
    item.deposits += day.deposits;
    item.withdrawals += day.withdrawals;
    item.realizedPnl += day.realizedPnl;
    item.dividends += day.dividends;
    item.fees += day.fees;
    item.taxes += day.taxes;
    item.openCostBasisChange += day.openCostBasisChange;
    map.set(month, item);
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}
