"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdmin, logAdminActivity } from "@/lib/admin/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export interface AdminActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

// =====================================================================
// RESTAURANT MANAGEMENT
// =====================================================================

/**
 * Toggle restaurant menu enabled/disabled
 */
export async function toggleRestaurantMenu(
  restaurantId: string,
  enabled: boolean,
  reason?: string
): Promise<AdminActionResult> {
  try {
    const admin = await requireAdmin();
    const supabase = createServerSupabase();

    const { error } = await supabase
      .from("restaurants")
      .update({
        menu_enabled: enabled,
        enforcement_reason: enabled ? null : reason || "Commission payment required",
      })
      .eq("id", restaurantId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Log activity
    await logAdminActivity({
      action_type: enabled ? "menu_enabled" : "menu_disabled",
      target_type: "restaurant",
      target_id: restaurantId,
      details: { reason, admin_name: admin.name },
    });

    revalidatePath("/admin");
    revalidatePath("/menu");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update restaurant",
    };
  }
}

/**
 * Update restaurant notes (admin-only field)
 */
export async function updateRestaurantNotes(
  restaurantId: string,
  notes: string
): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const supabase = createServerSupabase();

    const { error } = await supabase
      .from("restaurants")
      .update({ notes })
      .eq("id", restaurantId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update notes",
    };
  }
}

/**
 * Recalculate restaurant commission (useful for corrections)
 */
export async function recalculateCommission(
  restaurantId: string
): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const supabase = createServerSupabase();

    // Call the database function
    const { error } = await supabase.rpc("recalculate_restaurant_commission", {
      restaurant_id_param: restaurantId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to recalculate commission",
    };
  }
}

// =====================================================================
// COMMISSION PAYMENTS
// =====================================================================

const RecordPaymentSchema = z.object({
  restaurant_id: z.string().uuid(),
  amount: z.number().positive("Amount must be positive"),
  payment_method: z.enum(["cash", "bank_transfer", "check", "other"]),
  payment_date: z.string(), // ISO date string
  reference_number: z.string().optional(),
  notes: z.string().optional(),
});

export type RecordPaymentInput = z.infer<typeof RecordPaymentSchema>;

/**
 * Record a manual/offline commission payment
 */
export async function recordCommissionPayment(
  input: RecordPaymentInput
): Promise<AdminActionResult> {
  try {
    const admin = await requireAdmin();
    const validated = RecordPaymentSchema.parse(input);
    const supabase = createServerSupabase();

    // Insert payment record
    const { error: paymentError } = await supabase
      .from("commission_payments")
      .insert({
        restaurant_id: validated.restaurant_id,
        amount: validated.amount,
        payment_method: validated.payment_method,
        payment_date: validated.payment_date,
        reference_number: validated.reference_number || null,
        notes: validated.notes || null,
        recorded_by: admin.id,
      });

    if (paymentError) {
      return { success: false, error: paymentError.message };
    }

    // Recalculate commission balance
    await supabase.rpc("recalculate_restaurant_commission", {
      restaurant_id_param: validated.restaurant_id,
    });

    // Log activity
    await logAdminActivity({
      action_type: "payment_recorded",
      target_type: "payment",
      target_id: validated.restaurant_id,
      details: {
        amount: validated.amount,
        payment_method: validated.payment_method,
        admin_name: admin.name,
      },
    });

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to record payment",
    };
  }
}

/**
 * Get commission summary for a restaurant
 */
export async function getRestaurantCommissionSummary(
  restaurantId: string
): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const supabase = createServerSupabase();

    // Get restaurant data
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("total_commission_owed, total_commission_paid, commission_balance, last_payment_date")
      .eq("id", restaurantId)
      .single();

    if (restaurantError) {
      return { success: false, error: restaurantError.message };
    }

    // Get recent payments
    const { data: payments, error: paymentsError } = await supabase
      .from("commission_payments")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("payment_date", { ascending: false })
      .limit(10);

    if (paymentsError) {
      return { success: false, error: paymentsError.message };
    }

    return {
      success: true,
      data: {
        ...restaurant,
        recent_payments: payments,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get commission summary",
    };
  }
}

// =====================================================================
// PLATFORM STATS
// =====================================================================

/**
 * Get platform-wide statistics
 */
export async function getPlatformStats(): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const supabase = createServerSupabase();

    // Total restaurants
    const { count: totalRestaurants } = await supabase
      .from("restaurants")
      .select("id", { count: "exact", head: true });

    // Active restaurants (menu enabled)
    const { count: activeRestaurants } = await supabase
      .from("restaurants")
      .select("id", { count: "exact", head: true })
      .eq("menu_enabled", true);

    // Total orders
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true });

    // Total revenue (all completed orders)
    const { data: revenueData } = await supabase
      .from("orders")
      .select("total")
      .eq("status", "completed");

    const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total || 0), 0) || 0;

    // Total commission owed (across all restaurants)
    const { data: commissionData } = await supabase
      .from("restaurants")
      .select("commission_balance");

    const totalCommissionOwed = commissionData?.reduce(
      (sum, r) => sum + Number(r.commission_balance || 0),
      0
    ) || 0;

    // Restaurants with overdue commission
    const { count: overdueRestaurants } = await supabase
      .from("restaurants")
      .select("id", { count: "exact", head: true })
      .gt("commission_balance", 0);

    return {
      success: true,
      data: {
        totalRestaurants: totalRestaurants || 0,
        activeRestaurants: activeRestaurants || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        totalCommissionOwed,
        overdueRestaurants: overdueRestaurants || 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get platform stats",
    };
  }
}
