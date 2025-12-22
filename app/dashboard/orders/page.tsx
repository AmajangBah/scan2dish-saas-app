"use client";

import { useState } from "react";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import OrderCard from "./components/OrderCard";
import OrderDetailsModal from "./components/OrderDetailsModal";
import { Order, OrderStatus } from "./types";
import { mockOrders } from "./mockOrders";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 6;

  const filtered = orders.filter((o) =>
    o.table.toLowerCase().includes(search.toLowerCase())
  );

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleStatusChange = (id: number, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center">Orders</h1>

      <div className="max-w-md mx-auto">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {paginated.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onView={handleView}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {paginated.length === 0 && (
        <p className="text-center text-gray-400 mt-12">No orders found.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <OrderDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
