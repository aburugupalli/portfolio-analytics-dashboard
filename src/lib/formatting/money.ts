export function formatMoney(value?: number, currency = "EUR") {
  if (value === undefined || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("de-DE", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}
