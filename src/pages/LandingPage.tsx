import { motion } from "framer-motion";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { ArrowRight } from "lucide-react";
import cvedgeLogo from "@/assets/cvedge-logo.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MobileNav } from "@/components/landing/MobileNav";
import { TrustBar } from "@/components/landing/TrustBar";
import { SpeedSection } from "@/components/landing/SpeedSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { WhySection } from "@/components/landing/WhySection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ScholarshipPreview } from "@/components/landing/ScholarshipPreview";
import { PricingPreview } from "@/components/landing/PricingPreview";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { StatsBar } from "@/components/landing/StatsBar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed top-[-300px] left-[-200px] w-[700px] h-[700px] rounded-full bg-primary/5 blur-[150px] animate-orb pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-secondary/3 blur-[120px] animate-orb pointer-events-none" style={{ animationDelay: "-4s" }} />

      {/* Nav */}
      <nav className="relative z-10 border-b border-border/30 surface-glass sticky top-0">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5">
            <img src={cvedgeLogo} alt="CVEdge Logo" className="w-10 h-10 object-contain rounded-full shadow-glow-sm ring-1 ring-primary/20" />
            <span className="font-bold text-lg tracking-tight">CVEdge</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/services" className="hover:text-foreground transition-colors">Services</Link>
            <Link to="/scholarships" className="hover:text-foreground transition-colors">Scholarships</Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/jobs" className="hover:text-foreground transition-colors">Jobs</Link>
            <Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
          </div>
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
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-16 sm:pt-32 pb-16 sm:pb-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
              <span className="text-xs font-mono text-primary">Same-day delivery available</span>
            </motion.div>

            <motion.h1
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
              className="text-4xl sm:text-7xl lg:text-8xl font-serif font-bold leading-[1.08] mb-5"
            >
              The CV That Gets{" "}
              <span className="text-gradient">You Hired.</span>
              <br />
              <span className="text-2xl sm:text-4xl lg:text-5xl font-sans font-medium text-muted-foreground">
                Today.
              </span>
            </motion.h1>

            <motion.p
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="text-base sm:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed"
            >
              Professional CV writing, cover letters, scholarship essays and career documents — personally crafted by our expert team and delivered same day. We're always online. Pay instantly via M-Pesa.
            </motion.p>

            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <Link to="/order" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-8 shadow-glow gold-shimmer text-base"
                >
                  Order My CV Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-primary/30 font-semibold h-13 px-8 hover:bg-primary/5"
                >
                  See All Services
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={4}
              className="max-w-lg"
            >
              <LiveActivityFeed />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Speed Promise */}
      <SpeedSection />

      {/* Services */}
      <ServicesSection />

      {/* Why CVEdge */}
      <WhySection />

      {/* Stats */}
      <StatsBar />

      {/* Scholarship Preview */}
      <ScholarshipPreview />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Pricing Preview */}
      <PricingPreview />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      <section className="relative z-10 py-24 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-10 sm:p-14"
          >
            <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
              Ready to Get the <span className="text-gradient">Edge</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of professionals worldwide who trust CVEdge with their career documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/order">
                <Button
                  size="lg"
                  className="bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer text-base"
                >
                  Order My Documents Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4 font-mono">Pay via M-Pesa · Satisfaction guaranteed</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <img src={cvedgeLogo} alt="CVEdge Logo" className="w-9 h-9 object-contain rounded-full shadow-glow-sm ring-1 ring-primary/20" />
                <span className="font-bold">CVEdge</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Your Career's Secret Weapon</p>
              <a href="mailto:support@cvedge.live" className="text-xs text-primary hover:text-primary/80 transition-colors">support@cvedge.live</a>
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
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CVEdge. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Professional career documents for Kenyan professionals.</p>
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
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}