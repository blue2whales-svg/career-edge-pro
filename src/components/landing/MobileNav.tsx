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

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <img src={cvedgeLogo} className="w-9 h-9 rounded-full" />
            <div>
              <p className="text-sm font-bold">CV Edge</p>
              <p className="text-xs text-muted-foreground">Career OS</p>
            </div>
          </div>

          <button onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* USER BLOCK */}
        <div className="px-4 py-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{user ? (user.user_metadata?.display_name || user.email?.split("@")[0] || "User") : "Guest User"}</p>
              <p className="text-xs text-muted-foreground">{user ? "Pro member" : "Upgrade to unlock features"}</p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="px-4 py-4 space-y-2 border-b border-border/40">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Quick Actions</p>

          <Link to="/cv-builder" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 transition">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Build CV</span>
            </div>
          </Link>

          <Link to="/ats-checker" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 transition">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">ATS Check</span>
            </div>
          </Link>

          <Link to="/tracker" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 transition">
              <BarChart className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Track Jobs</span>
            </div>
          </Link>

          {user && (
            <>
              <Link to="/dashboard/referrals" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 transition">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium">Refer & Earn</span>
                </div>
              </Link>
              <Link to="/employer-dashboard" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 transition">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">Employer Dashboard</span>
                </div>
              </Link>
            </>
          )}

        {/* HOT CTA */}
        <div className="px-4 pt-4">
          <Link to="/jobs?industry=%F0%9F%94%A5+Hot+Abroad" onClick={() => setOpen(false)}>
            <Button variant="outline" className="w-full text-destructive border-destructive/40">
              <Flame className="w-4 h-4 mr-2" />
              Hot Jobs Abroad
            </Button>
          </Link>
        </div>

        {/* NAV LINKS */}
        <nav className="mt-4 flex-1 overflow-y-auto px-2 pb-4">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl text-sm transition",
                  active ? "bg-primary/10 text-primary" : "hover:bg-primary/5",
                  link.highlight && "text-yellow-500 font-semibold",
                )}
              >
                {link.label}
                {link.highlight && <span>✨</span>}
              </Link>
            );
          })}
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
