import { PublicLayout } from "@/components/PublicLayout";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart } from "lucide-react";

export default function Products() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      return res.json();
    },
  });

  return (
    <PublicLayout>
      <div className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4 flex items-center justify-center gap-3">
            <Package className="w-10 h-10 text-primary" /> Our Catalog
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Explore our curated selection of high-quality products designed to enhance your lifestyle.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-20 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-md">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-400">No products found</h2>
              <p className="text-slate-500">Check back later for new arrivals.</p>
            </div>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-slate-900 border shadow-sm">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-slate-600 text-sm line-clamp-2 min-h-[40px]">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full gap-2 font-semibold">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
