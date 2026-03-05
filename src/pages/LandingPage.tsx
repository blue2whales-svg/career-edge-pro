import { useState } from "react";
import { motion } from "framer-motion";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import {
  FileText,
  BarChart3,
  FolderOpen,
  Zap,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const FEATURES = [
  {
    icon: FileText,
    title: "AI Cover Letters",
    desc: "Paste a job URL — get a tailored, compelling cover letter in seconds. Powered by GPT-4o.",
  },
  {
    icon: BarChart3,
    title: "Application Tracking",
    desc: "Kanban-style board to track every application from Applied to Offer. Never lose track again.",
  },
  {
    icon: FolderOpen,
    title: "Document Vault",
    desc: "Store CVs, cover letters, and portfolios. Version history. One-click download.",
  },
  {
    icon: Zap,
    title: "Zapier Agents",
    desc: "Automate follow-ups, sync to Google Sheets, get deadline alerts. Your unfair advantage.",
  },
];

const PAIN_POINTS = [
  { icon: XCircle, text: "You apply to 50 jobs and hear back from 2." },
  { icon: Clock, text: "You lose track of deadlines and follow-ups." },
  { icon: XCircle, text: "Every cover letter takes 45 minutes to write." },
];

const TESTIMONIALS = [
  {
    name: "Amara O.",
    location: "Lagos, Nigeria",
    text: "CVEdge helped me land interviews at 3 FAANG companies. The AI cover letters are insane — I went from 2% response rate to 38%.",
    role: "Software Engineer",
  },
  {
    name: "James W.",
    location: "London, UK",
    text: "The Kanban board and Zapier automations saved me hours every week. I got an offer 3 weeks after signing up.",
    role: "Product Manager",
  },
  {
    name: "Priya S.",
    location: "Bangalore, India",
    text: "I was drowning in spreadsheets. CVEdge gave me clarity and confidence. Received 5 interview calls in my first month.",
    role: "Data Analyst",
  },
];

const STATS = [
  { value: "34,000+", label: "Applications Tracked" },
  { value: "180+", label: "Countries" },
  { value: "38%", label: "Avg Response Rate" },
  { value: "4,200+", label: "Offers Received" },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid + orbs */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-orb pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] animate-orb pointer-events-none" style={{ animationDelay: "-4s" }} />

      {/* Nav */}
      <nav className="relative z-10 border-b border-border/50 surface-glass">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <span className="text-sm font-bold text-background">CE</span>
            </div>
            <span className="font-bold text-lg">CVEdge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-brand border-0 font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 mb-8"
          >
            <span className="text-xs font-mono text-primary">NEW</span>
            <span className="text-xs text-muted-foreground">Zapier Agents now available</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-5xl sm:text-7xl font-extrabold leading-[1.05] mb-6"
          >
            Your Career's{" "}
            <span className="text-gradient">Secret Weapon</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Track every application, generate AI-powered cover letters, and automate your job search.
            The platform that gives you an unfair advantage.
          </motion.p>

          <motion.form
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8"
          >
            {!submitted ? (
              <>
                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/50 border-border h-12 text-base"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-brand border-0 font-semibold h-12 px-8 shrink-0 shadow-glow"
                >
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-primary mx-auto">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">You're on the list! We'll be in touch.</span>
              </div>
            )}
          </motion.form>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="max-w-lg mx-auto"
          >
            <LiveActivityFeed />
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
          >
            Job searching is <span className="text-gradient">broken</span>.
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
          >
            You deserve better tools than a messy spreadsheet and copy-pasted cover letters.
          </motion.p>
          <div className="grid sm:grid-cols-3 gap-4">
            {PAIN_POINTS.map((p, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <p.icon className="h-8 w-8 text-destructive mx-auto mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
          >
            Everything you need to{" "}
            <span className="text-gradient">win</span>.
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
          >
            Four powerful tools working together to supercharge your job search.
          </motion.p>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
                className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-brand-subtle flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zapier Callout */}
      <section className="relative z-10 py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-8 sm:p-12 text-center"
          >
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Automation is your unfair advantage.
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
              Zapier Agents handle follow-ups, sync your data to Google Sheets, and notify you
              before deadlines expire — while you sleep.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-brand border-0 font-semibold shadow-glow">
                Start Automating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 py-12 px-4 border-y border-border">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
          >
            Loved by job seekers <span className="text-gradient">worldwide</span>.
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role} · {t.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 px-4">
        <div className="container max-w-xl mx-auto text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Ready to get your <span className="text-gradient">edge</span>?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-muted-foreground mb-8"
          >
            Start for free. No credit card required.
          </motion.p>
          <motion.form
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="you@email.com"
              className="bg-muted/50 border-border h-12 text-base"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-brand border-0 font-semibold h-12 px-8 shrink-0 shadow-glow"
            >
              Get Started Free
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-10 px-4">
        <div className="container max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-brand flex items-center justify-center">
              <span className="text-xs font-bold text-background">CE</span>
            </div>
            <span className="font-semibold">CVEdge</span>
            <span className="text-xs text-muted-foreground ml-2">Your Career's Secret Weapon</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-foreground transition-colors">Log in</Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">Sign up</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
