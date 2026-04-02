import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
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
    price: "KES 1,490",
    originalPrice: "KES 5,000",
    desc: "Entry-level, fast delivery",
    features: ["Professional CV Writing", "ATS-Optimised Format", "Same-Day Delivery", "1 Revision"],
    popular: false,
  },
  {
    name: "Professional",
    price: "KES 2,490",
    originalPrice: "KES 9,000",
    desc: "Most Popular — full package",
    features: [
      "CV + Cover Letter + LinkedIn",
      "ATS-Optimised",
      "Delivered < 3 Hours",
      "2 Revisions",
      "Dedicated Specialist",
    ],
    popular: true,
  },
  {
    name: "Executive",
    price: "KES 5,490",
    originalPrice: "KES 15,000",
    desc: "Premium — human-reviewed",
    features: [
      "Executive CV + Cover Letter",
      "LinkedIn + Executive Bio",
      "Human Editor Review",
      "Delivered < 6 Hours",
      "Unlimited Revisions",
    ],
    popular: false,
  },
];

export function PricingSectionNew() {
  return (
    <section className="relative z-10 py-16 sm:py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
        >
          Pricing
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-4"
        >
          One Investment. <span className="text-gradient">Lifetime Impact.</span>
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={2}
          className="text-sm text-muted-foreground text-center mb-14 max-w-md mx-auto"
        >
          Less than a matatu fare to CBD. More than you'll earn staying invisible.
        </motion.p>

        <div className="grid sm:grid-cols-3 gap-4">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i + 3}
              className={`rounded-xl border p-6 ${
                pkg.popular ? "border-primary bg-gradient-brand-subtle shadow-glow" : "border-border bg-card"
              }`}
            >
              {pkg.popular && (
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="flex items-center gap-2 mt-3 mb-1">
                <span className="text-3xl font-bold">{pkg.price}</span>
                <span className="text-base text-muted-foreground line-through opacity-60">{pkg.originalPrice}</span>
              </div>
              <div className="font-semibold mb-1">{pkg.name}</div>
              <div className="inline-block rounded-full bg-brand-red/10 border border-brand-red/20 px-2 py-0.5 text-[10px] font-mono text-brand-red mb-3">
                Save{" "}
                {Math.round(
                  (1 - parseInt(pkg.price.replace(/\D/g, "")) / parseInt(pkg.originalPrice.replace(/\D/g, ""))) * 100,
                )}
                %
              </div>
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
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={6}
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
