import type { HistoricalPrice, MarketQuote, SymbolMapping } from "./market";

export type TransactionStatus = "Executed" | "Pending" | "Cancelled" | "Expired" | "Rejected" | "Unknown";
export type TransactionKind = "Buy" | "Sell" | "Savings plan" | "Distribution" | "Deposit" | "Withdrawal" | "Security transfer" | "Corporate action" | "Taxes" | "Interest" | "Fee" | "Unknown";

export type RawTransaction = Record<string, string | number | null | undefined>;

export type NormalizedTransaction = {
  id: string;
  sourceFile?: string;
  rowNumber: number;
  date: string;
  time?: string;
  dateTime: string;
  status: TransactionStatus;
  reference?: string;
  description: string;
  assetType: "Security" | "Cash" | "Unknown";
  type: TransactionKind;
  isin?: string;
  shares?: number;
  price?: number;
  amount?: number;
  fee: number;
  tax: number;
  currency: string;
  includedInCalculations: boolean;
  duplicate?: boolean;
  warnings: string[];
};

export type PortfolioWarning = {
  code: string;
  message: string;
  severity: "info" | "warning" | "error";
  transactionId?: string;
  isin?: string;
};

export type Lot = {
  id: string;
  isin: string;
  name: string;
  buyDate: string;
  sharesBought: number;
  remainingShares: number;
  buyPrice: number;
  costBasis: number;
  fee: number;
  sourceTransactionId: string;
};

export type RealizedTrade = {
  id: string;
  sellDate: string;
  name: string;
  isin: string;
  sharesSold: number;
  proceeds: number;
  costBasis: number;
  fees: number;
  taxes: number;
  grossPnl: number;
  netPnl: number;
  holdingPeriodDays: number;
  lotIds: string[];
};

export type CashFlow = {
  date: string;
  amount: number;
  label: string;
  isin?: string;
};

export type Position = {
  isin: string;
  name: string;
  symbol?: string;
  shares: number;
  averageCost: number;
  openCostBasis: number;
  totalInvested: number;
  totalProceeds: number;
  realizedPnl: number;
  fees: number;
  taxes: number;
  dividends: number;
  firstBuyDate?: string;
  lastTransactionDate?: string;
  buyCount: number;
  sellCount: number;
  status: "Open" | "Closed";
  currentPrice?: number;
  marketValue?: number;
  dailyPnl?: number;
  dailyPnlPercent?: number;
  unrealizedPnl?: number;
  unrealizedPercent?: number;
  totalPnl: number;
  totalReturnPercent?: number;
  portfolioWeight?: number;
  xirr?: number;
  currency: string;
  quote?: MarketQuote;
  lots: Lot[];
};

export type DailyDevelopmentEntry = {
  date: string;
  netBuySell: number;
  deposits: number;
  withdrawals: number;
  realizedPnl: number;
  dividends: number;
  fees: number;
  taxes: number;
  openCostBasisChange: number;
};

export type MonthlyDevelopmentEntry = DailyDevelopmentEntry & { month: string };

export type PortfolioRiskMetrics = {
  hhi: number;
  top5Weight: number;
  biggestWeight: number;
  concentrationWarnings: string[];
  maxDrawdown?: number;
  volatility?: number;
};

export type PortfolioSummary = {
  portfolioValue?: number;
  todaysChange?: number;
  totalInvested: number;
  openCostBasis: number;
  marketValue?: number;
  realizedPnl: number;
  unrealizedPnl?: number;
  totalPnl: number;
  totalReturnPercent?: number;
  portfolioXirr?: number;
  netDeposits: number;
  totalFees: number;
  totalTaxes: number;
  totalDividends: number;
  transactionCount: number;
  openPositions: number;
  closedPositions: number;
  firstTransactionDate?: string;
  portfolioAgeDays?: number;
  bestWinner?: Position;
  worstLoser?: Position;
  biggestHolding?: Position;
  lastMarketDataUpdate?: string;
};

export type PortfolioState = {
  rawTransactions: RawTransaction[];
  transactions: NormalizedTransaction[];
  positions: Position[];
  realizedTrades: RealizedTrade[];
  cashFlows: CashFlow[];
  dailyDevelopment: DailyDevelopmentEntry[];
  monthlyDevelopment: MonthlyDevelopmentEntry[];
  summary: PortfolioSummary;
  warnings: PortfolioWarning[];
  mappings: SymbolMapping[];
};

export type HoldingDeepDive = {
  position: Position;
  transactions: NormalizedTransaction[];
  realizedTrades: RealizedTrade[];
  historicalPrices: HistoricalPrice[];
};
