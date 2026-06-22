import { describe, expect, it } from "vitest";
import { toMarketQuote } from "./yahooClient";
import { quoteFromManualPrice } from "./quoteMapper";

describe("market data", () => {
  it("maps yahoo quote payloads", () => {
    const quote = toMarketQuote({ symbol: "AAPL", regularMarketPrice: 200, regularMarketChange: 1, regularMarketChangePercent: 0.5, currency: "USD", exchangeDataDelayedBy: 15 });
    expect(quote.symbol).toBe("AAPL");
    expect(quote.status).toBe("Delayed");
  });

  it("uses manual prices as quote fallback", () => {
    const quote = quoteFromManualPrice({ isin: "DE0001", symbol: "TEST", price: 12, currency: "EUR", date: "2024-01-01" });
    expect(quote.regularMarketPrice).toBe(12);
    expect(quote.source).toBe("Manual");
  });
});
