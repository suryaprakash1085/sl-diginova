import { AdminLayout } from "@/components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Package, Image as ImageIcon, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { ResponsiveTable, TableColumn } from "@/components/ResponsiveTable";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import { Badge } from "@/components/ui/badge";

export default function ProductsManagement() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [tech, setTech] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive" | "Draft">("Active");
  const [image, setImage] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      const json = await res.json();
      return json.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newProduct: Partial<Product>) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsOpen(false);
      resetForm();
      toast.success("Product created successfully!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedProduct: Product) => {
      const res = await fetch(`/api/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsOpen(false);
      resetForm();
      toast.success("Product updated successfully!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully!");
    },
  });

  const resetForm = () => {
    setName("");
    setSubtitle("");
    setDescription("");
    setFeatures("");
    setTech("");
    setStatus("Active");
    setImage("");
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSubtitle(product.subtitle || "");
    setDescription(product.description);
    setFeatures(product.features || "");
    setTech(product.tech || "");
    setStatus(product.status || "Active");
    setImage(product.image || "");
    setIsOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (json.success) {
          setImage(json.data.url);
          toast.success("Image uploaded successfully!");
        } else {
          toast.error("Failed to upload image");
        }
      } catch (error) {
        toast.error("Error uploading image");
      }
    }
  };

  const handleSubmit = async () => {
    const currentDate = new Date().toISOString().split("T")[0];

    const productData: Partial<Product> = {
      name,
      subtitle: subtitle || undefined,
      description,
      features: features || undefined,
      tech: tech || undefined,
      status,
      image,
      dateAdded: currentDate,
    };

    if (editingProduct) {
      await updateMutation.mutateAsync({ ...editingProduct, ...productData } as Product);
    } else {
      await createMutation.mutateAsync(productData);
    }
  };

  const columns: TableColumn<Product>[] = [
    {
      key: "image",
      label: "Image",
      className: "w-[100px]",
      render: (product) => (
        product.image ? (
          <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg object-cover border" />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
            <ImageIcon className="w-6 h-6" />
          </div>
        )
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (product) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{product.name}</span>
          <span className="text-xs text-slate-500 line-clamp-1">{product.subtitle}</span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (product) => (
        <span className="text-slate-500 text-sm line-clamp-2">{product.description}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (product) => {
        const status = product.status || "Active";
        const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
          Active: "default",
          Inactive: "secondary",
          Draft: "outline",
        };
        return <Badge variant={variants[status] || "default"}>{status}</Badge>;
      },
    },
    {
      key: "tech",
      label: "Tech Stack",
      render: (product) => (
        <span className="text-slate-500 text-sm">{product.tech || "-"}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (product) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-primary"
            onClick={() => handleEdit(product)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600"
            onClick={() => {
              if (confirm("Are you sure?")) {
                deleteMutation.mutate(product.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const renderMobileCard = (product: Product) => (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div className="flex gap-3">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-16 w-16 rounded-lg object-cover border flex-shrink-0" />
        ) : (
          <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <p className="font-semibold text-slate-900 truncate">{product.name}</p>
            <Badge variant={product.status === "Active" ? "default" : "secondary"} className="scale-75 origin-top-right">
              {product.status || "Active"}
            </Badge>
          </div>
          <p className="text-slate-500 text-xs truncate">{product.subtitle}</p>
        </div>
      </div>
      <p className="text-slate-500 text-sm line-clamp-2">{product.description}</p>
      <div className="flex gap-2 justify-end pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(product)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => {
            if (confirm("Are you sure?")) {
              deleteMutation.mutate(product.id);
            }
          }}
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
              <Package className="w-8 h-8 text-primary" /> Products Management
            </h2>
            <p className="text-slate-500 mt-1">Manage your catalog, prices, and inventory.</p>
          </div>

          <ResponsiveDialog
            open={isOpen}
            onOpenChange={(val) => {
              setIsOpen(val);
              if (!val) resetForm();
            }}
            trigger={
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            }
            title={editingProduct ? "Edit Product" : "Add New Product"}
            onSave={handleSubmit}
            saveLabel={editingProduct ? "Update Product" : "Create Product"}
            isLoading={createMutation.isPending || updateMutation.isPending}
          >
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-xl bg-slate-50/50">
              {image ? (
                <div className="relative group">
                  <img src={image} alt="Preview" className="h-32 w-32 object-cover rounded-lg border shadow-sm" />
                  <button
                    onClick={() => setImage("")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="h-32 w-32 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-sm font-medium">
                    <Upload className="w-4 h-4" /> Upload Image
                  </div>
                  <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </Label>
                <p className="text-xs text-slate-500">JPG, PNG or SVG. Max 5MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. Car Service Management Platform" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Long Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Key Features (One per line)</Label>
              <Textarea id="features" value={features} onChange={(e) => setFeatures(e.target.value)} rows={3} placeholder="Feature 1&#10;Feature 2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tech">Tech Stack</Label>
              <Input id="tech" value={tech} onChange={(e) => setTech(e.target.value)} placeholder="e.g. React, Node.js, MySQL" />
            </div>
          </div>
          </ResponsiveDialog>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <ResponsiveTable
            columns={columns}
            data={products}
            keyField="id"
            isLoading={isLoading}
            isEmpty={products.length === 0}
            emptyMessage="No products found"
            renderMobileCard={renderMobileCard}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
