import { describe, expect, it } from "vitest";
import { maxDrawdown, volatility } from "./risk";
import { calculateConcentration } from "./concentration";

describe("risk metrics", () => {
  it("calculates max drawdown and volatility", () => {
    const prices = [100, 120, 90, 110].map((close, index) => ({ date: `2024-01-0${index + 1}`, close }));
    expect(maxDrawdown(prices)).toBeCloseTo(-0.25);
    expect(volatility(prices)).toBeGreaterThan(0);
  });

  it("flags concentrated portfolios", () => {
    const metrics = calculateConcentration([{ portfolioWeight: 0.7, status: "Open" }, { portfolioWeight: 0.3, status: "Open" }] as never);
    expect(metrics.concentrationWarnings.length).toBeGreaterThan(0);
  });
});
