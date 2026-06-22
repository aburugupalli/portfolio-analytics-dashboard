import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { formatMoney } from "@/lib/formatting/money";
import type { PortfolioState } from "@/types/portfolio";

export function DailyDevelopmentTab({ state }: { state: PortfolioState }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"><h3 className="font-semibold">Transaction-driven Development</h3><PerformanceChart data={state.dailyDevelopment} /></section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"><h3 className="font-semibold">Monthly Aggregation</h3><MonthlyBarChart data={state.monthlyDevelopment} /></section>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-neutral-800"><tr>{["Date", "Buy/Sell", "Deposits", "Withdrawals", "Dividends", "Fees", "Taxes", "Cost Basis Δ"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>{state.dailyDevelopment.map((d) => <tr key={d.date} className="border-b border-slate-100 last:border-0 dark:border-neutral-800"><td className="px-4 py-3">{d.date}</td><td className="px-4 py-3">{formatMoney(d.netBuySell)}</td><td className="px-4 py-3">{formatMoney(d.deposits)}</td><td className="px-4 py-3">{formatMoney(d.withdrawals)}</td><td className="px-4 py-3">{formatMoney(d.dividends)}</td><td className="px-4 py-3">{formatMoney(d.fees)}</td><td className="px-4 py-3">{formatMoney(d.taxes)}</td><td className="px-4 py-3">{formatMoney(d.openCostBasisChange)}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
