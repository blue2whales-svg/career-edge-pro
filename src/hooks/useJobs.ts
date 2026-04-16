// @ts-nocheck
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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
  if (diff < 0) return "Just now";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days <= 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (days <= 30) return `${Math.ceil(days / 7)} week${Math.ceil(days / 7) > 1 ? "s" : ""} ago`;
  return "Recently";
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

// Route jobs to the primary project
// Jobs data lives on Lovable Cloud where fetch-jobs function + API keys are deployed
const JOBS_CLOUD_URL = "https://jxuqpxzsbkkywieughgh.supabase.co";
const JOBS_CLOUD_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dXFweHpzYmtreXdpZXVnaGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDExMjgsImV4cCI6MjA4ODMxNzEyOH0.nzT2xXLGfhmY-ibQBqDMd790_01AihREvgc3ZR6053o";

function getJobsFunctionConfig() {
  return {
    endpoint: `${JOBS_CLOUD_URL}/functions/v1/fetch-jobs`,
    key: JOBS_CLOUD_KEY,
  };
}

function parseResponseBody(raw: string) {
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
}

async function invokeJobsFunction(body: Record<string, any> = {}) {
  const { endpoint, key } = getJobsFunctionConfig();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  const raw = await response.text();
  const data = parseResponseBody(raw);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Jobs request failed (${response.status})`);
  }

  return data;
}

function isFeedResponse(data: any) {
  return Boolean(
    data &&
      typeof data === "object" &&
      (Array.isArray(data.jobs) ||
        Array.isArray(data.featured) ||
        typeof data.counts === "object" ||
        typeof data.totalCount === "number")
  );
}

async function feedQuery(body: Record<string, any>): Promise<any> {
  const data = await invokeJobsFunction({ mode: "feed", ...body });
  if (!isFeedResponse(data)) {
    throw new Error("Live jobs feed returned an invalid response.");
  }
  return data;
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
    posted: row.discovered_at
      ? `Posted ${timeAgo(row.discovered_at)}`
      : row.posted_at
        ? `Posted ${timeAgo(row.posted_at)}`
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
        "Asia Jobs": data.counts?.asia || 0,
        "USA Jobs": data.counts?.usa || 0,
        total: data.counts?.total || 0,
      };
      const jobs = (data.jobs || []).map(mapRow);
      const featured = (data.featured || []).map(mapRow);
      return { counts, jobs, featured };
    },
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
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
    retry: 1,
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
    retry: 1,
  });
}

export async function triggerJobsFetch() {
  try {
    await invokeJobsFunction();
    return true;
  } catch (err) {
    console.error("Failed to trigger job fetch:", err);
    return false;
  }
}
