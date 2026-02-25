import { AdminLayout } from "@/components/AdminLayout";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Building2, Palette, Type, Layout as LayoutIcon, Image as ImageIcon } from "lucide-react";

export default function Customization() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const s: Record<string, string> = {};
    settings.forEach((item) => {
      s[item.key] = item.value;
    });
    setLocalSettings(s);
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const payload = Object.entries(localSettings).map(([key, value]) => ({ key, value }));
    updateSettings(payload);
    toast.success("Settings saved successfully!");
  };

  if (isLoading) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">App Customization</h2>
            <p className="text-slate-500 mt-1">Control your website appearance and company details.</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="bg-white border p-1 shadow-sm">
            <TabsTrigger value="company" className="gap-2"><Building2 className="w-4 h-4" /> Company</TabsTrigger>
            <TabsTrigger value="theme" className="gap-2"><Palette className="w-4 h-4" /> Theme</TabsTrigger>
            <TabsTrigger value="background" className="gap-2"><ImageIcon className="w-4 h-4" /> Background</TabsTrigger>
            <TabsTrigger value="typography" className="gap-2"><Type className="w-4 h-4" /> Typography</TabsTrigger>
            <TabsTrigger value="layout" className="gap-2"><LayoutIcon className="w-4 h-4" /> Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>Basic information about your business.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input value={localSettings.company_name || ""} onChange={(e) => handleChange("company_name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Email</Label>
                    <Input value={localSettings.company_email || ""} onChange={(e) => handleChange("company_email", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Phone</Label>
                    <Input value={localSettings.company_phone || ""} onChange={(e) => handleChange("company_phone", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Footer Text</Label>
                    <Input value={localSettings.footer_text || ""} onChange={(e) => handleChange("footer_text", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Company Address</Label>
                  <Input value={localSettings.company_address || ""} onChange={(e) => handleChange("company_address", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Facebook URL</Label>
                    <Input value={localSettings.social_facebook || ""} onChange={(e) => handleChange("social_facebook", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter URL</Label>
                    <Input value={localSettings.social_twitter || ""} onChange={(e) => handleChange("social_twitter", e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Color Theme</CardTitle>
                <CardDescription>Customize the colors used throughout your website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-12 p-1 h-10" value={localSettings.primary_color || "#3b82f6"} onChange={(e) => handleChange("primary_color", e.target.value)} />
                      <Input value={localSettings.primary_color || ""} onChange={(e) => handleChange("primary_color", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-12 p-1 h-10" value={localSettings.secondary_color || "#6366f1"} onChange={(e) => handleChange("secondary_color", e.target.value)} />
                      <Input value={localSettings.secondary_color || ""} onChange={(e) => handleChange("secondary_color", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-12 p-1 h-10" value={localSettings.text_color || "#0f172a"} onChange={(e) => handleChange("text_color", e.target.value)} />
                      <Input value={localSettings.text_color || ""} onChange={(e) => handleChange("text_color", e.target.value)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="background">
            <Card>
              <CardHeader>
                <CardTitle>Background Settings</CardTitle>
                <CardDescription>Control the global background appearance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Background Type</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={localSettings.bg_type || "color"}
                    onChange={(e) => handleChange("bg_type", e.target.value)}
                  >
                    <option value="color">Color</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                {localSettings.bg_type === "color" ? (
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-12 p-1 h-10" value={localSettings.bg_color || "#ffffff"} onChange={(e) => handleChange("bg_color", e.target.value)} />
                      <Input value={localSettings.bg_color || ""} onChange={(e) => handleChange("bg_color", e.target.value)} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Background Image</Label>
                      <div className="flex flex-col gap-4">
                        {localSettings.bg_image && (
                          <div className="relative w-full h-40 rounded-lg overflow-hidden border bg-slate-100">
                            <img src={localSettings.bg_image} alt="Background Preview" className="w-full h-full object-cover" />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => handleChange("bg_image", "")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            className="flex-grow cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  handleChange("bg_image", reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">Or provide URL</span>
                          </div>
                        </div>
                        <Input
                          value={localSettings.bg_image || ""}
                          onChange={(e) => handleChange("bg_image", e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography">
            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>Set the fonts and text styles for your app.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Input value={localSettings.font_family || ""} onChange={(e) => handleChange("font_family", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Font Size (px)</Label>
                    <Input value={localSettings.font_size || ""} onChange={(e) => handleChange("font_size", e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout">
            <Card>
              <CardHeader>
                <CardTitle>Layout Settings</CardTitle>
                <CardDescription>Toggle global layout elements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-0.5">
                    <Label>Show Top Bar</Label>
                    <p className="text-xs text-slate-500">Enable or disable the main navigation header.</p>
                  </div>
                  <Switch checked={localSettings.show_top_bar === "true"} onCheckedChange={(val) => handleChange("show_top_bar", val.toString())} />
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-0.5">
                    <Label>Show Footer</Label>
                    <p className="text-xs text-slate-500">Enable or disable the website footer.</p>
                  </div>
                  <Switch checked={localSettings.show_footer === "true"} onCheckedChange={(val) => handleChange("show_footer", val.toString())} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sticky Header</Label>
                    <p className="text-xs text-slate-500">Keep the header visible while scrolling.</p>
                  </div>
                  <Switch checked={localSettings.sticky_header === "true"} onCheckedChange={(val) => handleChange("sticky_header", val.toString())} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
