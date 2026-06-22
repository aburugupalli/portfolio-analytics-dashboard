import type { ManualPrice, MarketQuote, SymbolMapping } from "@/types/market";

export function quoteFromManualPrice(price: ManualPrice): MarketQuote {
  return {
    symbol: price.symbol || price.isin,
    regularMarketPrice: price.price,
    currency: price.currency,
    source: "Manual",
    fetchedAt: price.date,
    status: "Unknown",
  };
}

export function mergeQuotesWithManualPrices(mappings: SymbolMapping[], quotes: Record<string, MarketQuote>, manualPrices: ManualPrice[]) {
  const result = { ...quotes };
  for (const mapping of mappings) {
    if (mapping.yahooSymbol && result[mapping.yahooSymbol]) continue;
    const manual = manualPrices.find((price) => price.isin === mapping.isin || price.symbol === mapping.yahooSymbol);
    if (manual) result[mapping.yahooSymbol || mapping.isin] = quoteFromManualPrice(manual);
  }
  return result;
}
