import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Flame, Ship, MapPin, Users, Globe, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCategoryCounts, useFeaturedJobs } from "@/hooks/useJobs";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export function JobsTeaser() {
  const { data: counts, isLoading: countsLoading } = useCategoryCounts();
  const { data: featured, isLoading: featuredLoading } = useFeaturedJobs();

  const total = counts?.total ?? 0;
  const kenyaCount = counts?.["Kenya Jobs"] ?? 0;
  const remoteCount = counts?.["Remote Jobs"] ?? 0;
  const gulfCount = (counts?.["Gulf Jobs"] ?? 0);
  const cruiseCount = counts?.["Cruise Jobs"] ?? 0;

  const HOT_CATEGORIES = [
    { icon: Ship, label: "Cruise Ships", count: cruiseCount, color: "text-secondary", link: "/jobs?market=Cruise" },
    { icon: Flame, label: "Gulf States", count: gulfCount, color: "text-destructive", link: "/jobs?market=Gulf" },
    { icon: Users, label: "Kenya Jobs", count: kenyaCount, color: "text-primary", link: "/jobs?market=Kenya" },
    { icon: Globe, label: "International", count: total, color: "text-accent", link: "/jobs" },
  ];

  // Pick top 4 featured/hot jobs for the teaser
  const hotJobs = featured.length > 0
    ? featured.slice(0, 4)
    : [];

  return (
    <section className="relative z-10 py-16 sm:py-20 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-4 py-1.5 mb-5">
            <Flame className="h-3.5 w-3.5 text-destructive animate-pulse" />
            <span className="text-xs font-mono text-destructive">
              {total > 0 ? `${total.toLocaleString()}+ Live Jobs` : "Live Jobs"} · Updated Hourly
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
            Find the Job. <span className="text-gradient">We'll Craft the CV.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Browse thousands of verified jobs from cruise lines, Gulf employers, and 10+ global markets. 
            Get a professionally written CV tailored to the exact role — and apply with confidence.
          </p>
        </motion.div>

        {/* Live stats strip */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.3}
          className="rounded-xl px-4 py-3 mb-6 space-y-1"
          style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-amber-400">🔥</span>
            <span>{total > 0 ? `${total.toLocaleString()}+` : "..."} live opportunities right now</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pl-4">
            <span>📍 {kenyaCount} jobs in Kenya</span>
            <span>🌍 {remoteCount} remote jobs</span>
            <span>🇦🇪 {gulfCount} Gulf & Middle East jobs</span>
          </div>
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
                to={cat.link}
                className="group block rounded-2xl border border-border bg-card p-5 sm:p-6 text-center hover:border-primary/40 hover:bg-muted/50 transition-all duration-200 active:scale-[0.97]"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60 group-hover:bg-primary/10 transition-colors">
                  <cat.icon className={`h-6 w-6 ${cat.color} transition-transform group-hover:scale-110`} />
                </div>
                <p className="text-sm font-semibold mb-0.5">{cat.label}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {countsLoading ? "..." : `${cat.count}+`} roles
                </p>
                <ArrowRight className="h-3.5 w-3.5 mx-auto mt-2 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Sample Hot Jobs — now from real data */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5}
          className="rounded-2xl border border-destructive/20 bg-card p-4 sm:p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-semibold">HOT RIGHT NOW</h3>
            <span className="ml-auto text-[10px] text-muted-foreground font-mono flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-accent" /> Verified
            </span>
          </div>
          <div className="space-y-1">
            {hotJobs.length > 0 ? hotJobs.map((job, i) => (
              <Link
                key={`${job.title}-${i}`}
                to="/jobs"
                className="flex items-center justify-between gap-3 py-3 px-2 rounded-lg border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors active:bg-muted/60"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{job.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 shrink-0" /> {job.location} · {job.company}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  🔓 Unlock to view & apply →
                </span>
              </Link>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">Loading hot jobs...</p>
            )}
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
            Cruise · Gulf · Kenya · Healthcare · Engineering · 10+ sectors
          </p>
        </motion.div>
      </div>
    </section>
  );
}
