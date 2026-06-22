import { formatMoney } from "@/lib/formatting/money";
import { formatPercent } from "@/lib/formatting/percent";
import type { PortfolioState } from "@/types/portfolio";

export function XirrTab({ state }: { state: PortfolioState }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm text-slate-500">Portfolio XIRR</p>
        <p className="mt-2 text-4xl font-semibold">{formatPercent(state.summary.portfolioXirr)}</p>
        <p className="mt-2 text-sm text-slate-500">Open positions use market value when available, otherwise cost basis as terminal value.</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-neutral-800"><tr><th className="px-4 py-3">Position</th><th className="px-4 py-3">XIRR</th><th className="px-4 py-3">Terminal Value</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Status</th></tr></thead>
          <tbody>{state.positions.map((p) => <tr key={p.isin} className="border-b border-slate-100 last:border-0 dark:border-neutral-800"><td className="px-4 py-3 font-semibold">{p.name}</td><td className="px-4 py-3">{formatPercent(p.xirr)}</td><td className="px-4 py-3">{formatMoney(p.marketValue ?? p.openCostBasis, p.quote?.currency ?? p.currency)}</td><td className="px-4 py-3">{p.marketValue ? "Market value" : "Cost basis"}</td><td className="px-4 py-3">{p.status}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
