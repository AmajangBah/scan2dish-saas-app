import { requireAdmin } from "@/lib/admin/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RestaurantControls from "./RestaurantControls";
import Link from "next/link";
import { ArrowLeft, Store, DollarSign, ShoppingCart, Table } from "lucide-react";

export default async function RestaurantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createServerSupabase();

  // Fetch restaurant details
  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !restaurant) {
    notFound();
  }

  // Fetch related counts
  const { count: tablesCount } = await supabase
    .from("restaurant_tables")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", params.id);

  const { count: menuItemsCount } = await supabase
    .from("menu_items")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", params.id);

  const { count: ordersCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", params.id);

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, status, total, created_at, restaurant_tables(table_number)")
    .eq("restaurant_id", params.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Commission payments
  const { data: payments } = await supabase
    .from("commission_payments")
    .select("*")
    .eq("restaurant_id", params.id)
    .order("payment_date", { ascending: false })
    .limit(10);

  const balance = Number(restaurant.commission_balance || 0);
  const owed = Number(restaurant.total_commission_owed || 0);
  const paid = Number(restaurant.total_commission_paid || 0);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/restaurants"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Restaurants
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
          <p className="text-gray-500 mt-1">{restaurant.phone}</p>
        </div>
        <Badge
          variant={restaurant.menu_enabled ? "default" : "destructive"}
          className="text-sm px-3 py-1"
        >
          {restaurant.menu_enabled ? "Menu Active" : "Menu Disabled"}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tables</CardTitle>
            <Table className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tablesCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Menu Items</CardTitle>
            <Store className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItemsCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Balance Due</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
              D{balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Controls & Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Admin Controls */}
          <RestaurantControls
            restaurantId={params.id}
            menuEnabled={restaurant.menu_enabled}
            enforcementReason={restaurant.enforcement_reason}
            notes={restaurant.notes}
          />

          {/* Commission Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Owed:</span>
                <span className="font-medium">D{owed.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-medium text-green-600">D{paid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold">Balance:</span>
                <span className={`font-bold ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
                  D{balance.toFixed(2)}
                </span>
              </div>
              {restaurant.last_payment_date && (
                <div className="text-xs text-gray-500 pt-2">
                  Last payment: {new Date(restaurant.last_payment_date).toLocaleDateString()}
                </div>
              )}
              <Link
                href={`/admin/commission?restaurant=${params.id}`}
                className="block text-center bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2 text-sm font-medium mt-4"
              >
                Manage Payments →
              </Link>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">ID:</span>
                <p className="font-mono text-xs break-all">{restaurant.id}</p>
              </div>
              <div>
                <span className="text-gray-600">Brand Color:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: restaurant.brand_color }}
                  />
                  <span className="text-xs">{restaurant.brand_color}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-600">Joined:</span>
                <p>{new Date(restaurant.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          Table {order.restaurant_tables?.table_number || "?"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">D{Number(order.total).toFixed(2)}</p>
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
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No orders yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {payment.payment_method.replace("_", " ")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </p>
                        {payment.reference_number && (
                          <p className="text-xs text-gray-400">Ref: {payment.reference_number}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          D{Number(payment.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No payments recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
