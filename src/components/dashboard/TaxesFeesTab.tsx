import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { formatMoney } from "@/lib/formatting/money";
import type { PortfolioState } from "@/types/portfolio";

export function TaxesFeesTab({ state }: { state: PortfolioState }) {
  const events = state.transactions.filter((tx) => tx.fee || tx.tax || tx.type === "Fee" || tx.type === "Taxes");
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">Total Fees<div className="text-2xl font-semibold">{formatMoney(state.summary.totalFees)}</div></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">Total Taxes<div className="text-2xl font-semibold">{formatMoney(state.summary.totalTaxes)}</div></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">Tax Refunds<div className="text-2xl font-semibold">{formatMoney(Math.abs(events.filter((e) => e.tax < 0).reduce((s, e) => s + e.tax, 0)))}</div></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">Fee Drag<div className="text-2xl font-semibold">{state.summary.totalInvested ? ((state.summary.totalFees / state.summary.totalInvested) * 100).toFixed(2) : "0.00"}%</div></div>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"><h3 className="font-semibold">Fees & Taxes over Time</h3><MonthlyBarChart data={state.monthlyDevelopment} /></section>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-neutral-800"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Fee</th><th className="px-4 py-3">Tax</th></tr></thead><tbody>{events.map((tx) => <tr key={tx.id} className="border-b border-slate-100 last:border-0 dark:border-neutral-800"><td className="px-4 py-3">{tx.date}</td><td className="px-4 py-3">{tx.description}</td><td className="px-4 py-3">{tx.type}</td><td className="px-4 py-3">{formatMoney(tx.fee)}</td><td className="px-4 py-3">{formatMoney(tx.tax)}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
