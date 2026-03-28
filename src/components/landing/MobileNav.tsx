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
  { label: "Pro ⭐", to: "/pro", highlight: true },
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
          "h-[100dvh] w-[85vw] max-w-[340px]",
          "rounded-none border-l border-border/60 bg-background/95 p-0 backdrop-blur-xl shadow-2xl flex flex-col",
        )}
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-4 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
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
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-card/50 text-muted-foreground hover:text-foreground transition"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* TOP CTA */}
        <div className="px-4 pt-4 shrink-0">
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

        {/* SCROLL AREA (FIXED PROPERLY) */}
        <nav className="mt-4 flex-1 overflow-y-auto px-2 pb-4">
          {NAV_LINKS.map((link) => {
            const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  "border-b border-border/10",
                  active ? "bg-primary/10 text-primary" : "text-foreground/85 hover:bg-primary/5 hover:text-foreground",
                  link.highlight && "text-yellow-500 font-semibold",
                )}
              >
                {link.label}
                {link.highlight && <span className="text-xs">✨</span>}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER CTA (ALWAYS VISIBLE) */}
        <div className="border-t border-border/50 bg-background/95 px-4 py-4 space-y-3 shrink-0">
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
      </SheetContent>
    </Sheet>
  );
}
