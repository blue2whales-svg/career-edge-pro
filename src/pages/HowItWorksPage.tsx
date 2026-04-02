import { motion } from "framer-motion";
import {
  ArrowRight,
  Upload,
  Pen,
  Download,
  MessageSquare,
  Clock,
  CheckCircle2,
  Sparkles,
  Shield,
  Flame,
  Zap,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const STEPS = [
  {
    num: "01",
    icon: Upload,
    title: "Place Your Order",
    badge: "Takes < 5 minutes",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    desc: "Pick your service, pay via M-Pesa or PayPal, and fill our smart intake form. The more detail you give us, the sharper your document will be.",
    details: [
      "Choose your service or package",
      "Pay securely — M-Pesa or PayPal",
      "Fill your career intake form",
      "Upload your existing CV (if you have one)",
    ],
    color: "text-primary",
    borderColor: "border-primary/20",
    bgColor: "bg-primary/10",
  },
  {
    num: "02",
    icon: Pen,
    title: "Your Specialist Gets to Work",
    badge: "Assigned within 30 min",
    badgeColor: "bg-secondary/10 text-secondary border-secondary/20",
    desc: "A dedicated career specialist — not AI, not a template — researches your industry, studies your target role, and writes every word with purpose.",
    details: [
      "Human writer, not AI-generated",
      "Industry & role research included",
      "ATS compatibility checked",
      "WhatsApp updates as we go",
    ],
    color: "text-secondary",
    borderColor: "border-secondary/20",
    bgColor: "bg-secondary/10",
  },
  {
    num: "03",
    icon: CheckCircle2,
    title: "Review It. Change Anything.",
    badge: "Unlimited revisions",
    badgeColor: "bg-accent/10 text-accent border-accent/20",
    desc: "You'll get a notification the moment your document is ready. Review it in your portal, send feedback, and we revise until it's exactly right.",
    details: [
      "Email & WhatsApp notification",
      "Secure client portal access",
      "Request changes — no limit",
      "Track every revision transparently",
    ],
    color: "text-accent",
    borderColor: "border-accent/20",
    bgColor: "bg-accent/10",
  },
  {
    num: "04",
    icon: Download,
    title: "Download & Go Get That Job",
    badge: "Multiple formats",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    desc: "Download your polished CV, cover letter, or LinkedIn copy — in PDF and Word formats. Apply to jobs in Kenya, the Gulf, UK, or wherever you're headed.",
    details: [
      "PDF & Word formats included",
      "LinkedIn-ready copy delivered",
      "Lifetime portal access to your files",
      "Apply with full confidence",
    ],
    color: "text-primary",
    borderColor: "border-primary/20",
    bgColor: "bg-primary/10",
  },
];

const PROMISES = [
  {
    icon: Clock,
    title: "Same-Day Delivery",
    desc: "Most orders done within hours — not days. We know you can't wait.",
  },
  {
    icon: Shield,
    title: "Satisfaction Guaranteed",
    desc: "Unlimited revisions. We don't stop until you're 100% happy.",
  },
  { icon: Phone, title: "WhatsApp Support", desc: "Direct line to your specialist. No tickets, no bots." },
  {
    icon: Sparkles,
    title: "100% Human-Written",
    desc: "Real career specialists. Every word intentional, every format strategic.",
  },
];

const FAQS = [
  {
    q: "How long does delivery actually take?",
    a: "Most orders are delivered same day — often within 3–6 hours. For complex orders like executive CVs or scholarship essays, it may take up to 24 hours. You'll always be updated via WhatsApp.",
  },
  {
    q: "Do I need to have an existing CV?",
    a: "No. Many clients come to us with nothing. Our intake form is designed to extract everything your specialist needs to build your document from scratch.",
  },
  {
    q: "What if I'm not happy with the result?",
    a: "Request a revision — as many times as you need. We don't consider an order complete until you're satisfied. This is our promise, not a policy buried in fine print.",
  },
  {
    q: "Is it really written by a human?",
    a: "Yes. Every document is written by a career specialist who has reviewed thousands of CVs and knows what recruiters in your target industry look for.",
  },
  {
    q: "Can you write for jobs outside Kenya?",
    a: "Absolutely. We write for clients targeting the Gulf (UAE, Saudi, Qatar), UK, EU, Cruise Lines, Canada, and beyond. Just select the International CV option or mention your target country.",
  },
];

export default function HowItWorksPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6"
          >
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary">Same-day delivery available</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] mb-5"
          >
            Four steps.
            <br />
            <span className="text-gradient">One career-changing document.</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            No back-and-forth. No guesswork. Just place your order, and let our specialists handle the rest — while you
            focus on preparing for your interview.
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
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
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
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <div className="flex items-center gap-3 sm:hidden">
                        <span className="text-2xl font-serif font-bold text-muted/50">{step.num}</span>
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    </div>
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
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-2xl sm:text-4xl font-serif font-bold text-center mb-3"
          >
            Our <span className="text-gradient">promises</span> to you
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-muted-foreground text-center text-sm mb-10 max-w-xl mx-auto"
          >
            Not marketing copy — these are the standards every order is held to.
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PROMISES.map((p, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
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

      {/* FAQ */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-3xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-2xl sm:text-4xl font-serif font-bold text-center mb-10"
          >
            Questions we get <span className="text-gradient">all the time</span>
          </motion.h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-xl border border-border bg-card p-5 sm:p-6"
              >
                <div className="flex gap-3 items-start">
                  <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base mb-1">{faq.q}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-10 sm:p-14"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">The job is already out there.</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              It takes less than 5 minutes to submit your order. Your specialist starts immediately. Most clients have
              their document before end of day.
            </p>
            <Link to="/order">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer"
              >
                Start Your Order <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">M-Pesa · PayPal · Same-day delivery</p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
