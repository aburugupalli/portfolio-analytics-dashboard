import type { MarketQuote, SymbolMapping } from "@/types/market";
import type { NormalizedTransaction } from "@/types/portfolio";
import { calculatePortfolio } from "./fifo";

export { calculatePortfolio };

export function enrichPortfolio(transactions: NormalizedTransaction[], mappings: SymbolMapping[], quotes: Record<string, MarketQuote>) {
  return calculatePortfolio(transactions, mappings, quotes);
}
