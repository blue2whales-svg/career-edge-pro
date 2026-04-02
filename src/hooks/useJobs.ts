// @ts-nocheck
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JOBS, FEATURED_JOBS, type Job } from "@/data/jobs";

const SOURCE_LABELS: Record<string, string> = {
  jsearch: "JSearch",
  firecrawl: "Firecrawl",
  adzuna: "Adzuna",
  jooble: "Jooble",
  platform_seed: "CV Edge",
};

export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export interface JobFilters {
  search?: string;
  category?: string;
  industry?: string;
  market?: string;
  company?: string;
  hotOnly?: boolean;
  visaOnly?: boolean;
}

const PAGE_SIZE = 20;

function mapRow(row: any): Job {
  return {
    title: row.title,
    company: row.company,
    location: row.location,
    salary: row.salary || "Competitive",
    type: row.type || "Full-time",
    industry: row.industry || "Operations",
    market: row.market_tag || row.market || "kenya",
    posted: row.posted_at
      ? `Posted ${timeAgo(row.posted_at)}`
      : row.discovered_at
        ? `Discovered ${timeAgo(row.discovered_at)}`
        : row.posted || "Recently",
    hot: row.hot || false,
    tag: row.tag || undefined,
    apply_url: row.apply_url || undefined,
    description: row.description || undefined,
    hot_score: row.hot_score || 0,
    category: row.category || undefined,
    country: row.country || undefined,
    visa_sponsorship: row.visa_sponsorship || false,
    verified: row.verified || false,
    featured: row.featured || false,
    source: row.source || "platform_seed",
    source_label: row.source_label || SOURCE_LABELS[row.source] || row.source || "CV Edge",
    posted_at: row.posted_at || undefined,
    discovered_at: row.discovered_at || undefined,
    is_active: row.is_active ?? true,
  };
}

// ─── Single page data hook — 1 query for everything ────────────────────────
export function useJobsPageData() {
  return useQuery({
    queryKey: ["jobs-page-data"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_jobs_page_data");
      if (error || !data) {
        return {
          counts: {
            "Kenya Jobs": 0,
            "Gulf Jobs": 0,
            "Cruise Jobs": 0,
            "Remote Jobs": 0,
            "Visa Sponsorship": 0,
            "Healthcare Jobs": 0,
            total: 0,
          },
          jobs: JOBS,
          featured: FEATURED_JOBS,
        };
      }
      const counts = {
        "Kenya Jobs": data.counts?.kenya || 0,
        "Gulf Jobs": data.counts?.gulf || 0,
        "Cruise Jobs": data.counts?.cruise || 0,
        "Remote Jobs": data.counts?.remote || 0,
        "Visa Sponsorship": data.counts?.visa || 0,
        "Healthcare Jobs": data.counts?.healthcare || 0,
        total: data.counts?.total || 0,
      };
      const jobs = (data.jobs || []).map(mapRow);
      const featured = jobs.filter((j) => j.hot).slice(0, 6);
      return { counts, jobs, featured };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

// ─── Category counts — now uses cached page data ───────────────────────────
export function useCategoryCounts() {
  const { data, isLoading } = useJobsPageData();
  return {
    data: data?.counts,
    isLoading,
  };
}

// ─── Featured jobs — now uses cached page data ─────────────────────────────
export function useFeaturedJobs() {
  const { data, isLoading } = useJobsPageData();
  return useQuery({
    queryKey: ["featured-jobs"],
    queryFn: async () => data?.featured || FEATURED_JOBS,
    enabled: !!data,
    staleTime: 1000 * 60 * 10,
  });
}

// ─── Paginated jobs with filters ───────────────────────────────────────────
export function useJobsPaginated(filters: JobFilters) {
  return useInfiniteQuery({
    queryKey: ["jobs-paginated", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query: any = supabase
        .from("cached_jobs")
        .select("*", { count: "exact" })
        .eq("is_active", true)
        .order("posted_at", { ascending: false })
        .order("hot_score", { ascending: false })
        .range(from, to);

      if (filters.search) {
        const s = `%${filters.search}%`;
        query = query.or(`title.ilike.${s},company.ilike.${s}`);
      }
      if (filters.category && filters.category !== "All Categories") {
        query = query.eq("category", filters.category);
      }
      if (filters.industry && filters.industry !== "All" && filters.industry !== "🔥 Hot Abroad") {
        query = query.eq("industry", filters.industry);
      }
      if (filters.industry === "🔥 Hot Abroad") {
        query = query.eq("hot", true);
      }
      if (filters.market && filters.market !== "All Markets") {
        query = query.eq("market", filters.market);
      }
      if (filters.hotOnly) query = query.eq("hot", true);
      if (filters.visaOnly) query = query.eq("visa_sponsorship", true);

      const { data, error, count } = await query;

      if (error) {
        const staticFiltered = filterStatic(JOBS, filters);
        return {
          jobs: staticFiltered.slice(from, to + 1),
          totalCount: staticFiltered.length,
          page: pageParam,
        };
      }

      const jobs = (data || []).map(mapRow);
      if (pageParam === 0 && jobs.length === 0) {
        const staticFiltered = filterStatic(JOBS, filters);
        return {
          jobs: staticFiltered.slice(0, PAGE_SIZE),
          totalCount: staticFiltered.length,
          page: 0,
        };
      }

      return { jobs, totalCount: count || 0, page: pageParam };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      if (nextPage * PAGE_SIZE >= lastPage.totalCount) return undefined;
      return nextPage;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

// ─── Static fallback filter ────────────────────────────────────────────────
function filterStatic(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter((job) => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!job.title.toLowerCase().includes(s) && !job.company.toLowerCase().includes(s)) return false;
    }
    if (filters.category && filters.category !== "All Categories" && job.category !== filters.category) return false;
    if (
      filters.industry &&
      filters.industry !== "All" &&
      filters.industry !== "🔥 Hot Abroad" &&
      job.industry !== filters.industry
    )
      return false;
    if (filters.industry === "🔥 Hot Abroad" && !job.hot) return false;
    if (filters.market && filters.market !== "All Markets" && job.market !== filters.market) return false;
    if (filters.hotOnly && !job.hot) return false;
    if (filters.visaOnly && !job.visa_sponsorship) return false;
    return true;
  });
}

// ─── Legacy hook ──────────────────────────────────────────────────────────
export function useJobs() {
  return useQuery({
    queryKey: ["live-jobs"],
    queryFn: async () => {
      const { data }: any = await supabase
        .from("cached_jobs")
        .select("*")
        .eq("is_active", true)
        .order("posted_at", { ascending: false })
        .limit(500);

      if (!data || data.length === 0) return { jobs: JOBS, featured: FEATURED_JOBS };

      const liveJobs = data.map(mapRow);
      const featured = (() => {
        const hot = liveJobs.filter((j: any) => j.hot === true);
        if (hot.length >= 3) return hot.slice(0, 6);
        return liveJobs.slice(0, 6);
      })();

      const combined = [...liveJobs, ...JOBS];
      const seen = new Set<string>();
      const deduped = combined.filter((j: any) => {
        const key = `${j.title.toLowerCase()}|${j.company.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return { jobs: deduped, featured };
    },
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}

export async function triggerJobsFetch() {
  try {
    await supabase.functions.invoke("fetch-jobs");
  } catch (err) {
    console.error("Failed to trigger job fetch:", err);
  }
}
