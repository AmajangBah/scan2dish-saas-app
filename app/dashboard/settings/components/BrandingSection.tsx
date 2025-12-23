"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Upload, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { updateBranding, getRestaurantProfile } from "@/app/actions/restaurant";

export default function BrandingPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#C84501");

  // Load current brand color
  useEffect(() => {
    async function loadBranding() {
      setLoading(true);
      const result = await getRestaurantProfile();
      if (result.success && result.data) {
        setPrimaryColor(result.data.brand_color || "#C84501");
      }
      setLoading(false);
    }
    loadBranding();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await updateBranding({
      brand_color: primaryColor,
    });

    setSaving(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to save branding");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-fadeIn p-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Branding</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your restaurant's visual identity and how your customers see
          your brand.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✓ Branding updated successfully!
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Logos & Visual Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo Upload */}
            <div className="space-y-4">
              <Label className="font-medium">Restaurant Logo</Label>
              <div className="border rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-muted/20 hover:bg-muted/30 transition">
                <Camera className="h-8 w-8 text-muted-foreground" />
                <Button variant="secondary" className="gap-2">
                  <Upload className="h-4 w-4" /> Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Recommended: PNG, SVG or high-res JPG
                </p>
              </div>
            </div>

            {/* Cover / Hero Image */}
            <div className="space-y-4">
              <Label className="font-medium">Cover Image</Label>
              <div className="border rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-muted/20 hover:bg-muted/30 transition min-h-[180px]">
                <Camera className="h-8 w-8 text-muted-foreground" />
                <Button variant="secondary" className="gap-2">
                  <Upload className="h-4 w-4" /> Upload Cover Image
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Displayed at the top of your customer-facing menu
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Brand Colors */}
          <div className="space-y-4">
            <Label className="font-medium">Brand Colors</Label>
            <p className="text-sm text-muted-foreground">
              Adjust the main color customers will see in the menu interface.
              Make it match your brand.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Primary Color *</Label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border overflow-hidden">
                    <input
                      type="color"
                      className="w-full h-full cursor-pointer"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="#C84501"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    pattern="^#[0-9A-Fa-f]{6}$"
                    title="Enter a valid hex color (e.g., #C84501)"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Used in customer menu and branding
                </p>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border overflow-hidden bg-gray-100">
                    <input
                      type="color"
                      className="w-full h-full cursor-not-allowed opacity-50"
                      disabled
                    />
                  </div>
                  <Input type="text" placeholder="#22C55E" disabled />
                </div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>

              <div className="space-y-2">
                <Label>Button Color</Label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border overflow-hidden bg-gray-100">
                    <input
                      type="color"
                      className="w-full h-full cursor-not-allowed opacity-50"
                      disabled
                    />
                  </div>
                  <Input type="text" placeholder="#EF4444" disabled />
                </div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Slogan */}
          <div className="space-y-2">
            <Label className="font-medium">Brand Slogan</Label>
            <Input placeholder="Example: Fresh. Fast. Delicious." />
          </div>
        </CardContent>
      </Card>

        <Button
          type="submit"
          className="mt-4 w-full md:w-auto"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
