import { describe, expect, it } from "vitest";
import { parseGermanNumber } from "./parseGermanNumber";
import { normalizeTransactions } from "./normalizeTransactions";
import { markDuplicates } from "./detectDuplicates";

describe("csv parsing", () => {
  it("parses german numbers", () => {
    expect(parseGermanNumber("1.234,56")).toBe(1234.56);
    expect(parseGermanNumber("149,95")).toBe(149.95);
    expect(parseGermanNumber("(12,30)")).toBe(-12.3);
  });

  it("normalizes semicolon-like rows and ignores pending in calculations", () => {
    const rows = [
      { date: "01.01.2024", time: "10:00", status: "Executed", type: "Buy", isin: "DE0001", shares: "2,5", price: "10,00", amount: "25,00", fee: "1,00", tax: "", currency: "EUR", description: "Test" },
      { date: "02.01.2024", time: "10:00", status: "Cancelled", type: "Buy", isin: "DE0001", shares: "1", price: "10", amount: "10", currency: "EUR", description: "Test" },
    ];
    const normalized = normalizeTransactions(rows);
    expect(normalized[0].shares).toBe(2.5);
    expect(normalized[1].includedInCalculations).toBe(false);
  });

  it("marks duplicate transactions", () => {
    const normalized = normalizeTransactions([
      { date: "01.01.2024", time: "10:00", status: "Executed", reference: "A", type: "Buy", isin: "DE0001", shares: "1", amount: "10" },
      { date: "01.01.2024", time: "10:00", status: "Executed", reference: "A", type: "Buy", isin: "DE0001", shares: "1", amount: "10" },
    ]);
    expect(markDuplicates(normalized).duplicates).toBe(1);
  });
});
