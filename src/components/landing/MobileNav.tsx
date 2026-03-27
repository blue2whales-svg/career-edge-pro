import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ArrowRight, Flame, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import cvedgeLogo from "@/assets/cvedge-logo.png";

const NAV_LINKS = [
  { label: "Jobs", to: "/jobs" },
  { label: "CV Builder", to: "/cv-builder" },
  { label: "CV Templates", to: "/templates" },
  { label: "Cover Letter", to: "/cover-letter" },
  { label: "ATS Checker", to: "/ats-checker" },
  { label: "Pricing", to: "/pricing" },
  { label: "Services", to: "/services" },
  { label: "Tracker", to: "/tracker" },
  { label: "Pro ⭐", to: "/pro" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm shrink-0"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className={cn(
          "md:hidden",
          "top-3 right-3 bottom-24 left-auto",
          "h-auto w-[82vw] max-w-[320px]",
          "rounded-2xl border border-border/60 bg-background/95 p-0 shadow-2xl backdrop-blur-xl",
        )}
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
          {/* Premium header */}
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <img
                src={cvedgeLogo}
                alt="CV Edge"
                className="w-9 h-9 rounded-full shadow-glow-sm ring-1 ring-primary/20 shrink-0"
              />
              <div className="min-w-0">
                <p className="truncate font-bold text-sm">CV Edge</p>
                <p className="truncate text-[11px] text-muted-foreground">Your Career&apos;s Secret Weapon</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-card/50 text-muted-foreground hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Top CTA */}
          <div className="px-4 pt-4">
            <Link to="/jobs?industry=%F0%9F%94%A5+Hot+Abroad" onClick={() => setOpen(false)}>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 font-semibold gap-1.5 rounded-xl"
              >
                <Flame className="h-4 w-4" />
                View Hot Jobs
              </Button>
            </Link>
          </div>

          {/* Scrollable links area */}
          <nav className="mt-3 min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            {NAV_LINKS.map((link) => {
              const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    "border-b border-border/10",
                    active
                      ? "bg-primary/8 text-primary"
                      : "text-foreground/85 hover:bg-primary/5 hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Sticky footer CTA area */}
          <div className="border-t border-border/50 bg-background/95 px-4 py-4 space-y-3">
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full h-11 text-sm border-primary/30 hover:bg-primary/5 rounded-xl">
                Log in
              </Button>
            </Link>

            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button className="w-full h-11 text-sm bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer rounded-xl">
                Sign Up Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
