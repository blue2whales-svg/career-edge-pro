import { motion } from "framer-motion";
import {
  ArrowRight, Upload, Pen, Download, MessageSquare, Clock,
  CheckCircle2, Sparkles, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const STEPS = [
  {
    num: "01",
    icon: Upload,
    title: "Submit Your Order",
    desc: "Fill our smart intake form with your career details, upload your existing CV (if you have one), and share the job or scholarship details you're targeting.",
    details: ["Choose your service & package", "Upload existing documents", "Share target role/scholarship", "Add special instructions"],
    color: "text-primary",
    borderColor: "border-primary/20",
    bgColor: "bg-primary/10",
  },
  {
    num: "02",
    icon: Pen,
    title: "We Craft Your Document",
    desc: "Your dedicated specialist builds your document to the highest professional standard. Every word is intentional, every format decision strategic.",
    details: ["Assigned specialist within 30 min", "Research your industry & target", "Write & optimise content", "ATS compatibility check"],
    color: "text-secondary",
    borderColor: "border-secondary/20",
    bgColor: "bg-secondary/10",
  },
  {
    num: "03",
    icon: CheckCircle2,
    title: "Review & Revise",
    desc: "Receive your document, review it carefully, and request any changes. We don't stop until you're 100% satisfied.",
    details: ["Email notification when ready", "Review in your client portal", "Request revisions if needed", "Track changes transparently"],
    color: "text-accent",
    borderColor: "border-accent/20",
    bgColor: "bg-accent/10",
  },
  {
    num: "04",
    icon: Download,
    title: "Download & Apply",
    desc: "Download your polished documents in multiple formats and start applying with confidence. Your career advantage is ready.",
    details: ["PDF, Word & LinkedIn formats", "Download from your portal", "Apply with confidence", "Lifetime access to files"],
    color: "text-primary",
    borderColor: "border-primary/20",
    bgColor: "bg-primary/10",
  },
];

const PROMISES = [
  { icon: Clock, title: "Same-Day Delivery", desc: "Most orders delivered within hours, not days." },
  { icon: Shield, title: "Satisfaction Guaranteed", desc: "Unlimited revisions until you're happy." },
  { icon: MessageSquare, title: "Direct Communication", desc: "Chat with your specialist via WhatsApp." },
  { icon: Sparkles, title: "Human-Crafted", desc: "Every document written by career specialists." },
];

export default function HowItWorksPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] mb-5"
          >
            Simple process.{" "}
            <span className="text-gradient">Exceptional results.</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            From submission to download, we've streamlined every step so you can focus on what matters — your career.
          </motion.p>
        </div>
      </section>

      {/* Steps */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={`rounded-2xl border ${step.borderColor} bg-card p-6 sm:p-8`}
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="shrink-0">
                    <div className={`w-14 h-14 rounded-2xl ${step.bgColor} flex items-center justify-center`}>
                      <step.icon className={`h-7 w-7 ${step.color}`} />
                    </div>
                    <div className="text-4xl font-serif font-bold text-muted/50 mt-2 hidden sm:block">{step.num}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 sm:hidden">
                      <span className="text-2xl font-serif font-bold text-muted/50">{step.num}</span>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    <h3 className="text-xl font-bold mb-2 hidden sm:block">{step.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{step.desc}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {step.details.map((d, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className={`h-3.5 w-3.5 ${step.color} shrink-0`} />
                          <span className="text-muted-foreground">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-4xl font-serif font-bold text-center mb-10"
          >
            Our <span className="text-gradient">promises</span> to you
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PROMISES.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-xl border border-border bg-card p-5 text-center"
              >
                <p.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-sm mb-1">{p.title}</h4>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
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
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              It takes less than 5 minutes to submit your order. Your specialist starts working immediately.
            </p>
            <Link to="/order">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer">
                Start Your Order <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
