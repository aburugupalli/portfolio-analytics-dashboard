"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Position } from "@/types/portfolio";

const colors = ["#0f766e", "#2563eb", "#db2777", "#d97706", "#475569", "#16a34a", "#7c3aed"];

export function AllocationChart({ positions }: { positions: Position[] }) {
  const data = positions.filter((p) => p.status === "Open").slice(0, 7).map((p) => ({ name: p.name, value: p.marketValue ?? p.openCostBasis }));
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={2}>
            {data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
          </Pie>
          <Tooltip formatter={(value) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Number(value ?? 0))} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
