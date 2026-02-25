import { Link, useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/use-settings";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, User as UserIcon } from "lucide-react";
import { useState } from "react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { getSetting } = useSettings();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const showTopBar = getSetting("show_top_bar") === "true";
  const showFooter = getSetting("show_footer") === "true";
  const stickyHeader = getSetting("sticky_header") === "true";

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className={`${stickyHeader ? "sticky top-0 z-50" : ""} bg-white/80 backdrop-blur-md border-b`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            {getSetting("company_name")}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">Products</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
            {user ? (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="gap-2">
                  <UserIcon className="w-4 h-4" /> Admin
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" /> Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white p-4 flex flex-col gap-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            {user ? (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {showFooter && (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-4">{getSetting("footer_text") || `© ${new Date().getFullYear()} ${getSetting("company_name")}. All rights reserved.`}</p>
            <div className="flex justify-center gap-6">
              <a href={getSetting("social_facebook")} className="hover:text-white">Facebook</a>
              <a href={getSetting("social_instagram")} className="hover:text-white">Instagram</a>
              <a href={getSetting("social_twitter")} className="hover:text-white">Twitter</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
