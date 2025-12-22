"use client";

import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center border rounded-xl p-2 bg-white shadow-sm max-w-md mx-auto">
      <span className="text-gray-400 ml-2 text-lg">🔍</span>
      <Input
        type="text"
        placeholder="Search menu items..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-none shadow-none ml-2 w-full focus:outline-none"
      />
    </div>
  );
}
