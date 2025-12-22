import { createServerSupabase } from "./supabase/server";

export async function getRestaurantId() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("user_id", user.id)
    .single();

  return restaurant?.id || null;
}
