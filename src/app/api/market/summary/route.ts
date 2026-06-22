import { NextRequest, NextResponse } from "next/server";
import { cacheKey, getCached, setCached } from "@/lib/market/marketCache";
import { summaryYahoo } from "@/lib/market/yahooClient";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim();
  if (!symbol) return NextResponse.json({ summary: null });
  const key = cacheKey("summary", symbol);
  const cached = getCached(key);
  if (cached && !cached.stale) return NextResponse.json({ summary: cached.value, cached: true });
  try {
    const summary = await summaryYahoo(symbol);
    setCached(key, summary, 18 * 60 * 60_000);
    return NextResponse.json({ summary, cached: false });
  } catch (error) {
    if (cached) return NextResponse.json({ summary: cached.value, cached: true, status: "Stale" });
    return NextResponse.json({ summary: null, error: error instanceof Error ? error.message : "Summary failed" }, { status: 502 });
  }
}
