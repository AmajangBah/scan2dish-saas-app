"use client";

import { usePathname } from "next/navigation";
import { Globe2, Moon } from "lucide-react";

export default function RestaurantNavBar() {
  const pathname = usePathname();

  // Clean segments
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => isNaN(Number(seg))); // remove dynamic IDs

  // Get last meaningful part
  const last = segments[segments.length - 1];

  // Convert slug → Title
  const pageTitle =
    !last || last === "dashboard"
      ? "Overview"
      : last.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <nav className="flex justify-between px-8 py-6  border-b  sticky top-0 z-50 w-full backdrop-blur-sm  ">
      {/* Dynamic Title */}
      <h1 className="text-2xl font-semibold">{pageTitle}</h1>

      {/* Right icons */}
      <div className="flex items-center gap-6">
        <Globe2 className="w-6 h-6 text-gray-700 cursor-pointer" />
        <Moon className="w-6 h-6 text-gray-700 cursor-pointer" />
      </div>
    </nav>
  );
}
