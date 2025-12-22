import { Order, OrderStatus } from "./types";

export const mockOrders: Order[] = Array.from({ length: 25 }).map((_, i) => {
  const statuses: OrderStatus[] = ["pending", "preparing", "completed"];
  return {
    id: i + 1,
    table: `Table ${Math.floor(Math.random() * 10) + 1}`,
    status: statuses[i % 3],
    total: (Math.random() * 40 + 10).toFixed(2),
    time: new Date().toLocaleString(),
    items: [
      { name: "Chicken Burger", qty: 1, price: 8.99 },
      { name: "Fries", qty: 2, price: 3.49 },
    ],
  };
});
