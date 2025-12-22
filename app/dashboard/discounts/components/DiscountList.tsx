import DiscountCard from "./DiscountCard";

export default function DiscountList({ discounts }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {discounts.map((d: any, i: number) => (
        <DiscountCard key={i} {...d} />
      ))}
    </div>
  );
}
