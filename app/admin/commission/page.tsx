import { requireAdmin } from "@/lib/admin/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import RecordPaymentDialog from "./RecordPaymentDialog";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default async function CommissionPage({
  searchParams,
}: {
  searchParams: { restaurant?: string };
}) {
  await requireAdmin();
  const supabase = createServerSupabase();

  // Fetch restaurants with commission data
  let query = supabase
    .from("restaurants")
    .select("id, name, commission_balance, total_commission_owed, total_commission_paid, last_payment_date, menu_enabled")
    .order("commission_balance", { ascending: false });

  // Filter by specific restaurant if provided
  if (searchParams.restaurant) {
    query = query.eq("id", searchParams.restaurant);
  }

  const { data: restaurants, error } = await query;

  if (error) {
    return <div className="text-red-600">Failed to load commission data</div>;
  }

  // Calculate totals
  const totalOwed = restaurants?.reduce((sum, r) => sum + Number(r.commission_balance || 0), 0) || 0;
  const totalGenerated = restaurants?.reduce((sum, r) => sum + Number(r.total_commission_owed || 0), 0) || 0;
  const totalCollected = restaurants?.reduce((sum, r) => sum + Number(r.total_commission_paid || 0), 0) || 0;
  const restaurantsWithBalance = restaurants?.filter(r => Number(r.commission_balance) > 0).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commission Management</h1>
          <p className="text-gray-500 mt-1">Track and collect commission payments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">D{totalOwed.toFixed(2)}</div>
            <p className="text-sm text-gray-500">Total Outstanding</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">D{totalGenerated.toFixed(2)}</div>
            <p className="text-sm text-gray-500">Total Generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">D{totalCollected.toFixed(2)}</div>
            <p className="text-sm text-gray-500">Total Collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{restaurantsWithBalance}</div>
            <p className="text-sm text-gray-500">With Balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Table */}
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Total Owed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Last Payment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {restaurants?.map((restaurant) => {
                  const balance = Number(restaurant.commission_balance);
                  const owed = Number(restaurant.total_commission_owed);
                  const paid = Number(restaurant.total_commission_paid);

                  return (
                    <tr key={restaurant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/restaurants/${restaurant.id}`}
                          className="font-medium text-gray-900 hover:text-orange-600"
                        >
                          {restaurant.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {restaurant.menu_enabled ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-700">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-700">Disabled</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">
                        D{owed.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-green-600">
                        D{paid.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`text-sm font-medium ${
                            balance > 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          D{balance.toFixed(2)}
                        </span>
                        {balance > 100 && (
                          <Badge variant="destructive" className="ml-2">
                            Overdue
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {restaurant.last_payment_date
                          ? new Date(restaurant.last_payment_date).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <RecordPaymentDialog
                          restaurantId={restaurant.id}
                          restaurantName={restaurant.name}
                          currentBalance={balance}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(!restaurants || restaurants.length === 0) && (
              <div className="text-center py-12 text-gray-500">No commission data found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
