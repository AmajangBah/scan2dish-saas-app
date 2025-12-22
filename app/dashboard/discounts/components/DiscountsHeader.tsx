import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DiscountsHeader({ onCreate }: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Discounts</h1>
        <p className="text-muted-foreground">
          Create and manage promotional offers
        </p>
      </div>

      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" /> New Discount
      </Button>
    </div>
  );
}
