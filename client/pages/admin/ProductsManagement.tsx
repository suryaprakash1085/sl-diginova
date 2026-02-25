import { AdminLayout } from "@/components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Package, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { ResponsiveTable, TableColumn } from "@/components/ResponsiveTable";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";

export default function ProductsManagement() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [icon, setIcon] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [features, setFeatures] = useState("");
  const [tech, setTech] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive" | "Draft">("Active");
  const [category, setCategory] = useState("");
  const [dateAdded, setDateAdded] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      return res.json();
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
    setImage("");
    setDescription("");
    setPrice("");
    setIcon("");
    setSubtitle("");
    setFeatures("");
    setTech("");
    setStatus("Active");
    setCategory("");
    setDateAdded("");
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setImage(product.image);
    setDescription(product.description);
    setPrice(product.price.toString());
    setIcon(product.icon || "");
    setSubtitle(product.subtitle || "");
    setFeatures(product.features || "");
    setTech(product.tech || "");
    setStatus(product.status || "Active");
    setCategory(product.category || "");
    setDateAdded(product.dateAdded || "");
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    const productData: Partial<Product> = {
      name,
      image,
      description,
      price: parseFloat(price),
      icon: icon || undefined,
      subtitle: subtitle || undefined,
      features: features || undefined,
      tech: tech || undefined,
      status,
      category: category || undefined,
      dateAdded: dateAdded || new Date().toISOString(),
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
      label: "Product Name",
      render: (product) => (
        <span className="font-semibold text-slate-900">{product.name}</span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (product) => (
        <span className="text-slate-700 font-medium">${product.price.toFixed(2)}</span>
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
          <p className="font-semibold text-slate-900 truncate">{product.name}</p>
          <p className="text-slate-700 font-medium">${product.price.toFixed(2)}</p>
          <p className="text-slate-500 text-xs line-clamp-2 mt-1">{product.description}</p>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
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
