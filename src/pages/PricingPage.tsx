import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { trackViewContent } from "@/hooks/useFbPixel";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import JobUnlockSheet from "@/components/jobs/JobUnlockSheet";
import { ArrowRight, Check, Zap, Star, Crown, Globe, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { SecurityBadges } from "@/components/landing/SecurityBadges";
import { useIsInternational } from "@/hooks/useIsInternational";
import { useUsdRate } from "@/hooks/useUsdRate";
import { PayPalButton } from "@/components/PayPalButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const PLANS = [
  {
    name: "Free",
    price: "KSh 0",
    priceNum: 0,
    period: "forever",
    desc: "Get started with basic access to Kenya jobs.",
    icon: Zap,
    features: [
      "Unverified Kenya jobs (unlimited)",
      "1 basic CV with watermark",
      "Job search and filters",
      "Basic application tracker",
    ],
    notIncluded: [
      "Verified employer jobs",
      "International & visa jobs",
      "Unlimited CV downloads",
      "Job alerts",
    ],
    popular: false,
    accent: "border-border",
    cta: "Current Plan",
    ctaLink: "/signup",
  },
  {
    name: "Pro",
    price: "KSh 500",
    priceNum: 500,
    period: "/month",
    desc: "Unlock everything. Land your dream job faster.",
    icon: Star,
    features: [
      "Everything in Free",
      "All verified Kenya employer jobs",
      "All international + visa jobs",
      "Unlimited CV downloads (no watermark)",
      "CV completeness score",
      "Application tracker",
      "Job alerts (email + WhatsApp)",
      "Priority support",
    ],
    notIncluded: [],
    popular: true,
    accent: "border-amber-500/50 shadow-[0_0_20px_rgba(245,166,35,0.15)]",
    cta: "Start Pro — M-Pesa or PayPal",
    ctaLink: "/order?service=pro_subscription",
  },
  {
    name: "Employer",
    price: "From KSh 0",
    priceNum: 0,
    period: "",
    desc: "Post jobs and find top candidates.",
    icon: Crown,
    features: [
      "Post Basic job (free, 7 days)",
      "Post Featured job (KSh 2,000, 14 days)",
      "Post Pro job (KSh 5,000, 30 days)",
      "Candidate search access",
      "Application management",
      "Company branding",
    ],
    notIncluded: [],
    popular: false,
    accent: "border-primary/30",
    cta: "Post a Job",
    ctaLink: "/post-job",
  },
];

const FAQS = [
  { q: "Can I cancel anytime?", a: "Yes, cancel anytime from your dashboard. No lock-in period." },
  { q: "What payment methods do you accept?", a: "M-Pesa (Paybill 4561075) and PayPal. Both are instant and secure." },
  { q: "Do single unlocks expire?", a: "No. Once you unlock a job, it stays unlocked forever in your account." },
  { q: "Is my data safe?", a: "Yes. All data is secured with row-level security policies and encrypted connections." },
  { q: "What's included in Pro?", a: "Unlimited job unlocks, watermark-free CV downloads, application tracking, job alerts, and priority support." },
];

export default function PricingPage() {
  useEffect(() => { trackViewContent("Pricing", "Pricing"); }, []);
  const { isInternational } = useIsInternational();
  const usdRate = useUsdRate();
  const navigate = useNavigate();
  const [showProSheet, setShowProSheet] = useState(false);

  const handleProClick = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) { navigate("/login?redirect=/pricing"); return; }
    setShowProSheet(true);
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-12 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] mb-5">
            Simple pricing. <span className="text-gradient">Maximum value.</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Start free. Upgrade when you're ready to unlock premium opportunities.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="flex justify-center">
            <SecurityBadges />
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="relative z-10 pb-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={`rounded-2xl border p-6 sm:p-8 flex flex-col relative bg-card ${plan.accent}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-mono text-black bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-1 rounded-full font-bold shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  plan.popular ? "bg-amber-500/10" : "bg-primary/10"
                }`}>
                  <plan.icon className={`h-5 w-5 ${plan.popular ? "text-amber-400" : "text-primary"}`} />
                </div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-bold ${plan.popular ? "text-amber-400" : "text-primary"}`}>
                    {isInternational && plan.priceNum > 0
                      ? `$${(plan.priceNum * usdRate).toFixed(0)}`
                      : plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.popular ? "text-amber-400" : "text-primary"}`} />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((f, j) => (
                    <li key={`no-${j}`} className="flex items-start gap-2 text-sm opacity-40">
                      <span className="h-4 w-4 shrink-0 mt-0.5 text-center">✕</span>
                      <span className="text-muted-foreground line-through">{f}</span>
                    </li>
                  ))}
                </ul>

                {plan.popular ? (
                  <Button onClick={handleProClick} className="w-full h-12 font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-black border-0 shadow-[0_0_20px_rgba(245,166,35,0.3)] gold-shimmer">
                    {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Link to={plan.ctaLink}>
                    <Button className="w-full h-12 font-semibold border-primary/30" variant="outline">
                      {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Single Unlock Pricing */}
      <section className="relative z-10 pb-16 px-4">
        <div className="container max-w-3xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-3xl font-serif font-bold text-center mb-8">
            Or unlock <span className="text-gradient">individual jobs</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
              <p className="text-amber-400 font-semibold mb-1">⭐ Verified Kenya Job</p>
              <p className="text-3xl font-bold text-amber-400 mb-2">KSh 99</p>
              <p className="text-xs text-muted-foreground">Unlock company name, full description & apply link</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 text-center">
              <p className="text-blue-400 font-semibold mb-1">🌍 International Job</p>
              <p className="text-3xl font-bold text-blue-400 mb-2">KSh 199</p>
              <p className="text-xs text-muted-foreground">Unlock company, description, visa details & apply link</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-3xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-3xl font-serif font-bold text-center mb-8">
            Frequently <span className="text-gradient">asked questions</span>
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-5 bg-card">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Guarantee */}
      <section className="relative z-10 py-16 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-10 sm:p-14">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              100% <span className="text-gradient">Satisfaction Guarantee</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Not happy? We'll revise until you are, or refund you. No questions asked.
            </p>
            <Link to="/order">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <SecurityBadges className="mt-6" />
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
