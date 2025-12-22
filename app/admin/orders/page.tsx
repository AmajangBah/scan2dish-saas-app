import { requireAdmin } from "@/lib/admin/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; restaurant?: string };
}) {
  await requireAdmin();
  const supabase = createServerSupabase();

  // Build query
  let query = supabase
    .from("orders")
    .select(`
      id,
      status,
      total,
      commission_amount,
      created_at,
      items,
      restaurants!inner(id, name),
      restaurant_tables!inner(table_number)
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  // Filter by status
  if (searchParams.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status);
  }

  // Filter by restaurant
  if (searchParams.restaurant) {
    query = query.eq("restaurant_id", searchParams.restaurant);
  }

  const { data: orders, error } = await query;

  if (error) {
    return <div className="text-red-600">Failed to load orders</div>;
  }

  // Calculate stats
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total || 0), 0) || 0;
  const totalCommission = orders?.reduce((sum, o) => sum + Number(o.commission_amount || 0), 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;
  const preparingOrders = orders?.filter(o => o.status === "preparing").length || 0;
  const completedOrders = orders?.filter(o => o.status === "completed").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
        <p className="text-gray-500 mt-1">Platform-wide order feed</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-sm text-gray-500">Total Orders (Showing 100)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{pendingOrders}</div>
            <p className="text-sm text-gray-500">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{preparingOrders}</div>
            <p className="text-sm text-gray-500">Preparing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
            <p className="text-sm text-gray-500">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Link
          href="/admin/orders"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            !searchParams.status || searchParams.status === "all"
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/orders?status=pending"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            searchParams.status === "pending"
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Pending
        </Link>
        <Link
          href="/admin/orders?status=preparing"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            searchParams.status === "preparing"
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Preparing
        </Link>
        <Link
          href="/admin/orders?status=completed"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            searchParams.status === "completed"
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Completed
        </Link>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders?.map((order) => {
                  const items = Array.isArray(order.items) ? order.items : [];
                  const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-gray-900">
                          {order.id.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-gray-500">{itemCount} items</p>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/restaurants/${order.restaurants?.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-orange-600"
                        >
                          {order.restaurants?.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.restaurant_tables?.table_number || "?"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "preparing"
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "preparing"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        D{Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-green-600 font-medium">
                        D{Number(order.commission_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(!orders || orders.length === 0) && (
              <div className="text-center py-12 text-gray-500">No orders found</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {orders && orders.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">D{totalRevenue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Commission</p>
                <p className="text-2xl font-bold text-green-600">D{totalCommission.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-orange-600">
                  D{totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
