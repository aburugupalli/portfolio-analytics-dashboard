"use client";

import { cn } from "@/lib/utils";

export const dashboardTabs = ["Overview", "Holdings", "Realized P&L", "Live Prices", "XIRR", "Daily Development", "Portfolio Analysis", "Transactions", "Taxes & Fees", "Settings"] as const;
export type DashboardTab = (typeof dashboardTabs)[number];

export function DashboardTabs({ active, onChange }: { active: DashboardTab; onChange: (tab: DashboardTab) => void }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="inline-flex min-w-max rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {dashboardTabs.map((tab) => (
          <button key={tab} onClick={() => onChange(tab)} className={cn("min-h-10 rounded-md px-3 text-sm font-medium text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white", active === tab && "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950")}>
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
