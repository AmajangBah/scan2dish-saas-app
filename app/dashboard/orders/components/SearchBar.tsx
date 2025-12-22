"use client";

import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center border rounded-xl p-2 bg-white shadow-sm">
      <span className="text-gray-400 ml-2 text-lg">🔍</span>
      <Input
        placeholder="Search by table..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-none shadow-none ml-2"
      />
    </div>
  );
}
