import { getDiscounts } from "@/app/actions/discounts";
import DiscountsClient from "./DiscountsClient";
import { requireRestaurantPage } from "@/lib/auth/restaurant";

export default async function DiscountsPage() {
  await requireRestaurantPage();

  const discounts = await getDiscounts();

  return <DiscountsClient initialDiscounts={discounts} />;
}
