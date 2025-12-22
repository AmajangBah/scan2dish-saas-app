import { createServerSupabase } from "@/lib/supabase/server";
import { getRestaurantId } from "@/lib/getRestaurantId";
import TablesClient from "./TablesClient";
import { Table, TableStatus } from "./types";

export default async function TablesPage() {
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

  const supabase = createServerSupabase();

  const { data: tables, error } = await supabase
    .from("restaurant_tables")
    .select("*")
    .eq("restaurant_id", restaurant_id)
    .order("table_number", { ascending: true });

  if (error) {
    console.error("Failed to fetch tables:", error);
    return (
      <div className="p-6 min-h-screen">
        <div className="text-center text-red-600">
          Failed to load tables. Please try again later.
        </div>
      </div>
    );
  }

  // Map database tables to UI Table type
  const mappedTables: Table[] = (tables || []).map((table) => ({
    id: table.id,
    number: table.table_number || "?",
    capacity: table.capacity || 4,
    status: (table.status || "available") as TableStatus,
    location: table.location || "Main Floor",
    qrAssigned: table.qr_assigned ?? true,
    qrScans: table.qr_scans || 0,
  }));

  return <TablesClient initialTables={mappedTables} />;
}
