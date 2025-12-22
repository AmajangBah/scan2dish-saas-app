"use client";

import { CartProvider } from "./context/CartContext";
import TopHeader from "./components/TopHeader";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout wraps all menu pages and injects CartProvider
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <TopHeader />
        <main>{children}</main>
      </div>
    </CartProvider>
  );
}
