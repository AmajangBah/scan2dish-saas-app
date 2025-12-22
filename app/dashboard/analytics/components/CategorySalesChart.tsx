"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  month: string | null;
  range: any;
}

const categorySales = [
  { category: "Burgers", amount: 14500 },
  { category: "Shawarma", amount: 10300 },
  { category: "Drinks", amount: 8700 },
  { category: "Wraps", amount: 6200 },
  { category: "Desserts", amount: 5400 },
];

export default function CategoryChart({ month, range }: Props) {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Sales by Category</h2>
      <p className="text-muted-foreground text-sm mb-6">
        {month
          ? `Showing data for: ${month}`
          : range
          ? "Filtered by custom date range"
          : "This Month"}
      </p>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categorySales}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="amount" fill="#a855f7" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
