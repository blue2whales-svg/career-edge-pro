import { motion } from "framer-motion";
import { ArrowRight, Flame, Shield, Zap, CreditCard, Users, RefreshCw, CheckCircle, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useJobsPageData } from "@/hooks/useJobs";
import { useIsInternational } from "@/hooks/useIsInternational";

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
  const { isInternational } = useIsInternational();

  const counts = liveJobsData?.counts;
  const kenyaCount = counts?.["Kenya Jobs"] || 0;
  const remoteCount = counts?.["Remote Jobs"] || 0;
  const totalCount = counts?.total || liveJobsData?.jobs?.length || 0;
  const internationalCount = Math.max(totalCount - kenyaCount, 0);
  const hotJob = liveJobsData?.featured?.[0] || liveJobsData?.jobs?.find((job) => job.hot) || liveJobsData?.jobs?.[0];

  // Geo-targeted stats: international visitors see remote/global first
  const liveStats: string[] = [];
  if (isInternational) {
    if (remoteCount > 0) liveStats.push(`🌐 ${remoteCount.toLocaleString()} remote jobs`);
    if (internationalCount > 0) liveStats.push(`✈️ ${internationalCount.toLocaleString()} international opportunities`);
    if (kenyaCount > 0) liveStats.push(`📍 ${kenyaCount.toLocaleString()} jobs in Kenya`);
  } else {
    if (kenyaCount > 0) liveStats.push(`📍 ${kenyaCount.toLocaleString()} jobs in Kenya`);
    if (remoteCount > 0) liveStats.push(`🌐 ${remoteCount.toLocaleString()} remote jobs`);
    if (internationalCount > 0) liveStats.push(`✈️ ${internationalCount.toLocaleString()} international opportunities`);
  }
  if (totalCount > 0 && liveStats.length === 0) liveStats.push(`🔥 ${totalCount.toLocaleString()} live opportunities`);
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

          {/* GEO-TARGETED BANNER for international visitors */}
          {isInternational && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 mb-5"
            >
              <Globe2 className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">🌍 Hiring from Kenya? Post jobs here</p>
                <p className="text-xs text-muted-foreground">Access {totalCount > 0 ? `${totalCount}+` : ""} remote & international opportunities — or recruit top Kenyan talent</p>
              </div>
              <Link to="/jobs?category=Remote" className="shrink-0">
                <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-xs h-8">
                  Browse Remote <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </motion.div>
          )}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={isInternational ? 1 : 0}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6"
          >
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary">Same-day delivery available</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={isInternational ? 2 : 1}
            className="text-3xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-4"
          >
            {isInternational ? (
              <>Remote Jobs & Global Talent. <span className="text-gradient">One Platform.</span></>
            ) : (
              <>The Job Is Already Out There. <span className="text-gradient">Can They Find You?</span></>
            )}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={isInternational ? 3 : 2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed"
          >
            {isInternational ? (
              <>CV Edge connects you to verified remote, cruise & international jobs — plus recruiter-ready CVs starting at <span className="text-primary font-semibold">$10</span></>
            ) : (
              <>CV Edge gives you a recruiter-ready CV + access to verified jobs in Kenya, Gulf, Cruise Lines and beyond — starting at <span className="text-primary font-semibold">KES 1,200</span></>
            )}
          </motion.p>

          {/* LIVE JOBS SNAPSHOT */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={isInternational ? 4 : 3}
            className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 max-w-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <p className="text-sm font-semibold text-foreground">🔥 {totalCount > 0 ? `${totalCount}+ live opportunities` : "Live opportunities"} right now</p>
            </div>

            {jobsLoading ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {isInternational ? "Scanning remote, cruise & global markets…" : "Scanning Kenya, Gulf, cruise, remote & global markets…"}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
                  Live feed syncing
                </div>
              </div>
            ) : jobsError ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Live jobs are syncing. Tap Jobs to see latest.</p>
                <Link to="/jobs" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                  See live jobs <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <>
                <ul className="space-y-1.5 text-sm mb-3">
                  {liveStats.map((item) => (
                    <li key={item} className="text-muted-foreground font-medium">{item}</li>
                  ))}
                </ul>

                {hotJob && (
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 mb-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-amber-400 font-bold mb-1">🔥 Hot Right Now</p>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{hotJob.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {hotJob.location}
                      {hotJob.company ? ` · ${hotJob.company}` : ""}
                    </p>
                  </div>
                )}

                <Link to={isInternational ? "/jobs?category=Remote" : "/jobs"} className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:text-primary/80 transition-colors">
                  🔒 Unlock to view &amp; apply <ArrowRight className="h-3 w-3" />
                </Link>
              </>
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={isInternational ? 5 : 4}
            className="flex flex-col sm:flex-row gap-3 mb-3"
          >
            <Link to={isInternational ? "/jobs?category=Remote" : "/order"} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-8 shadow-glow gold-shimmer text-base"
              >
                {isInternational ? "Browse Remote Jobs" : "Unlock Jobs Now"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-primary/30 font-semibold h-13 px-8 hover:bg-primary/5"
              >
                {isInternational ? "Explore All Jobs" : "Get Verified Job Access"}
              </Button>
            </Link>
          </motion.div>

          {/* URGENCY */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={isInternational ? 6 : 5}
            className="text-xs text-amber-400 font-medium mb-5"
          >
            ⏳ Some jobs expire in 24–48 hours — ⚠️ Positions are limited
          </motion.p>

          {/* Live counter */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={isInternational ? 7 : 6}
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
            custom={isInternational ? 8 : 7}
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
            custom={isInternational ? 9 : 8}
            className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground"
          >
            {!isInternational && (
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                <span>M-Pesa</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>PayPal</span>
            </div>
            {isInternational && (
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                <span>Stripe</span>
              </div>
            )}
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