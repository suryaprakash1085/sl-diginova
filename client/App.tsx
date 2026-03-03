import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ServicesManagement from "./pages/admin/servicesManagement";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Customization from "./pages/admin/Customization";
import HomeManagement from "./pages/admin/HomeManagement";
import AboutManagement from "./pages/admin/AboutManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import ProductsManagement from "./pages/admin/ProductsManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";
import NotFound from "./pages/NotFound";
import { PlaceholderPage } from "./components/PlaceholderPage";
import { ThemeInjector } from "./components/ThemeInjector";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeInjector />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          {/* <Route path="/" element={<Index />} /> */}

          {/* <Route path="/login" element={<Login />} /> */}
     <Route path="/" element={<Login />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/home" element={<HomeManagement />} />
          <Route path="/admin/about" element={<AboutManagement />} />
          <Route path="/admin/services" element={<ServicesManagement />} />
          <Route path="/admin/products" element={<ProductsManagement />} />
          <Route path="/admin/messages" element={<MessagesManagement />} />
          <Route path="/admin/customization" element={<Customization />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
const root = (window as any)._root || ((window as any)._root = createRoot(container));
root.render(<App />);
