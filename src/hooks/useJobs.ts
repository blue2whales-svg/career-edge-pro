import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JOBS, FEATURED_JOBS, type Job } from "@/data/jobs";

interface CachedJob {
  id: string;
  external_id: string | null;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  type: string | null;
  industry: string | null;
  market: string | null;
  posted: string | null;
  posted_at: string | null;
  hot: boolean | null;
  tag: string | null;
  source: string;
  apply_url: string | null;
  description: string | null;
  hot_score: number | null;
  category: string | null;
  country: string | null;
  visa_sponsorship: boolean | null;
  verified: boolean | null;
  featured: boolean | null;
}

function mapCachedToJob(cj: CachedJob): Job {
  return {
    title: cj.title,
    company: cj.company,
    location: cj.location,
    salary: cj.salary || "Competitive",
    type: cj.type || "Full-time",
    industry: cj.industry || "Operations",
    market: cj.market || "Kenya",
    posted: cj.posted || "Recently",
    hot: cj.hot || false,
    tag: cj.tag || undefined,
    apply_url: cj.apply_url || undefined,
    description: cj.description || undefined,
    hot_score: cj.hot_score || 0,
    category: cj.category || undefined,
    country: cj.country || undefined,
    visa_sponsorship: cj.visa_sponsorship || false,
    verified: cj.verified || false,
    featured: cj.featured || false,
  } as Job;
}

async function fetchLiveJobs(): Promise<{ jobs: Job[]; featured: Job[] }> {
  const { data, error } = await supabase
    .from("cached_jobs")
    .select("*")
    .order("hot_score", { ascending: false })
    .order("posted_at", { ascending: false })
    .limit(500);

  if (error || !data || data.length === 0) {
    return { jobs: JOBS, featured: FEATURED_JOBS };
  }

  const liveJobs = (data as unknown as CachedJob[]).map(mapCachedToJob);
  
  // Featured: highest scoring hot jobs
  const hotJobs = liveJobs.filter((j) => j.hot || (j.hot_score && j.hot_score >= 50)).slice(0, 6);
  const featured = hotJobs.length >= 3 ? hotJobs : FEATURED_JOBS;

  // Merge: live jobs first, then static as padding
  const combined = [...liveJobs, ...JOBS];
  const seen = new Set<string>();
  const deduped = combined.filter((j) => {
    const key = `${j.title.toLowerCase()}|${j.company.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { jobs: deduped, featured };
}

export function useJobs() {
  return useQuery({
    queryKey: ["live-jobs"],
    queryFn: fetchLiveJobs,
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
