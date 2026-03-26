import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, ShoppingCart, PenSquare, FolderLock } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/cv-builder", icon: PenSquare, label: "CV Builder" },
  { to: "/order", icon: ShoppingCart, label: "Order" },
  { to: "/document-vault", icon: FolderLock, label: "Vault" },
  { to: "/jobs", icon: Briefcase, label: "Jobs" },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/portal")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-border/40 surface-glass backdrop-blur-xl mb-2">
      <div className="flex items-center justify-around h-16 px-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const isOrder = item.to === "/order";

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
                isOrder && "relative",
              )}
            >
              {isOrder ? (
                <span className="flex items-center justify-center w-11 h-11 -mt-5 rounded-full bg-gradient-brand shadow-glow border-4 border-background">
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </span>
              ) : (
                <item.icon className="w-5 h-5" />
              )}
              <span className={cn("text-[10px] font-medium leading-none", isOrder && "-mt-0.5")}>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Safe area for iPhone bottom spacing */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
