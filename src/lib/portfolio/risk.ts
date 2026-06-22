import type { HistoricalPrice } from "@/types/market";

export function maxDrawdown(prices: HistoricalPrice[]) {
  let peak = -Infinity;
  let drawdown = 0;
  for (const point of prices) {
    peak = Math.max(peak, point.close);
    if (peak > 0) drawdown = Math.min(drawdown, (point.close - peak) / peak);
  }
  return drawdown;
}

export function volatility(prices: HistoricalPrice[]) {
  if (prices.length < 3) return undefined;
  const returns = prices.slice(1).map((p, i) => (p.close - prices[i].close) / prices[i].close).filter(Number.isFinite);
  if (!returns.length) return undefined;
  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const variance = returns.reduce((sum, value) => sum + (value - mean) ** 2, 0) / returns.length;
  return Math.sqrt(variance) * Math.sqrt(252);
}
