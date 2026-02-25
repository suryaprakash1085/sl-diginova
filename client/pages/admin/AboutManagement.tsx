import { AdminLayout } from "@/components/AdminLayout";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Pencil, Save, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

const ABOUT_KEYS = ["company_description", "mission", "vision", "team_details"];

export default function AboutManagement() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const aboutSettings = settings.filter(s => ABOUT_KEYS.includes(s.key) || s.key.startsWith("about_"));

  const handleDelete = async (key: string) => {
    if (confirm(`Are you sure you want to delete "${key}"?`)) {
      await fetch(`/api/settings/${key}`, { method: "DELETE" });
      toast.success("Content deleted");
      // Refresh logic is handled by TanStack Query invalidation in hook but we might need manual trigger if delete is outside mutation
      window.location.reload(); // Quickest way for this mock
    }
  };

  const handleSave = () => {
    updateSettings({ key: newKey, value: newValue });
    setIsOpen(false);
    setNewKey("");
    setNewValue("");
    setEditingKey(null);
    toast.success("Content saved");
  };

  const handleEdit = (key: string, value: string) => {
    setNewKey(key);
    setNewValue(value);
    setEditingKey(key);
    setIsOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Info className="w-8 h-8 text-primary" /> About Page Management
            </h2>
            <p className="text-slate-500 mt-1">Manage the company description, mission, vision, and team details.</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editingKey ? "Edit Content" : "Add New Content"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Key Name (e.g. mission, about_history)</Label>
                  <Input 
                    value={newKey} 
                    onChange={(e) => setNewKey(e.target.value)} 
                    placeholder="Enter unique key"
                    disabled={!!editingKey}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Value / Content</Label>
                  <Textarea 
                    value={newValue} 
                    onChange={(e) => setNewValue(e.target.value)} 
                    placeholder="Enter content details"
                    rows={6}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" /> {editingKey ? "Update" : "Save"} Content
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dynamic Content Table</CardTitle>
            <CardDescription>All keys starting with 'about_' or core about keys are shown here.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-8">Loading content...</TableCell></TableRow>
                ) : aboutSettings.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-8 text-slate-500">No content found. Add some using the button above.</TableCell></TableRow>
                ) : (
                  aboutSettings.map((s) => (
                    <TableRow key={s.key} className="align-top hover:bg-slate-50/50">
                      <TableCell className="font-mono text-sm font-semibold text-slate-900">{s.key}</TableCell>
                      <TableCell className="text-slate-600 text-sm whitespace-pre-wrap max-w-xl">
                        {s.value}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary" onClick={() => handleEdit(s.key, s.value)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(s.key)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
