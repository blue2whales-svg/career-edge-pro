import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Building2, ArrowRight, Briefcase, Sparkles, Clock, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useJobs } from "@/hooks/useJobs";
import { useIsInternational } from "@/hooks/useIsInternational";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const SOURCE_BADGES = [
  "BrighterMonday",
  "LinkedIn Jobs",
  "Fuzu",
  "MyJobMag",
  "Remotive",
  "We Work Remotely",
  "Himalayas",
  "Jobicy",
  "Arbeitnow",
];

const LOCATION_TABS = [
  { key: "all", label: "All" },
  { key: "kenya", label: "🇰🇪 Kenya" },
  { key: "remote", label: "🌍 Remote" },
  { key: "international", label: "✈️ International" },
] as const;

type LocKey = typeof LOCATION_TABS[number]["key"];

function matchesLocation(job: { market?: string; location?: string; title?: string }, key: LocKey) {
  if (key === "all") return true;
  const hay = `${job.location ?? ""} ${job.title ?? ""}`.toLowerCase();
  const isRemote = /remote|work from home|wfh|anywhere/.test(hay);
  const isKenya = job.market === "Kenya" || /kenya|nairobi|mombasa|kisumu/.test(hay);
  if (key === "kenya") return isKenya;
  if (key === "remote") return isRemote;
  if (key === "international") return !isKenya;
  return true;
}

export function JobPreviewSection() {
  const { data, isLoading } = useJobs();
  const { isInternational } = useIsInternational();
  const jobs = data?.jobs ?? [];

  const [locFilter, setLocFilter] = useState<LocKey>("all");
  const [activeSources, setActiveSources] = useState<Set<string>>(new Set());

  const availableSources = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j: any) => { if (j.source_label) set.add(j.source_label); });
    return Array.from(set).sort();
  }, [jobs]);

  const toggleSource = (s: string) => {
    setActiveSources((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  };

  const filtered = jobs.filter((j: any) => {
    if (!matchesLocation(j, locFilter)) return false;
    if (activeSources.size > 0 && !activeSources.has(j.source_label)) return false;
    return true;
  });

  const prioritized = isInternational
    ? [...filtered].sort((a, b) => Number(b.market !== "Kenya") - Number(a.market !== "Kenya"))
    : [...filtered].sort((a, b) => Number(b.market === "Kenya") - Number(a.market === "Kenya"));

  const visible = prioritized.slice(0, 16);
  const totalCount = jobs.length;

  return (
    <section className="relative z-10 py-16 sm:py-24 px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-[80%] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="flex items-center justify-center gap-2 mb-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Live Job Board
          </span>
        </motion.div>

        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-3"
        >
          Real Jobs. <span className="text-gradient">Right Now.</span>
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={2}
          className="text-center text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-10"
        >
          Fresh remote & local roles pulled every 2 hours from verified employer sources.
          {totalCount > 0 && (
            <span className="block mt-1 text-xs text-primary/80 font-mono">
              {totalCount.toLocaleString()}+ open positions right now
            </span>
          )}
        </motion.p>

        {/* Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {LOCATION_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setLocFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                  locFilter === tab.key
                    ? "bg-gradient-brand text-primary-foreground border border-primary/40 shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {availableSources.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mr-1">
                Sources:
              </span>
              {availableSources.map((s) => {
                const active = activeSources.has(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSource(s)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95 ${
                      active
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    {active ? "✓ " : ""}{s}
                  </button>
                );
              })}
              {activeSources.size > 0 && (
                <button
                  onClick={() => setActiveSources(new Set())}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium text-brand-red border border-brand-red/30 hover:bg-brand-red/10"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          )}

          {!isLoading && visible.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              No jobs match these filters. Try clearing or switching tabs.
            </p>
          )}
        </div>

        {/* Jobs grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {isLoading
            ? [...Array(16)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-2/3 mb-3" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))
            : visible.map((job, i) => {
                const href = job.apply_url || "/jobs";
                const isExternal = /^https?:\/\//i.test(href);
                const CardInner = (
                  <>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/[0.06] opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2 flex-1">
                        {job.title}
                      </h3>
                      {i < 4 && (
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wide text-primary">
                          <Sparkles className="h-2.5 w-2.5" /> Hot
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Building2 className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{job.location}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/60">
                      <span className="text-xs font-mono text-primary line-clamp-1">
                        {job.salary || "Competitive"}
                      </span>
                      <span className="text-[9px] text-green-400 shrink-0 flex items-center gap-1">
                        ✅ {job.source_label || SOURCE_BADGES[i % SOURCE_BADGES.length]}
                      </span>
                    </div>
                  </>
                );
                const className =
                  "group relative block overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.4)] hover:-translate-y-0.5 cursor-pointer";
                return (
                  <motion.div
                    key={`${job.title}-${job.company}-${i}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i + 2}
                  >
                    {isExternal ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                        {CardInner}
                      </a>
                    ) : (
                      <Link to={href} className={className}>
                        {CardInner}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
        </div>

        {/* Stats + CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={3}
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-card to-card p-6 sm:p-8"
        >
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-6 text-center">
            <div className="flex flex-col items-center gap-1">
              <Briefcase className="h-5 w-5 text-primary mb-1" />
              <span className="text-2xl font-serif font-bold">
                {totalCount > 0 ? `${totalCount.toLocaleString()}+` : "1,000+"}
              </span>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Open Roles</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Clock className="h-5 w-5 text-primary mb-1" />
              <span className="text-2xl font-serif font-bold">2 hrs</span>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Refresh Cycle</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className="h-5 w-5 text-primary mb-1" />
              <span className="text-2xl font-serif font-bold">9+</span>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Verified Sources</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer">
                Browse All Live Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/portal/alerts" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                <Sparkles className="mr-2 h-4 w-4" /> Get Job Alerts
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
