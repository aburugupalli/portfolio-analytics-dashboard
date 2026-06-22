import { describe, expect, it } from "vitest";
import { calculatePortfolio } from "./fifo";
import type { NormalizedTransaction } from "@/types/portfolio";

function tx(partial: Partial<NormalizedTransaction>): NormalizedTransaction {
  return {
    id: partial.id ?? Math.random().toString(),
    rowNumber: 1,
    date: partial.date!,
    dateTime: `${partial.date}T00:00:00.000Z`,
    status: "Executed",
    description: partial.description ?? "Asset",
    assetType: "Security",
    type: partial.type!,
    isin: partial.isin ?? "DE0001",
    shares: partial.shares,
    price: partial.price,
    amount: partial.amount,
    fee: partial.fee ?? 0,
    tax: partial.tax ?? 0,
    currency: "EUR",
    includedInCalculations: true,
    warnings: [],
  };
}

describe("fifo portfolio engine", () => {
  it("matches sell against oldest lot and calculates net pnl", () => {
    const portfolio = calculatePortfolio([
      tx({ id: "b1", date: "2024-01-01", type: "Buy", shares: 10, price: 10, amount: 100, fee: 1 }),
      tx({ id: "b2", date: "2024-02-01", type: "Buy", shares: 10, price: 20, amount: 200 }),
      tx({ id: "s1", date: "2024-03-01", type: "Sell", shares: 12, price: 30, amount: 360, fee: 1, tax: 10 }),
    ]);
    expect(portfolio.realizedTrades[0].costBasis).toBeCloseTo(141);
    expect(portfolio.realizedTrades[0].netPnl).toBeCloseTo(208);
    expect(portfolio.positions[0].shares).toBeCloseTo(8);
  });

  it("warns on missing cost basis", () => {
    const portfolio = calculatePortfolio([tx({ id: "s1", date: "2024-03-01", type: "Sell", shares: 2, price: 30, amount: 60 })]);
    expect(portfolio.warnings.some((w) => w.code === "missing-cost-basis")).toBe(true);
  });

  it("tracks dividends and tax refunds", () => {
    const portfolio = calculatePortfolio([
      tx({ date: "2024-01-01", type: "Buy", shares: 1, price: 100, amount: 100 }),
      tx({ date: "2024-04-01", type: "Distribution", amount: 5, tax: -1 }),
    ]);
    expect(portfolio.summary.totalDividends).toBe(5);
    expect(portfolio.summary.totalTaxes).toBe(-1);
  });
});
