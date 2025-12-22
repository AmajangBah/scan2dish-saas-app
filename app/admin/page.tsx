import { requireAdmin } from "@/lib/admin/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, DollarSign, ShoppingCart, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = createServerSupabase();

  // Platform stats
  const { count: totalRestaurants } = await supabase
    .from("restaurants")
    .select("id", { count: "exact", head: true });

  const { count: activeRestaurants } = await supabase
    .from("restaurants")
    .select("id", { count: "exact", head: true })
    .eq("menu_enabled", true);

  const { count: totalOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true });

  const { data: revenueData } = await supabase
    .from("orders")
    .select("total")
    .eq("status", "completed");

  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total || 0), 0) || 0;

  const { data: commissionData } = await supabase.from("restaurants").select("commission_balance");

  const totalCommissionOwed = commissionData?.reduce(
    (sum, r) => sum + Number(r.commission_balance || 0),
    0
  ) || 0;

  const { count: overdueRestaurants } = await supabase
    .from("restaurants")
    .select("id", { count: "exact", head: true })
    .gt("commission_balance", 100); // More than $100 overdue

  // Recent restaurants
  const { data: recentRestaurants } = await supabase
    .from("restaurants")
    .select("id, name, menu_enabled, commission_balance, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total,
      created_at,
      restaurants!inner(name)
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and quick actions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Restaurants
            </CardTitle>
            <Store className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRestaurants || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              {activeRestaurants || 0} active menus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">D{Math.round(totalRevenue)}</div>
            <p className="text-xs text-gray-500 mt-1">Completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Commission Owed
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              D{Math.round(totalCommissionOwed)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {overdueRestaurants || 0} restaurants overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders || 0}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Restaurants */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRestaurants?.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/admin/restaurants/${restaurant.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {restaurant.menu_enabled ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{restaurant.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(restaurant.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      D{Number(restaurant.commission_balance).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Balance</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/admin/restaurants"
              className="block text-center text-sm text-orange-600 hover:text-orange-700 mt-4 font-medium"
            >
              View all restaurants →
            </Link>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders?.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.restaurants?.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      D{Number(order.total).toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "preparing"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/admin/orders"
              className="block text-center text-sm text-orange-600 hover:text-orange-700 mt-4 font-medium"
            >
              View all orders →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
