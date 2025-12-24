import { createServerSupabase } from "@/lib/supabase/server";
import { getRestaurantId } from "@/lib/getRestaurantId";
import OrdersClient from "./OrdersClient";
import { Order } from "./types";

export default async function OrdersPage() {
  const restaurant_id = await getRestaurantId();
  
  if (!restaurant_id) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center text-red-600">
          Unable to load restaurant data. Please log in again.
        </div>
      </div>
    );
  }

  const supabase = createServerSupabase();

  // Fetch orders with table information
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total,
      items,
      created_at,
      restaurant_tables!inner(table_number)
    `)
    .eq("restaurant_id", restaurant_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch orders:", error);
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center text-red-600">
          Failed to load orders. Please try again later.
        </div>
      </div>
    );
  }

  // Map database orders to UI Order type
  const mappedOrders: Order[] = (orders || []).map((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    const orderItems = items.map((item: {name?: string; quantity?: number; price?: string | number}) => ({
      name: item.name || "Unknown Item",
      qty: item.quantity || 1,
      price: parseFloat(String(item.price || 0)),
    }));

    return {
      id: o.id,
      table: o.restaurant_tables?.table_number || "Unknown",
      status: o.status as "pending" | "preparing" | "completed",
      total: parseFloat(o.total || 0).toFixed(2),
      time: new Date(o.created_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: orderItems,
    };
  });

  return <OrdersClient initialOrders={mappedOrders} />;
}
