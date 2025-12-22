"use client";

import { useState } from "react";
import { mockMenu } from "./mockMenu";
import { MenuItem, MenuCategory } from "./types";
import CategoryTabs from "./components/CategoryTabs";
import SearchBar from "./components/SearchBar";
import AddMenuButton from "./components/AddMenuButton";
import MenuCard from "./components/MenuCard";
import MenuModal from "./components/MenuModal";
import MenuListItem from "./components/MenuListItem"; // <-- NEW
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

export default function MenuPage() {
  const categories: MenuCategory[] = [
    "Starters",
    "Mains",
    "Drinks",
    "Desserts",
  ];

  const [selectedCategory, setSelectedCategory] = useState<
    MenuCategory | "All"
  >("All");

  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenu);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MenuItem | undefined>();

  // 🔥 NEW State for view
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = menuItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setItemToEdit(undefined);
    setModalOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setItemToEdit(item);
    setModalOpen(true);
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = (item: MenuItem) => {
    setMenuItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.map((i) => (i.id === item.id ? item : i));
      return [...prev, item];
    });
  };

  return (
    <div className="p-6 min-h-screen space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>

        {/* 🔥 View Switch Buttons */}
        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
          >
            <Grid size={18} />
          </Button>

          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
          >
            <List size={18} />
          </Button>
        </div>
      </div>

      <AddMenuButton onClick={handleAdd} />

      <CategoryTabs
        categories={categories}
        selected={selectedCategory}
        onSelect={(category) =>
          setSelectedCategory(category as MenuCategory | "All")
        }
      />

      <SearchBar value={search} onChange={setSearch} />

      {/* 🔥 SWITCH BETWEEN GRID AND LIST */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filtered.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onToggleAvailability={handleToggleAvailability}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-4">
          {filtered.map((item) => (
            <MenuListItem
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onToggleAvailability={handleToggleAvailability}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <MenuModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        itemToEdit={itemToEdit}
      />
    </div>
  );
}
