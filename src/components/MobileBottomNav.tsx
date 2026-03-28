import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  ShoppingCart,
  FolderLock,
  Menu,
  FileText,
  ScanSearch,
  PenSquare,
  Sparkles,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/jobs", icon: Briefcase, label: "Jobs" },
  { to: "/order", icon: ShoppingCart, label: "Order" },
  { to: "/document-vault", icon: FolderLock, label: "Vault" },
];

const MORE_ITEMS = [
  { to: "/cv-builder", icon: PenSquare, label: "CV Builder" },
  { to: "/templates", icon: FileText, label: "CV Templates" },
  { to: "/cover-letter", icon: FileText, label: "Cover Letter" },
  { to: "/ats-checker", icon: ScanSearch, label: "ATS Checker" },
  { to: "/pricing", icon: Package, label: "Pricing" },
  { to: "/services", icon: Sparkles, label: "Services" },
  { to: "/tracker", icon: Briefcase, label: "Tracker" },
  { to: "/pro", icon: Sparkles, label: "Pro ⭐" },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/portal")) return null;

  return (
    <>
      <nav className="fixed bottom-3 left-3 right-3 z-[40] md:hidden rounded-2xl border border-border/40 surface-glass backdrop-blur-xl shadow-lg">
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

          {/* MORE BUTTON */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors",
                  "text-muted-foreground",
                )}
                aria-label="Open more menu"
              >
                <Menu className="w-5 h-5" />
                <span className="text-[10px] font-medium leading-none">More</span>
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[85vw] max-w-sm bg-background border-border p-0">
              <SheetTitle className="sr-only">More Navigation</SheetTitle>

              <div className="flex h-full flex-col">
                <div className="border-b border-border/50 px-5 py-5">
                  <h2 className="text-lg font-bold">More</h2>
                  <p className="mt-1 text-sm text-muted-foreground">More CV Edge tools and pages</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-3">
                  {MORE_ITEMS.map((item) => {
                    const active = pathname.startsWith(item.to);

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors border-b border-border/20",
                          active
                            ? "text-primary bg-primary/5"
                            : "text-foreground/80 hover:text-foreground hover:bg-primary/5",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Safe area for iPhone bottom spacing */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}
