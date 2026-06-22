import type { Position } from "@/types/portfolio";

export function suggestedSearchQuery(position: Position) {
  return position.symbol || position.isin || position.name;
}
