"use server";

import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { getRestaurantId } from "@/lib/getRestaurantId";

const UpdateOrderStatusSchema = z.object({
  order_id: z.string().uuid(),
  status: z.enum(["pending", "preparing", "completed"]),
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

export interface UpdateOrderStatusResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action: update an order's status (owner-only via RLS + restaurant_id check)
 */
export async function updateOrderStatus(
  input: UpdateOrderStatusInput
): Promise<UpdateOrderStatusResult> {
  try {
    const validated = UpdateOrderStatusSchema.parse(input);
    const supabase = createServerSupabase();

    const restaurant_id = await getRestaurantId();
    if (!restaurant_id) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: validated.status })
      .eq("id", validated.order_id)
      .eq("restaurant_id", restaurant_id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update order";
    return { success: false, error: message };
  }
}


