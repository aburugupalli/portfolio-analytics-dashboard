import type { PortfolioWarning } from "@/types/portfolio";

export function warning(code: string, message: string, severity: PortfolioWarning["severity"] = "warning"): PortfolioWarning {
  return { code, message, severity };
}
