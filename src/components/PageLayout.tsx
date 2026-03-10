import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Briefcase, GraduationCap, CreditCard, Wrench, BookOpen, Phone } from "lucide-react";
import cvedgeLogo from "@/assets/cvedge-logo.png";
import { MobileNav } from "@/components/landing/MobileNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
}

const DOCK_LINKS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/services", icon: Wrench, label: "Services" },
  { to: "/scholarships", icon: GraduationCap, label: "Scholarships" },
  { to: "/pricing", icon: CreditCard, label: "Pricing" },
  { to: "/jobs", icon: Briefcase, label: "Jobs" },
  { to: "/how-it-works", icon: BookOpen, label: "How It Works" },
  { to: "/contact", icon: Phone, label: "Contact" },
];

export default function PageLayout({ children }: PageLayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed top-[-300px] left-[-200px] w-[700px] h-[700px] rounded-full bg-primary/5 blur-[150px] animate-orb pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-secondary/3 blur-[120px] animate-orb pointer-events-none" style={{ animationDelay: "-4s" }} />

      {/* Minimal Top Bar */}
      <nav className="relative z-10 border-b border-border/30 surface-glass sticky top-0">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={cvedgeLogo} alt="CVEdge Logo" className="w-10 h-10 object-contain rounded-full shadow-glow-sm ring-1 ring-primary/20" />
            <span className="font-bold text-lg tracking-tight">CVEdge</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/jobs?industry=%F0%9F%94%A5+Hot+Abroad">
              <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 font-semibold text-xs gap-1.5 rounded-full px-3">
                <Flame className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Hot Jobs</span>
                <span className="sm:hidden">Jobs</span>
              </Button>
            </Link>
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/order">
                <Button size="sm" className="bg-gradient-brand border-0 font-semibold shadow-glow-sm gold-shimmer">
                  Order Now
                </Button>
              </Link>
            </div>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Content */}
      {children}

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-3">
                <img src={cvedgeLogo} alt="CVEdge Logo" className="w-9 h-9 object-contain rounded-full shadow-glow-sm ring-1 ring-primary/20" />
                <span className="font-bold">CVEdge</span>
              </Link>
              <p className="text-xs text-muted-foreground mb-2">Your Career's Secret Weapon</p>
              <a href="mailto:support@cvedge.live" className="text-xs text-primary hover:text-primary/80 transition-colors">support@cvedge.live</a>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Services</h4>
              <div className="space-y-2 text-sm">
                <Link to="/services" className="block text-primary hover:text-primary/80 transition-colors">CV Writing</Link>
                <Link to="/services" className="block text-primary hover:text-primary/80 transition-colors">Cover Letters</Link>
                <Link to="/services" className="block text-primary hover:text-primary/80 transition-colors">LinkedIn</Link>
                <Link to="/scholarships" className="block text-primary hover:text-primary/80 transition-colors">Scholarships</Link>
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
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CVEdge. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Professional career documents for 90+ countries worldwide.</p>
          </div>
          {/* Extra bottom padding for bottom nav */}
          <div className="h-20 md:h-24" />
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />

      {/* Desktop Floating Bottom Dock */}
      <motion.div
        className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.1 }}
      >
        <div className="flex items-center gap-1 px-3 py-2 rounded-2xl border border-border/40 bg-background/70 backdrop-blur-2xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.25)]">
          {DOCK_LINKS.map((link, i) => {
            const isActive = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
            return (
              <motion.div
                key={link.to}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.03, duration: 0.2 }}
              >
                <Link
                  to={link.to}
                  className={cn(
                    "group relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <link.icon className={cn(
                    "w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110",
                    isActive && "scale-110"
                  )} />
                  <span className="text-[10px] font-medium leading-none">{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="dock-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
          <div className="w-px h-8 bg-border/50 mx-1" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link to="/order">
              <Button size="sm" className="bg-gradient-brand border-0 font-semibold shadow-glow-sm gold-shimmer rounded-xl h-10 px-5">
                Order
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* WhatsApp — shift up on mobile to clear bottom nav, on desktop to clear dock */}
      <a
        href="https://wa.me/254793919962"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
