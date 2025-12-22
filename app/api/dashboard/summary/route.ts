import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getRestaurantId } from "@/lib/getRestaurantId";

export async function GET() {
  const supabase = createServerSupabase();
  const restaurant_id = await getRestaurantId();

  if (!restaurant_id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Total orders
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant_id);

  // Revenue - Use database aggregation for better performance
  // Only count completed orders for revenue
  const { data: revenueData, error: revenueError } = await supabase
    .from("orders")
    .select("total")
    .eq("restaurant_id", restaurant_id)
    .eq("status", "completed");

  const revenue =
    revenueData?.reduce((sum, o) => sum + Number(o.total || 0), 0) || 0;

  // Active tables
  const { count: activeTables } = await supabase
    .from("restaurant_tables")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant_id)
    .eq("is_active", true);

  // Pending orders (not deliveries - this is a table service app)
  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurant_id)
    .in("status", ["pending", "preparing"]);

  return NextResponse.json({
    totalOrders: totalOrders || 0,
    revenue,
    activeTables: activeTables || 0,
    pendingOrders: pendingOrders || 0, // Fixed: was "pendingDeliveries"
  });
}
