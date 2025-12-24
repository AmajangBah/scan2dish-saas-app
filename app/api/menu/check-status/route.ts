/**
 * Menu Status Check API
 * Allows client-side to check restaurant status before operations
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tableId = searchParams.get("tableId");
    const restaurantId = searchParams.get("restaurantId");

    if (!tableId && !restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error: "tableId or restaurantId required",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let restaurant_id = restaurantId;

    // If tableId provided, resolve to restaurant_id
    if (tableId && !restaurantId) {
      const { data: table } = await supabase
        .from("restaurant_tables")
        .select("restaurant_id")
        .eq("id", tableId)
        .single();

      if (!table) {
        return NextResponse.json(
          {
            success: false,
            error: "Table not found",
          },
          { status: 404 }
        );
      }

      restaurant_id = table.restaurant_id;
    }

    // Get restaurant status
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id, name, menu_enabled, enforcement_reason")
      .eq("id", restaurant_id!)
      .single();

    if (!restaurant) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.name,
        menu_enabled: restaurant.menu_enabled,
        enforcement_reason: restaurant.enforcement_reason,
      },
    });
  } catch (error) {
    console.error("Menu status check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to check status",
      },
      { status: 500 }
    );
  }
}
