import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function TimeRangeInputs() {
  return (
    <div className="space-y-2">
      <Label>Active Hours</Label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Start Time</Label>
          <Input type="time" />
        </div>

        <div>
          <Label className="text-xs">End Time</Label>
          <Input type="time" />
        </div>
      </div>
    </div>
  );
}
