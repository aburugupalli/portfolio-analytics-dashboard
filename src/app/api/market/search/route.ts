import { NextRequest, NextResponse } from "next/server";
import { cacheKey, getCached, setCached } from "@/lib/market/marketCache";
import { searchYahoo } from "@/lib/market/yahooClient";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();
  if (!query) return NextResponse.json({ results: [] });
  const key = cacheKey("search", query);
  const cached = getCached(key);
  if (cached && !cached.stale) return NextResponse.json({ results: cached.value, cached: true });
  try {
    const results = await searchYahoo(query);
    setCached(key, results, 24 * 60 * 60 * 1000);
    return NextResponse.json({ results, cached: false });
  } catch (error) {
    if (cached) return NextResponse.json({ results: cached.value, cached: true, status: "Stale" });
    return NextResponse.json({ results: [], error: error instanceof Error ? error.message : "Search failed" }, { status: 502 });
  }
}
