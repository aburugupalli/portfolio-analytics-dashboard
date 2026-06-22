"use client";

import Papa from "papaparse";
import type { NormalizedTransaction, RawTransaction } from "@/types/portfolio";
import { markDuplicates } from "./detectDuplicates";
import { normalizeTransactions } from "./normalizeTransactions";

export type ParsedCsvResult = {
  rawTransactions: RawTransaction[];
  transactions: NormalizedTransaction[];
  warnings: string[];
  duplicates: number;
};

export async function parseScalableFiles(files: File[]): Promise<ParsedCsvResult> {
  const allRaw: RawTransaction[] = [];
  const allNormalized: NormalizedTransaction[] = [];
  const warnings: string[] = [];

  for (const file of files) {
    const parsed = await new Promise<Papa.ParseResult<RawTransaction>>((resolve, reject) => {
      Papa.parse<RawTransaction>(file, {
        header: true,
        skipEmptyLines: true,
        delimiter: ";",
        dynamicTyping: false,
        transformHeader: (header) => header.trim(),
        complete: resolve,
        error: reject,
      });
    });
    if (parsed.errors.length) {
      warnings.push(...parsed.errors.map((error) => `${file.name}: ${error.message}`));
    }
    allRaw.push(...parsed.data);
    allNormalized.push(...normalizeTransactions(parsed.data, file.name));
  }

  const deduped = markDuplicates(allNormalized.sort((a, b) => a.dateTime.localeCompare(b.dateTime)));
  return {
    rawTransactions: allRaw,
    transactions: deduped.transactions,
    warnings,
    duplicates: deduped.duplicates,
  };
}
