import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Upload, Camera, Globe, MapPin, Phone, Mail } from "lucide-react";

export default function BusinessProfile() {
  return (
    <div className="space-y-6 animate-fadeIn p-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Business Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your restaurant details, branding and public information.
        </p>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Restaurant Name</Label>
              <Input placeholder="Scan2Dish Restaurant" />
            </div>

            <div className="space-y-2">
              <Label>Business Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="restaurant@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="(+220) 123 4567" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="https://myrestaurant.com"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                className="pl-10"
                placeholder="Enter full restaurant address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe your restaurant, cuisine, mission, or any info customers should know."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label>Logo</Label>
              <div className="border rounded-xl p-6 flex flex-col items-center justify-center gap-4 bg-muted/20">
                <Camera className="h-8 w-8 text-muted-foreground" />
                <Button variant="secondary" className="gap-2">
                  <Upload className="h-4 w-4" /> Upload Logo
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Cover Image</Label>
              <div className="border rounded-xl p-6 flex flex-col items-center justify-center gap-4 bg-muted/20 h-full min-h-[180px]">
                <Camera className="h-8 w-8 text-muted-foreground" />
                <Button variant="secondary" className="gap-2">
                  <Upload className="h-4 w-4" /> Upload Cover
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-2">
            <Label>Short Slogan</Label>
            <Input placeholder="Fresh. Fast. Delicious." />
          </div>
        </CardContent>
      </Card>

      <Button className="mt-4 w-full md:w-auto">Save Changes</Button>
    </div>
  );
}
