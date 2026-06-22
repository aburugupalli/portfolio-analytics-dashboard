import { AllocationChart } from "@/components/charts/AllocationChart";
import { calculateConcentration } from "@/lib/portfolio/concentration";
import { formatMoney } from "@/lib/formatting/money";
import { formatPercent } from "@/lib/formatting/percent";
import type { PortfolioState } from "@/types/portfolio";

export function PortfolioAnalysisTab({ state }: { state: PortfolioState }) {
  const concentration = calculateConcentration(state.positions);
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"><h3 className="font-semibold">Allocation by Value</h3><AllocationChart positions={state.positions} /></section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold">Concentration</h3>
        <div className="mt-4 space-y-3 text-sm">
          <p>HHI <span className="float-right font-semibold">{concentration.hhi.toFixed(3)}</span></p>
          <p>Biggest Position <span className="float-right font-semibold">{formatPercent(concentration.biggestWeight)}</span></p>
          <p>Top 5 Weight <span className="float-right font-semibold">{formatPercent(concentration.top5Weight)}</span></p>
          {concentration.concentrationWarnings.map((w) => <p key={w} className="rounded-md bg-amber-50 p-2 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">{w}</p>)}
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold">Contribution</h3>
        <div className="mt-4 space-y-3">
          {state.positions.slice(0, 8).map((p) => <div key={p.isin} className="flex justify-between gap-3 text-sm"><span className="truncate">{p.name}</span><span className="font-semibold number-tabular">{formatMoney(p.totalPnl, p.currency)}</span></div>)}
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-3 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold">Benchmark Comparison</h3>
        <p className="mt-2 text-sm text-slate-500">Prepared benchmarks: S&P 500 (^GSPC), Nasdaq 100 (^NDX), QQQ, DAX (^GDAXI). Historical portfolio valuation is ready to extend once per-holding historical prices are fetched.</p>
      </section>
    </div>
  );
}
