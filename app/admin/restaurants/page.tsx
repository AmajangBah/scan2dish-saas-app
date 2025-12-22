import { requireAdmin } from "@/lib/admin/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle, Search } from "lucide-react";

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string };
}) {
  await requireAdmin();
  const supabase = createServerSupabase();

  // Build query
  let query = supabase
    .from("restaurants")
    .select(`
      id,
      name,
      phone,
      menu_enabled,
      commission_balance,
      total_commission_owed,
      total_commission_paid,
      created_at,
      enforcement_reason,
      notes
    `)
    .order("created_at", { ascending: false });

  // Filter by status
  if (searchParams.status === "active") {
    query = query.eq("menu_enabled", true);
  } else if (searchParams.status === "disabled") {
    query = query.eq("menu_enabled", false);
  } else if (searchParams.status === "overdue") {
    query = query.gt("commission_balance", 0);
  }

  const { data: restaurants, error } = await query;

  if (error) {
    return <div className="text-red-600">Failed to load restaurants</div>;
  }

  // Filter by search (client-side for simplicity)
  const filteredRestaurants = searchParams.search
    ? restaurants?.filter((r) =>
        r.name.toLowerCase().includes(searchParams.search!.toLowerCase())
      )
    : restaurants;

  // Calculate stats
  const totalActive = restaurants?.filter((r) => r.menu_enabled).length || 0;
  const totalDisabled = restaurants?.filter((r) => !r.menu_enabled).length || 0;
  const totalOverdue = restaurants?.filter((r) => Number(r.commission_balance) > 0).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-500 mt-1">Manage all restaurants on the platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{restaurants?.length || 0}</div>
            <p className="text-sm text-gray-500">Total Restaurants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{totalActive}</div>
            <p className="text-sm text-gray-500">Active Menus</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{totalDisabled}</div>
            <p className="text-sm text-gray-500">Disabled Menus</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{totalOverdue}</div>
            <p className="text-sm text-gray-500">With Balance Due</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <Link
            href="/admin/restaurants"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !searchParams.status
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </Link>
          <Link
            href="/admin/restaurants?status=active"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              searchParams.status === "active"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active
          </Link>
          <Link
            href="/admin/restaurants?status=disabled"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              searchParams.status === "disabled"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Disabled
          </Link>
          <Link
            href="/admin/restaurants?status=overdue"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              searchParams.status === "overdue"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Overdue
          </Link>
        </div>
      </div>

      {/* Restaurants List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRestaurants?.map((restaurant) => {
                  const balance = Number(restaurant.commission_balance);
                  const owed = Number(restaurant.total_commission_owed);
                  const paid = Number(restaurant.total_commission_paid);

                  return (
                    <tr key={restaurant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{restaurant.name}</p>
                          <p className="text-sm text-gray-500">{restaurant.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {restaurant.menu_enabled ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-700">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-700">Disabled</span>
                          </div>
                        )}
                        {restaurant.enforcement_reason && (
                          <p className="text-xs text-gray-500 mt-1">
                            {restaurant.enforcement_reason}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900">D{owed.toFixed(2)}</p>
                          <p className="text-gray-500">owed</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p
                            className={`font-medium ${
                              balance > 0 ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            D{balance.toFixed(2)}
                          </p>
                          {balance > 0 && (
                            <Badge variant="destructive" className="mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(restaurant.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/restaurants/${restaurant.id}`}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(!filteredRestaurants || filteredRestaurants.length === 0) && (
              <div className="text-center py-12 text-gray-500">No restaurants found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
