import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  Info, 
  Package, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Home Page", icon: Home, href: "/admin/home" },
  { label: "About Page", icon: Info, href: "/admin/about" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Messages", icon: MessageSquare, href: "/admin/messages" },
  { label: "Customization", icon: Settings, href: "/admin/customization" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/login");
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col fixed inset-y-0 shadow-sm z-50">
        <div className="p-6 border-b">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">A</div>
            Admin Panel
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 min-h-screen">
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between sticky top-0 z-40">
          <h1 className="font-semibold text-slate-800">
            {menuItems.find(m => m.href === location.pathname)?.label || "Admin"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Welcome, <strong>{user.username}</strong></span>
            <div className="w-8 h-8 rounded-full bg-slate-200 border flex items-center justify-center text-xs font-bold text-slate-600">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
