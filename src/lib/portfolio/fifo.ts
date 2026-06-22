import Decimal from "decimal.js";
import { differenceInCalendarDays } from "date-fns";
import type { CashFlow, Lot, NormalizedTransaction, PortfolioState, PortfolioWarning, Position, RealizedTrade } from "@/types/portfolio";
import type { MarketQuote, SymbolMapping } from "@/types/market";
import { calculateDailyDevelopment, calculateMonthlyDevelopment } from "./dailyDevelopment";
import { calculateXirr } from "./xirr";

type PositionAccumulator = Omit<Position, "averageCost" | "status" | "totalPnl" | "lots"> & { lots: Lot[] };

function numeric(value: Decimal.Value) {
  return new Decimal(value).toDecimalPlaces(8).toNumber();
}

function transactionValue(tx: NormalizedTransaction) {
  const fromAmount = Math.abs(tx.amount ?? 0);
  if (fromAmount > 0) return fromAmount;
  return Math.abs(tx.shares ?? 0) * Math.abs(tx.price ?? 0);
}

function ensurePosition(map: Map<string, PositionAccumulator>, tx: NormalizedTransaction, mapping?: SymbolMapping) {
  const isin = tx.isin ?? "UNKNOWN";
  const existing = map.get(isin);
  if (existing) return existing;
  const created: PositionAccumulator = {
    isin,
    name: tx.description || isin,
    symbol: mapping?.yahooSymbol,
    shares: 0,
    openCostBasis: 0,
    totalInvested: 0,
    totalProceeds: 0,
    realizedPnl: 0,
    fees: 0,
    taxes: 0,
    dividends: 0,
    firstBuyDate: undefined,
    lastTransactionDate: tx.date,
    buyCount: 0,
    sellCount: 0,
    currentPrice: undefined,
    marketValue: undefined,
    dailyPnl: undefined,
    dailyPnlPercent: undefined,
    unrealizedPnl: undefined,
    unrealizedPercent: undefined,
    portfolioWeight: undefined,
    xirr: undefined,
    currency: tx.currency || mapping?.currency || "EUR",
    quote: undefined,
    lots: [],
  };
  map.set(isin, created);
  return created;
}

