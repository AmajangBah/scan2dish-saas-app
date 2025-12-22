"use client";

import { useState } from "react";

import Header from "./components/Header";
import WeeklySales from "./components/WeeklySalesChart";
import KpiSection from "./components/KpiSection";
import CategoryChart from "./components/CategorySalesChart";
import TopProducts from "./components/TopSellingTable";
import RevenueCard from "./components/RevenueCard";

import { currentWeek, lastWeek } from "./data";

export default function AnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<any>(null);

  return (
    <div className="space-y-10">
      <Header
        onMonthChange={setSelectedMonth}
        onRangeChange={setSelectedRange}
      />

      {/* Weekly Sales + Revenue */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <WeeklySales month={selectedMonth} range={selectedRange} />
        </div>

        <RevenueCard month={selectedMonth} range={selectedRange} />
      </div>

      {/* KPIs */}
      <KpiSection month={selectedMonth} range={selectedRange} />

      {/* Category Chart */}
      <CategoryChart month={selectedMonth} range={selectedRange} />

      {/* Top Selling */}
      <TopProducts
        currentWeek={currentWeek}
        lastWeek={lastWeek}
        month={selectedMonth}
        range={selectedRange}
      />
    </div>
  );
}
