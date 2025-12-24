import { SidebarProvider } from "@/components/ui/sidebar";
import RestaurantSidebar from "../components/RestaurantSidebar";
import RestaurantNavBar from "../components/RestaurantNavBar";
import React, { ReactNode } from "react";
import { generateMetadataFromPath } from "@/utils/generateMetadata";

interface DashboardLayoutProps {
  children: ReactNode;
  params: { pathname?: string }; // App Router passes params
}

// You can use a function to generate metadata dynamically
export async function generateMetadata() {
  const pathname = params?.pathname || "dashboard";
  return generateMetadataFromPath(pathname);
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-row">
      <div className="flex min-h-screen bg-[#F9F9F9]">
        <SidebarProvider>
          <RestaurantSidebar />
        </SidebarProvider>
      </div>

      <div className="flex flex-col flex-1 min-w-0 bg-[#F5F5F5]">
        <RestaurantNavBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
