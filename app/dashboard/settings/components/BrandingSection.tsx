import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Upload, Camera } from "lucide-react";

export default function BrandingPage() {
  return (
    <div className="space-y-6 animate-fadeIn p-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Branding</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your restaurant's visual identity and how your customers see
          your brand.
        </p>
      </div>

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
                <Label>Primary Color</Label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border overflow-hidden">
                    <input
                      type="color"
                      className="w-full h-full cursor-pointer"
                    />
                  </div>
                  <Input type="text" placeholder="#4F46E5" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border overflow-hidden">
                    <input
                      type="color"
                      className="w-full h-full cursor-pointer"
                    />
                  </div>
                  <Input type="text" placeholder="#22C55E" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Button Color</Label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border overflow-hidden">
                    <input
                      type="color"
                      className="w-full h-full cursor-pointer"
                    />
                  </div>
                  <Input type="text" placeholder="#EF4444" />
                </div>
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

      <Button className="mt-4 w-full md:w-auto">Save Changes</Button>
    </div>
  );
}
