import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  User,
  X,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import cvedgeLogo from "@/assets/cvedge-logo.png";
import { useIsMobile } from "@/hooks/use-mobile";

const NAV_ITEMS = [
  { label: "My Orders", icon: LayoutDashboard, path: "/portal" },
  { label: "Documents", icon: FileText, path: "/portal/documents" },
  { label: "Messages", icon: MessageSquare, path: "/portal/messages" },
  { label: "Settings", icon: Settings, path: "/portal/settings" },
];

export default function PortalLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile top header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={cvedgeLogo} alt="CVEdge" className="w-7 h-7 object-contain rounded-full ring-1 ring-primary/20" />
            <span className="font-bold text-foreground text-sm">CVEdge</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
            <Button variant="ghost" size="icon" className="ml-2" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300",
          isMobile
            ? cn("w-64", mobileOpen ? "translate-x-0" : "-translate-x-full")
            : cn(collapsed ? "w-16" : "w-60")
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={cvedgeLogo} alt="CVEdge" className="w-8 h-8 object-contain rounded-full ring-1 ring-primary/20" />
            {(isMobile || !collapsed) && <span className="font-bold text-foreground">CVEdge</span>}
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Online indicator + Back to Home */}
        {(isMobile || !collapsed) && (
          <div className="px-4 py-3 border-b border-border space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Specialist Online</span>
            </div>
            <Link to="/" className="flex items-center gap-2 text-xs text-primary hover:underline">
              <Home className="h-3 w-3" />
              Back to Home
            </Link>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {(isMobile || !collapsed) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="border-t border-border p-3 space-y-2">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            {(isMobile || !collapsed) && (
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">My Account</div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={cn("w-full justify-start text-muted-foreground hover:text-destructive", !isMobile && collapsed && "px-3")}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {(isMobile || !collapsed) && <span className="ml-2">Sign out</span>}
          </Button>
        </div>

        {/* Collapse toggle - desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-4 -right-3 w-6 h-6 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            {collapsed ? <Menu className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        )}
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isMobile ? "mt-14" : (collapsed ? "ml-16" : "ml-60")
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
