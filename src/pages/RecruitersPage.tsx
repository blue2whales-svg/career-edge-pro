import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Star, Users, ArrowRight, Briefcase, MessageSquare, Calendar, Building2, Zap, Send, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageLayout from "@/components/PageLayout";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";
import { trackViewContent } from "@/hooks/useFbPixel";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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

const STATS = [
  { value: "10,000+", label: "Active candidates" },
  { value: "200+", label: "Live jobs" },
  { value: "24hr", label: "Average response" },
  { value: "3", label: "Talent markets" },
];

const STEPS = [
  { num: "01", title: "Pay & post your job", desc: "Secure M-Pesa payment. Your listing goes live in minutes.", icon: Zap, color: "text-primary" },
  { num: "02", title: "Receive applications", desc: "Candidates apply directly from the platform to your inbox.", icon: Send, color: "text-emerald-500" },
  { num: "03", title: "Review & hire", desc: "Shortlist, message, and schedule interviews on your dashboard.", icon: UserCheck, color: "text-secondary" },
];

const COMPARISON_ROWS = [
  { feature: "Job listings", basic: "1", featured: "1", pro: "Unlimited" },
  { feature: "Listing duration", basic: "30 days", featured: "60 days", pro: "Monthly" },
  { feature: "Placement", basic: "Standard", featured: "Top of results", pro: "Top of results" },
  { feature: "Featured badge", basic: false, featured: true, pro: true },
  { feature: "Social media promotion", basic: false, featured: true, pro: true },
  { feature: "View applicants", basic: true, featured: true, pro: true },
  { feature: "Shortlist candidates", basic: false, featured: true, pro: true },
  { feature: "Reject with note", basic: false, featured: true, pro: true },
  { feature: "In-app messaging", basic: false, featured: false, pro: true },
  { feature: "Interview scheduling", basic: false, featured: false, pro: true },
  { feature: "CV database access", basic: false, featured: false, pro: true },
  { feature: "Dedicated support", basic: false, featured: false, pro: true },
];

const PLACEHOLDER_COMPANIES = [
  { name: "Safaricom PLC", plan: "Pro", jobs: 12 },
  { name: "KCB Group", plan: "Featured", jobs: 8 },
  { name: "Equity Bank", plan: "Pro", jobs: 15 },
  { name: "Aga Khan Hospital", plan: "Featured", jobs: 5 },
  { name: "DHL Kenya", plan: "Basic", jobs: 3 },
  { name: "Marriott Nairobi", plan: "Featured", jobs: 6 },
];

const TRUST_LOGOS = ["S", "K", "E", "A", "D"];

function CompanyInitials({ name, className = "" }: { name: string; className?: string }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2);
  return (
    <div className={`flex items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30 font-bold text-primary ${className}`}>
      {initials}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    Pro: "bg-primary/20 text-primary border-primary/30",
    Featured: "bg-muted text-muted-foreground border-border",
    Basic: "bg-muted/50 text-muted-foreground border-border",
  };
  return <Badge variant="outline" className={`text-[10px] font-mono ${styles[plan] || styles.Basic}`}>{plan}</Badge>;
}

