import { MonthFilter } from "./MonthFilter";
import { DateRangePicker } from "./DateRangePicker";

interface HeaderProps {
  onMonthChange: (month: string | null) => void;
  onRangeChange: (range: any) => void;
}

export default function Header({ onMonthChange, onRangeChange }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl font-black tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Insights into your restaurant's performance.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <MonthFilter onChange={onMonthChange} />
        <DateRangePicker onChange={onRangeChange} />
      </div>
    </div>
  );
}
