import type { NormalizedTransaction } from "@/types/portfolio";

export function demoTransactions(): NormalizedTransaction[] {
  const base: Array<Partial<NormalizedTransaction>> = [
    { date: "2022-01-10", type: "Deposit", amount: 8000, description: "Initial deposit", assetType: "Cash" },
    { date: "2022-01-12", type: "Buy", isin: "US0378331005", description: "Apple Inc.", shares: 12, price: 145, amount: 1740, fee: 0.99 },
    { date: "2022-02-02", type: "Savings plan", isin: "IE00B4L5Y983", description: "iShares Core MSCI World", shares: 18, price: 72, amount: 1296, fee: 0 },
    { date: "2022-06-14", type: "Buy", isin: "US5949181045", description: "Microsoft Corp.", shares: 8, price: 245, amount: 1960, fee: 0.99 },
    { date: "2023-03-20", type: "Sell", isin: "US0378331005", description: "Apple Inc.", shares: 4, price: 156, amount: 624, fee: 0.99, tax: 18.4 },
    { date: "2023-07-05", type: "Distribution", isin: "IE00B4L5Y983", description: "iShares Core MSCI World", amount: 37.2, tax: 9.3 },
    { date: "2024-01-03", type: "Savings plan", isin: "IE00B4L5Y983", description: "iShares Core MSCI World", shares: 10, price: 83, amount: 830 },
    { date: "2024-09-18", type: "Buy", isin: "US67066G1040", description: "NVIDIA Corp.", shares: 15, price: 112, amount: 1680, fee: 0.99 },
    { date: "2025-05-11", type: "Sell", isin: "US5949181045", description: "Microsoft Corp.", shares: 2, price: 438, amount: 876, fee: 0.99, tax: 42 },
    { date: "2025-10-15", type: "Withdrawal", amount: 500, description: "Cash withdrawal", assetType: "Cash" },
  ];
  return base.map((tx, index) => ({
    id: `demo-${index}`,
    rowNumber: index + 1,
    date: tx.date!,
    time: "10:00",
    dateTime: `${tx.date}T10:00:00.000Z`,
    status: "Executed",
    reference: `DEMO-${index}`,
    description: tx.description!,
    assetType: tx.assetType ?? "Security",
    type: tx.type!,
    isin: tx.isin,
    shares: tx.shares,
    price: tx.price,
    amount: tx.amount,
    fee: tx.fee ?? 0,
    tax: tx.tax ?? 0,
    currency: "EUR",
    includedInCalculations: true,
    warnings: [],
  }));
}

export const demoMappings = [
  { isin: "US0378331005", name: "Apple Inc.", yahooSymbol: "AAPL", currency: "USD", exchange: "Nasdaq", quoteType: "EQUITY", confirmedByUser: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { isin: "US5949181045", name: "Microsoft Corp.", yahooSymbol: "MSFT", currency: "USD", exchange: "Nasdaq", quoteType: "EQUITY", confirmedByUser: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { isin: "US67066G1040", name: "NVIDIA Corp.", yahooSymbol: "NVDA", currency: "USD", exchange: "Nasdaq", quoteType: "EQUITY", confirmedByUser: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { isin: "IE00B4L5Y983", name: "iShares Core MSCI World", yahooSymbol: "IWDA.AS", currency: "EUR", exchange: "Amsterdam", quoteType: "ETF", confirmedByUser: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
