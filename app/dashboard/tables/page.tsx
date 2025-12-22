"use client";

import { useState } from "react";

// COMPONENTS
import TableCard from "./components/TableCard";
import TableTabs from "./components/TableTabs";
import AddTableDialog from "./components/AddTableDialog";
import QrDialog from "./components/QrDialog";

// DATA / TYPES / UTILS
import { initialTables } from "./data/initialTables";
import type { Table, TableStatus } from "./types";

export default function SetTablesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const [tables, setTables] = useState<Table[]>(initialTables);

  // Handle status change
  const handleStatusChange = (id: string, status: TableStatus) => {
    setTables((prev) =>
      prev.map((table) => (table.id === id ? { ...table, status } : table))
    );
  };

  // Open QR dialog
  const handleQrView = (table: Table) => {
    setSelectedTable(table);
    setIsQrDialogOpen(true);
  };

  // Filter tables
  const filteredTables = tables.filter((t) => {
    if (activeTab === "all") return true;
    if (activeTab === "no-qr") return !t.qrAssigned;
    return t.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Table Management</h2>
          <p className="text-muted-foreground">
            Manage your restaurant tables and QR codes
          </p>
        </div>

        <AddTableDialog open={isAddDialogOpen} setOpen={setIsAddDialogOpen} />
      </div>

      {/* Tabs */}
      <TableTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Table Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onStatusChange={handleStatusChange}
            onQrView={handleQrView}
          />
        ))}
      </div>

      {/* QR Dialog */}
      <QrDialog
        open={isQrDialogOpen}
        setOpen={setIsQrDialogOpen}
        table={selectedTable}
      />
    </div>
  );
}
