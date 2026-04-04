import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap, Crown, Star, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";
import { trackViewContent } from "@/hooks/useFbPixel";
import { useProPlan } from "@/hooks/useProPlan";

const PLANS = [
  {
    id: "job-seeker-pro",
    name: "Job Seeker Pro",
    monthlyPrice: 1000,
    yearlyPrice: 9600,
    yearlyMonthly: 800,
    icon: Star,
    popular: true,
    mpesaPackage: "pro-monthly",
    features: [
      "Unlimited CV downloads",
      "All premium templates",
      "ATS score reports",
      "Priority job alerts by email",
      "Application tracker",
      "Cover letter generator",
      "Document vault storage",
    ],
  },
  {
    id: "pro-plus",
    name: "Pro Plus",
    monthlyPrice: 2000,
    yearlyPrice: 19200,
    yearlyMonthly: 1600,
    icon: Crown,
    popular: false,
    mpesaPackage: "pro-plus",
    features: [
      "Everything in Job Seeker Pro",
      "LinkedIn profile optimization",
      "Interview preparation tools",
      "Expert CV review (monthly)",
      "Priority support",
      "Early access to new features",
      "Unlimited revisions",
      "Dedicated career advisor",
    ],
  },
];

export default function SubscribePage() {
  useEffect(() => { trackViewContent("Subscribe", "Subscription"); }, []);

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("pro-monthly");
  const { isPro, loading } = useProPlan();

  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });

  const handleSubscribe = (plan: typeof PLANS[0]) => {
    const pkg = billingCycle === "yearly"
      ? `${plan.mpesaPackage}-yearly`
      : plan.mpesaPackage;
    setSelectedPkg(pkg);
    setPaymentOpen(true);
  };

  return (
    <PageLayout>
      <MpesaPaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        defaultPackage={selectedPkg}
      />

      <section className="relative z-10 pt-16 sm:pt-24 pb-8 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 bg-primary/10 border border-primary/20"
          >
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Subscription Plans
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-bold mb-4"
          >
            Unlimited access. <span className="text-gradient">One price.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mb-8 max-w-lg mx-auto"
          >
            Stop paying per CV. Get unlimited downloads, job alerts, and career tools for one monthly fee.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center rounded-full border border-border bg-muted/50 p-1 mb-10"
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all relative ${
                billingCycle === "yearly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                -20%
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section ref={cardRef} className="relative z-10 pb-24 px-4">
        <div className="container max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {PLANS.map((plan, i) => {
              const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyMonthly;
              const totalYearly = plan.yearlyPrice;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className={`rounded-2xl border p-6 sm:p-8 flex flex-col relative ${
                    plan.popular
                      ? "border-primary shadow-glow bg-gradient-brand-subtle"
                      : "border-border bg-card"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="text-xs font-mono text-primary-foreground bg-gradient-brand px-4 py-1 rounded-full font-semibold shadow-glow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <plan.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                  </div>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-primary">
                      KSh {price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>

                  {billingCycle === "yearly" && (
                    <p className="text-xs text-muted-foreground mb-1">
                      KSh {totalYearly.toLocaleString()}/year · Save KSh {((plan.monthlyPrice * 12) - totalYearly).toLocaleString()}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground mb-6">
                    {billingCycle === "monthly" ? "Billed monthly · Cancel anytime" : "Billed annually · Cancel anytime"}
                  </p>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {isPro ? (
                    <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-center">
                      <p className="text-sm font-medium text-green-400">
                        ✅ You're subscribed
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      className={`w-full h-12 font-semibold ${
                        plan.popular
                          ? "bg-gradient-brand border-0 shadow-glow gold-shimmer"
                          : "border-primary/30"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Subscribe Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Comparison with one-time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8 text-center"
          >
            <h3 className="text-lg font-serif font-bold mb-2">Not ready for a subscription?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You can still buy a single CV starting at KES 1,200. No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="border-primary/30" asChild>
                <a href="/templates">Build a Free CV (with watermark)</a>
              </Button>
              <Button variant="outline" className="border-primary/30" asChild>
                <a href="/pricing">See One-Time Pricing</a>
              </Button>
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Shield className="h-3 w-3" /> Secure M-Pesa & PayPal
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Shield className="h-3 w-3" /> Cancel anytime
            </span>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
