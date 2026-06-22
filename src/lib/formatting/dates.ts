import { format, parseISO } from "date-fns";

export function formatDate(value?: string) {
  if (!value) return "N/A";
  try {
    return format(parseISO(value), "dd.MM.yyyy");
  } catch {
    return value;
  }
}
