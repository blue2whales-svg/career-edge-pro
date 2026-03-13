import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const BENEFITS = [
  "Unlimited CV edits & generations",
  "Unlimited ATS scans",
  "Priority job alerts by email",
  "Interview preparation tools",
  "Saved job matches",
  "Document vault (unlimited storage)",
  "Cover letter generator (unlimited)",
  "Early access to new features",
];

export default function ProPage() {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const isPro = localStorage.getItem("cvedge_pro") === "true";

  return (
    <PageLayout>
      <MpesaPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage="pro-monthly" />
      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <Star className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs font-mono text-yellow-500">Premium Membership</span>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-6xl font-serif font-bold mb-5">
            CVEdge <span className="text-gradient">Pro</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-muted-foreground max-w-lg mx-auto mb-10">
            Unlock unlimited access to all CVEdge tools. Build, scan, and optimize without limits.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="rounded-2xl p-8 sm:p-10 max-w-md mx-auto"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(6,182,212,0.12))",
              border: "1px solid rgba(6,182,212,0.3)",
            }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-lg">CVEdge Pro</span>
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-4xl font-bold text-primary">KSh 2,000</span>
              <span className="text-muted-foreground text-sm">/ month</span>
            </div>

            <ul className="space-y-3 text-left mb-8">
              {BENEFITS.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>

            {isPro ? (
              <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4 text-center">
                <p className="text-green-400 font-semibold text-sm">✅ You're a Pro member!</p>
              </div>
            ) : (
              <Button onClick={() => setPaymentOpen(true)} className="w-full h-12 font-bold text-base border-0 bg-gradient-brand gold-shimmer">
                <Zap className="h-4 w-4 mr-2" /> Upgrade to Pro — KSh 2,000/month
              </Button>
            )}

            <p className="text-xs text-muted-foreground mt-4">Cancel anytime. No long-term commitment.</p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
