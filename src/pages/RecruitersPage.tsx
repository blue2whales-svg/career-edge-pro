import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const PLANS = [
  {
    name: "Basic Post",
    price: "KSh 3,000",
    pkg: "recruiter-basic",
    features: ["Single job listing", "30-day visibility", "Standard placement"],
    popular: false,
  },
  {
    name: "Featured Post",
    price: "KSh 10,000",
    pkg: "recruiter-featured",
    features: ["Featured placement (top of listings)", 'Gold "Featured" badge', "60-day visibility", "Social media promotion"],
    popular: true,
  },
  {
    name: "Recruiter Pro",
    price: "KSh 25,000/mo",
    pkg: "recruiter-pro",
    features: ["Unlimited job postings", "CV database search access", "Save & shortlist candidates", "Dedicated account support"],
    popular: false,
  },
];

export default function RecruitersPage() {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("recruiter-featured");

  return (
    <PageLayout>
      <MpesaPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage={selectedPkg} />
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-mono text-primary">For Employers & Recruiters</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-6xl font-serif font-bold mb-5">
            Hire Africa's <span className="text-gradient">Best Talent</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Post jobs to 10,000+ active job seekers across Kenya and Africa
          </motion.p>
        </div>
      </section>

      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={`rounded-2xl border p-6 sm:p-8 flex flex-col relative ${plan.popular ? "bg-gradient-brand-subtle border-primary shadow-glow" : "bg-card border-border"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-mono text-primary-foreground bg-gradient-brand px-4 py-1 rounded-full font-semibold">⭐ Popular</span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold text-primary mb-4">{plan.price}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => { setSelectedPkg(plan.pkg); setPaymentOpen(true); }}
                  className={`w-full h-12 font-semibold ${plan.popular ? "bg-gradient-brand border-0 gold-shimmer" : ""}`}
                  variant={plan.popular ? "default" : "outline"}>
                  {plan.name === "Recruiter Pro" ? "Start Recruiting" : "Post a Job"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
