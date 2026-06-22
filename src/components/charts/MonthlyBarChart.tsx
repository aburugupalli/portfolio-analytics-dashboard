"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthlyDevelopmentEntry } from "@/types/portfolio";

export function MonthlyBarChart({ data }: { data: MonthlyDevelopmentEntry[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.slice(-18)}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="openCostBasisChange" name="Cost Basis Change" fill="#0f766e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="dividends" name="Dividends" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
