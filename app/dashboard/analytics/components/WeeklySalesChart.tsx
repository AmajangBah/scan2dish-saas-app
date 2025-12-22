"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  month: string | null;
  range: any;
}

const sampleSales = [
  { day: "Mon", amount: 5000 },
  { day: "Tue", amount: 6200 },
  { day: "Wed", amount: 5800 },
  { day: "Thu", amount: 7100 },
  { day: "Fri", amount: 8300 },
  { day: "Sat", amount: 9200 },
  { day: "Sun", amount: 6800 },
];

export default function WeeklySales({ month, range }: Props) {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Weekly Sales Overview</h2>
      <p className="text-muted-foreground text-sm mb-6">
        {month
          ? `Showing data for: ${month}`
          : range
          ? "Filtered by custom date range"
          : "This Week"}
      </p>

      <div className="h-[330px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleSales}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              fill="url(#colorSales)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
