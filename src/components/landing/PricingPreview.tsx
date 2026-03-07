import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
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

const PACKAGES = [
  {
    name: "Starter",
    price: "KES 2,500",
    desc: "Entry-level, fast delivery",
    features: ["Professional CV Writing", "ATS-Optimised Format", "Same-Day Delivery", "1 Revision"],
    popular: false,
  },
  {
    name: "Professional",
    price: "KES 4,500",
    desc: "Most Popular — full package",
    features: ["CV + Cover Letter + LinkedIn", "ATS-Optimised", "Delivered < 3 Hours", "2 Revisions", "Dedicated Specialist"],
    popular: true,
  },
  {
    name: "Executive",
    price: "KES 7,900",
    desc: "Premium — human-reviewed",
    features: ["Executive CV + Cover Letter", "LinkedIn + Executive Bio", "Human Editor Review", "Delivered < 6 Hours", "Unlimited Revisions"],
    popular: false,
  },
];

export function PricingPreview() {
  return (
    <section className="relative z-10 py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
        >
          Pricing
        </motion.p>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-16"
        >
          Invest in your <span className="text-gradient">career</span>.
        </motion.h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 2}
              className={`rounded-xl border p-6 ${
                pkg.popular
                  ? "border-primary bg-gradient-brand-subtle shadow-glow"
                  : "border-border bg-card"
              }`}
            >
              {pkg.popular && (
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="text-3xl font-bold mt-3 mb-1">{pkg.price}</div>
              <div className="font-semibold mb-1">{pkg.name}</div>
              <p className="text-sm text-muted-foreground mb-5">{pkg.desc}</p>
              <ul className="space-y-2 mb-6">
                {pkg.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/order">
                <Button
                  className={`w-full ${
                    pkg.popular
                      ? "bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer"
                      : "border-primary/30"
                  }`}
                  variant={pkg.popular ? "default" : "outline"}
                >
                  Order Now
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5}
          className="text-center mt-8"
        >
          <Link to="/pricing" className="text-sm text-primary hover:underline font-medium">
            See Full Pricing & Subscription Plans →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}