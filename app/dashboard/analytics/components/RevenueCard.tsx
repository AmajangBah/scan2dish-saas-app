interface Props {
  month: string | null;
  range: any;
}

export default function RevenueCard({ month, range }: Props) {
  return (
    <div className="rounded-3xl border bg-white/50 p-8">
      <p className="text-sm text-muted-foreground">Total Earnings</p>
      <h2 className="text-4xl font-bold mt-2">D25,000</h2>
    </div>
  );
}
