import { NextRequest, NextResponse } from "next/server";
import { cacheKey, getCached, setCached } from "@/lib/market/marketCache";
import { chartYahoo } from "@/lib/market/yahooClient";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim();
  const range = request.nextUrl.searchParams.get("range") || "1y";
  const interval = request.nextUrl.searchParams.get("interval") || "1d";
  if (!symbol) return NextResponse.json({ prices: [] });
  const ttl = interval.includes("m") ? 3 * 60_000 : 6 * 60 * 60_000;
  const key = cacheKey("chart", symbol, range, interval);
  const cached = getCached(key);
  if (cached && !cached.stale) return NextResponse.json({ prices: cached.value, cached: true });
  try {
    const prices = await chartYahoo(symbol, range, interval);
    setCached(key, prices, ttl);
    return NextResponse.json({ prices, cached: false });
  } catch (error) {
    if (cached) return NextResponse.json({ prices: cached.value, cached: true, status: "Stale" });
    return NextResponse.json({ prices: [], error: error instanceof Error ? error.message : "Chart failed" }, { status: 502 });
  }
}
