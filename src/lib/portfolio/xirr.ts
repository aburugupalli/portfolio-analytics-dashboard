import type { CashFlow } from "@/types/portfolio";

const DAY_MS = 86_400_000;

function npv(rate: number, flows: CashFlow[]) {
  const first = new Date(flows[0]?.date ?? new Date()).getTime();
  return flows.reduce((sum, flow) => {
    const years = (new Date(flow.date).getTime() - first) / DAY_MS / 365;
    return sum + flow.amount / (1 + rate) ** years;
  }, 0);
}

function derivative(rate: number, flows: CashFlow[]) {
  const first = new Date(flows[0]?.date ?? new Date()).getTime();
  return flows.reduce((sum, flow) => {
    const years = (new Date(flow.date).getTime() - first) / DAY_MS / 365;
    return sum - (years * flow.amount) / (1 + rate) ** (years + 1);
  }, 0);
}

export function calculateXirr(flows: CashFlow[]): number | undefined {
  const valid = flows.filter((flow) => Number.isFinite(flow.amount) && flow.date).sort((a, b) => a.date.localeCompare(b.date));
  if (valid.length < 2 || !valid.some((f) => f.amount > 0) || !valid.some((f) => f.amount < 0)) return undefined;

  let guess = 0.08;
  for (let i = 0; i < 80; i += 1) {
    const value = npv(guess, valid);
    const slope = derivative(guess, valid);
    if (Math.abs(value) < 1e-7) return guess;
    if (!Number.isFinite(slope) || Math.abs(slope) < 1e-12) break;
    const next = guess - value / slope;
    if (!Number.isFinite(next) || next <= -0.9999) break;
    guess = next;
  }

  let low = -0.9999;
  let high = 10;
  let lowValue = npv(low, valid);
  let highValue = npv(high, valid);
  if (lowValue * highValue > 0) {
    high = 100;
    highValue = npv(high, valid);
  }
  if (lowValue * highValue > 0) return undefined;

  for (let i = 0; i < 160; i += 1) {
    const mid = (low + high) / 2;
    const midValue = npv(mid, valid);
    if (Math.abs(midValue) < 1e-7) return mid;
    if (lowValue * midValue <= 0) {
      high = mid;
      highValue = midValue;
    } else {
      low = mid;
      lowValue = midValue;
    }
  }
  const result = (low + high) / 2;
  return Number.isFinite(result) ? result : undefined;
}
