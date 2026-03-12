import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Briefcase, GraduationCap, CreditCard, Wrench, BookOpen, Phone, Flame, FileText, Target, Star } from "lucide-react";
import cvedgeLogo from "@/assets/cvedge-logo.png";
import { MobileNav } from "@/components/landing/MobileNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import ChatPrompt from "@/components/ChatPrompt";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
}

const DOCK_LINKS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/jobs", icon: Briefcase, label: "Jobs" },
  { to: "/cv-builder", icon: FileText, label: "CV Builder" },
  { to: "/cover-letter", icon: FileText, label: "Cover Letter" },
  { to: "/ats-checker", icon: Target, label: "ATS Check" },
  { to: "/pricing", icon: CreditCard, label: "Pricing" },
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
      <ChatPrompt />

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

    </div>
  );
}
