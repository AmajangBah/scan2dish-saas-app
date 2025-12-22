import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function OpeningHours() {
  return (
    <div className="space-y-6 animate-fadeIn p-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Opening Hours</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set your business hours so customers know when they can order.
        </p>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {DAYS.map((day) => (
              <div
                key={day}
                className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 border rounded-xl p-4 bg-muted/10 hover:bg-muted/20 transition"
              >
                {/* Day */}
                <div className="font-medium text-sm md:text-base">{day}</div>

                {/* Open/Closed Toggle */}
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Label className="text-sm text-muted-foreground">Open</Label>
                </div>

                {/* Opening Time */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Opens</Label>
                  <Input type="time" defaultValue="09:00" />
                </div>

                {/* Closing Time */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Closes
                  </Label>
                  <Input type="time" defaultValue="22:00" />
                </div>

                {/* Break/Holiday */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">
                    Break (Optional)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input type="time" defaultValue="" />
                    <span className="text-xs text-muted-foreground">to</span>
                    <Input type="time" defaultValue="" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button className="mt-4 w-full md:w-auto">Save Hours</Button>
    </div>
  );
}
