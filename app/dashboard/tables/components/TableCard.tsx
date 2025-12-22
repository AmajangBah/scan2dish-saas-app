"use client";

import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Pencil, Download } from "lucide-react";
import { Table } from "../types";

interface TableCardProps {
  table: Table;
  onEdit: (table: Table) => void;
}

export default function TableCard({ table, onEdit }: TableCardProps) {
  const handleDownload = () => {
    const svg = document.getElementById(`qr-${table.id}`)?.innerHTML;
    const blob = new Blob([svg!], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${table.name}-qrcode.svg`;
    link.click();
  };

  return (
    <div className="border p-4 rounded-xl flex flex-col gap-3 shadow-sm">
      <h2 className="text-lg font-semibold">{table.name}</h2>
      <p className="text-sm text-gray-500">{table.seats} seats</p>

      {/* QR CODE */}
      <div
        id={`qr-${table.id}`}
        className="bg-white p-3 rounded-lg self-center"
      >
        <QRCodeSVG value={table.qrCode} size={128} />
      </div>

      <div className="flex justify-between mt-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(table)}>
          <Pencil className="w-4 h-4 mr-2" /> Edit
        </Button>

        <Button size="sm" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" /> Download
        </Button>
      </div>
    </div>
  );
}
