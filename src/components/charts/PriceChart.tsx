"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HistoricalPrice } from "@/types/market";

export function PriceChart({ prices, averageCost }: { prices: HistoricalPrice[]; averageCost?: number }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={prices.map((p) => ({ ...p, date: p.date.slice(0, 10) }))}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="close" stroke="#0f766e" strokeWidth={2} dot={false} />
          {averageCost ? <ReferenceLine y={averageCost} stroke="#dc2626" strokeDasharray="4 4" /> : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
