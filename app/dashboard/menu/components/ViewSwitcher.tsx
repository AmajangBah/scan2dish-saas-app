"use client";

import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

export function ViewSwitcher({ view, setView }: any) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={view === "grid" ? "default" : "outline"}
        onClick={() => setView("grid")}
        className="flex gap-1"
      >
        <Grid size={18} />
        Grid
      </Button>

      <Button
        variant={view === "list" ? "default" : "outline"}
        onClick={() => setView("list")}
        className="flex gap-1"
      >
        <List size={18} />
        List
      </Button>
    </div>
  );
}
