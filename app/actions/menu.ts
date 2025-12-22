"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getRestaurantId } from "@/lib/getRestaurantId";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const MenuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().default(""),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  tags: z.object({
    spicy: z.boolean().default(false),
    vegetarian: z.boolean().default(false),
    glutenFree: z.boolean().default(false),
  }).default({}),
  variants: z.array(z.object({
    label: z.string(),
    price: z.number(),
  })).default([]),
});

export type MenuItemInput = z.infer<typeof MenuItemSchema>;

export interface MenuActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

/**
 * Create a new menu item
 */
export async function createMenuItem(input: MenuItemInput): Promise<MenuActionResult> {
  try {
    const validated = MenuItemSchema.parse(input);
    const restaurant_id = await getRestaurantId();

    if (!restaurant_id) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        restaurant_id,
        name: validated.name,
        description: validated.description,
        price: validated.price,
        category: validated.category,
        images: validated.images,
        available: validated.available,
        tags: validated.tags,
        variants: validated.variants,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create menu item:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/menu");
    revalidatePath("/menu");

    return { success: true, id: data.id };
  } catch (error) {
    console.error("Create menu item error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create menu item",
    };
  }
}

/**
 * Update an existing menu item
 */
export async function updateMenuItem(
  id: string,
  input: Partial<MenuItemInput>
): Promise<MenuActionResult> {
  try {
    const restaurant_id = await getRestaurantId();

    if (!restaurant_id) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = createServerSupabase();

    // Build update object with only provided fields
    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.price !== undefined) updateData.price = input.price;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.images !== undefined) updateData.images = input.images;
    if (input.available !== undefined) updateData.available = input.available;
    if (input.tags !== undefined) updateData.tags = input.tags;
    if (input.variants !== undefined) updateData.variants = input.variants;

    const { error } = await supabase
      .from("menu_items")
      .update(updateData)
      .eq("id", id)
      .eq("restaurant_id", restaurant_id);

    if (error) {
      console.error("Failed to update menu item:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/menu");
    revalidatePath("/menu");

    return { success: true, id };
  } catch (error) {
    console.error("Update menu item error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update menu item",
    };
  }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: string): Promise<MenuActionResult> {
  try {
    const restaurant_id = await getRestaurantId();

    if (!restaurant_id) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = createServerSupabase();

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id)
      .eq("restaurant_id", restaurant_id);

    if (error) {
      console.error("Failed to delete menu item:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/menu");
    revalidatePath("/menu");

    return { success: true };
  } catch (error) {
    console.error("Delete menu item error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete menu item",
    };
  }
}

/**
 * Toggle menu item availability
 */
export async function toggleMenuItemAvailability(
  id: string,
  available: boolean
): Promise<MenuActionResult> {
  try {
    const restaurant_id = await getRestaurantId();

    if (!restaurant_id) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = createServerSupabase();

    const { error } = await supabase
      .from("menu_items")
      .update({ available })
      .eq("id", id)
      .eq("restaurant_id", restaurant_id);

    if (error) {
      console.error("Failed to toggle availability:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/menu");
    revalidatePath("/menu");

    return { success: true };
  } catch (error) {
    console.error("Toggle availability error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update availability",
    };
  }
}
