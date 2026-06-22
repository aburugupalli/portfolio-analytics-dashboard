import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import type { PortfolioState } from "@/types/portfolio";

export function MarketDataStatusBar({ state, onRefresh, isRefreshing }: { state: PortfolioState; onRefresh: () => void; isRefreshing: boolean }) {
  const mapped = state.positions.filter((p) => p.symbol).length;
  const errors = state.positions.filter((p) => p.quote?.status === "Error").length;
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
          {errors ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          Market Data
        </span>
        <span className="text-slate-500 dark:text-slate-400">{mapped}/{state.positions.length} gemappt</span>
        <span className="text-slate-500 dark:text-slate-400">Last updated: {state.summary.lastMarketDataUpdate ? new Date(state.summary.lastMarketDataUpdate).toLocaleString("de-DE") : "N/A"}</span>
      </div>
      <button onClick={onRefresh} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950">
        <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        Fetch latest prices
      </button>
    </div>
  );
}
