import type { PortfolioRiskMetrics, Position } from "@/types/portfolio";

export function calculateConcentration(positions: Position[]): PortfolioRiskMetrics {
  const open = positions.filter((p) => p.status === "Open");
  const weights = open.map((p) => p.portfolioWeight ?? 0).sort((a, b) => b - a);
  const hhi = weights.reduce((sum, weight) => sum + weight ** 2, 0);
  const biggestWeight = weights[0] ?? 0;
  const top5Weight = weights.slice(0, 5).reduce((sum, weight) => sum + weight, 0);
  const concentrationWarnings: string[] = [];
  if (biggestWeight > 0.2) concentrationWarnings.push("Position > 20%");
  if (top5Weight > 0.6) concentrationWarnings.push("Top 5 > 60%");
  if (hhi > 0.18) concentrationWarnings.push("High concentration score");
  return { hhi, biggestWeight, top5Weight, concentrationWarnings };
}
