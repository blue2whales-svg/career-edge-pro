import { motion } from "framer-motion";
import { ArrowRight, Flame, Shield, Zap, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export function HeroSection() {
  return (
    <section className="relative z-10 pt-14 sm:pt-28 pb-14 sm:pb-20 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="max-w-3xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6"
          >
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary">Same-day delivery available</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-4"
          >
            The Job Is Already Out There.{" "}
            <span className="text-gradient">Can They Find You?</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed"
          >
            CV Edge gives you a recruiter-ready CV + access to verified jobs in Kenya, Gulf,
            Cruise Lines and beyond — starting at{" "}
            <span className="text-primary font-semibold">KES 1,200</span>
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <Link to="/order" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-8 shadow-glow gold-shimmer text-base"
              >
                Get My CV Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-primary/30 font-semibold h-13 px-8 hover:bg-primary/5"
              >
                Browse Jobs
              </Button>
            </Link>
          </motion.div>

          {/* Live counter */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="flex items-center gap-2 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            <span className="text-sm text-muted-foreground">
              🔥 <span className="text-foreground font-semibold">1,200+</span> job seekers already on CV Edge
            </span>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={5}
            className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              <span>M-Pesa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>PayPal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>Instant Delivery</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
