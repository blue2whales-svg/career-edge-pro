import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { Link } from "react-router-dom";

import cvedgeLogo from "@/assets/cvedge-logo.png";
import { Button } from "@/components/ui/button";

import { MobileNav } from "@/components/landing/MobileNav";
import { TrustBar } from "@/components/landing/TrustBar";
import { SpeedSection } from "@/components/landing/SpeedSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { WhySection } from "@/components/landing/WhySection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ScholarshipPreview } from "@/components/landing/ScholarshipPreview";
import { PricingPreview } from "@/components/landing/PricingPreview";
import { StatsBar } from "@/components/landing/StatsBar";
import { JobsTeaser } from "@/components/landing/JobsTeaser";
import { AnimatedStatsBar } from "@/components/landing/AnimatedStatsBar";
import { TrustTestimonials } from "@/components/landing/TrustTestimonials";
import { GuaranteeBadge } from "@/components/landing/GuaranteeBadge";
import { CountriesServed } from "@/components/landing/CountriesServed";

import BeforeAfterSection from "@/components/landing/BeforeAfterSection";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { LiveActivityPopup } from "@/components/landing/LiveActivityPopup";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* NAVBAR */}
      <nav className="border-b border-border/30 sticky top-0 z-10 bg-background/70 backdrop-blur">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4 gap-3">
          {/* Left */}
          <div className="flex items-center gap-2 min-w-0">
            <img src={cvedgeLogo} alt="CV Edge" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0" />
            <span className="font-bold text-sm sm:text-lg truncate">CV Edge</span>
          </div>

          {/* Desktop middle links */}
          <div className="hidden md:flex gap-6 text-sm text-muted-foreground">
            <Link to="/services" className="hover:text-foreground transition-colors">
              Services
            </Link>
            <Link to="/scholarships" className="hover:text-foreground transition-colors">
              Scholarships
            </Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/jobs" className="hover:text-foreground transition-colors">
              Jobs
            </Link>
            <Link to="/how-it-works" className="hover:text-foreground transition-colors">
              How it Works
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Hide on mobile, show from small screens upward */}
            <Link to="/jobs?industry=%F0%9F%94%A5+Hot+Abroad" className="hidden sm:inline-flex">
              <Button size="sm" variant="outline" className="whitespace-nowrap">
                <Flame className="w-4 h-4 mr-1" />
                Hot Jobs
              </Button>
            </Link>

            <Link to="/order">
              <Button size="sm" className="whitespace-nowrap px-3 sm:px-4">
                Order Now
              </Button>
            </Link>

            <MobileNav />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-20 pb-16 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl sm:text-7xl font-bold mb-6"
          >
            The CV That Gets You Hired.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg text-muted-foreground mb-8 max-w-xl"
          >
            Professional CV writing, cover letters, scholarship essays and career documents crafted to pass ATS and
            impress recruiters.
          </motion.p>

          <div className="flex gap-4 flex-wrap">
            <Link to="/order">
              <Button size="lg">
                Order My CV
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>

            <Link to="/services">
              <Button variant="outline" size="lg">
                See Services
              </Button>
            </Link>
          </div>

          {/* Mobile Hot Jobs button — better placement */}
          <div className="mt-4 sm:hidden">
            <Link to="/jobs?industry=%F0%9F%94%A5+Hot+Abroad">
              <Button variant="outline" size="sm" className="w-full">
                <Flame className="w-4 h-4 mr-1" />
                Browse Hot Jobs
              </Button>
            </Link>
          </div>

          <div className="mt-10">
            <LiveActivityFeed />
          </div>
        </div>
      </section>

      {/* STATS */}
      <AnimatedStatsBar />

      {/* TRUST */}
      <TrustBar />

      {/* SPEED */}
      <SpeedSection />

      {/* SERVICES */}
      <ServicesSection />

      {/* WHY */}
      <WhySection />

      {/* STATS */}
      <StatsBar />

      {/* JOBS */}
      <JobsTeaser />

      {/* SCHOLARSHIPS */}
      <ScholarshipPreview />

      {/* HOW IT WORKS */}
      <HowItWorksSection />

      {/* PRICING */}
      <PricingPreview />

      {/* ATS BEFORE / AFTER */}
      <BeforeAfterSection />

      {/* TESTIMONIALS */}
      <TrustTestimonials />

      {/* COUNTRIES */}
      <CountriesServed />

      {/* FINAL CTA */}
      <section className="py-24 text-center px-4">
        <h2 className="text-4xl font-bold mb-6">Ready to Get the Edge?</h2>

        <p className="text-muted-foreground mb-8">Thousands trust CV Edge with their career documents.</p>

        <Link to="/order">
          <Button size="lg">Order My Documents</Button>
        </Link>

        <div className="mt-6 flex justify-center">
          <GuaranteeBadge />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CV Edge
      </footer>

      {/* LIVE ACTIVITY POPUP */}
      <LiveActivityPopup />
    </div>
  );
}
