import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase, ArrowRight, Flame, RefreshCw, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { FeaturedJobs } from "@/components/jobs/FeaturedJobs";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { LiveStatusBar } from "@/components/jobs/LiveStatusBar";
import { FeaturedCategories } from "@/components/jobs/FeaturedCategories";
import { UpsellStrip } from "@/components/jobs/UpsellStrip";
import { INDUSTRIES, MARKETS, type Job } from "@/data/jobs";
import { useJobs, triggerJobsFetch } from "@/hooks/useJobs";
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export default function JobsPage() {
  const [searchParams] = useSearchParams();
  const initialIndustry = searchParams.get("industry") || "All";
  const initialMarket = searchParams.get("market") || "All Markets";

  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustry);
  const [selectedMarket, setSelectedMarket] = useState(initialMarket);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data, isLoading, refetch } = useJobs();
  const jobs = data?.jobs ?? [];

  // Trigger a background refresh on first visit
  useEffect(() => {
    triggerJobsFetch();
  }, []);

  const filtered = jobs.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    if (selectedIndustry === "🔥 Hot Abroad") {
      const matchMarket = selectedMarket === "All Markets" || job.market === selectedMarket;
      return matchSearch && job.hot && matchMarket;
    }
    const matchIndustry = selectedIndustry === "All" || job.industry === selectedIndustry;
    const matchMarket = selectedMarket === "All Markets" || job.market === selectedMarket;
    return matchSearch && matchIndustry && matchMarket;
  });

  return (
    <PageLayout>
      <JobDetailModal job={selectedJob} open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)} />
      <section className="relative z-10 pt-16 sm:pt-24 pb-10 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/5 px-4 py-1.5 mb-6"
          >
            <Briefcase className="h-3.5 w-3.5 text-brand-red" />
            <span className="text-xs font-mono text-brand-red">Live Jobs — Updated Hourly</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] mb-5"
          >
            Land a role abroad.{" "}
            <span className="text-gradient">Get the CV to match.</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4"
          >
            Real jobs from cruise lines, Gulf states, and 10+ global markets — refreshed live. Find the role, we'll craft the perfect CV.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="inline-flex items-center gap-2 rounded-full bg-muted/60 border border-border px-4 py-1.5 mb-8"
          >
            <Flame className="h-3.5 w-3.5 text-brand-red" />
            <span className="text-xs text-muted-foreground font-mono">
              {jobs.length} live roles · Cruise & Gulf trending
            </span>
          </motion.div>

          {/* Search */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="max-w-xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search cruise, Gulf, or any job..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-13 pl-12 bg-card border-border text-base"
            />
          </motion.div>
        </div>
      </section>

      {/* How to Apply Banner */}
      <section className="relative z-10 px-4 -mt-2 mb-6">
        <div className="container max-w-5xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">How to Apply</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Pick a role → Order a tailored <strong className="text-foreground">CV + Cover Letter</strong> → Pay via M-Pesa → Download in <strong className="text-foreground">PDF or Word</strong> → The <strong className="text-foreground">direct apply link</strong> unlocks so you can submit straight to the employer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hot Jobs */}
      <FeaturedJobs />

      {/* Filters */}
      <section className="relative z-10 pb-6 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-serif font-bold">All Openings</h2>
            <span className="text-xs text-muted-foreground font-mono">{filtered.length} roles</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-xs gap-1.5"
              onClick={() => { triggerJobsFetch().then(() => refetch()); }}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedIndustry === ind
                    ? "bg-gradient-brand text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mt-3">
            <Globe className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
            {MARKETS.map((mkt) => (
              <button
                key={mkt}
                onClick={() => setSelectedMarket(mkt)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedMarket === mkt
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {mkt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Loading live jobs...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((job, i) => (
                <JobCard key={i} job={job} index={i} onClick={() => setSelectedJob(job)} />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No jobs found matching your search. Try a different filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-10 sm:p-14"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Don't see your dream role? <span className="text-gradient">We'll still help.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Order a CV tailored to any role or industry. Share the job description and we'll craft the perfect application.
            </p>
            <Link to="/order">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer">
                Order Custom CV <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
