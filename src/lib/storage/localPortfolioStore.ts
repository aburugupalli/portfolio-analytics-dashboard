"use client";

import type { MarketQuote, ManualPrice, SymbolMapping } from "@/types/market";
import type { NormalizedTransaction, RawTransaction } from "@/types/portfolio";

const keys = {
  raw: "portfolio.rawTransactions",
  transactions: "portfolio.normalizedTransactions",
  mappings: "portfolio.symbolMappings",
  quotes: "portfolio.marketQuotes",
  manualPrices: "portfolio.manualPrices",
  alerts: "portfolio.alerts",
  autoRefresh: "portfolio.autoRefresh",
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadTransactions() {
  return readJson<NormalizedTransaction[]>(keys.transactions, []);
}

export function saveTransactions(transactions: NormalizedTransaction[]) {
  writeJson(keys.transactions, transactions);
}

export function loadRawTransactions() {
  return readJson<RawTransaction[]>(keys.raw, []);
}

export function saveRawTransactions(transactions: RawTransaction[]) {
  writeJson(keys.raw, transactions);
}

export function loadMappings() {
  return readJson<SymbolMapping[]>(keys.mappings, []);
}

export function saveMappings(mappings: SymbolMapping[]) {
  writeJson(keys.mappings, mappings);
}

export function loadQuotes() {
  return readJson<Record<string, MarketQuote>>(keys.quotes, {});
}

export function saveQuotes(quotes: Record<string, MarketQuote>) {
  writeJson(keys.quotes, quotes);
}

export function loadManualPrices() {
  return readJson<ManualPrice[]>(keys.manualPrices, []);
}

export function saveManualPrices(prices: ManualPrice[]) {
  writeJson(keys.manualPrices, prices);
}

export function loadAutoRefresh() {
  return readJson<number>(keys.autoRefresh, 0);
}

export function saveAutoRefresh(seconds: number) {
  writeJson(keys.autoRefresh, seconds);
}

export function clearLocalPortfolioData() {
  Object.values(keys).forEach((key) => window.localStorage.removeItem(key));
}

export function exportLocalData() {
  return {
    rawTransactions: loadRawTransactions(),
    transactions: loadTransactions(),
    mappings: loadMappings(),
    quotes: loadQuotes(),
    manualPrices: loadManualPrices(),
    exportedAt: new Date().toISOString(),
  };
}

export function importLocalData(data: Partial<ReturnType<typeof exportLocalData>>) {
  if (data.rawTransactions) saveRawTransactions(data.rawTransactions);
  if (data.transactions) saveTransactions(data.transactions);
  if (data.mappings) saveMappings(data.mappings);
  if (data.quotes) saveQuotes(data.quotes);
  if (data.manualPrices) saveManualPrices(data.manualPrices);
}
