import YahooFinance from "yahoo-finance2";
import type { HistoricalPrice, MarketQuote, SearchResult } from "@/types/market";

type YahooRecord = Record<string, unknown>;
const yahooFinance = new YahooFinance();

function stringValue(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function numberValue(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

export function toMarketQuote(raw: YahooRecord): MarketQuote {
  const fetchedAt = new Date().toISOString();
  const regularMarketTime = raw.regularMarketTime;
  return {
    symbol: stringValue(raw.symbol) ?? "",
    shortName: stringValue(raw.shortName),
    longName: stringValue(raw.longName),
    regularMarketPrice: numberValue(raw.regularMarketPrice),
    regularMarketChange: numberValue(raw.regularMarketChange),
    regularMarketChangePercent: numberValue(raw.regularMarketChangePercent),
    regularMarketPreviousClose: numberValue(raw.regularMarketPreviousClose),
    regularMarketOpen: numberValue(raw.regularMarketOpen),
    regularMarketDayHigh: numberValue(raw.regularMarketDayHigh),
    regularMarketDayLow: numberValue(raw.regularMarketDayLow),
    regularMarketVolume: numberValue(raw.regularMarketVolume),
    marketCap: numberValue(raw.marketCap),
    currency: stringValue(raw.currency),
    exchange: stringValue(raw.fullExchangeName) ?? stringValue(raw.exchange),
    quoteType: stringValue(raw.quoteType),
    marketState: stringValue(raw.marketState),
    regularMarketTime: regularMarketTime ? new Date(regularMarketTime as string | number | Date).toISOString() : undefined,
    dataDelayBy: numberValue(raw.exchangeDataDelayedBy),
    source: "Yahoo Finance",
    fetchedAt,
    status: raw.exchangeDataDelayedBy ? "Delayed" : raw.marketState ? "Live" : "Unknown",
  };
}

export async function searchYahoo(query: string): Promise<SearchResult[]> {
  const result = (await yahooFinance.search(query, { newsCount: 0, quotesCount: 8 })) as unknown as { quotes?: YahooRecord[] };
  return (result.quotes ?? []).map((quote) => ({
    symbol: stringValue(quote.symbol) ?? "",
    shortName: stringValue(quote.shortname),
    longName: stringValue(quote.longname),
    exchange: stringValue(quote.exchange),
    quoteType: stringValue(quote.quoteType),
    currency: stringValue(quote.currency),
    score: numberValue(quote.score),
  }));
}

export async function quoteYahoo(symbols: string[]): Promise<MarketQuote[]> {
  if (symbols.length === 1) return [toMarketQuote(await yahooFinance.quote(symbols[0]))];
  const result = await yahooFinance.quote(symbols);
  return (Array.isArray(result) ? result : [result]).map((item) => toMarketQuote(item as YahooRecord));
}

export async function chartYahoo(symbol: string, range = "1y", interval = "1d"): Promise<HistoricalPrice[]> {
  const now = new Date();
  const period1 = new Date(now);
  if (range === "1d") period1.setDate(now.getDate() - 1);
  else if (range === "5d") period1.setDate(now.getDate() - 5);
  else if (range === "1mo") period1.setMonth(now.getMonth() - 1);
  else if (range === "6mo") period1.setMonth(now.getMonth() - 6);
  else if (range === "ytd") period1.setMonth(0, 1);
  else if (range === "5y") period1.setFullYear(now.getFullYear() - 5);
  else if (range === "max") period1.setFullYear(1980, 0, 1);
  else period1.setFullYear(now.getFullYear() - 1);
  const result = (await yahooFinance.chart(symbol, { period1, period2: now, interval: interval as never })) as unknown as { quotes?: YahooRecord[] };
  return (result.quotes ?? [])
    .filter((point) => numberValue(point.close))
    .map((point) => ({
      date: new Date(point.date as string | number | Date).toISOString(),
      open: numberValue(point.open),
      high: numberValue(point.high),
      low: numberValue(point.low),
      close: numberValue(point.close) ?? 0,
      adjClose: numberValue(point.adjclose),
      volume: numberValue(point.volume),
    }));
}

export async function summaryYahoo(symbol: string) {
  return yahooFinance.quoteSummary(symbol, {
    modules: [
      "price",
      "summaryDetail",
      "assetProfile",
      "summaryProfile",
      "defaultKeyStatistics",
      "financialData",
      "recommendationTrend",
      "earnings",
      "calendarEvents",
      "majorHoldersBreakdown",
      "fundProfile",
      "fundPerformance",
      "topHoldings",
    ] as never,
  });
}

export async function newsYahoo(query: string) {
  const result = (await yahooFinance.search(query, { newsCount: 10, quotesCount: 0 })) as unknown as { news?: YahooRecord[] };
  return (result.news ?? []).map((item) => ({
    title: stringValue(item.title),
    publisher: stringValue(item.publisher),
    url: stringValue(item.link),
    publishedAt: numberValue(item.providerPublishTime) ? new Date(numberValue(item.providerPublishTime)! * 1000).toISOString() : undefined,
    relatedTickers: item.relatedTickers,
    thumbnail: undefined,
  }));
}
