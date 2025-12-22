"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toggleRestaurantMenu, updateRestaurantNotes, recalculateCommission } from "@/app/actions/admin";
import { Power, RefreshCw, Save } from "lucide-react";

export default function RestaurantControls({
  restaurantId,
  menuEnabled,
  enforcementReason,
  notes,
}: {
  restaurantId: string;
  menuEnabled: boolean;
  enforcementReason: string | null;
  notes: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [localNotes, setLocalNotes] = useState(notes || "");
  const [reason, setReason] = useState(enforcementReason || "Commission payment required");

  const handleToggleMenu = async (enable: boolean) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await toggleRestaurantMenu(
        restaurantId,
        enable,
        enable ? undefined : reason
      );

      if (result.success) {
        setSuccess(`Menu ${enable ? "enabled" : "disabled"} successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setError(result.error || "Failed to update menu status");
      }
    });
  };

  const handleSaveNotes = async () => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await updateRestaurantNotes(restaurantId, localNotes);

      if (result.success) {
        setSuccess("Notes saved successfully");
      } else {
        setError(result.error || "Failed to save notes");
      }
    });
  };

  const handleRecalculate = async () => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await recalculateCommission(restaurantId);

      if (result.success) {
        setSuccess("Commission recalculated");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setError(result.error || "Failed to recalculate commission");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
            {success}
          </div>
        )}

        {/* Menu Control */}
        <div className="space-y-2">
          <Label>Menu Status</Label>
          {!menuEnabled && (
            <div className="mb-2">
              <Label className="text-xs text-gray-600">Enforcement Reason</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why is the menu disabled?"
                className="text-sm mt-1"
                rows={2}
              />
            </div>
          )}
          <div className="flex gap-2">
            {menuEnabled ? (
              <Button
                onClick={() => handleToggleMenu(false)}
                disabled={isPending}
                variant="destructive"
                className="flex-1"
              >
                <Power className="h-4 w-4 mr-2" />
                Disable Menu
              </Button>
            ) : (
              <Button
                onClick={() => handleToggleMenu(true)}
                disabled={isPending}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Power className="h-4 w-4 mr-2" />
                Enable Menu
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {menuEnabled
              ? "Customers can see menu and place orders"
              : "Customers see: Menus currently unavailable"}
          </p>
        </div>

        {/* Admin Notes */}
        <div className="space-y-2">
          <Label>Internal Notes</Label>
          <Textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            placeholder="Add internal notes about this restaurant..."
            rows={4}
          />
          <Button
            onClick={handleSaveNotes}
            disabled={isPending || localNotes === notes}
            variant="outline"
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Notes
          </Button>
        </div>

        {/* Recalculate Commission */}
        <div className="space-y-2 pt-4 border-t">
          <Button
            onClick={handleRecalculate}
            disabled={isPending}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate Commission
          </Button>
          <p className="text-xs text-gray-500">
            Syncs commission with completed orders
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
