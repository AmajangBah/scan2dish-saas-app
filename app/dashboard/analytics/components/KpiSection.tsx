import KpiCard from "./KpiCard";

interface Props {
  month: string | null;
  range: any;
}

export default function KpiSection({ month, range }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KpiCard label="Orders This Week" value="342" />
      <KpiCard label="Average Order" value="D180" />
      <KpiCard label="Returning Customers" value="62%" />
      <KpiCard label="Table Scans" value="1,230" />
    </div>
  );
}
