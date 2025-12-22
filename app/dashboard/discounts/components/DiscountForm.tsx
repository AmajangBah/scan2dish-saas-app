import DiscountTypeSelect from "./DiscountTypeSelect";
import ApplyToSelect from "./ApplyToSelect";
import DateRangeSelector from "./DateRangeSelector";
import TimeRangeInputs from "./TimeRangeInput";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function DiscountForm({ dateRange, setDateRange }: any) {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label>Discount Name</Label>
        <Input placeholder="Weekend Shawarma Promo" />
      </div>

      <DiscountTypeSelect />

      <div className="space-y-2">
        <Label>Amount</Label>
        <div className="flex gap-2 items-center">
          <Input type="number" placeholder="20" />
          <span className="text-muted-foreground">% / D</span>
        </div>
      </div>

      <ApplyToSelect />

      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />

      <TimeRangeInputs />

      <div className="pt-4 flex justify-end">
        <Button className="px-6">Create Discount</Button>
      </div>
    </div>
  );
}
