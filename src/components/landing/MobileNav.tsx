import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ArrowRight, Flame, X, User, FileText, CheckCircle, BarChart, LogOut, Gift, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import cvedgeLogo from "@/assets/cvedge-logo.png";
import { supabase } from "@/integrations/supabase/client";

const NAV_LINKS = [
  { label: "Jobs", to: "/jobs" },
  { label: "CV Templates", to: "/templates" },
  { label: "Cover Letter", to: "/cover-letter" },
  { label: "Pricing", to: "/pricing" },
  { label: "Services", to: "/services" },
  { label: "Pro ⭐", to: "/pro", highlight: true },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    navigate("/");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm">
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="z-[100] h-[100dvh] w-[85vw] max-w-[340px] p-0 bg-background/95 backdrop-blur-xl border-l border-border/60 flex flex-col"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        {/* HEADER + USER */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {user ? <User className="w-4 h-4 text-primary" /> : <img src={cvedgeLogo} className="w-8 h-8 rounded-full" />}
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">{user ? (user.user_metadata?.display_name || user.email?.split("@")[0] || "User") : "CV Edge"}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{user ? user.email : "Career OS"}</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ALL LINKS — single scrollable list */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {/* Primary nav */}
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-1 pb-1">Navigate</p>
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition",
                  active ? "bg-primary/10 text-primary font-medium" : "hover:bg-primary/5",
                  link.highlight && "text-yellow-500 font-semibold",
                )}
              >
                {link.label}
                {link.highlight && <span className="text-xs">✨</span>}
              </Link>
            );
          })}

          {/* Quick tools */}
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-3 pb-1">Tools</p>
          {[
            { to: "/cv-builder", icon: <FileText className="w-4 h-4 text-primary" />, label: "Build CV" },
            { to: "/ats-checker", icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, label: "ATS Check" },
            { to: "/tracker", icon: <BarChart className="w-4 h-4 text-blue-500" />, label: "Track Jobs" },
          ].map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-primary/5 transition">
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}

          {/* Logged-in extras */}
          {user && (
            <>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-3 pb-1">Account</p>
              {[
                { to: "/portal", icon: <User className="w-4 h-4 text-primary" />, label: "My Portal" },
                { to: "/dashboard/referrals", icon: <Gift className="w-4 h-4 text-amber-400" />, label: "Refer & Earn" },
                { to: "/employer-dashboard", icon: <Briefcase className="w-4 h-4 text-purple-500" />, label: "Employer Dashboard" },
              ].map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-primary/5 transition">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </>
          )}

          {/* Hot CTA */}
          <div className="mt-3 px-1">
            <Link to="/jobs?industry=%F0%9F%94%A5+Hot+Abroad" onClick={() => setOpen(false)}>
              <Button variant="outline" size="sm" className="w-full text-destructive border-destructive/40 text-xs gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Hot Jobs Abroad
              </Button>
            </Link>
          </div>
        </nav>

        {/* FOOTER */}
        <div className="border-t border-border/50 px-4 py-4 space-y-3 shrink-0">
          {user ? (
            <>
              <Link to="/portal" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full gap-2">
                  <User className="w-4 h-4" /> My Portal
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" className="w-full gap-2 text-destructive border-destructive/30">
                <LogOut className="w-4 h-4" /> Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)}>
                <Button className="w-full bg-gradient-brand">
                  Sign Up Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
