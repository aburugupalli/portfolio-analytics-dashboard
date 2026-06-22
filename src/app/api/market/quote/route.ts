import { NextRequest, NextResponse } from "next/server";
import type { MarketQuote } from "@/types/market";
import { cacheKey, getCached, setCached } from "@/lib/market/marketCache";
import { quoteYahoo } from "@/lib/market/yahooClient";

export async function GET(request: NextRequest) {
  const symbols = (request.nextUrl.searchParams.get("symbols") || request.nextUrl.searchParams.get("symbol") || "")
    .split(",")
    .map((symbol) => symbol.trim())
    .filter(Boolean)
    .slice(0, 50);
  if (!symbols.length) return NextResponse.json({ quotes: [] });
  const key = cacheKey("quote", symbols.sort().join(","));
  const cached = getCached<MarketQuote[]>(key);
  if (cached && !cached.stale) return NextResponse.json({ quotes: cached.value, cached: true });
  try {
    const quotes = await quoteYahoo(symbols);
    setCached(key, quotes, 45_000);
    return NextResponse.json({ quotes, cached: false });
  } catch (error) {
    if (cached) return NextResponse.json({ quotes: cached.value.map((q) => ({ ...q, status: "Stale" })), cached: true, status: "Stale" });
    return NextResponse.json({ quotes: symbols.map((symbol) => ({ symbol, source: "Yahoo Finance", fetchedAt: new Date().toISOString(), status: "Error", error: error instanceof Error ? error.message : "Quote failed" })) }, { status: 502 });
  }
}
