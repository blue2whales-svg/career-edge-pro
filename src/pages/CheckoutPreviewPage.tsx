import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard, Smartphone, Building, ArrowRight, Check, Globe,
  MapPin, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

type PaymentMethod = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  recommended?: boolean;
  tag?: string;
};

const KENYA_METHODS: PaymentMethod[] = [
  {
    id: "mpesa",
    label: "M-Pesa",
    description: "Pay instantly with your Safaricom number",
    icon: <Smartphone className="h-5 w-5 text-emerald-500" />,
    recommended: true,
    tag: "Most popular in Kenya",
  },
  {
    id: "card-ke",
    label: "Debit / Credit Card",
    description: "Visa, Mastercard via Paystack",
    icon: <CreditCard className="h-5 w-5 text-primary" />,
  },
  {
    id: "bank-ke",
    label: "Bank Transfer",
    description: "Pay via mobile banking or USSD",
    icon: <Building className="h-5 w-5 text-muted-foreground" />,
  },
];

const US_METHODS: PaymentMethod[] = [
  {
    id: "card-us",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex via Stripe",
    icon: <CreditCard className="h-5 w-5 text-primary" />,
    recommended: true,
    tag: "Most popular in the US",
  },
  {
    id: "apple-pay",
    label: "Apple Pay",
    description: "Quick checkout with Apple Pay",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-foreground" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
  },
  {
    id: "google-pay",
    label: "Google Pay",
    description: "Fast, secure Google Pay checkout",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.86 3.18-1.82 4.12-1.16 1.16-2.96 2.44-6.02 2.44-4.8 0-8.56-3.88-8.56-8.68S7.68 3.4 12.48 3.4c2.6 0 4.48.92 5.88 2.24l2.36-2.36C18.56 1.18 15.98 0 12.48 0 5.8 0 .32 5.16.32 11.84s5.48 11.84 12.16 11.84c3.56 0 6.24-1.16 8.36-3.36 2.16-2.16 2.84-5.2 2.84-7.64 0-.76-.04-1.44-.16-2.04H12.48v.28z" className="fill-muted-foreground" />
      </svg>
    ),
  },
];

function CheckoutMockup({
  region,
  flag,
  currency,
  amount,
  methods,
  color,
}: {
  region: string;
  flag: string;
  currency: string;
  amount: string;
  methods: PaymentMethod[];
  color: string;
}) {
  const [selected, setSelected] = useState(methods[0]?.id);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 ${color} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{flag}</span>
          <div>
            <p className="font-semibold text-sm text-foreground">{region}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Auto-detected
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-bold text-primary">{currency}{amount}</p>
        </div>
      </div>

      {/* Order summary mini */}
      <div className="px-6 py-3 border-b border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Professional CV</span>
          <span>{currency}49</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">Cover Letter</span>
          <span>{currency}29</span>
        </div>
      </div>

      {/* Payment methods */}
      <div className="p-6">
        <p className="text-sm font-semibold mb-3">Choose payment method</p>
        <div className="space-y-2.5">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`w-full rounded-xl border p-4 flex items-center gap-3 text-left transition-all duration-200 ${
                selected === m.id
                  ? "border-primary bg-primary/5 shadow-glow-sm"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                {m.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{m.label}</span>
                  {m.recommended && (
                    <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-mono text-primary">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                {m.tag && selected === m.id && (
                  <p className="text-[10px] text-primary mt-1 font-mono">{m.tag}</p>
                )}
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selected === m.id ? "border-primary bg-primary" : "border-border"
              }`}>
                {selected === m.id && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
            </button>
          ))}
        </div>

        {/* M-Pesa phone input mockup */}
        {selected === "mpesa" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
          >
            <p className="text-sm font-medium text-emerald-400 mb-2">Enter M-Pesa Number</p>
            <div className="flex gap-2">
              <div className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground w-16 text-center">
                +254
              </div>
              <div className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground flex-1">
                7XX XXX XXX
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              You'll receive an STK push on your phone to confirm payment
            </p>
          </motion.div>
        )}

        {/* Card input mockup */}
        {(selected === "card-us" || selected === "card-ke") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3"
          >
            <div className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground">
              4242 •••• •••• ••••
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground">
                MM / YY
              </div>
              <div className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground">
                CVC
              </div>
            </div>
          </motion.div>
        )}

        {/* Apple / Google Pay mockup */}
        {(selected === "apple-pay" || selected === "google-pay") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4"
          >
            <Button className="w-full h-12 bg-foreground text-background font-semibold rounded-xl">
              {selected === "apple-pay" ? " Pay" : "Pay with Google"}
            </Button>
          </motion.div>
        )}

        {/* Pay button */}
        {selected !== "apple-pay" && selected !== "google-pay" && (
          <Button className="w-full h-12 bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer mt-4">
            Pay {currency}{amount} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}

        {/* Override */}
        <div className="mt-4 pt-4 border-t border-border">
          <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full justify-center">
            <Globe className="h-3 w-3" />
            Not in {region}? Change payment region
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPreviewPage() {
  return (
    <PageLayout>
      <section className="relative z-10 pt-16 sm:pt-24 pb-10 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6"
          >
            <CreditCard className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-mono text-primary">Checkout Preview</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-3xl sm:text-5xl font-serif font-bold leading-[1.08] mb-5"
          >
            Smart checkout.{" "}
            <span className="text-gradient">Local payment methods.</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-base text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            We auto-detect your location and show the most relevant payment method. Users can always switch manually.
          </motion.p>
        </div>
      </section>

      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🇰🇪</span>
                <p className="text-sm font-semibold">User in Nairobi, Kenya</p>
              </div>
              <CheckoutMockup
                region="Kenya"
                flag="🇰🇪"
                currency="KES "
                amount="7,800"
                methods={KENYA_METHODS}
                color="bg-emerald-500/5 border-b border-emerald-500/10"
              />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🇺🇸</span>
                <p className="text-sm font-semibold">User in New York, USA</p>
              </div>
              <CheckoutMockup
                region="United States"
                flag="🇺🇸"
                currency="$"
                amount="78"
                methods={US_METHODS}
                color="bg-blue-500/5 border-b border-blue-500/10"
              />
            </motion.div>
          </div>

          {/* How it works */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="mt-16 rounded-2xl border border-border bg-card p-8 sm:p-10"
          >
            <h2 className="text-2xl font-serif font-bold mb-6 text-center">How it works</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Auto-detect location",
                  desc: "We use IP geolocation to identify the user's country and show the correct currency + payment methods.",
                },
                {
                  step: "2",
                  title: "Show local methods first",
                  desc: "M-Pesa in Kenya, Stripe in the US, Tap Payments in the Gulf — the best option is always recommended.",
                },
                {
                  step: "3",
                  title: "Manual override",
                  desc: "Users can switch payment region if traveling or using a VPN. Full flexibility.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-3">
                    <span className="text-sm font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
