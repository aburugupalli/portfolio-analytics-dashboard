"use client";

import { useRef } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { clearLocalPortfolioData, exportLocalData, importLocalData } from "@/lib/storage/localPortfolioStore";
import type { SymbolMapping } from "@/types/market";
import type { PortfolioState } from "@/types/portfolio";

export function SettingsTab({ state, onMappingsChange, onDataChanged }: { state: PortfolioState; onMappingsChange: (mappings: SymbolMapping[]) => void; onDataChanged: () => void }) {
  const importRef = useRef<HTMLInputElement>(null);
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(exportLocalData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-intelligence-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const staticReport = () => {
    const html = `<!doctype html><title>Portfolio Report</title><body><h1>Portfolio Report</h1><p>Total P&L: ${state.summary.totalPnl}</p><table>${state.positions.map((p) => `<tr><td>${p.name}</td><td>${p.isin}</td><td>${p.totalPnl}</td></tr>`).join("")}</table></body>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-report.html";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold">Privacy</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">CSV parsing, portfolio calculations, mappings, manual prices and alerts are stored locally in your browser. Market-data requests send only Yahoo symbols, not transaction history.</p>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold">Data</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={exportJson} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"><Download className="h-4 w-4" /> Export JSON</button>
          <button onClick={staticReport} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold dark:border-neutral-800"><Download className="h-4 w-4" /> Static HTML Report</button>
          <button onClick={() => importRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold dark:border-neutral-800"><Upload className="h-4 w-4" /> Import JSON</button>
          <input ref={importRef} type="file" accept="application/json" className="sr-only" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            importLocalData(JSON.parse(await file.text()));
            onDataChanged();
          }} />
          <button onClick={() => { clearLocalPortfolioData(); onDataChanged(); }} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-red-600 px-4 text-sm font-semibold text-white"><Trash2 className="h-4 w-4" /> Clear Local Data</button>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold">Symbol Mapping</h3>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-neutral-800"><tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">ISIN</th><th className="px-3 py-2">Yahoo Symbol</th><th className="px-3 py-2">Action</th></tr></thead><tbody>{state.mappings.map((m) => <tr key={m.isin} className="border-b border-slate-100 dark:border-neutral-800"><td className="px-3 py-2">{m.name}</td><td className="px-3 py-2">{m.isin}</td><td className="px-3 py-2">{m.yahooSymbol}</td><td className="px-3 py-2"><button onClick={() => onMappingsChange(state.mappings.filter((x) => x.isin !== m.isin))} className="text-red-600">Reset</button></td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}