export function calculatePortfolio(
  transactions: NormalizedTransaction[],
  mappings: SymbolMapping[] = [],
  quotes: Record<string, MarketQuote> = {},
): PortfolioState {
  const warnings: PortfolioWarning[] = [];
  const positions = new Map<string, PositionAccumulator>();
  const realizedTrades: RealizedTrade[] = [];
  const cashFlows: CashFlow[] = [];
  const included = transactions.filter((tx) => tx.includedInCalculations && !tx.duplicate).sort((a, b) => a.dateTime.localeCompare(b.dateTime));
  const mappingByIsin = new Map(mappings.map((m) => [m.isin, m]));

  for (const tx of included) {
    if (tx.assetType === "Security" && !tx.isin) {
      warnings.push({ code: "missing-isin", severity: "warning", message: "Security transaction without ISIN ignored for position calculations.", transactionId: tx.id });
      continue;
    }
    const mapping = tx.isin ? mappingByIsin.get(tx.isin) : undefined;
    const pos = tx.isin ? ensurePosition(positions, tx, mapping) : undefined;
    if (pos) {
      pos.name = pos.name === pos.isin ? tx.description : pos.name;
      pos.lastTransactionDate = tx.date;
      pos.fees += tx.fee;
      pos.taxes += tx.tax;
    }
    const amount = transactionValue(tx);
    const shares = Math.abs(tx.shares ?? 0);
    const price = Math.abs(tx.price ?? (shares ? amount / shares : 0));

    if (pos && (tx.type === "Buy" || tx.type === "Savings plan")) {
      const costBasis = amount + tx.fee;
      const lot: Lot = {
        id: `${tx.id}-lot`,
        isin: pos.isin,
        name: pos.name,
        buyDate: tx.date,
        sharesBought: shares,
        remainingShares: shares,
        buyPrice: price,
        costBasis,
        fee: tx.fee,
        sourceTransactionId: tx.id,
      };
      pos.lots.push(lot);
      pos.shares = numeric(new Decimal(pos.shares).plus(shares));
      pos.openCostBasis = numeric(new Decimal(pos.openCostBasis).plus(costBasis));
      pos.totalInvested = numeric(new Decimal(pos.totalInvested).plus(costBasis));
      pos.buyCount += 1;
      pos.firstBuyDate ??= tx.date;
      cashFlows.push({ date: tx.date, amount: -costBasis, label: tx.type, isin: pos.isin });
    }

    if (pos && tx.type === "Sell") {
      let remaining = new Decimal(shares);
      let matchedCost = new Decimal(0);
      let weightedDays = 0;
      const lotIds: string[] = [];
      for (const lot of pos.lots) {
        if (remaining.lte(0)) break;
        if (lot.remainingShares <= 0) continue;
        const used = Decimal.min(remaining, lot.remainingShares);
        const lotCost = new Decimal(lot.costBasis).div(lot.sharesBought).mul(used);
        lot.remainingShares = numeric(new Decimal(lot.remainingShares).minus(used));
        matchedCost = matchedCost.plus(lotCost);
        weightedDays += differenceInCalendarDays(new Date(tx.date), new Date(lot.buyDate)) * used.toNumber();
        lotIds.push(lot.id);
        remaining = remaining.minus(used);
      }
      if (remaining.gt(0)) {
        warnings.push({ code: "missing-cost-basis", severity: "error", message: "Sell exceeds available FIFO lots. Missing cost basis for part of the sale.", transactionId: tx.id, isin: pos.isin });
      }
      const proceeds = amount;
      const grossPnl = new Decimal(proceeds).minus(matchedCost);
      const netPnl = grossPnl.minus(tx.fee).minus(tx.tax);
      const trade: RealizedTrade = {
        id: `${tx.id}-realized`,
        sellDate: tx.date,
        name: pos.name,
        isin: pos.isin,
        sharesSold: shares,
        proceeds,
        costBasis: numeric(matchedCost),
        fees: tx.fee,
        taxes: tx.tax,
        grossPnl: numeric(grossPnl),
        netPnl: numeric(netPnl),
        holdingPeriodDays: shares ? Math.round(weightedDays / shares) : 0,
        lotIds,
      };
      realizedTrades.push(trade);
      pos.shares = numeric(new Decimal(pos.shares).minus(shares));
      pos.openCostBasis = numeric(Decimal.max(0, new Decimal(pos.openCostBasis).minus(matchedCost)));
      pos.totalProceeds = numeric(new Decimal(pos.totalProceeds).plus(proceeds));
      pos.realizedPnl = numeric(new Decimal(pos.realizedPnl).plus(netPnl));
      pos.sellCount += 1;
      cashFlows.push({ date: tx.date, amount: proceeds - tx.fee - tx.tax, label: "Sell", isin: pos.isin });
    }

    if (pos && (tx.type === "Distribution" || tx.type === "Interest")) {
      pos.dividends = numeric(new Decimal(pos.dividends).plus(amount));
      cashFlows.push({ date: tx.date, amount, label: tx.type, isin: pos.isin });
    }
    if (tx.type === "Deposit") cashFlows.push({ date: tx.date, amount: -amount, label: "Deposit" });
    if (tx.type === "Withdrawal") cashFlows.push({ date: tx.date, amount, label: "Withdrawal" });
    if (tx.type === "Fee" && !pos) cashFlows.push({ date: tx.date, amount: -amount, label: "Fee" });
  }

  let resultPositions: Position[] = [...positions.values()].map((pos) => {
    const quote = pos.symbol ? quotes[pos.symbol] : undefined;
    const currentPrice = quote?.regularMarketPrice;
    const marketValue = currentPrice !== undefined ? numeric(new Decimal(pos.shares).mul(currentPrice)) : undefined;
    const unrealizedPnl = marketValue !== undefined ? numeric(new Decimal(marketValue).minus(pos.openCostBasis)) : undefined;
    const totalPnl = numeric(new Decimal(pos.realizedPnl).plus(unrealizedPnl ?? 0).plus(pos.dividends));
    const flows = cashFlows.filter((flow) => flow.isin === pos.isin);
    if (pos.shares > 0) flows.push({ date: new Date().toISOString().slice(0, 10), amount: marketValue ?? pos.openCostBasis, label: marketValue ? "Terminal market value" : "Terminal cost basis", isin: pos.isin });
    return {
      ...pos,
      quote,
      currentPrice,
      marketValue,
      dailyPnl: quote?.regularMarketChange !== undefined ? numeric(new Decimal(pos.shares).mul(quote.regularMarketChange)) : undefined,
      dailyPnlPercent: quote?.regularMarketChangePercent !== undefined ? quote.regularMarketChangePercent / 100 : undefined,
      unrealizedPnl,
      unrealizedPercent: unrealizedPnl !== undefined && pos.openCostBasis ? unrealizedPnl / pos.openCostBasis : undefined,
      totalPnl,
      totalReturnPercent: pos.totalInvested ? totalPnl / pos.totalInvested : undefined,
      averageCost: pos.shares > 0 ? pos.openCostBasis / pos.shares : 0,
      status: pos.shares > 0.000001 ? "Open" : "Closed",
      xirr: calculateXirr(flows),
      lots: pos.lots.filter((lot) => lot.remainingShares > 0.000001),
    };
  });

  const totalMarketValue = resultPositions.reduce((sum, p) => sum + (p.marketValue ?? 0), 0);
  const totalCostBasis = resultPositions.reduce((sum, p) => sum + p.openCostBasis, 0);
  resultPositions = resultPositions.map((p) => ({ ...p, portfolioWeight: totalMarketValue > 0 ? (p.marketValue ?? 0) / totalMarketValue : totalCostBasis > 0 ? p.openCostBasis / totalCostBasis : undefined }));

  for (const position of resultPositions.filter((p) => p.status === "Open" && !p.symbol)) {
    warnings.push({ code: "missing-yahoo-symbol", severity: "info", message: "Missing Yahoo symbol mapping.", isin: position.isin });
  }
  for (const tx of transactions.filter((t) => !t.includedInCalculations && t.status !== "Executed")) {
    warnings.push({ code: "ignored-status", severity: "info", message: `${tx.status} transaction is visible but ignored in calculations.`, transactionId: tx.id, isin: tx.isin });
  }
  for (const tx of transactions.filter((t) => t.warnings.length)) {
    warnings.push(...tx.warnings.map((message) => ({ code: "csv-warning", severity: "warning" as const, message, transactionId: tx.id, isin: tx.isin })));
  }

  const dailyDevelopment = calculateDailyDevelopment(transactions);
  const monthlyDevelopment = calculateMonthlyDevelopment(dailyDevelopment);
  const firstTransactionDate = included[0]?.date;
  const portfolioValue = totalMarketValue || undefined;
  const terminalValue = portfolioValue ?? totalCostBasis;
  const portfolioFlows = [...cashFlows, ...(terminalValue ? [{ date: new Date().toISOString().slice(0, 10), amount: terminalValue, label: portfolioValue ? "Terminal market value" : "Terminal cost basis" }] : [])];
  const totalInvested = resultPositions.reduce((sum, p) => sum + p.totalInvested, 0);
  const realizedPnl = resultPositions.reduce((sum, p) => sum + p.realizedPnl, 0);
  const totalDividends = resultPositions.reduce((sum, p) => sum + p.dividends, 0);
  const unrealizedPnl = portfolioValue !== undefined ? resultPositions.reduce((sum, p) => sum + (p.unrealizedPnl ?? 0), 0) : undefined;
  const totalPnl = realizedPnl + (unrealizedPnl ?? 0) + totalDividends;
  const summary = {
    portfolioValue,
    todaysChange: resultPositions.reduce((sum, p) => sum + (p.dailyPnl ?? 0), 0) || undefined,
    totalInvested,
    openCostBasis: totalCostBasis,
    marketValue: portfolioValue,
    realizedPnl,
    unrealizedPnl,
    totalPnl,
    totalReturnPercent: totalInvested ? totalPnl / totalInvested : undefined,
    portfolioXirr: calculateXirr(portfolioFlows),
    netDeposits: cashFlows.filter((f) => f.label === "Deposit" || f.label === "Withdrawal").reduce((sum, f) => sum - f.amount, 0),
    totalFees: included.reduce((sum, tx) => sum + tx.fee, 0),
    totalTaxes: included.reduce((sum, tx) => sum + tx.tax, 0),
    totalDividends,
    transactionCount: transactions.length,
    openPositions: resultPositions.filter((p) => p.status === "Open").length,
    closedPositions: resultPositions.filter((p) => p.status === "Closed").length,
    firstTransactionDate,
    portfolioAgeDays: firstTransactionDate ? differenceInCalendarDays(new Date(), new Date(firstTransactionDate)) : undefined,
    bestWinner: [...resultPositions].sort((a, b) => b.totalPnl - a.totalPnl)[0],
    worstLoser: [...resultPositions].sort((a, b) => a.totalPnl - b.totalPnl)[0],
    biggestHolding: [...resultPositions].sort((a, b) => (b.portfolioWeight ?? 0) - (a.portfolioWeight ?? 0))[0],
    lastMarketDataUpdate: Object.values(quotes).sort((a, b) => b.fetchedAt.localeCompare(a.fetchedAt))[0]?.fetchedAt,
  };

  return {
    rawTransactions: [],
    transactions,
    positions: resultPositions.sort((a, b) => (b.marketValue ?? b.openCostBasis) - (a.marketValue ?? a.openCostBasis)),
    realizedTrades,
    cashFlows,
    dailyDevelopment,
    monthlyDevelopment,
    summary,
    warnings,
    mappings,
  };
}
