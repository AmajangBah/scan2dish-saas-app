"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Download,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export default function BillingSectionPremium() {
  const invoices = [
    { id: "INV-0012", date: "Dec 1, 2025", amount: "D374", status: "Paid" },
    { id: "INV-0011", date: "Nov 1, 2025", amount: "D412", status: "Paid" },
    { id: "INV-0010", date: "Oct 1, 2025", amount: "D398", status: "Paid" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Billing</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your payment methods, invoices and commission billing cycle.
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <RefreshCw size={16} />
        </Button>
      </div>

      {/* CURRENT PLAN */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">
              Current Commission Model
            </div>
            <div className="text-2xl font-bold mt-1">2.5% per Order</div>
            <p className="text-sm text-slate-500 mt-2">
              Commission deducted monthly based on total processed orders.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button size="sm">View Breakdown</Button>
            <Button variant="outline" size="sm">
              Change Model
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PAYMENT METHOD */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold p-6">
            Payment Method
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Card on file */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-inner">
                <CreditCard className="text-slate-700" size={22} />
              </div>
              <div>
                <div className="font-medium">Visa ending in 4421</div>
                <div className="text-xs text-slate-500">Expires 09/28</div>
              </div>
            </div>
            <Button variant="outline">Replace</Button>
          </div>

          {/* Add new */}
          <Button variant="secondary" className="w-full gap-2">
            <Plus size={16} /> Add Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* INVOICE HISTORY */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="p-6 text-lg font-semibold">
            Invoice History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4 text-left">Invoice</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-medium">{inv.id}</td>
                  <td className="p-4">{inv.date}</td>
                  <td className="p-4">{inv.amount}</td>
                  <td className="p-4">
                    <Badge variant="secondary">{inv.status}</Badge>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Download size={14} /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* SECURITY */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="font-semibold">Payments secured by Stripe</div>
            <p className="text-xs text-slate-500 mt-1">
              All transactions are encrypted and PCI-compliant.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
