"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { PriceChart } from "@/components/charts/PriceChart";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { formatDate } from "@/lib/formatting/dates";
import { formatMoney } from "@/lib/formatting/money";
import { formatPercent } from "@/lib/formatting/percent";
import { calculatePortfolio } from "@/lib/portfolio/calculations";
import { loadMappings, loadQuotes, loadTransactions } from "@/lib/storage/localPortfolioStore";
import type { HistoricalPrice } from "@/types/market";

type SummaryPayload = Record<string, Record<string, { fmt?: string } | string | number | undefined> | undefined>;
type NewsItem = { title: string; publisher?: string; url: string; publishedAt?: string };

function fmtYahoo(value: { fmt?: string } | string | number | undefined) {
  if (typeof value === "object" && value && "fmt" in value) return value.fmt;
  if (value === undefined) return undefined;
  return String(value);
}

export function HoldingDeepDivePage({ isin }: { isin: string }) {
  const [prices, setPrices] = useState<HistoricalPrice[]>([]);
  const [summary, setSummary] = useState<SummaryPayload | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [range, setRange] = useState("1y");
  const [loading, setLoading] = useState(false);
  const state = useMemo(() => calculatePortfolio(loadTransactions(), loadMappings(), loadQuotes()), []);
  const position = state.positions.find((p) => p.isin === isin);
  const transactions = state.transactions.filter((tx) => tx.isin === isin);
  const trades = state.realizedTrades.filter((trade) => trade.isin === isin);

  useEffect(() => {
    if (!position?.symbol) return;
    const timer = window.setTimeout(() => {
      setLoading(true);
      Promise.all([
        fetch(`/api/market/chart?symbol=${encodeURIComponent(position.symbol!)}&range=${range}&interval=1d`).then((r) => r.json()).catch(() => ({ prices: [] })),
        fetch(`/api/market/summary?symbol=${encodeURIComponent(position.symbol!)}`).then((r) => r.json()).catch(() => ({ summary: null })),
        fetch(`/api/market/news?symbol=${encodeURIComponent(position.symbol!)}`).then((r) => r.json()).catch(() => ({ news: [] })),
      ]).then(([chart, detail, newsResult]) => {
        setPrices(chart.prices ?? []);
        setSummary(detail.summary);
        setNews(newsResult.news ?? []);
      }).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [position?.symbol, range]);

  if (!position) {
    return (
      <main className="min-h-screen"><AppHeader /><ResponsiveContainer className="py-10"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4" /> Dashboard</Link><div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">Holding nicht gefunden.</div></ResponsiveContainer></main>
    );
  }

  const fundamentals = summary?.defaultKeyStatistics || summary?.financialData || {};
  const price = summary?.price || {};
  return (
    <main className="min-h-screen">
      <AppHeader />
      <ResponsiveContainer className="space-y-5 py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">{position.symbol ?? "Unmapped"} · {position.isin} · {position.quote?.exchange ?? "Exchange N/A"}</p>
              <h1 className="mt-1 text-3xl font-semibold">{position.name}</h1>
              <p className="mt-2 text-sm text-slate-500">Market State: {position.quote?.marketState ?? "Unknown"} · Last Updated: {position.quote?.fetchedAt ? new Date(position.quote.fetchedAt).toLocaleString("de-DE") : "N/A"}</p>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-3xl font-semibold number-tabular">{formatMoney(position.currentPrice, position.quote?.currency ?? position.currency)}</p>
              <p className={position.dailyPnl && position.dailyPnl < 0 ? "text-red-600" : "text-emerald-600"}>{formatMoney(position.dailyPnl, position.quote?.currency ?? position.currency)} · {formatPercent(position.dailyPnlPercent)}</p>
            </div>
          </div>
        </section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Shares" value={position.shares.toFixed(4)} />
          <KpiCard label="Average Cost" value={formatMoney(position.averageCost, position.currency)} />
          <KpiCard label="Market Value" value={formatMoney(position.marketValue, position.quote?.currency ?? position.currency)} />
          <KpiCard label="Unrealized P&L" value={formatMoney(position.unrealizedPnl, position.quote?.currency ?? position.currency)} tone={(position.unrealizedPnl ?? 0) < 0 ? "negative" : "positive"} sublabel={formatPercent(position.unrealizedPercent)} />
          <KpiCard label="Realized P&L" value={formatMoney(position.realizedPnl, position.currency)} />
          <KpiCard label="Total P&L" value={formatMoney(position.totalPnl, position.currency)} tone={position.totalPnl < 0 ? "negative" : "positive"} sublabel={formatPercent(position.totalReturnPercent)} />
          <KpiCard label="XIRR" value={formatPercent(position.xirr)} />
          <KpiCard label="Portfolio Weight" value={formatPercent(position.portfolioWeight)} />
          <KpiCard label="First Buy" value={formatDate(position.firstBuyDate)} />
          <KpiCard label="Last Transaction" value={formatDate(position.lastTransactionDate)} />
          <KpiCard label="Fees" value={formatMoney(position.fees, position.currency)} />
          <KpiCard label="Taxes" value={formatMoney(position.taxes, position.currency)} />
        </div>
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="font-semibold">Price Chart</h2><div className="flex gap-2 overflow-x-auto">{["1mo", "6mo", "ytd", "1y", "5y", "max"].map((r) => <button key={r} onClick={() => setRange(r)} className="min-h-9 rounded-md border border-slate-200 px-3 text-sm dark:border-neutral-800">{r}</button>)}{loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : null}</div></div>
          <PriceChart prices={prices} averageCost={position.averageCost} />
        </section>
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"><h2 className="font-semibold">FIFO Lots</h2><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-neutral-800"><tr><th className="px-3 py-2">Buy Date</th><th className="px-3 py-2">Shares</th><th className="px-3 py-2">Remaining</th><th className="px-3 py-2">Buy Price</th><th className="px-3 py-2">Cost Basis</th></tr></thead><tbody>{position.lots.map((lot) => <tr key={lot.id} className="border-b border-slate-100 dark:border-neutral-800"><td className="px-3 py-2">{lot.buyDate}</td><td className="px-3 py-2">{lot.sharesBought.toFixed(4)}</td><td className="px-3 py-2">{lot.remainingShares.toFixed(4)}</td><td className="px-3 py-2">{formatMoney(lot.buyPrice, position.currency)}</td><td className="px-3 py-2">{formatMoney(lot.costBasis, position.currency)}</td></tr>)}</tbody></table></div></section>
          <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"><h2 className="font-semibold">Fundamentals</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{[["Market Cap", fmtYahoo(price.marketCap)], ["PE Ratio", fmtYahoo(fundamentals.trailingPE)], ["Forward PE", fmtYahoo(fundamentals.forwardPE)], ["Beta", fmtYahoo(fundamentals.beta)], ["52W High", fmtYahoo(summary?.summaryDetail?.fiftyTwoWeekHigh)], ["52W Low", fmtYahoo(summary?.summaryDetail?.fiftyTwoWeekLow)], ["Dividend Yield", fmtYahoo(summary?.summaryDetail?.dividendYield)], ["Recommendation", fmtYahoo(summary?.financialData?.recommendationKey)]].map(([label, value]) => <div key={label} className="rounded-md bg-slate-50 p-3 text-sm dark:bg-neutral-950"><span className="text-slate-500">{label}</span><div className="font-semibold">{value ?? "N/A"}</div></div>)}</div></section>
        </div>
        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"><h2 className="font-semibold">News</h2><div className="mt-3 grid gap-3 md:grid-cols-2">{news.slice(0, 6).map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="rounded-md border border-slate-200 p-3 text-sm transition hover:bg-slate-50 dark:border-neutral-800 dark:hover:bg-neutral-950"><span className="font-semibold">{item.title}</span><span className="mt-1 block text-slate-500">{item.publisher} · {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("de-DE") : ""}</span></a>)}</div></section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"><h2 className="font-semibold">Transactions & Realized Trades</h2><p className="mt-2 text-sm text-slate-500">{transactions.length} transactions · {trades.length} realized FIFO trades. Benchmark comparison is prepared for ^GSPC, ^NDX, QQQ and ^GDAXI.</p></section>
      </ResponsiveContainer>
    </main>
  );
}
