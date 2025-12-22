import { createServerSupabase } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "support";
  is_active: boolean;
}

/**
 * Check if current user is an admin
 * Returns admin user data if authenticated, null otherwise
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = createServerSupabase();

  // Get current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Check if user exists in admin_users table
  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select("id, email, name, role, is_active")
    .eq("email", user.email)
    .eq("is_active", true)
    .single();

  if (error || !adminUser) {
    return null;
  }

  return adminUser as AdminUser;
}

/**
 * Require admin authentication
 * Throws error if not admin
 */
export async function requireAdmin(): Promise<AdminUser> {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    throw new Error("Unauthorized: Admin access required");
  }

  return adminUser;
}

/**
 * Check if user has specific admin role
 */
export async function hasAdminRole(
  requiredRole: "super_admin" | "admin" | "support"
): Promise<boolean> {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    return false;
  }

  // Super admin has all permissions
  if (adminUser.role === "super_admin") {
    return true;
  }

  // Check specific role
  return adminUser.role === requiredRole;
}

/**
 * Log admin activity
 */
export async function logAdminActivity(params: {
  action_type:
    | "menu_disabled"
    | "menu_enabled"
    | "payment_recorded"
    | "restaurant_created"
    | "restaurant_updated"
    | "order_viewed"
    | "bulk_action";
  target_type: "restaurant" | "order" | "payment" | "system";
  target_id?: string;
  details?: Record<string, any>;
}): Promise<void> {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    return; // Skip logging if not admin
  }

  const supabase = createServerSupabase();

  await supabase.from("admin_activity_log").insert({
    admin_user_id: adminUser.id,
    admin_email: adminUser.email,
    action_type: params.action_type,
    target_type: params.target_type,
    target_id: params.target_id || null,
    details: params.details || {},
  });
}
