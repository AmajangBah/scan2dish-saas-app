import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";

export default function DiscountCard({ title, type, duration }: any) {
  return (
    <Card className="rounded-3xl border bg-white/60 shadow-sm backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Percent className="h-5 w-5 text-primary" /> {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <p>
          <span className="font-semibold">Type:</span> {type}
        </p>
        <p>
          <span className="font-semibold">Duration:</span> {duration}
        </p>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
