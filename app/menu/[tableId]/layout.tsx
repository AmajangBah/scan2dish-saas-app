import { validateTable } from "@/lib/utils/tables";
import { notFound } from "next/navigation";

interface MenuLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tableId: string }>;
}

/**
 * Server Component Layout for menu routes
 * Validates that the table exists and is active before rendering
 * This ensures customers can only access menus for valid, active tables
 */
export default async function MenuLayout({ children, params }: MenuLayoutProps) {
  const { tableId } = await params;
  
  // Validate table exists and is active
  const table = await validateTable(tableId);
  
  if (!table) {
    // Table not found or inactive - show 404
    notFound();
  }

  // Table is valid, render children
  return <>{children}</>;
}

