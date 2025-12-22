"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";

export default function ProductCard({
  product,
}: {
  product: {
    id: string;
    name: string;
    desc?: string;
    price: number;
    image?: string;
  };
}) {
  const { add } = useCart();

  return (
    <div className="flex gap-4 items-start p-4 bg-white rounded-2xl shadow-sm">
      <div className="w-20 h-20 bg-orange-600 rounded-lg shrink-0" />

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        {product.desc && (
          <p className="text-sm text-gray-500 mt-1">{product.desc}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold">D{product.price}</div>
          <Button
            variant="outline"
            onClick={() =>
              add({ id: product.id, name: product.name, price: product.price })
            }
          >
            + Add
          </Button>
        </div>
      </div>
    </div>
  );
}
