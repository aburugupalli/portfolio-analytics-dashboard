export function formatPercent(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("de-DE", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
