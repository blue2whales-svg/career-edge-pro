import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Flame, Ship, MapPin, Users, Globe, ShieldCheck, Clock } from "lucide-react";
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
  { icon: Ship, label: "Cruise Ships", count: "50+", color: "text-secondary", industry: "Cruise & Hospitality" },
  { icon: Flame, label: "Gulf States", count: "200+", color: "text-destructive", industry: "🔥 Hot Abroad" },
  { icon: Users, label: "Housemaids & Nannies", count: "80+", color: "text-primary", industry: "Domestic & Housekeeping" },
  { icon: Globe, label: "International", count: "500+", color: "text-accent", industry: "All" },
];

export function JobsTeaser() {
  return (
    <section className="relative z-10 py-16 sm:py-20 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-4 py-1.5 mb-5">
            <Flame className="h-3.5 w-3.5 text-destructive animate-pulse" />
            <span className="text-xs font-mono text-destructive">1,000+ Live Jobs · Updated Hourly</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
            Find the Job. <span className="text-gradient">We'll Craft the CV.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Browse thousands of verified jobs from cruise lines, Gulf employers, and 10+ global markets. 
            Get a professionally written CV tailored to the exact role — and apply with confidence.
          </p>
        </motion.div>

        {/* Verified badge */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.5}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span className="text-xs text-muted-foreground">Only verified employer listings</span>
          <span className="text-muted-foreground/30">·</span>
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">Refreshed every hour</span>
        </motion.div>

        {/* Hot Categories — clickable cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-8">
          {HOT_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
            >
              <Link
                to={`/jobs?industry=${encodeURIComponent(cat.industry)}`}
                className="group block rounded-2xl border border-border bg-card p-5 sm:p-6 text-center hover:border-primary/40 hover:bg-muted/50 transition-all duration-200 active:scale-[0.97]"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60 group-hover:bg-primary/10 transition-colors">
                  <cat.icon className={`h-6 w-6 ${cat.color} transition-transform group-hover:scale-110`} />
                </div>
                <p className="text-sm font-semibold mb-0.5">{cat.label}</p>
                <p className="text-xs text-muted-foreground font-mono">{cat.count} roles</p>
                <ArrowRight className="h-3.5 w-3.5 mx-auto mt-2 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Sample Hot Jobs */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5}
          className="rounded-2xl border border-destructive/20 bg-card p-4 sm:p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-semibold">Trending Now</h3>
            <span className="ml-auto text-[10px] text-muted-foreground font-mono flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-accent" /> Verified
            </span>
          </div>
          <div className="space-y-1">
            {[
              { title: "Cruise Ship Bartender", company: "Celebrity Cruises", location: "At Sea — Caribbean", salary: "KES 260K–390K/mo", tag: "🚢 Cruise" },
              { title: "Live-in Housemaid — Urgent", company: "Private Family", location: "Dubai, UAE", salary: "KES 65K–120K/mo", tag: "🔥 Gulf" },
              { title: "ICU Nurse", company: "Hamad Medical Corp.", location: "Doha, Qatar", salary: "KES 530K–780K/mo", tag: "🔥 Gulf" },
              { title: "Nanny — Immediate Start", company: "Staffing Agency", location: "Riyadh, Saudi Arabia", salary: "KES 55K–100K/mo", tag: "🔥 Gulf" },
            ].map((job, i) => (
              <Link
                key={i}
                to="/jobs"
                className="flex items-center justify-between gap-3 py-3 px-2 rounded-lg border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors active:bg-muted/60"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{job.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 shrink-0" /> {job.location}
                  </p>
                  <p className="text-xs text-primary font-mono mt-0.5">{job.salary}</p>
                </div>
                <span className="shrink-0 rounded-full bg-destructive/10 border border-destructive/20 px-2.5 py-1 text-[10px] font-mono text-destructive">
                  {job.tag}
                </span>
              </Link>
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
