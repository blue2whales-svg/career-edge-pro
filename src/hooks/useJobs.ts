import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JOBS, FEATURED_JOBS, type Job } from "@/data/jobs";

// ─── Source label mapping ───────────────────────────────────────────────────
const SOURCE_LABELS: Record<string, string> = {
  jsearch: "JSearch",
  firecrawl: "Firecrawl",
  adzuna: "Adzuna",
  jooble: "Jooble",
  platform_seed: "CV Edge",
};

// ─── Time-ago helper ────────────────────────────────────────────────────────
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

// ─── Filters interface ─────────────────────────────────────────────────────
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

// ─── Map DB row to Job ─────────────────────────────────────────────────────
function mapRow(row: any): Job {
  return {
    title: row.title,
    company: row.company,
    location: row.location,
    salary: row.salary || "Competitive",
    type: row.type || "Full-time",
    industry: row.industry || "Operations",
    market: row.market || "Kenya",
    posted: row.posted_at ? `Posted ${timeAgo(row.posted_at)}` : (row.discovered_at ? `Discovered ${timeAgo(row.discovered_at)}` : row.posted || "Recently"),
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

// ─── Build Supabase query with filters ──────────────────────────────────────
function buildQuery(filters: JobFilters) {
  let query = supabase
    .from("cached_jobs")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("hot_score", { ascending: false })
    .order("posted_at", { ascending: false });

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
  if (filters.company) {
    query = query.ilike("company", `%${filters.company}%`);
  }
  if (filters.hotOnly) {
    query = query.eq("hot", true);
  }
  if (filters.visaOnly) {
    query = query.eq("visa_sponsorship", true);
  }

  return query;
}

// ─── Paginated jobs hook ────────────────────────────────────────────────────
export function useJobsPaginated(filters: JobFilters) {
  return useInfiniteQuery({
    queryKey: ["jobs-paginated", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const query = buildQuery(filters).range(from, to);
      const { data, error, count } = await query;

      if (error) {
        console.error("Jobs query error:", error);
        // Fallback to static
        const staticFiltered = filterStatic(JOBS, filters);
        return {
          jobs: staticFiltered.slice(from, to + 1),
          totalCount: staticFiltered.length,
          page: pageParam,
        };
      }

      const jobs = (data || []).map(mapRow);

      // If DB is empty on first page, use static fallback
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

// ─── Featured jobs hook ─────────────────────────────────────────────────────
export function useFeaturedJobs() {
  return useQuery({
    queryKey: ["featured-jobs"],
    queryFn: async () => {
      // Try explicit featured first
      const { data: explicit } = await supabase
        .from("cached_jobs")
        .select("*")
        .eq("is_active", true)
        .eq("featured", true)
        .order("hot_score", { ascending: false })
        .limit(6);

      if (explicit && explicit.length >= 3) return explicit.map(mapRow);

      // Fall back to hot jobs
      const { data: hot } = await supabase
        .from("cached_jobs")
        .select("*")
        .eq("is_active", true)
        .eq("hot", true)
        .order("hot_score", { ascending: false })
        .limit(6);

      if (hot && hot.length >= 3) return hot.map(mapRow);

      // Fall back to top jobs
      const { data: top } = await supabase
        .from("cached_jobs")
        .select("*")
        .eq("is_active", true)
        .order("hot_score", { ascending: false })
        .limit(6);

      if (top && top.length >= 3) return top.map(mapRow);

      return FEATURED_JOBS;
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

// ─── Category counts hook ───────────────────────────────────────────────────
export interface CategoryCount {
  category: string;
  count: number;
}

export function useCategoryCounts() {
  return useQuery({
    queryKey: ["category-counts"],
    queryFn: async () => {
      const counts: Record<string, number> = {};

      // Kenya
      const { count: kenya } = await supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true).eq("market", "Kenya");
      counts["Kenya Jobs"] = kenya || 0;

      // Gulf
      const { count: gulf } = await supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true).in("market", ["UAE", "Qatar", "Saudi Arabia", "Oman", "Bahrain", "Kuwait"]);
      counts["Gulf Jobs"] = gulf || 0;

      // Cruise
      const { count: cruise } = await supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true).eq("category", "Cruise Jobs");
      counts["Cruise Jobs"] = cruise || 0;

      // Remote
      const { count: remote } = await supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true).eq("category", "Remote Jobs");
      counts["Remote Jobs"] = remote || 0;

      // Visa
      const { count: visa } = await supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true).eq("visa_sponsorship", true);
      counts["Visa Sponsorship"] = visa || 0;

      // Healthcare
      const { count: health } = await supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true).eq("industry", "Healthcare");
      counts["Healthcare Jobs"] = health || 0;

      // Total
      const { count: total } = await supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true);
      counts["total"] = total || 0;

      return counts;
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
    if (filters.industry && filters.industry !== "All" && filters.industry !== "🔥 Hot Abroad" && job.industry !== filters.industry) return false;
    if (filters.industry === "🔥 Hot Abroad" && !job.hot) return false;
    if (filters.market && filters.market !== "All Markets" && job.market !== filters.market) return false;
    if (filters.company && !job.company.toLowerCase().includes(filters.company.toLowerCase())) return false;
    if (filters.hotOnly && !job.hot) return false;
    if (filters.visaOnly && !job.visa_sponsorship) return false;
    return true;
  });
}

// ─── Legacy hook (for FeaturedJobs backward compat) ─────────────────────────
export function useJobs() {
  return useQuery({
    queryKey: ["live-jobs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("cached_jobs")
        .select("*")
        .eq("is_active", true)
        .order("hot_score", { ascending: false })
        .order("posted_at", { ascending: false })
        .limit(500);

      if (!data || data.length === 0) {
        return { jobs: JOBS, featured: FEATURED_JOBS };
      }

      const liveJobs = data.map(mapRow);

      const featured = (() => {
        const explicit = liveJobs.filter(j => j.featured === true);
        if (explicit.length >= 3) return explicit.slice(0, 6);
        const hot = liveJobs.filter(j => j.hot === true || (j.hot_score && j.hot_score >= 40));
        if (hot.length >= 3) return hot.slice(0, 6);
        return liveJobs.slice(0, 6);
      })();

      const combined = [...liveJobs, ...JOBS];
      const seen = new Set<string>();
      const deduped = combined.filter((j) => {
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
