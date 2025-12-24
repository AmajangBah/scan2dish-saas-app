"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Upload, Camera, Globe, MapPin, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { updateBusinessProfile, getRestaurantProfile } from "@/app/actions/restaurant";
import { getCurrencyOptions } from "@/lib/utils/currency";

export default function BusinessProfile() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    description: "",
    currency: "USD",
  });

  const currencyOptions = getCurrencyOptions();

  // Load restaurant profile on mount
  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const result = await getRestaurantProfile();
      if (result.success && result.data) {
        setFormData((prev) => ({
          ...prev,
          name: result.data.name || "",
          phone: result.data.phone || "",
          currency: result.data.currency || "USD",
        }));
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await updateBusinessProfile({
      name: formData.name,
      phone: formData.phone || null,
      currency: formData.currency as any,
    });

    setSaving(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to save changes");
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
        <h1 className="text-2xl font-semibold tracking-tight">
          Business Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your restaurant details, branding and public information.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✓ Changes saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Restaurant Name *</Label>
                <Input
                  name="name"
                  placeholder="Scan2Dish Restaurant"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Business Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="email"
                    className="pl-10"
                    placeholder="restaurant@email.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    title="Email cannot be changed here"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Contact support to change your email
                </p>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="phone"
                    className="pl-10"
                    placeholder="(+220) 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Currency *</Label>
                <select
                  name="currency"
                  className="w-full p-2 border rounded-lg"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, currency: e.target.value }))
                  }
                  required
                >
                  {currencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Used for menu prices and reports
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="website"
                    className="pl-10"
                    placeholder="https://myrestaurant.com"
                    value={formData.website}
                    onChange={handleChange}
                    disabled
                    title="Coming soon"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  name="address"
                  className="pl-10"
                  placeholder="Enter full restaurant address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled
                  title="Coming soon"
                />
              </div>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                placeholder="Describe your restaurant, cuisine, mission, or any info customers should know."
                rows={4}
                value={formData.description}
                onChange={handleChange}
                disabled
                title="Coming soon"
              />
              <p className="text-xs text-muted-foreground">Coming soon</p>
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
