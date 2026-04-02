import { motion } from "framer-motion";
import { ArrowRight, Shield, CreditCard, Zap } from "lucide-react";
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

export function FinalCTASection() {
  return (
    <section className="relative z-10 py-20 px-4">
      <div className="container max-w-3xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-10 sm:p-14"
        >
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
            Your Next Job Is Waiting.{" "}
            <span className="text-gradient">Is Your CV Ready?</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join 1,200+ Kenyans who took their career seriously.
          </p>
          <Link to="/order">
            <Button
              size="lg"
              className="bg-gradient-brand border-0 font-semibold h-14 px-12 shadow-glow gold-shimmer text-base"
            >
              Get My CV Now — KES 1,200
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Secure payment
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              M-Pesa & PayPal
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Instant access after payment
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
