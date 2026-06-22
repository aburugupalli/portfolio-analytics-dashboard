import { AllocationChart } from "@/components/charts/AllocationChart";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { formatMoney } from "@/lib/formatting/money";
import { formatPercent } from "@/lib/formatting/percent";
import type { PortfolioState } from "@/types/portfolio";
import { KpiCard } from "./KpiCard";

export function OverviewTab({ state }: { state: PortfolioState }) {
  const s = state.summary;
  const kpis = [
    ["Portfolio Value", formatMoney(s.portfolioValue), s.lastMarketDataUpdate ? "Yahoo / Manual" : "Requires market data"],
    ["Today’s Change", formatMoney(s.todaysChange), "Daily P&L"],
    ["Total Invested", formatMoney(s.totalInvested), "FIFO cost basis"],
    ["Open Cost Basis", formatMoney(s.openCostBasis), "Current open lots"],
    ["Realized P&L", formatMoney(s.realizedPnl), "Net after fees/taxes"],
    ["Unrealized P&L", formatMoney(s.unrealizedPnl), s.unrealizedPnl === undefined ? "Requires market data" : "Open positions"],
    ["Total P&L", formatMoney(s.totalPnl), "Realized + unrealized + dividends"],
    ["Total Return %", formatPercent(s.totalReturnPercent), "On invested capital"],
    ["Portfolio XIRR", formatPercent(s.portfolioXirr), "Personal return"],
    ["Net Deposits", formatMoney(s.netDeposits), "Deposits - withdrawals"],
    ["Total Fees", formatMoney(s.totalFees), "Broker costs"],
    ["Total Taxes Paid", formatMoney(s.totalTaxes), "Negative = refunds"],
    ["Total Dividends", formatMoney(s.totalDividends), "Distributions + interest"],
    ["Transactions", String(s.transactionCount), `${s.openPositions} open / ${s.closedPositions} closed`],
    ["First Transaction", s.firstTransactionDate ?? "N/A", s.portfolioAgeDays ? `${s.portfolioAgeDays} days` : undefined],
    ["Biggest Holding", s.biggestHolding?.name ?? "N/A", s.biggestHolding?.portfolioWeight !== undefined ? formatPercent(s.biggestHolding.portfolioWeight) : undefined],
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(([label, value, sublabel]) => (
          <KpiCard key={label} label={label ?? ""} value={value ?? "N/A"} sublabel={sublabel} tone={String(value).includes("-") ? "negative" : "neutral"} />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold">Allocation</h3>
          <AllocationChart positions={state.positions} />
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold">Daily Development</h3>
          <PerformanceChart data={state.dailyDevelopment} />
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold">Monthly Deployment</h3>
          <MonthlyBarChart data={state.monthlyDevelopment} />
        </section>
      </div>
    </div>
  );
}
