import type { NormalizedTransaction } from "@/types/portfolio";

export function transactionDuplicateKey(tx: NormalizedTransaction) {
  return [
    tx.reference || "",
    tx.date,
    tx.time || "",
    tx.isin || "",
    tx.type,
    tx.shares ?? "",
    tx.amount ?? "",
  ].join("|");
}

export function markDuplicates(transactions: NormalizedTransaction[]) {
  const seen = new Set<string>();
  let duplicates = 0;
  const result = transactions.map((tx) => {
    const key = transactionDuplicateKey(tx);
    if (seen.has(key)) {
      duplicates += 1;
      return { ...tx, duplicate: true, includedInCalculations: false, warnings: [...tx.warnings, "Duplicate transaction removed from calculations"] };
    }
    seen.add(key);
    return tx;
  });
  return { transactions: result, duplicates };
}
