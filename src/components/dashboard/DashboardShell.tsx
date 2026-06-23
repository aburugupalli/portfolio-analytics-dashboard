"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { calculatePortfolio } from "@/lib/portfolio/calculations";
import { loadMappings, loadQuotes, loadTransactions, saveMappings, saveQuotes } from "@/lib/storage/localPortfolioStore";
import type { MarketQuote, SymbolMapping } from "@/types/market";
import type { PortfolioState } from "@/types/portfolio";
import { DashboardTab, DashboardTabs } from "./DashboardTabs";
import { DailyDevelopmentTab } from "./DailyDevelopmentTab";
import { HoldingsTab } from "./HoldingsTab";
import { LivePricesTab } from "./LivePricesTab";
import { MarketDataStatusBar } from "./MarketDataStatusBar";
import { OverviewTab } from "./OverviewTab";
import { PortfolioAnalysisTab } from "./PortfolioAnalysisTab";
import { RealizedPnlTab } from "./RealizedPnlTab";
import { SettingsTab } from "./SettingsTab";
import { TaxesFeesTab } from "./TaxesFeesTab";
import { TransactionsTab } from "./TransactionsTab";
import { XirrTab } from "./XirrTab";

function emptyState(): PortfolioState {
  return calculatePortfolio([], [], {});
}

export function DashboardShell() {
  const [active, setActive] = useState<DashboardTab>("Overview");
  const [transactions, setTransactions] = useState(() => (typeof window === "undefined" ? [] : loadTransactions()));
  const [mappings, setMappings] = useState<SymbolMapping[]>(() => (typeof window === "undefined" ? [] : loadMappings()));
  const [quotes, setQuotes] = useState<Record<string, MarketQuote>>(() => (typeof window === "undefined" ? {} : loadQuotes()));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const state = useMemo(() => (transactions.length ? calculatePortfolio(transactions, mappings, quotes) : emptyState()), [mappings, quotes, transactions]);

  const reload = useCallback(() => {
    setTransactions(loadTransactions());
    setMappings(loadMappings());
    setQuotes(loadQuotes());
  }, []);

  const updateMappings = useCallback((next: SymbolMapping[]) => {
    saveMappings(next);
    setMappings(next);
  }, []);

  const refreshQuotes = useCallback(async () => {
    const symbols = [...new Set(mappings.map((m) => m.yahooSymbol).filter(Boolean))];
    if (!symbols.length) return;
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/market/quote?symbols=${encodeURIComponent(symbols.join(","))}`);
      const data = await response.json();
      const nextQuotes = { ...quotes };
      for (const quote of data.quotes ?? []) nextQuotes[quote.symbol] = quote;
      saveQuotes(nextQuotes);
      setQuotes(nextQuotes);
    } finally {
      setIsRefreshing(false);
    }
  }, [mappings, quotes]);

  useEffect(() => {
    if (transactions.length && mappings.length && !Object.keys(quotes).length) {
      const timer = window.setTimeout(() => void refreshQuotes(), 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [mappings.length, quotes, refreshQuotes, transactions.length]);

  if (!transactions.length) {
    return (
      <main className="min-h-screen">
        <AppHeader />
        <ResponsiveContainer className="py-10">
          <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-200">
              <UploadCloud className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-normal">Import your first CSV</h1>
            <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500 dark:text-slate-400">Upload your Scalable Capital transaction history to create your personal portfolio analysis.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">Upload CSV</Link>
              <Link href="/demo" className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200 dark:hover:bg-neutral-800">View demo</Link>
            </div>
          </div>
        </ResponsiveContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <AppHeader />
      <ResponsiveContainer className="space-y-5 py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Portfolio Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">{state.summary.transactionCount} transactions · {state.summary.openPositions} open positions · FIFO method</p>
          </div>
        </div>
        <MarketDataStatusBar state={state} onRefresh={refreshQuotes} isRefreshing={isRefreshing} />
        {state.warnings.length ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
            {state.warnings.slice(0, 4).map((w, index) => <span key={`${w.code}-${index}`} className="mr-3">{w.message}</span>)}
          </div>
        ) : null}
        <DashboardTabs active={active} onChange={setActive} />
        {active === "Overview" && <OverviewTab state={state} />}
        {active === "Holdings" && <HoldingsTab state={state} />}
        {active === "Realized P&L" && <RealizedPnlTab state={state} />}
        {active === "Live Prices" && <LivePricesTab state={state} onMappingsChange={updateMappings} />}
        {active === "XIRR" && <XirrTab state={state} />}
        {active === "Daily Development" && <DailyDevelopmentTab state={state} />}
        {active === "Portfolio Analysis" && <PortfolioAnalysisTab state={state} />}
        {active === "Transactions" && <TransactionsTab state={state} />}
        {active === "Taxes & Fees" && <TaxesFeesTab state={state} />}
        {active === "Settings" && <SettingsTab state={state} onMappingsChange={updateMappings} onDataChanged={reload} />}
      </ResponsiveContainer>
    </main>
  );
}
