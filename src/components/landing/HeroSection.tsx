import { motion } from "framer-motion";
import { ArrowRight, Flame, Shield, Zap, CreditCard, Users, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useJobsPageData } from "@/hooks/useJobs";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export function HeroSection() {
  const { data: liveJobsData, isLoading: jobsLoading, isError: jobsError } = useJobsPageData();

  const counts = liveJobsData?.counts;
  const kenyaCount = counts?.["Kenya Jobs"] || 0;
  const remoteCount = counts?.["Remote Jobs"] || 0;
  const totalCount = counts?.total || liveJobsData?.jobs?.length || 0;
  const internationalCount = Math.max(totalCount - kenyaCount, 0);
  const hotJob = liveJobsData?.featured?.[0] || liveJobsData?.jobs?.find((job) => job.hot) || liveJobsData?.jobs?.[0];

  // Build enticing stats — skip any category with 0
  const liveStats: string[] = [];
  if (kenyaCount > 0) liveStats.push(`📍 ${kenyaCount.toLocaleString()} jobs in Kenya`);
  if (remoteCount > 0) liveStats.push(`🌐 ${remoteCount.toLocaleString()} remote jobs`);
  if (internationalCount > 0) liveStats.push(`✈️ ${internationalCount.toLocaleString()} international opportunities`);
  if (totalCount > 0 && liveStats.length === 0) liveStats.push(`🔥 ${totalCount.toLocaleString()} live opportunities`);
  // Always show total as a highlight if we have jobs
  if (totalCount > 0 && liveStats.length < 3) {
    const gulfCount = counts?.["Gulf Jobs"] || 0;
    const cruiseCount = counts?.["Cruise Jobs"] || 0;
    if (gulfCount > 0 && !liveStats.some(s => s.includes("Gulf"))) liveStats.push(`🏜️ ${gulfCount} Gulf & Middle East jobs`);
    if (cruiseCount > 0 && !liveStats.some(s => s.includes("Cruise"))) liveStats.push(`🚢 ${cruiseCount} cruise ship opportunities`);
  }

  return (
    <section className="relative z-10 pt-14 sm:pt-28 pb-14 sm:pb-20 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="max-w-3xl">
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
            className="text-3xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-4"
          >
            The Job Is Already Out There. <span className="text-gradient">Can They Find You?</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed"
          >
            CV Edge gives you a recruiter-ready CV + access to verified jobs in Kenya, Gulf, Cruise Lines and beyond —
            starting at <span className="text-primary font-semibold">KES 1,200</span>
          </motion.p>

          {/* LIVE JOBS SNAPSHOT */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 max-w-md"
          >
            <p className="text-sm font-semibold text-foreground mb-2">🔥 We found live opportunities for you right now:</p>

            {jobsLoading ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Checking fresh jobs across Kenya, Gulf, cruise, remote, and global markets…</p>
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
                  Live feed syncing now
                </div>
              </div>
            ) : jobsError ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Live jobs are syncing right now. Tap Jobs to load the latest openings.</p>
                <Link to="/jobs" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                  See live jobs <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <>
                <ul className="space-y-1 text-sm text-muted-foreground mb-3">
                  {liveStats.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                {hotJob && (
                  <div className="rounded-lg border border-border/50 bg-background/40 px-3 py-2 mb-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Current hot job</p>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{hotJob.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {hotJob.location}
                      {hotJob.company ? ` · ${hotJob.company}` : ""}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-primary font-medium">
                  🔒 Unlock to view &amp; apply
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="flex flex-col sm:flex-row gap-3 mb-3"
          >
            <Link to="/order" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-8 shadow-glow gold-shimmer text-base"
              >
                Unlock Jobs Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-primary/30 font-semibold h-13 px-8 hover:bg-primary/5"
              >
                Get Verified Job Access
              </Button>
            </Link>
          </motion.div>

          {/* URGENCY */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={5}
            className="text-xs text-amber-400 font-medium mb-5"
          >
            ⏳ Some jobs expire in 24–48 hours — ⚠️ Positions are limited
          </motion.p>

          {/* Live counter */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={6}
            className="flex items-center gap-2 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            <span className="text-sm text-muted-foreground">
              🔥 <span className="text-foreground font-semibold">1,200+</span> job seekers already on CV Edge
            </span>
          </motion.div>

          {/* TRUST BADGES */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={7}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>Used by 1,000+ job seekers</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5 text-primary" />
              <span>Updated daily</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <span>Verified listings only</span>
            </div>
          </motion.div>

          {/* Payment badges */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={8}
            className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              <span>M-Pesa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>PayPal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>Instant Delivery</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
