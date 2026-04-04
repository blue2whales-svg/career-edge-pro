// @ts-nocheck
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Job } from "@/data/jobs";

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

async function feedQuery(body: Record<string, any>): Promise<any> {
  const { data, error } = await supabase.functions.invoke("fetch-jobs", {
    body: { mode: "feed", ...body },
  });
  if (error) throw error;
  return data || {};
}

function mapRow(row: any): Job {
  return {
    title: row.title,
    company: row.company,
    location: row.location,
    salary: row.salary || "Competitive",
    type: row.type || "Full-time",
    industry: row.industry || "Operations",
    market: row.market || "Kenya",
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

export function useJobsPageData() {
  return useQuery({
    queryKey: ["jobs-page-data"],
    queryFn: async () => {
      const data = await feedQuery({
        page: 0,
        pageSize: PAGE_SIZE,
        includeCounts: true,
        includeFeatured: true,
      });
      const counts = {
        "Kenya Jobs": data.counts?.kenya || 0,
        "Gulf Jobs": data.counts?.gulf || 0,
        "Cruise Jobs": data.counts?.cruise || 0,
        "Remote Jobs": data.counts?.remote || 0,
        "Visa Sponsorship": data.counts?.visa || 0,
        "Healthcare Jobs": data.counts?.healthcare || 0,
        "UK Jobs": data.counts?.uk || 0,
        "Australia Jobs": data.counts?.australia || 0,
        "Germany Jobs": data.counts?.germany || 0,
        "Canada Jobs": data.counts?.canada || 0,
        "Europe Jobs": data.counts?.europe || 0,
        total: data.counts?.total || 0,
      };
      const jobs = (data.jobs || []).map(mapRow);
      const featured = (data.featured || []).map(mapRow);
      return { counts, jobs, featured };
    },
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useCategoryCounts() {
  const { data, isLoading } = useJobsPageData();
  return {
    data: data?.counts,
    isLoading,
  };
}

export function useFeaturedJobs() {
  const { data, isLoading } = useJobsPageData();
  return { data: data?.featured || [], isLoading };
}

export function useJobsPaginated(filters: JobFilters) {
  return useInfiniteQuery({
    queryKey: ["jobs-paginated", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await feedQuery({
        filters,
        page: Number(pageParam),
        pageSize: PAGE_SIZE,
      });
      const jobs = (res.jobs || []).map(mapRow);
      return { jobs, totalCount: res.totalCount || 0, page: res.page ?? Number(pageParam) };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      if (nextPage * PAGE_SIZE >= lastPage.totalCount) return undefined;
      return nextPage;
    },
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useJobs() {
  return useQuery({
    queryKey: ["live-jobs"],
    queryFn: async () => {
      const res = await feedQuery({ page: 0, pageSize: 200, includeFeatured: true });
      const liveJobs = (res.jobs || []).map(mapRow);
      const featured = (res.featured || []).map(mapRow);
      return { jobs: liveJobs, featured };
    },
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export async function triggerJobsFetch() {
  try {
    await supabase.functions.invoke("fetch-jobs");
  } catch (err) {
    console.error("Failed to trigger job fetch:", err);
  }
}
