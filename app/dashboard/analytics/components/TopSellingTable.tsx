"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Product {
  name: string;
  amount: number;
}

interface Props {
  currentWeek: Product[];
  lastWeek: Product[];
  month: string | null;
  range: any;
}

export default function TopProducts({ currentWeek, lastWeek }: Props) {
  const combined = currentWeek.map((item) => {
    const last = lastWeek.find((p) => p.name === item.name);
    const lastAmount = last?.amount ?? 0;
    const diff = item.amount - lastAmount;
    const percent = lastAmount ? ((diff / lastAmount) * 100).toFixed(1) : "0";

    return {
      ...item,
      lastAmount,
      percent,
      trendingUp: diff >= 0,
    };
  });

  return (
    <div className="rounded-3xl border bg-white/50 p-8">
      <h2 className="text-xl font-semibold mb-6">Top Selling Products</h2>

      <div className="space-y-4">
        {combined.map((p, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 rounded-2xl border"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs flex items-center gap-1">
                {p.trendingUp ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                {p.percent}% vs last week
              </p>
            </div>
            <p className="text-lg font-semibold">D{p.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
