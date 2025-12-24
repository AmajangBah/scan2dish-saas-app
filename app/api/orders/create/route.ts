/**
 * Order Creation API with Enforcement
 * Server-side validation that checks restaurant menu status
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isRestaurantMenuEnabled } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      table_id,
      restaurant_id,
      items,
      subtotal,
      vat_amount,
      tip_amount,
      total,
      commission_amount,
      customer_name,
      notes,
    } = body;

    // Validation
    if (!table_id || !restaurant_id || !items || !Array.isArray(items)) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // CRITICAL ENFORCEMENT: Check if restaurant menu is enabled
    const menuEnabled = await isRestaurantMenuEnabled(restaurant_id);

    if (!menuEnabled) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This restaurant's menu is currently unavailable. Orders cannot be placed at this time.",
          enforcement: true,
        },
        { status: 403 }
      );
    }

    // Verify table exists and belongs to restaurant
    const { data: table, error: tableError } = await supabase
      .from("restaurant_tables")
      .select("id, restaurant_id, is_active")
      .eq("id", table_id)
      .single();

    if (tableError || !table) {
      return NextResponse.json(
        {
          success: false,
          error: "Table not found",
        },
        { status: 404 }
      );
    }

    if (!table.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: "This table is not active",
        },
        { status: 400 }
      );
    }

    if (table.restaurant_id !== restaurant_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Table does not belong to this restaurant",
        },
        { status: 400 }
      );
    }

    // Get restaurant commission rate
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("commission_rate")
      .eq("id", restaurant_id)
      .single();

    const commissionRate = restaurant?.commission_rate || 0.05;
    const calculatedCommission = Number(subtotal) * commissionRate;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        table_id,
        restaurant_id,
        items,
        subtotal: Number(subtotal),
        vat_amount: Number(vat_amount || 0),
        tip_amount: Number(tip_amount || 0),
        total: Number(total),
        commission_rate: commissionRate,
        commission_amount: calculatedCommission,
        customer_name: customer_name || null,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 }
    );
  }
}
