"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import type { DailyDevelopmentEntry } from "@/types/portfolio";

export function PerformanceChart({ data }: { data: DailyDevelopmentEntry[] }) {
  const chartData = data.reduce<Array<{ date: string; value: number }>>((acc, entry) => {
    const previous = acc.at(-1)?.value ?? 0;
    const value = previous + entry.openCostBasisChange + entry.realizedPnl + entry.dividends - entry.fees - entry.taxes;
    return [...acc, { date: entry.date, value: Number(value.toFixed(2)) }];
  }, []);
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
