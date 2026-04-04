import { useEffect, useState } from "react";
import cvedgeLogo from "@/assets/cvedge-logo.png";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Flame, LogOut, User, Gift } from "lucide-react";
import { MobileNav } from "@/components/landing/MobileNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { JobPreviewSection } from "@/components/landing/JobPreviewSection";
import { UrgencyStrip } from "@/components/landing/UrgencyStrip";
import { HowItWorksNew } from "@/components/landing/HowItWorksNew";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { WhyUpgradeSection } from "@/components/landing/WhyUpgradeSection";
import { PricingSectionNew } from "@/components/landing/PricingSectionNew";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { supabase } from "@/integrations/supabase/client";

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
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
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed top-[-300px] left-[-200px] w-[700px] h-[700px] rounded-full bg-primary/5 blur-[150px] animate-orb pointer-events-none" />
      <div
        className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-secondary/3 blur-[120px] animate-orb pointer-events-none"
        style={{ animationDelay: "-4s" }}
      />

      {/* Nav */}
      <nav className="relative z-10 border-b border-border/30 surface-glass sticky top-0">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5">
            <img
              src={cvedgeLogo}
              alt="CV Edge Logo"
              className="w-10 h-10 object-contain rounded-full shadow-glow-sm ring-1 ring-primary/20"
            />
            <span className="font-bold text-lg tracking-tight">CV Edge</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/services" className="hover:text-foreground transition-colors">Services</Link>
            <Link to="/jobs" className="hover:text-foreground transition-colors">Jobs</Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link to="/samples" className="hover:text-foreground transition-colors">Templates</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/jobs?industry=%F0%9F%94%A5+Hot+Abroad">
              <Button
                size="sm"
                variant="outline"
                className="border-destructive/40 text-destructive hover:bg-destructive/10 font-semibold text-xs gap-1.5 rounded-full px-3"
              >
                <Flame className="h-3.5 w-3.5" />
                Hot Jobs
              </Button>
            </Link>
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/dashboard/referrals">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-amber-400">
                      <Gift className="h-3.5 w-3.5" /> Refer & Earn
                    </Button>
                  </Link>
                  <Link to="/portal">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <User className="h-3.5 w-3.5" /> My Portal
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-destructive">
                    <LogOut className="h-3.5 w-3.5" /> Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Log in</Button>
                  </Link>
                  <Link to="/order">
                    <Button size="sm" className="bg-gradient-brand border-0 font-semibold shadow-glow-sm gold-shimmer">
                      Order Now
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* 1. Hero */}
      <HeroSection />

      {/* Urgency Strip */}
      <UrgencyStrip />

      {/* 2. Job Preview */}
      <JobPreviewSection />

      {/* 3. How It Works */}
      <HowItWorksNew />

      {/* Urgency Strip repeat */}
      <UrgencyStrip />

      {/* 4. Social Proof */}
      <SocialProofSection />

      {/* 5. Why Upgrade */}
      <WhyUpgradeSection />

      {/* 6. Pricing */}
      <PricingSectionNew />

      {/* 7. Final CTA */}
      <FinalCTASection />

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <img
                  src={cvedgeLogo}
                  alt="CV Edge Logo"
                  loading="lazy"
                  className="w-9 h-9 object-contain rounded-full shadow-glow-sm ring-1 ring-primary/20"
                />
                <span className="font-bold">CV Edge</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Your Career's Secret Weapon</p>
              <a href="mailto:support@cvedge.live" className="text-xs text-primary hover:text-primary/80 transition-colors">
                support@cvedge.live
              </a>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Services</h4>
              <div className="space-y-2 text-sm">
                <Link to="/services" className="block text-primary hover:text-primary/80 transition-colors">CV Writing</Link>
                <Link to="/services" className="block text-primary hover:text-primary/80 transition-colors">Cover Letters</Link>
                <Link to="/services" className="block text-primary hover:text-primary/80 transition-colors">LinkedIn Optimisation</Link>
                <Link to="/scholarships" className="block text-primary hover:text-primary/80 transition-colors">Scholarship Essays</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <div className="space-y-2 text-sm">
                <Link to="/about" className="block text-primary hover:text-primary/80 transition-colors">About</Link>
                <Link to="/how-it-works" className="block text-primary hover:text-primary/80 transition-colors">How It Works</Link>
                <Link to="/pricing" className="block text-primary hover:text-primary/80 transition-colors">Pricing</Link>
                <Link to="/contact" className="block text-primary hover:text-primary/80 transition-colors">Contact Us</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Account</h4>
              <div className="space-y-2 text-sm">
                <Link to="/login" className="block text-primary hover:text-primary/80 transition-colors">Log in</Link>
                <Link to="/signup" className="block text-primary hover:text-primary/80 transition-colors">Sign up</Link>
                <Link to="/order" className="block text-primary hover:text-primary/80 transition-colors">Order Now</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CV Edge. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms &amp; Conditions</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
              <Link to="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Fixed WhatsApp Button */}
      <a
        href="https://wa.me/254793919962"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
