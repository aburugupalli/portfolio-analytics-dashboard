import { describe, expect, it } from "vitest";
import { calculateXirr } from "./xirr";

describe("xirr", () => {
  it("calculates simple annual cashflows", () => {
    const rate = calculateXirr([
      { date: "2024-01-01", amount: -1000, label: "Buy" },
      { date: "2025-01-01", amount: 1100, label: "Terminal" },
    ]);
    expect(rate).toBeCloseTo(0.1, 1);
  });

  it("returns undefined for impossible one-sided flows", () => {
    expect(calculateXirr([{ date: "2024-01-01", amount: -1000, label: "Buy" }])).toBeUndefined();
  });
});
