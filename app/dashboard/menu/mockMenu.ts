import { MenuItem } from "./types";

export const mockMenu: MenuItem[] = [
  {
    id: "1",
    name: "Cheese Burger",
    description: "Juicy beef burger with cheese and lettuce",
    price: 8.99,
    category: "Mains",
    available: true,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "French Fries",
    description: "Crispy golden fries",
    price: 3.49,
    category: "Starters",
    available: true,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "Coke",
    description: "Chilled soft drink",
    price: 1.99,
    category: "Drinks",
    available: true,
    image: "https://via.placeholder.com/150",
  },
  // Add more for demo
];
