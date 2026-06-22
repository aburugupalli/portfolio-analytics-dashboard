import { NextRequest, NextResponse } from "next/server";
import { cacheKey, getCached, setCached } from "@/lib/market/marketCache";
import { newsYahoo } from "@/lib/market/yahooClient";

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("symbol") || request.nextUrl.searchParams.get("query"))?.trim();
  if (!query) return NextResponse.json({ news: [] });
  const key = cacheKey("news", query);
  const cached = getCached(key);
  if (cached && !cached.stale) return NextResponse.json({ news: cached.value, cached: true });
  try {
    const news = await newsYahoo(query);
    setCached(key, news, 20 * 60_000);
    return NextResponse.json({ news, cached: false });
  } catch (error) {
    if (cached) return NextResponse.json({ news: cached.value, cached: true, status: "Stale" });
    return NextResponse.json({ news: [], error: error instanceof Error ? error.message : "News failed" }, { status: 502 });
  }
}
