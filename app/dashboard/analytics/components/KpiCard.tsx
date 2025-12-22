interface CardProps {
  label: string;
  value: string | number;
}

export default function KpiCard({ label, value }: CardProps) {
  return (
    <div className="rounded-2xl border bg-white/60 p-6 shadow-sm backdrop-blur-xl">
      <p className="text-sm text-muted-foreground">{label}</p>
      <h3 className="text-3xl font-semibold mt-2">{value}</h3>
    </div>
  );
}
