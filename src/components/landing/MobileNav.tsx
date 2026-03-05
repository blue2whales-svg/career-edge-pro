import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import cvedgeLogo from "@/assets/cvedge-logo.png";

const NAV_LINKS = [
  { label: "Services", to: "/services" },
  { label: "Scholarships", to: "/scholarships" },
  { label: "Pricing", to: "/pricing" },
  { label: "Jobs", to: "/jobs" },
  { label: "How It Works", to: "/how-it-works" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] max-w-sm bg-background border-border p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-2.5 p-5 border-b border-border/50">
            <img src={cvedgeLogo} alt="CVEdge" className="w-9 h-9 rounded-full shadow-glow-sm ring-1 ring-primary/20" />
            <span className="font-bold text-lg">CVEdge</span>
          </div>

          {/* Links */}
          <nav className="flex-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="flex items-center px-6 py-4 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-primary/5 transition-colors border-b border-border/20"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="p-5 space-y-3 border-t border-border/50">
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full h-12 text-base border-primary/30 hover:bg-primary/5">
                Log in
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button className="w-full h-12 text-base bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer">
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
