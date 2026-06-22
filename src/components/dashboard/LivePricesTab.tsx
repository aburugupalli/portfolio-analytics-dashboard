"use client";

import { useState } from "react";
import { Save, Search } from "lucide-react";
import { formatMoney } from "@/lib/formatting/money";
import type { SearchResult, SymbolMapping } from "@/types/market";
import type { PortfolioState } from "@/types/portfolio";

export function LivePricesTab({ state, onMappingsChange }: { state: PortfolioState; onMappingsChange: (mappings: SymbolMapping[]) => void }) {
  const [results, setResults] = useState<Record<string, SearchResult[]>>({});
  const [manual, setManual] = useState<Record<string, string>>({});
  async function search(isin: string, query: string) {
    const response = await fetch(`/api/market/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    setResults((prev) => ({ ...prev, [isin]: data.results ?? [] }));
  }
  function saveMapping(isin: string, symbol: string, meta?: Partial<SearchResult>) {
    const position = state.positions.find((p) => p.isin === isin);
    const now = new Date().toISOString();
    const next = [...state.mappings.filter((m) => m.isin !== isin), { isin, name: position?.name ?? isin, yahooSymbol: symbol, exchange: meta?.exchange, currency: meta?.currency, quoteType: meta?.quoteType, confirmedByUser: true, createdAt: now, updatedAt: now }];
    onMappingsChange(next);
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">Mapped<div className="text-2xl font-semibold">{state.positions.filter((p) => p.symbol).length}</div></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">Unmapped<div className="text-2xl font-semibold">{state.positions.filter((p) => !p.symbol).length}</div></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">Quotes<div className="text-2xl font-semibold">{state.positions.filter((p) => p.quote).length}</div></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">Errors<div className="text-2xl font-semibold">{state.positions.filter((p) => p.quote?.status === "Error").length}</div></div>
      </div>
      <div className="space-y-3">
        {state.positions.map((p) => (
          <div key={p.isin} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-slate-500">{p.isin} · {p.symbol ?? "not mapped"} · {p.quote?.status ?? "No quote"}</p>
              </div>
              <div className="text-sm number-tabular">{formatMoney(p.currentPrice, p.quote?.currency ?? p.currency)} · {p.quote?.marketState ?? "Unknown"}</div>
              <div className="flex min-w-0 gap-2">
                <input value={manual[p.isin] ?? ""} onChange={(e) => setManual((prev) => ({ ...prev, [p.isin]: e.target.value.toUpperCase() }))} placeholder="Yahoo symbol" className="min-h-10 min-w-0 rounded-md border border-slate-200 bg-transparent px-3 text-sm dark:border-neutral-800" />
                <button onClick={() => search(p.isin, p.name)} className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 dark:border-neutral-800" title="Search"><Search className="h-4 w-4" /></button>
                <button onClick={() => saveMapping(p.isin, manual[p.isin] || p.symbol || "")} className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950" title="Save"><Save className="h-4 w-4" /></button>
              </div>
            </div>
            {results[p.isin]?.length ? (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {results[p.isin].map((r) => (
                  <button key={r.symbol} onClick={() => saveMapping(p.isin, r.symbol, r)} className="min-h-10 rounded-md border border-slate-200 px-3 text-left text-sm dark:border-neutral-800">
                    <span className="font-semibold">{r.symbol}</span> <span className="text-slate-500">{r.shortName ?? r.longName}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
