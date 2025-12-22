"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { Button } from "@/components/ui/button";

export default function ItemPage() {
  const { tableId, itemId } = useParams();
  const { add } = useCart();

  // mock item
  const item = {
    id: itemId ?? "1",
    name: "Beef Burger",
    desc: "Juicy beef patty with melted cheese and fries",
    price: 300,
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold">Amie's Kitchen</h2>

        <div className="mt-4 w-full h-52 bg-gray-100 rounded-xl" />

        <div className="mt-4">
          <h3 className="text-2xl font-semibold">{item.name}</h3>
          <p className="text-gray-600 mt-2">{item.desc}</p>
          <p className="text-xl font-bold mt-3">D{item.price}</p>

          <Button
            onClick={() =>
              add({ id: "item.id", name: item.name, price: item.price })
            }
            className="mt-6 w-full bg-orange-600 text-white py-3 rounded-xl"
          >
            Add to cart
          </Button>
        </div>

        <div className="mt-8">
          <h4 className="font-semibold">You might also like</h4>
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-600 rounded-xl" />
              <div>
                <div className="font-medium">Cocktail</div>
                <div className="text-xs text-gray-500">D70</div>
              </div>
            </div>
          </div>
        </div>

        <Link
          href={`/menu/${tableId}/browse`}
          className="block text-center mt-8 text-gray-600 underline"
        >
          Back to menu
        </Link>
      </div>
    </div>
  );
}