export default function RecruitersPage() {
  useEffect(() => { trackViewContent("Recruiters", "Employers"); }, []);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("recruiter-featured");
  const [employers, setEmployers] = useState<typeof PLACEHOLDER_COMPANIES>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase.from("employer_profiles").select("company_name, plan_pkg, user_id");
      if (profiles && profiles.length > 0) {
        const cards = await Promise.all(profiles.slice(0, 6).map(async (p) => {
          const { count } = await supabase.from("job_postings").select("id", { count: "exact", head: true }).eq("employer_id", p.user_id).eq("status", "active");
          return { name: p.company_name || "Company", plan: p.plan_pkg === "recruiter-pro" ? "Pro" : p.plan_pkg === "recruiter-featured" ? "Featured" : "Basic", jobs: count || 0 };
        }));
        setEmployers(cards);
      } else {
        setEmployers(PLACEHOLDER_COMPANIES);
      }
    })();
  }, []);

  const openPayment = (pkg: string) => { setSelectedPkg(pkg); setPaymentOpen(true); };

  return (
    <PageLayout>
      <MpesaPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage={selectedPkg} />

      {/* Trust Bar */}
      <section className="relative z-10 pt-10 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-center mb-4">
            <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase mb-4">Trusted by 500+ companies across Kenya &amp; Africa</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {TRUST_LOGOS.map((letter, i) => (
                <div key={i} className="w-14 h-10 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-sm font-bold text-muted-foreground">{letter}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero */}
      <section className="relative z-10 pt-8 sm:pt-16 pb-10 px-4">
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
            className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Post jobs to 10,000+ active job seekers across Kenya and Africa
          </motion.p>

          {/* Stat counters */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold text-primary font-mono">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards — UNTOUCHED LOGIC */}
      <section className="relative z-10 pb-16 px-4">
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
                <Button onClick={() => openPayment(plan.pkg)}
                  className={`w-full h-12 font-semibold ${plan.popular ? "bg-gradient-brand border-0 gold-shimmer" : ""}`}
                  variant={plan.popular ? "default" : "outline"}>
                  {plan.name === "Recruiter Pro" ? "Start Recruiting" : "Post a Job"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 pb-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-3xl font-serif font-bold text-center mb-12">How it works</motion.h2>
          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* dashed connector line desktop */}
            <div className="hidden sm:block absolute top-12 left-[17%] right-[17%] border-t-2 border-dashed border-border" />
            {STEPS.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-2xl border border-border bg-card p-6 text-center relative z-10">
                <div className={`text-3xl font-bold font-mono ${step.color} mb-3`}>{step.num}</div>
                <step.icon className={`h-8 w-8 mx-auto mb-3 ${step.color}`} />
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="relative z-10 pb-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-3xl font-serif font-bold text-center mb-10">Plan Comparison</motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-mono text-xs">Feature</th>
                    <th className="p-4 text-center text-muted-foreground font-mono text-xs">Basic</th>
                    <th className="p-4 text-center font-mono text-xs text-primary bg-primary/5 border-x border-primary/10">Featured</th>
                    <th className="p-4 text-center text-muted-foreground font-mono text-xs">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={i} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                      <td className="p-4 text-foreground">{row.feature}</td>
                      {(["basic", "featured", "pro"] as const).map((tier) => {
                        const val = row[tier];
                        const isFeatured = tier === "featured";
                        return (
                          <td key={tier} className={`p-4 text-center ${isFeatured ? "bg-primary/5 border-x border-primary/10" : ""}`}>
                            {typeof val === "boolean"
                              ? val ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <span className="text-muted-foreground">—</span>
                              : <span className="font-medium">{val}</span>
                            }
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Employer Cards */}
      <section className="relative z-10 pb-20 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-3xl font-serif font-bold mb-3">Companies hiring on CV Edge right now</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-muted-foreground mb-10">Join hundreds of employers finding great talent</motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {employers.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-2xl border border-border bg-card p-5 flex flex-col items-center gap-3">
                <CompanyInitials name={c.name} className="w-14 h-14 text-lg" />
                <h4 className="font-bold text-sm">{c.name}</h4>
                <PlanBadge plan={c.plan} />
                <p className="text-xs text-muted-foreground">{c.jobs} active job{c.jobs !== 1 ? "s" : ""}</p>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate(`/jobs?company=${encodeURIComponent(c.name)}`)}>
                  View Jobs
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard CTA */}
      <section className="relative z-10 pb-10 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-serif font-bold mb-2">Already have a plan?</h3>
              <p className="text-sm text-muted-foreground">Manage your postings, review applicants, shortlist candidates, and schedule interviews from your dashboard.</p>
            </div>
            <Button size="lg" className="h-12 font-semibold shrink-0 gap-2" variant="outline" onClick={() => navigate("/employer-dashboard")}>
              <Briefcase className="h-4 w-4" /> Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 pb-16 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-2xl border border-primary/20 bg-card p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">Ready to find your next great hire?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join 500+ companies posting jobs on CV Edge. Pay via M-Pesa. Live in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="outline" size="lg" className="h-12 font-semibold" onClick={() => openPayment("recruiter-basic")}>
                Post a Job — KSh 3,000
              </Button>
              <Button size="lg" className="h-12 font-semibold bg-gradient-brand border-0 gold-shimmer" onClick={() => openPayment("recruiter-featured")}>
                Get Featured — KSh 10,000 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
