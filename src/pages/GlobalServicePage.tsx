import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";
import { trackViewContent } from "@/hooks/useFbPixel";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const FEATURES = [
  "Complete CV optimization",
  "Tailored cover letter per application",
  "Targeted job search (25 positions)",
  "Full application submission on your behalf",
  "Interview scheduling support",
  "Weekly progress reports",
  "90-day service period",
];

export default function GlobalServicePage() {
  useEffect(() => { trackViewContent("Global Assistance", "Services"); }, []);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <PageLayout>
      <MpesaPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage="global" />
      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <Globe className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs font-mono text-yellow-500">Premium Service</span>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-6xl font-serif font-bold mb-5">
            Global Job Application <span className="text-gradient">Assistance</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-muted-foreground max-w-xl mx-auto mb-10">
            Let our expert team handle your entire job search — from CV to application submission
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="rounded-2xl p-8 sm:p-10 max-w-lg mx-auto text-left"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(59,130,246,0.08))",
              border: "1px solid rgba(245,158,11,0.3)",
            }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-500 border border-yellow-500/30 font-semibold">🌍 Premium</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Global Application Assistance</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-primary">KSh 20,000</span>
              <span className="text-muted-foreground text-sm">– 30,000</span>
            </div>

            <ul className="space-y-3 mb-8">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <Button onClick={() => setPaymentOpen(true)} className="w-full h-12 font-bold text-base border-0 bg-gradient-brand gold-shimmer">
              Apply for Global Assistance <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
