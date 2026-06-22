import type { HistoricalPrice } from "@/types/market";

export function compareBenchmark(portfolio: HistoricalPrice[], benchmark: HistoricalPrice[]) {
  const firstPortfolio = portfolio[0]?.close;
  const lastPortfolio = portfolio.at(-1)?.close;
  const firstBenchmark = benchmark[0]?.close;
  const lastBenchmark = benchmark.at(-1)?.close;
  if (!firstPortfolio || !lastPortfolio || !firstBenchmark || !lastBenchmark) return undefined;
  const portfolioReturn = lastPortfolio / firstPortfolio - 1;
  const benchmarkReturn = lastBenchmark / firstBenchmark - 1;
  return { portfolioReturn, benchmarkReturn, outperformance: portfolioReturn - benchmarkReturn };
}
