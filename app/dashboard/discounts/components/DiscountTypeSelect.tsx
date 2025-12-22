import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function DiscountTypeSelect() {
  return (
    <div className="space-y-2">
      <Label>Discount Type</Label>

      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="percentage">Percentage</SelectItem>
          <SelectItem value="fixed">Fixed Amount</SelectItem>
          <SelectItem value="category">Category Discount</SelectItem>
          <SelectItem value="item">Item Discount</SelectItem>
          <SelectItem value="time">Timed Promotion</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
