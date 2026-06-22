"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { formatDate } from "@/lib/formatting/dates";
import { formatMoney } from "@/lib/formatting/money";
import { formatPercent } from "@/lib/formatting/percent";
import type { PortfolioState } from "@/types/portfolio";

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function HoldingsTab({ state }: { state: PortfolioState }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const rows = useMemo(() => state.positions.filter((p) => {
    const matchesQuery = `${p.name} ${p.isin} ${p.symbol ?? ""}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "open" && p.status === "Open") || (filter === "closed" && p.status === "Closed") || (filter === "winners" && p.totalPnl >= 0) || (filter === "losers" && p.totalPnl < 0) || (filter === "unmapped" && !p.symbol);
    return matchesQuery && matchesFilter;
  }), [filter, query, state.positions]);
  const exportCsv = () => {
    const header = ["Name", "ISIN", "Symbol", "Shares", "Avg Cost", "Cost Basis", "Current Price", "Market Value", "Unrealized P&L", "Realized P&L", "Total P&L", "Weight"];
    const body = rows.map((p) => [p.name, p.isin, p.symbol, p.shares, p.averageCost, p.openCostBasis, p.currentPrice, p.marketValue, p.unrealizedPnl, p.realizedPnl, p.totalPnl, p.portfolioWeight].map(csvEscape).join(";"));
    const blob = new Blob([[header.join(";"), ...body].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "holdings.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-900">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search holdings" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <div className="flex gap-2 overflow-x-auto">
          {["all", "open", "closed", "winners", "losers", "unmapped"].map((item) => (
            <button key={item} onClick={() => setFilter(item)} className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium capitalize dark:border-neutral-800 dark:bg-neutral-900">{item}</button>
          ))}
          <button onClick={exportCsv} className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950" title="Export CSV"><Download className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-neutral-800">
            <tr>{["Name", "Shares", "Avg Cost", "Current", "Market Value", "Today", "Unrealized", "Realized", "Total", "Weight", "First Buy", "Status"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.isin} className="border-b border-slate-100 last:border-0 dark:border-neutral-800">
                <td className="px-4 py-3"><Link href={`/dashboard/holding/${encodeURIComponent(p.isin)}`} className="font-semibold hover:underline">{p.name}</Link><div className="text-xs text-slate-500">{p.isin} {p.symbol ? `· ${p.symbol}` : "· unmapped"}</div></td>
                <td className="px-4 py-3 number-tabular">{p.shares.toFixed(4)}</td>
                <td className="px-4 py-3 number-tabular">{formatMoney(p.averageCost, p.currency)}</td>
                <td className="px-4 py-3 number-tabular">{formatMoney(p.currentPrice, p.quote?.currency ?? p.currency)}</td>
                <td className="px-4 py-3 number-tabular">{formatMoney(p.marketValue, p.quote?.currency ?? p.currency)}</td>
                <td className="px-4 py-3 number-tabular">{formatMoney(p.dailyPnl, p.quote?.currency ?? p.currency)}<div className="text-xs">{formatPercent(p.dailyPnlPercent)}</div></td>
                <td className="px-4 py-3 number-tabular">{formatMoney(p.unrealizedPnl, p.quote?.currency ?? p.currency)}<div className="text-xs">{formatPercent(p.unrealizedPercent)}</div></td>
                <td className="px-4 py-3 number-tabular">{formatMoney(p.realizedPnl, p.currency)}</td>
                <td className="px-4 py-3 number-tabular">{formatMoney(p.totalPnl, p.currency)}<div className="text-xs">{formatPercent(p.totalReturnPercent)}</div></td>
                <td className="px-4 py-3 number-tabular">{formatPercent(p.portfolioWeight)}</td>
                <td className="px-4 py-3">{formatDate(p.firstBuyDate)}</td>
                <td className="px-4 py-3">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
