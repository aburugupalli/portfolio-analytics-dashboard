export function DataTable({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-neutral-800">{children}</div>;
}
