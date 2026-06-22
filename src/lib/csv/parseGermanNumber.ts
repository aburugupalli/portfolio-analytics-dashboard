export function parseGermanNumber(input: unknown): number | undefined {
  if (input === null || input === undefined) return undefined;
  if (typeof input === "number") return Number.isFinite(input) ? input : undefined;
  const value = String(input).trim();
  if (!value) return undefined;
  const cleaned = value
    .replace(/\s/g, "")
    .replace(/[€%]/g, "")
    .replace(/^\((.*)\)$/, "-$1");
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned.replace(/,/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}
