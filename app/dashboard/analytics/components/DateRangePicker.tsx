"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

export function DateRangePicker({
  onChange,
}: {
  onChange: (range: DateRange | undefined) => void;
}) {
  const [range, setRange] = useState<DateRange | undefined>();

  const handleSelect = (val: DateRange | undefined) => {
    setRange(val);
    onChange(val);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          {range?.from
            ? `${range.from.toLocaleDateString()} — ${
                range.to?.toLocaleDateString() ?? "…"
              }`
            : "Custom Range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
