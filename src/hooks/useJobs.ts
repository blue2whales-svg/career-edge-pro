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
    // Extra fields for live jobs
    apply_url: cj.apply_url || undefined,
    description: cj.description || undefined,
  } as Job;
}

async function fetchLiveJobs(): Promise<{ jobs: Job[]; featured: Job[] }> {
  const { data, error } = await supabase
    .from("cached_jobs")
    .select("*")
    .order("posted_at", { ascending: false })
    .limit(200);

  if (error || !data || data.length === 0) {
    // Fallback to static data
    return { jobs: JOBS, featured: FEATURED_JOBS };
  }

  const liveJobs = (data as CachedJob[]).map(mapCachedToJob);
  const hotJobs = liveJobs.filter((j) => j.hot).slice(0, 6);
  const featured = hotJobs.length >= 3 ? hotJobs : FEATURED_JOBS;

  // Merge: live jobs first, then static as padding
  const combined = [...liveJobs, ...JOBS];
  // Deduplicate by title+company
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
    staleTime: 1000 * 60 * 30, // 30 min
    refetchOnWindowFocus: false,
  });
}

// Trigger a refresh from the edge function
export async function triggerJobsFetch() {
  try {
    await supabase.functions.invoke("fetch-jobs");
  } catch (err) {
    console.error("Failed to trigger job fetch:", err);
  }
}
