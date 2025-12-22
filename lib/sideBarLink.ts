import {
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  Table,
  BarChart3,
  BadgePercent,
} from "lucide-react";

const sideBarLinks = [
  {
    title: "Overview",
    href: "/overview",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Menu",
    href: "/menu",
    icon: Utensils,
  },
  {
    title: "Tables",
    href: "/tables",
    icon: Table,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Discount",
    href: "/discount",
    icon: BadgePercent,
  },
];
export default sideBarLinks;
