import { requireAdmin } from "@/lib/admin/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, DollarSign, Power, FileEdit } from "lucide-react";

const actionIcons: Record<string, any> = {
  menu_disabled: Power,
  menu_enabled: Power,
  payment_recorded: DollarSign,
  restaurant_updated: FileEdit,
};

const actionColors: Record<string, string> = {
  menu_disabled: "bg-red-100 text-red-700",
  menu_enabled: "bg-green-100 text-green-700",
  payment_recorded: "bg-blue-100 text-blue-700",
  restaurant_updated: "bg-gray-100 text-gray-700",
  order_viewed: "bg-purple-100 text-purple-700",
  bulk_action: "bg-orange-100 text-orange-700",
};

export default async function ActivityLogPage() {
  await requireAdmin();
  const supabase = createServerSupabase();

  // Fetch recent activity
  const { data: activities, error } = await supabase
    .from("admin_activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return <div className="text-red-600">Failed to load activity log</div>;
  }

  // Group by date
  const groupedByDate: Record<string, typeof activities> = {};
  activities?.forEach((activity) => {
    const date = new Date(activity.created_at).toLocaleDateString();
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(activity);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-500 mt-1">Audit trail of all admin actions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activities?.length || 0}</div>
            <p className="text-sm text-gray-500">Recent Actions (100)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {activities?.filter((a) => a.action_type === "menu_enabled").length || 0}
            </div>
            <p className="text-sm text-gray-500">Menus Enabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {activities?.filter((a) => a.action_type === "menu_disabled").length || 0}
            </div>
            <p className="text-sm text-gray-500">Menus Disabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {activities?.filter((a) => a.action_type === "payment_recorded").length || 0}
            </div>
            <p className="text-sm text-gray-500">Payments Recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-8">
            {Object.entries(groupedByDate).map(([date, dateActivities]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{date}</h3>
                <div className="space-y-3">
                  {dateActivities.map((activity) => {
                    const Icon = actionIcons[activity.action_type] || Activity;
                    const colorClass = actionColors[activity.action_type] || "bg-gray-100 text-gray-700";

                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.action_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.created_at).toLocaleTimeString()}
                            </p>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            by <span className="font-medium">{activity.admin_email}</span>
                          </p>

                          {/* Details */}
                          {activity.details && Object.keys(activity.details).length > 0 && (
                            <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                              <div className="space-y-1">
                                {Object.entries(activity.details as Record<string, any>).map(
                                  ([key, value]) => (
                                    <div key={key} className="flex gap-2 text-xs">
                                      <span className="text-gray-500 capitalize">
                                        {key.replace(/_/g, " ")}:
                                      </span>
                                      <span className="text-gray-900 font-medium">
                                        {typeof value === "object"
                                          ? JSON.stringify(value)
                                          : String(value)}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Target Info */}
                          <div className="mt-2 flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {activity.target_type}
                            </Badge>
                            {activity.target_id && (
                              <Badge variant="outline" className="text-xs font-mono">
                                {activity.target_id.slice(0, 8)}...
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {(!activities || activities.length === 0) && (
            <div className="text-center py-12 text-gray-500">No activity recorded yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
