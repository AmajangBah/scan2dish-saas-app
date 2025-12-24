"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getCurrencyOptions } from "@/lib/utils/currency";

export default function PreferencesSection() {
  const [color, setColor] = useState("#ff9800");
  const currencyOptions = getCurrencyOptions();

  return (
    <div className="p-6 space-y-10 max-w-md">
      <h2 className="text-2xl font-semibold">Preferences</h2>

      {/* Language */}
      <div className="space-y-2">
        <Label>Language</Label>
        <Select defaultValue="en">
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <Label>Currency</Label>
        <Select defaultValue="usd">
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toLowerCase()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand Color */}
      <div className="space-y-2">
        <Label>Customer UI Primary Color</Label>
        <Input
          type="color"
          className="h-12 w-24 p-0 border-none"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          This color will be applied to buttons and headers on the customer
          page.
        </p>
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Order Notifications</Label>
          <p className="text-xs text-muted-foreground">
            Receive a sound alert when new orders are placed.
          </p>
        </div>
        <Switch defaultChecked />
      </div>

      <Button className="w-full mt-4">Save Changes</Button>
    </div>
  );
}
