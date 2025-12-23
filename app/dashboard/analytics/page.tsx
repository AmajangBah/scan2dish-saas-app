import {
  getAnalyticsKPIs,
  getTopSellingItems,
  getCategorySales,
  getWeeklySales,
} from "@/app/actions/analytics";
import { getRestaurantId } from "@/lib/getRestaurantId";
import AnalyticsClient from "./AnalyticsClient";

export default async function AnalyticsPage() {
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

  // Fetch all analytics data in parallel
  const [kpis, topItems, categorySales, weeklySales] = await Promise.all([
    getAnalyticsKPIs(),
    getTopSellingItems(5),
    getCategorySales(),
    getWeeklySales(),
  ]);

  return (
    <AnalyticsClient
      kpis={kpis}
      topItems={topItems}
      categorySales={categorySales}
      weeklySales={weeklySales}
    />
  );
}
