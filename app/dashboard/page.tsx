import Link from "next/link";
import DashboardCard from "../components/DashboardCard";
import Route from "../constants/Route";
import { ShoppingBag, DollarSign, Utensils, Timer } from "lucide-react";
import ActivityFeed from "../components/ActivityFeed";
import { ActivityItem } from "@/types/activity";

const Dashboard = () => {
  const RestaurantName = "Amie's Kitchen";
  const activityData: ActivityItem[] = [
    {
      id: "1",
      table: 4,
      time: "12:45 PM",
      items: [
        { name: "Burger", quantity: 2, price: 5.99 },
        { name: "Fries", quantity: 1, price: 2.99 },
      ],
    },
    {
      id: "2",
      table: 1,
      time: "1:10 PM",
      items: [{ name: "Pasta Alfredo", quantity: 1, price: 8.5 }],
    },
  ];

  return (
    <section className="p-6 w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold my-4">
          Welcome back 👋 {RestaurantName}
        </h1>
        <p className="text-gray-600 text-sm">
          Here's the latest overview of your restaurant performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard
          heading="Total Orders"
          figure={2100}
          accent="orange"
          icon={<ShoppingBag />}
        />
        <DashboardCard
          heading="Revenue"
          figure={34000}
          accent="green"
          icon={<DollarSign />}
        />
        <DashboardCard
          heading="Active Tables"
          figure={21}
          accent="blue"
          icon={<Utensils />}
        />
        <DashboardCard
          heading="Pending Orders"
          figure={14}
          accent="red"
          icon={<Timer />}
        />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href={Route.TABLES}>
          <DashboardCard heading="Add More Tables" isAddCard />
        </Link>

        <Link href={Route.MENU}>
          <DashboardCard heading="Add More Menu Items" isAddCard />
        </Link>
      </div>
      <ActivityFeed activities={activityData} />
    </section>
  );
};

export default Dashboard;
