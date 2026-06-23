import { CheckCircle2, FileText } from "lucide-react";

export function UploadSummary({
  files,
  transactionCount,
  duplicates,
  ignoredCount = 0,
  holdingsCount,
}: {
  files: File[];
  transactionCount: number;
  duplicates: number;
  ignoredCount?: number;
  holdingsCount?: number;
}) {
  if (!files.length) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        Upload ready
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-md bg-slate-50 p-3 dark:bg-neutral-950">
          <p className="text-xs text-slate-500 dark:text-slate-400">Transactions</p>
          <p className="mt-1 text-lg font-semibold number-tabular">{transactionCount}</p>
        </div>
        <div className="rounded-md bg-slate-50 p-3 dark:bg-neutral-950">
          <p className="text-xs text-slate-500 dark:text-slate-400">Ignored</p>
          <p className="mt-1 text-lg font-semibold number-tabular">{ignoredCount + duplicates}</p>
        </div>
        <div className="rounded-md bg-slate-50 p-3 dark:bg-neutral-950">
          <p className="text-xs text-slate-500 dark:text-slate-400">Holdings</p>
          <p className="mt-1 text-lg font-semibold number-tabular">{holdingsCount ?? "N/A"}</p>
        </div>
      </div>
      <div className="max-h-40 space-y-2 overflow-auto">
        {files.map((file) => (
          <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900">
            <span className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate">{file.name}</span>
            </span>
            <span className="shrink-0 text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        ))}
      </div>
    </div>
  );
}
