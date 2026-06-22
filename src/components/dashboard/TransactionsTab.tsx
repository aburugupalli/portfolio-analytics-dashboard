"use client";

import { useState } from "react";
import type { PortfolioState } from "@/types/portfolio";

export function TransactionsTab({ state }: { state: PortfolioState }) {
  const [query, setQuery] = useState("");
  const rows = state.transactions.filter((tx) => `${tx.description} ${tx.isin ?? ""} ${tx.type} ${tx.status}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="space-y-3">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter transactions" className="min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-neutral-800"><tr>{["Date", "Status", "Type", "Name", "ISIN", "Shares", "Price", "Amount", "Fee", "Tax", "Included"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>{rows.map((tx) => <tr key={tx.id} className="border-b border-slate-100 last:border-0 dark:border-neutral-800"><td className="px-4 py-3">{tx.date}</td><td className="px-4 py-3">{tx.status}</td><td className="px-4 py-3">{tx.type}</td><td className="px-4 py-3 font-semibold">{tx.description}</td><td className="px-4 py-3">{tx.isin}</td><td className="px-4 py-3">{tx.shares}</td><td className="px-4 py-3">{tx.price}</td><td className="px-4 py-3">{tx.amount}</td><td className="px-4 py-3">{tx.fee}</td><td className="px-4 py-3">{tx.tax}</td><td className="px-4 py-3">{tx.includedInCalculations ? "Yes" : "No"}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
