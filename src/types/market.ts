export type QuoteStatus = "Live" | "Delayed" | "Stale" | "Error" | "Unknown";

export type MarketQuote = {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketPreviousClose?: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  currency?: string;
  exchange?: string;
  quoteType?: string;
  marketState?: string;
  regularMarketTime?: string;
  dataDelayBy?: number;
  source: "Yahoo Finance" | "Manual";
  fetchedAt: string;
  status: QuoteStatus;
  error?: string;
};

export type HistoricalPrice = {
  date: string;
  open?: number;
  high?: number;
  low?: number;
  close: number;
  adjClose?: number;
  volume?: number;
};

export type ManualPrice = {
  isin: string;
  symbol?: string;
  price: number;
  currency: string;
  date: string;
};

export type SymbolMapping = {
  isin: string;
  name: string;
  yahooSymbol: string;
  exchange?: string;
  currency?: string;
  quoteType?: string;
  confirmedByUser: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SearchResult = {
  symbol: string;
  shortName?: string;
  longName?: string;
  exchange?: string;
  quoteType?: string;
  currency?: string;
  score?: number;
};
