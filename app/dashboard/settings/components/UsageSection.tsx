"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { Download, ChevronDown, RefreshCw } from "lucide-react";

// Premium Usage section — drop-in replacement for UsageSection.tsx
// - High polish: KPI cards, SVG area chart sparkline, donut breakdown, recent orders table, filters & export
// - Uses shadcn components + Tailwind utilities

export default function UsageSectionPremium({
  brandColor = "#d9551a",
}: {
  brandColor?: string;
}) {
  const kpis = [
    { label: "Orders (30d)", value: "3,482", change: "+12%" },
    { label: "Conversion", value: "4.3%", change: "+0.4%" },
    { label: "Revenue", value: "D12,480", change: "+8%" },
    { label: "Commission", value: "D374", change: "-2%" },
  ];

  const recent = [
    { id: "#3452", items: 3, total: "D16", time: "2m ago", status: "New" },
    { id: "#3451", items: 1, total: "D8", time: "15m ago", status: "Accepted" },
    {
      id: "#3450",
      items: 4,
      total: "D25",
      time: "1h ago",
      status: "Preparing",
    },
  ];

  return (
    <div className="p-6">
      {/* header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold">Usage & Commission</h1>
          <p className="text-sm text-slate-500 mt-1">
            Detailed overview of orders, commissions and customer activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Input className="w-48" placeholder="Search orders" />
            <Button variant="ghost">
              <RefreshCw size={16} />
            </Button>
          </div>

          <Select>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Tooltip content="Export data">
            <Button>
              <Download size={16} /> Export
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {kpis.map((k, i) => (
          <Card key={i} className="p-4 rounded-2xl shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">{k.label}</div>
                  <div className="text-xl font-bold mt-1">{k.value}</div>
                </div>
                <Badge
                  className={`text-sm`}
                  variant={
                    k.change.startsWith("+") ? "secondary" : "destructive"
                  }
                >
                  {k.change}
                </Badge>
              </div>

              {/* mini sparkline */}
              <div className="mt-4 h-12">
                <svg
                  viewBox="0 0 100 24"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <polyline
                    fill="none"
                    stroke={brandColor}
                    strokeWidth="3"
                    points="0,18 15,10 30,12 45,5 60,8 75,6 90,4 100,2"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* main content: chart + breakdown + recent orders */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-8">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold p-6">
                Orders trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full h-60 bg-linear-to-b from-white to-slate-50 rounded-lg shadow-inner flex items-center justify-center">
                {/* Area chart (simple SVG with gradient) */}
                <svg viewBox="0 0 800 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={brandColor}
                        stopOpacity="0.25"
                      />
                      <stop
                        offset="100%"
                        stopColor={brandColor}
                        stopOpacity="0.02"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,140 C80,120 160,100 240,90 320,70 400,80 480,60 560,40 640,70 720,50 800,40 L800,200 L0,200 Z"
                    fill="url(#g1)"
                  />
                  <path
                    d="M0,140 C80,120 160,100 240,90 320,70 400,80 480,60 560,40 640,70 720,50 800,40"
                    fill="none"
                    stroke={brandColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Showing orders and commissions for the selected period.
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    Compare
                  </Button>
                  <Button size="sm">View detailed report</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* recent orders table */}
          <Card className="mt-6 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold p-6">
                Recent activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-500 bg-slate-50">
                    <tr>
                      <th className="p-4">Order</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r) => (
                      <tr key={r.id} className="border-t hover:bg-slate-50">
                        <td className="p-4 font-medium">{r.id}</td>
                        <td className="p-4">{r.items}</td>
                        <td className="p-4">{r.total}</td>
                        <td className="p-4">{r.time}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              r.status === "New" ? "outline" : "secondary"
                            }
                          >
                            {r.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">
                            Open
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* right column: breakdown + commission box */}
        <div className="col-span-4 space-y-4">
          <Card className="rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Commission Due</div>
                <div className="text-2xl font-bold">D374</div>
                <div className="text-sm text-slate-500 mt-1">
                  Next billing:{" "}
                  <span className="font-medium">Nov 30, 2025</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Button size="sm">Pay now</Button>
                <Button variant="outline" size="sm">
                  Download invoice
                </Button>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl p-4">
            <h3 className="text-sm text-slate-500">Order breakdown</h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-linear-to-br from-white to-slate-50">
                {/* donut chart (SVG) */}
                <svg viewBox="0 0 36 36" className="w-20 h-20">
                  <path
                    d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831 15.9155 15.9155 0 1 0 0-31.831"
                    fill="#f3f4f6"
                  />
                  <path
                    d="M18 2.0845a15.9155 15.9155 0 0 1 11.313 5.187 15.9155 15.9155 0 0 0-11.313-5.187z"
                    fill={brandColor}
                  />
                  <text
                    x="18"
                    y="21"
                    textAnchor="middle"
                    fontSize="6"
                    fill="#0f172a"
                  >
                    68%
                  </text>
                </svg>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Dine-in</div>
                    <div className="text-xs text-slate-500">1,820 orders</div>
                  </div>
                  <div className="text-sm font-semibold">48%</div>
                </div>

                <div className="mt-3">
                  <div className="text-sm font-medium">Pickup</div>
                  <div className="text-xs text-slate-500">662 orders</div>
                </div>

                <div className="mt-3">
                  <div className="text-sm font-medium">Delivery</div>
                  <div className="text-xs text-slate-500">1,000 orders</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl p-4">
            <h3 className="text-sm text-slate-500">Top items</h3>
            <ul className="mt-3 space-y-3">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center">
                    🍔
                  </div>
                  <div>
                    <div className="font-medium">Chicken Burger</div>
                    <div className="text-xs text-slate-500">420 sold</div>
                  </div>
                </div>
                <div className="text-sm font-semibold">D6.50</div>
              </li>

              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center">
                    🍟
                  </div>
                  <div>
                    <div className="font-medium">Fries</div>
                    <div className="text-xs text-slate-500">300 sold</div>
                  </div>
                </div>
                <div className="text-sm font-semibold">D2.00</div>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
