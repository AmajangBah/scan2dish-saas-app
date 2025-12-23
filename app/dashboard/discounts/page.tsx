import { getRestaurantId } from "@/lib/getRestaurantId";
import { getDiscounts } from "@/app/actions/discounts";
import DiscountsClient from "./DiscountsClient";

export default async function DiscountsPage() {
  const restaurant_id = await getRestaurantId();

  if (!restaurant_id) {
    return (
      <div className="p-6 min-h-screen">
        <div className="text-center text-red-600">
          Unable to load restaurant data. Please log in again.
        </div>
      </div>
    );
  }

  const discounts = await getDiscounts();

  return <DiscountsClient initialDiscounts={discounts} />;
}
