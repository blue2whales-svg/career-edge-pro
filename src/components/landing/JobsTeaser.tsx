import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Flame, Ship, MapPin, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const HOT_CATEGORIES = [
  { icon: Ship, label: "Cruise Ships", count: "50+", color: "text-blue-400" },
  { icon: Flame, label: "Gulf States", count: "200+", color: "text-brand-red" },
  { icon: Users, label: "Housemaids & Nannies", count: "80+", color: "text-amber-400" },
  { icon: Globe, label: "International", count: "500+", color: "text-primary" },
];

export function JobsTeaser() {
  return (
    <section className="relative z-10 py-20 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/5 px-4 py-1.5 mb-5">
            <Flame className="h-3.5 w-3.5 text-brand-red animate-pulse" />
            <span className="text-xs font-mono text-brand-red">1,000+ Live Jobs · Updated Hourly</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
            Find the Job. <span className="text-gradient">We'll Craft the CV.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse thousands of verified jobs from cruise lines, Gulf employers, and 10+ global markets. 
            Get a professionally written CV tailored to the exact role — and apply with confidence.
          </p>
        </motion.div>

        {/* Hot Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {HOT_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              className="rounded-xl border border-border bg-card p-4 text-center hover:border-primary/30 transition-colors"
            >
              <cat.icon className={`h-6 w-6 mx-auto mb-2 ${cat.color}`} />
              <p className="text-sm font-semibold">{cat.label}</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">{cat.count} roles</p>
            </motion.div>
          ))}
        </div>

        {/* Sample Hot Jobs */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5}
          className="rounded-2xl border border-brand-red/20 bg-card p-5 sm:p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-4 w-4 text-brand-red" />
            <h3 className="text-sm font-semibold">Trending Now</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: "Cruise Ship Bartender", company: "Celebrity Cruises", location: "At Sea — Caribbean", salary: "KES 260K–390K/mo + tips", tag: "🚢 Cruise" },
              { title: "Live-in Housemaid — Urgent", company: "Private Family", location: "Dubai, UAE", salary: "KES 65K–120K/mo + accommodation", tag: "🔥 Gulf" },
              { title: "ICU Nurse", company: "Hamad Medical Corp.", location: "Doha, Qatar", salary: "KES 530K–780K/mo tax-free", tag: "🔥 Gulf" },
              { title: "Nanny — Immediate Start", company: "Staffing Agency", location: "Riyadh, Saudi Arabia", salary: "KES 55K–100K/mo + flights", tag: "🔥 Gulf" },
            ].map((job, i) => (
              <div key={i} className="flex items-center justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{job.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" /> {job.location} · {job.salary}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-red/10 border border-brand-red/20 px-2 py-0.5 text-[10px] font-mono text-brand-red">
                  {job.tag}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={6}
          className="text-center"
        >
          <Link to="/jobs">
            <Button size="lg" className="bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer text-base">
              Browse All Jobs <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-3 font-mono">
            Cruise · Gulf · Housemaids · Healthcare · Engineering · 10+ sectors
          </p>
        </motion.div>
      </div>
    </section>
  );
}