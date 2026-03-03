import { AdminLayout } from "@/components/AdminLayout";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Pencil, Server , Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ResponsiveTable, TableColumn } from "@/components/ResponsiveTable";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import { Badge } from "@/components/ui/badge";

const SERVICES_CORE_KEYS = ["banner_title", "banner_description", "button_text"];

export default function servicesManagement() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [pageName, setPageName] = useState("Services");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);

const servicesSettings = settings.filter(
  (s) =>
    s.page_name === "Services" ||
    s.page_name?.startsWith("Services_")
);


  const handleDelete = async (id: number) => {
    if (confirm(`Are you sure you want to delete this setting?`)) {
      await fetch(`/api/settings/${id}`, { method: "DELETE" });
      toast.success("Content deleted");
      window.location.reload();
    }
  };

  const handleSave = () => {
    updateSettings({ key: newKey, value: newValue, page_name: pageName });
    setIsOpen(false);
    setNewKey("");
    setNewValue("");
    setPageName("Services");
    setEditingId(null);
    setEditingKey(null);
    toast.success("Services content saved");
  };

  const handleEdit = (item: any) => {
    setNewKey(item.key);
    setNewValue(item.value);
    setPageName(item.page_name || "Services");
    setEditingId(item.id);
    setEditingKey(item.key);
    setIsOpen(true);
  };

  const handleSaveDialog = async () => {
    await handleSave();
  };

  const columns: TableColumn<any> [] = [
    {
      key: "page_name",
      label: "Page",
      render: (item) => (
        <Badge variant="outline" className="gap-1">
          <Globe className="w-3 h-3" /> {item.page_name}
        </Badge>
      ),
    },
    {
      key: "key",
      label: "Key",
      className: "w-[200px]",
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
            onClick={() => handleEdit(item)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600"
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const renderMobileCard = (item: any) => (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div className="flex justify-between items-start">
        <p className="font-mono text-sm font-semibold text-primary">{item.key}</p>
        <Badge variant="outline" className="scale-75 origin-top-right">{item.page_name}</Badge>
      </div>
      <p className="text-slate-600 text-sm whitespace-pre-wrap mt-2 line-clamp-3">{item.value}</p>
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(item)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => handleDelete(item.id)}
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
              <Server  className="w-8 h-8 text-primary" /> Services Page Management
            </h2>
            <p className="text-slate-500 mt-1">Manage all dynamic text and images on the Services page.</p>
          </div>

          <ResponsiveDialog
            open={isOpen}
            onOpenChange={(val) => {
              setIsOpen(val);
              if (!val) {
                setNewKey("");
                setNewValue("");
                setPageName("Services");
                setEditingId(null);
                setEditingKey(null);
              }
            }}
            trigger={
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" /> Add Services Content
              </Button>
            }
            title={editingKey ? "Edit Content" : "Add New Content"}
            description="Manage dynamic content specifically for the Services page."
            onSave={handleSaveDialog}
            saveLabel={editingKey ? "Update Content" : "Save Content"}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Page Name</Label>
                <Input
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  placeholder="e.g. Services"
                />
              </div>
              <div className="space-y-2">
                <Label>Key Name (e.g. banner_title, Services_feature1_desc)</Label>
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
            <CardTitle>Services Page Content Keys</CardTitle>
            <CardDescription>Manage your Services page's dynamic segments using key-value storage.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveTable
              columns={columns}
              data={servicesSettings}
              keyField="key"
              isLoading={isLoading}
              isEmpty={servicesSettings.length === 0}
              emptyMessage="No content found"
              renderMobileCard={renderMobileCard}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
