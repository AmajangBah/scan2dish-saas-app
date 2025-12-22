import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ApplyToSelect() {
  return (
    <div className="space-y-2">
      <Label>Apply To</Label>

      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select category or item" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="desserts">Desserts</SelectItem>
          <SelectItem value="drinks">Drinks</SelectItem>
          <SelectItem value="starters">Starters</SelectItem>
          <SelectItem value="drinks">Drinks</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
