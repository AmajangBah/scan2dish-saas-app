"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import DiscountsHeader from "./components/DiscountsHeader";
import DiscountList from "./components/DiscountList";
import DiscountForm from "./components/DiscountForm";

export default function DiscountsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [dateRange, setDateRange] = useState();

  const mockData = [
    {
      title: "20% Off Shawarma",
      type: "Item Discount",
      duration: "Jan 15 - Jan 20",
    },
    {
      title: "10% Drinks Promo",
      type: "Category Discount",
      duration: "Feb 2 - Feb 5",
    },
  ];

  return (
    <div className="space-y-10">
      <DiscountsHeader onCreate={() => setCreateOpen(true)} />

      <DiscountList discounts={mockData} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Create Discount
            </DialogTitle>
          </DialogHeader>

          <DiscountForm dateRange={dateRange} setDateRange={setDateRange} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
