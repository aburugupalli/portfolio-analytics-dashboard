import { cn } from "@/lib/utils";

export function KpiCard({ label, value, sublabel, tone = "neutral" }: { label: string; value: string; sublabel?: string; tone?: "neutral" | "positive" | "negative" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs font-medium uppercase tracking-normal text-slate-500 dark:text-slate-400">{label}</p>
      <p className={cn("mt-2 truncate text-2xl font-semibold number-tabular", tone === "positive" && "text-emerald-600 dark:text-emerald-300", tone === "negative" && "text-red-600 dark:text-red-300")}>{value}</p>
      {sublabel && <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{sublabel}</p>}
    </div>
  );
}
