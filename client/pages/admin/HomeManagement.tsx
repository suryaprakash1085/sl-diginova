import { AdminLayout } from "@/components/AdminLayout";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Pencil, Home } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ResponsiveTable, TableColumn } from "@/components/ResponsiveTable";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";

const HOME_CORE_KEYS = ["banner_title", "banner_description", "button_text"];

export default function HomeManagement() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const homeSettings = settings.filter(s => HOME_CORE_KEYS.includes(s.key) || s.key.startsWith("home_"));

  const handleDelete = async (key: string) => {
    if (confirm(`Are you sure you want to delete "${key}"?`)) {
      await fetch(`/api/settings/${key}`, { method: "DELETE" });
      toast.success("Content deleted");
      window.location.reload(); 
    }
  };

  const handleSave = () => {
    updateSettings({ key: newKey, value: newValue });
    setIsOpen(false);
    setNewKey("");
    setNewValue("");
    setEditingKey(null);
    toast.success("Home content saved");
  };

  const handleEdit = (key: string, value: string) => {
    setNewKey(key);
    setNewValue(value);
    setEditingKey(key);
    setIsOpen(true);
  };

  const handleSaveDialog = async () => {
    await handleSave();
  };

  const columns: TableColumn<{ key: string; value: string }> [] = [
    {
      key: "key",
      label: "Key",
      className: "w-[250px]",
      render: (item) => (
        <span className="font-mono text-sm font-semibold text-primary">{item.key}</span>
      ),
    },
    {
      key: "value",
      label: "Current Content",
      render: (item) => (
        <span className="text-slate-600 text-sm whitespace-pre-wrap line-clamp-3">{item.value}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-primary"
            onClick={() => handleEdit(item.key, item.value)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600"
            onClick={() => handleDelete(item.key)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const renderMobileCard = (item: { key: string; value: string }) => (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div>
        <p className="font-mono text-sm font-semibold text-primary">{item.key}</p>
        <p className="text-slate-600 text-sm whitespace-pre-wrap mt-2 line-clamp-3">{item.value}</p>
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(item.key, item.value)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => handleDelete(item.key)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Home className="w-8 h-8 text-primary" /> Home Page Management
            </h2>
            <p className="text-slate-500 mt-1">Manage all dynamic text and images on the landing page.</p>
          </div>

          <ResponsiveDialog
            open={isOpen}
            onOpenChange={(val) => {
              setIsOpen(val);
              if (!val) {
                setNewKey("");
                setNewValue("");
                setEditingKey(null);
              }
            }}
            trigger={
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" /> Add Dynamic Key
              </Button>
            }
            title={editingKey ? "Edit Key" : "Add New Key"}
            description="Use keys in your frontend to fetch this content dynamically."
            onSave={handleSaveDialog}
            saveLabel={editingKey ? "Update Key" : "Save Key"}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Key Name (e.g. banner_title, home_feature1_desc)</Label>
                <Input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Enter unique key"
                  disabled={!!editingKey}
                />
              </div>
              <div className="space-y-2">
                <Label>Content / Value</Label>
                <Textarea
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter text or URL"
                  rows={4}
                />
              </div>
            </div>
          </ResponsiveDialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Home Page Content Keys</CardTitle>
            <CardDescription>Manage your landing page's dynamic segments using key-value storage.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveTable
              columns={columns}
              data={homeSettings}
              keyField="key"
              isLoading={isLoading}
              isEmpty={homeSettings.length === 0}
              emptyMessage="No content found"
              renderMobileCard={renderMobileCard}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
