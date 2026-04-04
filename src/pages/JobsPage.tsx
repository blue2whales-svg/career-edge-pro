import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase, ArrowRight, Flame, RefreshCw, Globe, Sparkles, SearchX, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { FeaturedJobs } from "@/components/jobs/FeaturedJobs";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { LiveStatusBar } from "@/components/jobs/LiveStatusBar";
import { FeaturedCategories } from "@/components/jobs/FeaturedCategories";
import { UpsellStrip } from "@/components/jobs/UpsellStrip";
import { INDUSTRIES, MARKETS, JOB_CATEGORIES, type Job } from "@/data/jobs";
import { useJobsPaginated, useCategoryCounts, triggerJobsFetch, type JobFilters } from "@/hooks/useJobs";
import { useJobAccess } from "@/hooks/useJobAccess";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const TABS = [
  { key: "all", label: "All Jobs", icon: "📋" },
  { key: "free", label: "Free Kenya Jobs", icon: "✅", countKey: "Kenya Jobs" },
  { key: "verified", label: "Verified Employers", icon: "⭐" },
  { key: "international", label: "International", icon: "🌍" },
  { key: "visa", label: "Visa Sponsorship", icon: "🛂", countKey: "Visa Sponsorship" },
];

export default function JobsPage() {
  const [searchParams] = useSearchParams();
  const initialIndustry = searchParams.get("industry") || "All";
  const initialMarket = searchParams.get("market") || "All Markets";
  const initialCategory = searchParams.get("category") || "All Categories";
  const initialCompany = searchParams.get("company") || "";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(initialCompany);
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustry);
  const [selectedMarket, setSelectedMarket] = useState(initialMarket);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { getJobTier, sessionSocialProof } = useJobAccess();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Map tab to filters
  const tabFilters: Partial<JobFilters> = (() => {
    switch (activeTab) {
      case "free": return { market: "Kenya" };
      case "international": return { market: "International" };
      case "visa": return { visaOnly: true };
      default: return {};
    }
  })();

  const filters: JobFilters = {
    search: debouncedSearch || undefined,
    category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
    industry: selectedIndustry !== "All" ? selectedIndustry : undefined,
    market: tabFilters.market || (selectedMarket !== "All Markets" ? selectedMarket : undefined),
    company: selectedCompany || undefined,
    visaOnly: tabFilters.visaOnly,
  };

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useJobsPaginated(filters);
  const { data: counts } = useCategoryCounts();
  const totalActive = counts?.total ?? 0;

  const allJobs = data?.pages.flatMap((p) => p.jobs) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // Filter by tab for verified/free locally
  const filteredJobs = allJobs.filter((job) => {
    if (activeTab === "verified") {
      return getJobTier(job.company, job.market, job.visa_sponsorship) === "verified";
    }
    if (activeTab === "free") {
      return getJobTier(job.company, job.market, job.visa_sponsorship) === "free";
    }
    return true;
  });

  const handleRefresh = useCallback(() => {
    setIsManualRefreshing(true);
    triggerJobsFetch().finally(() => refetch()).finally(() => {
      setTimeout(() => setIsManualRefreshing(false), 2000);
    });
  }, [refetch]);

  const handleFilterChange = useCallback((params: Partial<JobFilters>) => {
    if (params.search) setSearch(params.search);
    if (params.industry) setSelectedIndustry(params.industry);
    if (params.market) setSelectedMarket(params.market);
    if (params.category) setSelectedCategory(params.category);
    if (params.visaOnly) {
      setActiveTab("visa");
    }
  }, []);

  return (
    <PageLayout>
      <JobDetailModal job={selectedJob} open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)} />

      {/* Hero */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-10 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/5 px-4 py-1.5 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-brand-red" />
            <span className="text-xs font-mono text-brand-red">AI-Powered Job Discovery — Auto-Updated</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] mb-5">
            Land a role abroad. <span className="text-gradient">Get the CV to match.</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Fresh jobs from cruise lines, Gulf states, Kenya, and 10+ global markets.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="inline-flex items-center gap-2 rounded-full bg-muted/60 border border-border px-4 py-1.5 mb-8">
            <Flame className="h-3.5 w-3.5 text-brand-red" />
            <span className="text-xs text-muted-foreground font-mono">
              {Math.max(totalActive || 0, filteredJobs.length, 50)}+ live roles · Updated {new Date().toLocaleDateString("en-KE", { day: "numeric", month: "short" })}
            </span>
          </motion.div>

          {/* Search */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search cruise, Gulf, Kenya, or any job..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-13 pl-12 bg-card border-border text-base" />
          </motion.div>
        </div>
      </section>

      {/* Tab Header */}
      <section className="relative z-10 px-4 pb-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {TABS.map((tab) => {
              const count = tab.countKey ? (counts?.[tab.countKey] ?? 0) : (tab.key === "all" ? totalActive : undefined);
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.key
                      ? tab.key === "verified"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,166,35,0.2)]"
                        : tab.key === "international"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_8px_rgba(74,144,226,0.2)]"
                          : "bg-gradient-brand text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  {count !== undefined && count > 0 && (
                    <span className="text-[10px] font-mono bg-background/30 rounded-full px-1.5 py-0.5">
                      {count}+
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Apply Banner */}
      <section className="relative z-10 px-4 mb-6">
        <div className="container max-w-5xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">How to Apply</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Pick a role → Order a tailored <strong className="text-foreground">CV + Cover Letter</strong> → Pay via M-Pesa → Download in <strong className="text-foreground">PDF or Word</strong> → The <strong className="text-foreground">apply link</strong> unlocks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hot Jobs */}
      <FeaturedJobs />

      {/* Featured Categories */}
      <FeaturedCategories onFilterChange={handleFilterChange} />

      {/* Category Filters */}
      <section className="relative z-10 pb-2 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {JOB_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-brand-red text-white"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-brand-red/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Industry + Market Filters */}
      <section className="relative z-10 pb-6 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-serif font-bold">
              {selectedCompany ? `Jobs at ${selectedCompany}` : activeTab === "verified" ? "⭐ Verified Employer Jobs" : activeTab === "international" ? "🌍 International Jobs" : "All Openings"}
            </h2>
            <span className="text-xs text-muted-foreground font-mono">{filteredJobs.length} roles</span>
            {selectedCompany && (
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setSelectedCompany("")}>Clear filter</Button>
            )}
            <Button variant="ghost" size="sm" className="ml-auto text-xs gap-1.5" onClick={handleRefresh}>
              <RefreshCw className={`h-3.5 w-3.5 ${isManualRefreshing ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {INDUSTRIES.map((ind) => (
              <button key={ind} onClick={() => setSelectedIndustry(ind)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedIndustry === ind ? "bg-gradient-brand text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >{ind}</button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mt-3">
            <Globe className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
            {MARKETS.map((mkt) => (
              <button key={mkt} onClick={() => setSelectedMarket(mkt)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedMarket === mkt ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >{mkt}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="mb-4">
            <LiveStatusBar jobCount={totalCount} isRefreshing={isManualRefreshing} onRefresh={handleRefresh} />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 flex items-start gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-3" />
                        <div className="flex gap-3">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <SearchX className="h-5 w-5 mx-auto mb-4 text-destructive" />
              <span className="text-sm font-semibold">Live jobs feed unavailable</span>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto mt-2">
                {error instanceof Error ? error.message : "Couldn't load jobs right now."}
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" size="sm" onClick={() => { setSearch(""); setSelectedCategory("All Categories"); setSelectedIndustry("All"); setSelectedMarket("All Markets"); setActiveTab("all"); }}>
                  Reset Filters
                </Button>
                <Button size="sm" className="bg-gradient-brand border-0" onClick={handleRefresh}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Try Again
                </Button>
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-20">
              <SearchX className="h-5 w-5 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground text-sm mb-6">Clear filters or try a different tab.</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" size="sm" onClick={() => { setSearch(""); setSelectedCategory("All Categories"); setSelectedIndustry("All"); setSelectedMarket("All Markets"); setActiveTab("all"); }}>
                  Clear All Filters
                </Button>
                <Button size="sm" className="bg-gradient-brand border-0" onClick={handleRefresh}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {filteredJobs.map((job, i) => {
                  const tier = getJobTier(job.company, job.market, job.visa_sponsorship);
                  return (
                    <React.Fragment key={`${job.title}-${job.company}-${i}`}>
                      <JobCard
                        job={job}
                        index={i}
                        onClick={() => setSelectedJob(job)}
                        tier={tier}
                        socialProofCount={tier !== "free" ? sessionSocialProof : undefined}
                      />
                      {i > 0 && (i + 1) % 6 === 0 && (
                        <UpsellStrip variant={Math.floor(i / 6) % 2 === 0 ? "ats" : "bundle"} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              {hasNextPage && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="min-w-[200px]">
                    {isFetchingNextPage ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Loading...</> : <>Load More Jobs ({totalCount - allJobs.length} remaining)</>}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-10 sm:p-14">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Don't see your dream role? <span className="text-gradient">We'll still help.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Order a CV tailored to any role or industry.
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
