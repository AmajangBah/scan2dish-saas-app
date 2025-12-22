import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  DollarSign,
  ShoppingCart,
  Activity,
  LogOut,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let adminUser;
  try {
    adminUser = await requireAdmin();
  } catch (error) {
    redirect("/login?redirect=/admin");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/restaurants", label: "Restaurants", icon: Store },
    { href: "/admin/commission", label: "Commission", icon: DollarSign },
    { href: "/admin/orders", label: "All Orders", icon: ShoppingCart },
    { href: "/admin/activity", label: "Activity Log", icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">
            <span className="text-black">Scan</span>
            <span className="text-orange-600">2Dish</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
              <p className="text-xs text-gray-500 capitalize">{adminUser.role.replace("_", " ")}</p>
            </div>
            <Link
              href="/api/auth/signout"
              className="text-gray-400 hover:text-gray-600"
              title="Sign out"
            >
              <LogOut size={18} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
