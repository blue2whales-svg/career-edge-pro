import { motion } from "framer-motion";
import { ArrowRight, Home, Flame, FileText, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import cvedgeLogo from "@/assets/cvedge-logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const QUICK_LINKS = [
  {
    icon: FileText,
    label: "Order a CV",
    desc: "Get your document today",
    href: "/order",
    primary: true,
  },
  {
    icon: Briefcase,
    label: "Browse Jobs",
    desc: "Verified openings in Kenya & abroad",
    href: "/jobs",
    primary: false,
  },
  {
    icon: Home,
    label: "Back to Home",
    desc: "Start from the beginning",
    href: "/",
    primary: false,
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background effects — same as LandingPage */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed top-[-300px] left-[-200px] w-[700px] h-[700px] rounded-full bg-primary/5 blur-[150px] animate-orb pointer-events-none" />
      <div
        className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-secondary/3 blur-[120px] animate-orb pointer-events-none"
        style={{ animationDelay: "-4s" }}
      />

      {/* Minimal nav */}
      <nav className="relative z-10 border-b border-border/30 surface-glass sticky top-0">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={cvedgeLogo}
              alt="CV Edge Logo"
              className="w-10 h-10 object-contain rounded-full shadow-glow-sm ring-1 ring-primary/20"
            />
            <span className="font-bold text-lg tracking-tight">CV Edge</span>
          </Link>
          <Link to="/order">
            <Button size="sm" className="bg-gradient-brand border-0 font-semibold shadow-glow-sm gold-shimmer">
              Order Now
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-20">
        <div className="container max-w-2xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8"
          >
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary">Page not found</span>
          </motion.div>

          {/* 404 number */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-4">
            <span className="text-[120px] sm:text-[160px] font-serif font-bold leading-none text-gradient opacity-20 select-none">
              404
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-3xl sm:text-5xl font-serif font-bold leading-[1.1] mb-4 -mt-6 sm:-mt-10"
          >
            Looks like this page moved.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-12 leading-relaxed"
          >
            The link you followed might be outdated or mistyped. The job's still out there — let's get you back on
            track.
          </motion.p>

          {/* Quick links */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="grid sm:grid-cols-3 gap-4 mb-10"
          >
            {QUICK_LINKS.map((link) => (
              <Link to={link.href} key={link.label}>
                <div
                  className={`rounded-2xl border p-5 text-left transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 h-full ${
                    link.primary ? "border-primary/30 bg-gradient-brand-subtle" : "border-border bg-card"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                      link.primary ? "bg-primary/20" : "bg-muted"
                    }`}
                  >
                    <link.icon className={`h-4 w-4 ${link.primary ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="font-semibold text-sm mb-0.5">{link.label}</h3>
                  <p className="text-xs text-muted-foreground">{link.desc}</p>
                </div>
              </Link>
            ))}
          </motion.div>

          {/* Primary CTA */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
            <Link to="/order">
              <Button
                size="lg"
                className="bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer"
              >
                Start Your Order <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">M-Pesa · PayPal · Same-day delivery</p>
          </motion.div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="relative z-10 border-t border-border/30 py-6 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} CV Edge.{" "}
          <a href="mailto:support@cvedge.live" className="text-primary hover:text-primary/80 transition-colors">
            support@cvedge.live
          </a>
        </p>
      </footer>
    </div>
  );
}
