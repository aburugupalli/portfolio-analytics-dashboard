import { parse, isValid, formatISO } from "date-fns";
import type { NormalizedTransaction, RawTransaction, TransactionKind, TransactionStatus } from "@/types/portfolio";
import { parseGermanNumber } from "./parseGermanNumber";

const statusMap: Record<string, TransactionStatus> = {
  executed: "Executed",
  pending: "Pending",
  cancelled: "Cancelled",
  canceled: "Cancelled",
  expired: "Expired",
  rejected: "Rejected",
};

const typeMap: Record<string, TransactionKind> = {
  buy: "Buy",
  kauf: "Buy",
  sell: "Sell",
  verkauf: "Sell",
  "savings plan": "Savings plan",
  sparplan: "Savings plan",
  distribution: "Distribution",
  ausschüttung: "Distribution",
  dividend: "Distribution",
  deposit: "Deposit",
  einzahlung: "Deposit",
  withdrawal: "Withdrawal",
  auszahlung: "Withdrawal",
  "security transfer": "Security transfer",
  "corporate action": "Corporate action",
  taxes: "Taxes",
  tax: "Taxes",
  steuern: "Taxes",
  interest: "Interest",
  zinsen: "Interest",
  fee: "Fee",
  gebühr: "Fee",
};

const aliases: Record<string, string[]> = {
  date: ["date", "datum", "buchungstag"],
  time: ["time", "zeit"],
  status: ["status"],
  reference: ["reference", "referenz", "id"],
  description: ["description", "beschreibung", "name"],
  assetType: ["assettype", "asset type", "asset_type", "wertpapierart"],
  type: ["type", "typ", "transactiontype", "transaction type"],
  isin: ["isin"],
  shares: ["shares", "stücke", "stuecke", "quantity", "anzahl"],
  price: ["price", "preis", "kurs"],
  amount: ["amount", "betrag", "value", "wert"],
  fee: ["fee", "fees", "gebühr", "gebuehr", "kosten"],
  tax: ["tax", "taxes", "steuer", "steuern"],
  currency: ["currency", "währung", "waehrung"],
};

function keyOf(raw: RawTransaction, field: keyof typeof aliases) {
  const keys = Object.keys(raw);
  const wanted = aliases[field].map((x) => x.toLowerCase().replace(/[^a-z0-9äöüß]/gi, ""));
  return keys.find((key) => wanted.includes(key.toLowerCase().replace(/[^a-z0-9äöüß]/gi, "")));
}

function read(raw: RawTransaction, field: keyof typeof aliases) {
  const key = keyOf(raw, field);
  const value = key ? raw[key] : undefined;
  return value === null || value === undefined ? "" : String(value).trim();
}

function parseDateTime(dateValue: string, timeValue: string) {
  const candidates = ["dd.MM.yyyy HH:mm:ss", "dd.MM.yyyy HH:mm", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm"];
  const combined = `${dateValue} ${timeValue || "00:00"}`.trim();
  for (const pattern of candidates) {
    const parsed = parse(combined, pattern, new Date());
    if (isValid(parsed)) return parsed;
  }
  const fallback = new Date(`${dateValue}T${timeValue || "00:00:00"}`);
  return isValid(fallback) ? fallback : new Date(0);
}

export function normalizeTransactions(rawRows: RawTransaction[], sourceFile?: string): NormalizedTransaction[] {
  return rawRows
    .filter((row) => Object.values(row).some((value) => String(value ?? "").trim()))
    .map((row, index) => {
      const warnings: string[] = [];
      const date = read(row, "date");
      const time = read(row, "time");
      const parsedDate = parseDateTime(date, time);
      const rawStatus = read(row, "status").toLowerCase();
      const rawType = read(row, "type").toLowerCase();
      const status = statusMap[rawStatus] ?? "Unknown";
      const type = typeMap[rawType] ?? "Unknown";
      const assetRaw = read(row, "assetType").toLowerCase();
      const assetType = assetRaw.includes("cash") || assetRaw.includes("bar") ? "Cash" : assetRaw.includes("security") || assetRaw.includes("wert") ? "Security" : "Unknown";
      const isin = read(row, "isin") || undefined;
      if (status === "Unknown") warnings.push("Unknown status");
      if (type === "Unknown") warnings.push("Unknown transaction type");
      if (!isin && assetType === "Security") warnings.push("Missing ISIN");
      const normalized: NormalizedTransaction = {
        id: `${sourceFile ?? "csv"}-${index}-${formatISO(parsedDate)}`,
        sourceFile,
        rowNumber: index + 1,
        date: formatISO(parsedDate, { representation: "date" }),
        time: time || undefined,
        dateTime: parsedDate.toISOString(),
        status,
        reference: read(row, "reference") || undefined,
        description: read(row, "description") || isin || "Unknown",
        assetType,
        type,
        isin,
        shares: parseGermanNumber(read(row, "shares")),
        price: parseGermanNumber(read(row, "price")),
        amount: parseGermanNumber(read(row, "amount")),
        fee: Math.abs(parseGermanNumber(read(row, "fee")) ?? 0),
        tax: parseGermanNumber(read(row, "tax")) ?? 0,
        currency: read(row, "currency") || "EUR",
        includedInCalculations: status === "Executed",
        warnings,
      };
      return normalized;
    })
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime));
}
