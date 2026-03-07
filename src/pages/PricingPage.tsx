import { motion } from "framer-motion";
import { ArrowRight, Check, Zap, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const PACKAGES = [
  {
    name: "Starter",
    price: "KES 2,500",
    period: "one-time",
    desc: "Perfect for entry-level professionals needing a strong foundation.",
    icon: Zap,
    features: [
      "Professional CV Writing",
      "ATS-Optimised Format",
      "Same-Day Delivery",
      "1 Revision Round",
      "PDF + Word Format",
    ],
    popular: false,
    accent: "border-border",
  },
  {
    name: "Professional",
    price: "KES 4,500",
    period: "one-time",
    desc: "Our most popular package — everything you need to land interviews.",
    icon: Star,
    features: [
      "CV + Cover Letter + LinkedIn",
      "ATS-Optimised Format",
      "Delivered in < 3 Hours",
      "2 Revision Rounds",
      "Dedicated Specialist",
      "PDF + Word + LinkedIn Txt",
      "ATS Score Report",
    ],
    popular: true,
    accent: "border-primary shadow-glow",
  },
  {
    name: "Executive",
    price: "KES 7,900",
    period: "one-time",
    desc: "For senior leaders who need documents that command boardroom attention.",
    icon: Crown,
    features: [
      "Executive CV + Cover Letter",
      "LinkedIn + Executive Bio",
      "Human Editor Review",
      "Delivered in < 6 Hours",
      "Unlimited Revisions",
      "All Formats Included",
      "Priority Support",
      "Strategy Consultation",
    ],
    popular: false,
    accent: "border-gold-dark/30",
  },
];

const ADD_ONS = [
  { name: "Additional Cover Letter", price: "KES 1,000" },
  { name: "CV Review & Critique", price: "KES 1,000" },
  { name: "Reference Letter Draft", price: "KES 1,500" },
  { name: "Personal Statement", price: "KES 3,500" },
  { name: "Scholarship Essay (per essay)", price: "KES 2,500" },
  { name: "Rush Delivery (< 1 hour)", price: "+KES 1,500" },
];

export default function PricingPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] mb-5"
          >
            Transparent pricing.{" "}
            <span className="text-gradient">No surprises.</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4"
          >
            One-time payment. No subscriptions. Pay for what you need, when you need it.
          </motion.p>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-sm font-mono text-primary"
          >
            📱 Pay instantly via M-Pesa
          </motion.p>
        </div>
      </section>

      {/* Packages */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-5">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={`rounded-2xl border p-6 sm:p-8 flex flex-col relative ${
                  pkg.popular ? "bg-gradient-brand-subtle " + pkg.accent : "bg-card " + pkg.accent
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-mono text-primary-foreground bg-gradient-brand px-4 py-1 rounded-full font-semibold shadow-glow-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <pkg.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-primary">{pkg.price}</span>
                  <span className="text-sm text-muted-foreground">/{pkg.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{pkg.desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/order">
                  <Button
                    className={`w-full h-12 font-semibold ${
                      pkg.popular ? "bg-gradient-brand border-0 shadow-glow gold-shimmer" : "border-primary/30"
                    }`}
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    Choose {pkg.name} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-3xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-4xl font-serif font-bold text-center mb-10"
          >
            Add-on <span className="text-gradient">services</span>
          </motion.h2>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {ADD_ONS.map((addon, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={`flex items-center justify-between p-5 ${
                  i < ADD_ONS.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <span className="font-medium text-sm sm:text-base">{addon.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold">{addon.price}</span>
                  <Link to="/order">
                    <Button size="sm" variant="outline" className="border-primary/30 text-xs">
                      Add
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="relative z-10 py-20 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-10 sm:p-14"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              100% <span className="text-gradient">Satisfaction Guarantee</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Not happy with the result? We'll revise it until you are. If you're still not satisfied, we'll refund you. No questions asked.
            </p>
            <Link to="/order">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
