import { motion } from "framer-motion";
import {
  ArrowRight, Globe, Users, Award, Clock, Heart, Target,
  Sparkles, Shield, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import cvedgeLogo from "@/assets/cvedge-logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const VALUES = [
  { icon: Heart, title: "Client-First", desc: "Every decision we make starts with: does this make our client's life better?" },
  { icon: Sparkles, title: "Excellence", desc: "We don't do 'good enough.' Every document is crafted to the highest standard." },
  { icon: Zap, title: "Speed", desc: "Your career can't wait. Same-day delivery is our standard, not our exception." },
  { icon: Globe, title: "Global Reach", desc: "We serve clients in 90+ countries with market-specific expertise." },
  { icon: Shield, title: "Integrity", desc: "Transparent pricing, honest timelines, and genuine career advice." },
  { icon: Target, title: "Results", desc: "We measure success by your success — interviews, offers, scholarships won." },
];

const STATS = [
  { value: "12,000+", label: "Documents Delivered" },
  { value: "90+", label: "Countries Served" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "< 6hrs", label: "Average Delivery" },
];

const TEAM = [
  { role: "CV Specialists", count: "8+", desc: "Industry-specific career writers" },
  { role: "Scholarship Experts", count: "4+", desc: "Former scholarship reviewers" },
  { role: "Executive Writers", count: "3+", desc: "C-suite level expertise" },
  { role: "Quality Reviewers", count: "2+", desc: "Final human review layer" },
];

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0}
                className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-[1.08] mb-5"
              >
                Your career's{" "}
                <span className="text-gradient">secret weapon</span>.
              </motion.h1>
              <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}
                className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed"
              >
                CVEdge is a global career document agency trusted by professionals, executives, and scholars in 90+ countries. We don't just write CVs — we craft career-defining documents that open doors.
              </motion.p>
              <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
                className="text-base text-muted-foreground mb-8 leading-relaxed"
              >
                Founded with a simple belief: everyone deserves a document that represents the best version of their professional story. Today, we've delivered over 12,000 documents and counting.
              </motion.p>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                <Link to="/order">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-8 shadow-glow gold-shimmer">
                    Work With Us <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl bg-gradient-brand-subtle border border-primary/20 flex items-center justify-center shadow-glow">
                  <img src={cvedgeLogo} alt="CVEdge" className="w-32 h-32 sm:w-44 sm:h-44 object-contain rounded-full" />
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
                  <div className="text-2xl font-bold text-primary">12K+</div>
                  <div className="text-xs text-muted-foreground">Documents delivered</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-12 px-4 border-y border-border/50">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="text-3xl sm:text-4xl font-bold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative z-10 py-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-4xl font-serif font-bold text-center mb-12"
          >
            What drives <span className="text-gradient">everything we do</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
              >
                <v.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-4xl font-serif font-bold text-center mb-10"
          >
            Our <span className="text-gradient">specialist team</span>
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TEAM.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-xl border border-border bg-card p-5 text-center"
              >
                <div className="text-3xl font-bold text-primary mb-1">{t.count}</div>
                <h4 className="font-semibold text-sm mb-1">{t.role}</h4>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-10 sm:p-14"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Ready to experience the <span className="text-gradient">CVEdge difference</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join 12,000+ professionals who've trusted us with their most important career documents.
            </p>
            <Link to="/order">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer">
                Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
