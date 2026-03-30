import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── Source labels ──────────────────────────────────────────────────────────
const SOURCE_LABELS: Record<string, string> = {
  jsearch: "JSearch",
  firecrawl: "Firecrawl",
  adzuna: "Adzuna",
  jooble: "Jooble",
  platform_seed: "CV Edge",
};

// ─── JSearch queries ────────────────────────────────────────────────────────
const JSEARCH_QUERIES = [
  { query: "cruise ship jobs", market: "USA", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line", category: "Cruise Jobs" },
  { query: "cruise line careers", market: "UK", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line", category: "Cruise Jobs" },
  { query: "cruise ship chef jobs", market: "USA", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line", category: "Cruise Jobs" },
  { query: "cruise ship entertainment jobs", market: "USA", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line", category: "Cruise Jobs" },
  { query: "housemaid jobs Dubai UAE", market: "UAE", industry: "Domestic & Housekeeping", tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "nanny jobs Saudi Arabia", market: "Saudi Arabia", industry: "Domestic & Housekeeping", tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "housekeeper jobs Qatar", market: "Qatar", industry: "Domestic & Housekeeping", tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "domestic worker jobs abroad", market: "UK", industry: "Domestic & Housekeeping", tag: null, category: "Hospitality Jobs" },
  { query: "caregiver jobs Canada visa sponsorship", market: "Canada", industry: "Domestic & Housekeeping", tag: null, category: "Healthcare Jobs" },
  { query: "jobs in Dubai UAE", market: "UAE", industry: null, tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "jobs in Qatar Doha", market: "Qatar", industry: null, tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "jobs in Saudi Arabia", market: "Saudi Arabia", industry: null, tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "jobs in Oman Muscat", market: "Oman", industry: null, tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "hotel jobs Dubai", market: "UAE", industry: "Cruise & Hospitality", tag: "🔥 Gulf Hot", category: "Hospitality Jobs" },
  { query: "construction jobs Qatar", market: "Qatar", industry: "Engineering", tag: "🔥 Gulf Hot", category: "Construction Jobs" },
  { query: "driver jobs Dubai UAE", market: "UAE", industry: "Operations", tag: "🔥 Gulf Hot", category: "Drivers & Logistics" },
  { query: "security guard jobs Saudi Arabia", market: "Saudi Arabia", industry: "Operations", tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "jobs in Nairobi Kenya", market: "Kenya", industry: null, tag: null, category: "Kenya Jobs" },
  { query: "jobs in Mombasa Kenya", market: "Kenya", industry: null, tag: null, category: "Kenya Jobs" },
  { query: "NGO jobs Kenya", market: "Kenya", industry: "NGO", tag: null, category: "Kenya Jobs" },
  { query: "accounting jobs Nairobi", market: "Kenya", industry: "Finance", tag: null, category: "Kenya Jobs" },
  { query: "teaching jobs Kenya", market: "Kenya", industry: "Education", tag: null, category: "Kenya Jobs" },
  { query: "visa sponsorship jobs UK", market: "UK", industry: null, tag: "✈️ Visa Sponsor", category: "Remote Jobs" },
  { query: "visa sponsorship jobs Canada", market: "Canada", industry: null, tag: "✈️ Visa Sponsor", category: "Remote Jobs" },
  { query: "visa sponsorship jobs Australia", market: "Australia", industry: null, tag: "✈️ Visa Sponsor", category: "Remote Jobs" },
  { query: "nursing jobs abroad", market: "UK", industry: "Healthcare", tag: null, category: "Healthcare Jobs" },
  { query: "nurse jobs Dubai", market: "UAE", industry: "Healthcare", tag: "🔥 Gulf Hot", category: "Healthcare Jobs" },
  { query: "remote jobs Africa", market: "Kenya", industry: "Technology", tag: "🌍 Remote", category: "Remote Jobs" },
  { query: "civil engineer jobs Gulf", market: "UAE", industry: "Engineering", tag: "🔥 Gulf Hot", category: "Engineering Jobs" },
  { query: "driver jobs abroad", market: "UAE", industry: "Operations", tag: null, category: "Drivers & Logistics" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function mapType(types: string[] | undefined): string {
  if (!types || types.length === 0) return "Full-time";
  if (types.includes("FULLTIME")) return "Full-time";
  if (types.includes("CONTRACTOR") || types.includes("INTERN")) return "Contract";
  if (types.includes("PARTTIME")) return "Part-time";
  return "Full-time";
}

function guessIndustry(title: string, employer: string): string {
  const t = (title + " " + employer).toLowerCase();
  if (/nurse|doctor|medical|health|hospital|pharma|dental|physio|radiol/i.test(t)) return "Healthcare";
  if (/engineer|civil|mechanical|electrical|structural|hvac|plumb/i.test(t)) return "Engineering";
  if (/software|developer|data|devops|cloud|cyber|IT |tech/i.test(t)) return "Technology";
  if (/account|finance|bank|audit|insur/i.test(t)) return "Finance";
  if (/market|brand|content|seo|social media/i.test(t)) return "Marketing";
  if (/teacher|lecturer|educat|school|tutor/i.test(t)) return "Education";
  if (/legal|lawyer|attorney|compliance/i.test(t)) return "Legal";
  if (/sales|retail|business develop/i.test(t)) return "Sales";
  if (/housemaid|nanny|housekeeper|domestic|cleaner|maid|au pair|childcare|caregiver/i.test(t)) return "Domestic & Housekeeping";
  if (/hotel|restaurant|chef|cruise|hospitality|waiter|bartend|spa|cabin crew/i.test(t)) return "Cruise & Hospitality";
  if (/oil|gas|petrol|energy/i.test(t)) return "Oil & Gas";
  if (/ngo|unicef|world vision|red cross|amref/i.test(t)) return "NGO";
  if (/construct|mason|weld|plast|paint|carpen/i.test(t)) return "Engineering";
  if (/driv|transport|logist|warehouse|dispatch/i.test(t)) return "Operations";
  return "Operations";
}

function guessCategory(industry: string, market: string, tag: string | null, title: string): string {
  const t = title.toLowerCase();
  if (tag?.includes("Cruise") || t.includes("cruise")) return "Cruise Jobs";
  if (["UAE", "Qatar", "Saudi Arabia", "Oman", "Bahrain", "Kuwait"].includes(market)) return "Gulf Jobs";
  if (market === "Kenya") return "Kenya Jobs";
  if (t.includes("remote") || t.includes("work from home")) return "Remote Jobs";
  if (industry === "Healthcare") return "Healthcare Jobs";
  if (industry === "Engineering") return "Engineering Jobs";
  if (/construct|mason|weld/i.test(t)) return "Construction Jobs";
  if (industry === "Cruise & Hospitality") return "Hospitality Jobs";
  if (/driv|transport|logist/i.test(t)) return "Drivers & Logistics";
  return "Remote Jobs";
}

function detectVisaSponsorship(title: string, description: string): boolean {
  const text = (title + " " + description).toLowerCase();
  return /visa sponsor|relocation|work permit|sponsored visa|immigration support/i.test(text);
}

function computeHotScore(job: { posted_at: string; salary: string; visa_sponsorship: boolean; market: string; tag: string | null }): number {
  let score = 0;
  const hoursAgo = (Date.now() - new Date(job.posted_at).getTime()) / 3600000;
  if (hoursAgo < 24) score += 40;
  else if (hoursAgo < 48) score += 25;
  else if (hoursAgo < 72) score += 10;
  if (job.salary && job.salary !== "Competitive" && job.salary !== "Competitive tax-free") score += 20;
  if (job.visa_sponsorship) score += 25;
  if (["UAE", "Qatar", "Saudi Arabia", "Oman", "UK", "Canada", "Australia", "Germany"].includes(job.market)) score += 15;
  if (job.tag?.includes("Cruise")) score += 10;
  return score;
}

function extractCountry(location: string, market: string): string {
  const parts = location.split(",").map((s) => s.trim());
  if (parts.length > 1) return parts[parts.length - 1];
  return market;
}

// ─── Debug logger ───────────────────────────────────────────────────────────
interface FetchStats {
  source: string;
  fetched: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

// ─── JSearch fetcher ────────────────────────────────────────────────────────
async function fetchJSearchJobs(rapidApiKey: string): Promise<{ jobs: any[]; stats: FetchStats }> {
  const allJobs: any[] = [];
  const stats: FetchStats = { source: "jsearch", fetched: 0, inserted: 0, updated: 0, skipped: 0, errors: [] };

  for (const q of JSEARCH_QUERIES) {
    try {
      const url = new URL("https://jsearch.p.rapidapi.com/search");
      url.searchParams.set("query", q.query);
      url.searchParams.set("page", "1");
      url.searchParams.set("num_pages", "1");
      url.searchParams.set("date_posted", "3days");

      const res = await fetch(url.toString(), {
        headers: { "X-RapidAPI-Key": rapidApiKey, "X-RapidAPI-Host": "jsearch.p.rapidapi.com" },
      });

      if (!res.ok) {
        stats.errors.push(`Query "${q.query}": HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const jobs = data.data || [];
      stats.fetched += jobs.length;

      for (const job of jobs) {
        const industry = q.industry || guessIndustry(job.job_title || "", job.employer_name || "");
        const isGulf = ["UAE", "Qatar", "Saudi Arabia", "Oman"].includes(q.market);
        const isCruise = industry === "Cruise & Hospitality" && (job.job_title || "").toLowerCase().includes("cruise");
        const description = (job.job_description || "").substring(0, 3000);
        const title = job.job_title || "";
        const location = [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ") || q.market;
        const salary = job.job_min_salary && job.job_max_salary
          ? `KES ${Math.round(job.job_min_salary * 130).toLocaleString()}–${Math.round(job.job_max_salary * 130).toLocaleString()}/mo`
          : isGulf ? "Competitive tax-free" : "Competitive";
        const posted_at = job.job_posted_at_datetime_utc || new Date().toISOString();
        const visa = detectVisaSponsorship(title, description);
        const category = q.category || guessCategory(industry, q.market, q.tag || null, title);
        const tag = q.tag || (isCruise ? "🚢 Cruise Line" : isGulf ? "🔥 Gulf Hot" : visa ? "✈️ Visa Sponsor" : null);

        const jobObj: any = {
          external_id: job.job_id,
          title, company: job.employer_name || "Company", location, salary,
          type: mapType(job.job_employment_type ? [job.job_employment_type] : undefined),
          industry, market: q.market, posted_at, hot: false, tag,
          source: "jsearch", source_label: "JSearch",
          apply_url: job.job_apply_link || null, description,
          country: extractCountry(location, q.market), category,
          visa_sponsorship: visa, hot_score: 0, verified: false, featured: false,
          is_active: true, discovered_at: new Date().toISOString(),
        };
        jobObj.hot_score = computeHotScore(jobObj);
        jobObj.hot = jobObj.hot_score >= 50;
        allJobs.push(jobObj);
      }
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      stats.errors.push(`Query "${q.query}": ${err}`);
    }
  }
  return { jobs: allJobs, stats };
}

// ─── Adzuna fetcher ─────────────────────────────────────────────────────────
async function fetchAdzunaJobs(appId: string, appKey: string): Promise<{ jobs: any[]; stats: FetchStats }> {
  const allJobs: any[] = [];
  const stats: FetchStats = { source: "adzuna", fetched: 0, inserted: 0, updated: 0, skipped: 0, errors: [] };

  const queries = [
    { country: "ke", what: "jobs", market: "Kenya", category: "Kenya Jobs" },
    { country: "ke", what: "nurse", market: "Kenya", category: "Healthcare Jobs" },
    { country: "ke", what: "developer", market: "Kenya", category: "Kenya Jobs" },
    { country: "gb", what: "visa sponsorship", market: "UK", category: "Remote Jobs" },
    { country: "gb", what: "nurse", market: "UK", category: "Healthcare Jobs" },
    { country: "za", what: "jobs", market: "South Africa", category: "Remote Jobs" },
    { country: "in", what: "gulf jobs", market: "India", category: "Gulf Jobs" },
    { country: "au", what: "visa sponsorship", market: "Australia", category: "Remote Jobs" },
    { country: "de", what: "engineer", market: "Germany", category: "Engineering Jobs" },
    { country: "ca", what: "visa sponsorship", market: "Canada", category: "Remote Jobs" },
  ];

  for (const q of queries) {
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/${q.country}/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(q.what)}&results_per_page=20&max_days_old=3&sort_by=date`;
      const res = await fetch(url);
      if (!res.ok) {
        stats.errors.push(`Adzuna ${q.country}/${q.what}: HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      const results = data.results || [];
      stats.fetched += results.length;

      for (const r of results) {
        const title = r.title?.replace(/<[^>]*>/g, "").trim() || "";
        const company = r.company?.display_name || "Company";
        const location = r.location?.display_name || q.market;
        const salary = r.salary_min && r.salary_max
          ? `KES ${Math.round(r.salary_min * 130).toLocaleString()}–${Math.round(r.salary_max * 130).toLocaleString()}/yr`
          : "Competitive";
        const description = (r.description || "").substring(0, 3000).replace(/<[^>]*>/g, "");
        const posted_at = r.created || new Date().toISOString();
        const visa = detectVisaSponsorship(title, description);
        const industry = guessIndustry(title, company);
        const category = q.category || guessCategory(industry, q.market, null, title);
        const isGulf = ["UAE", "Qatar", "Saudi Arabia", "Oman"].includes(q.market);

        const jobObj: any = {
          external_id: `adzuna-${r.id}`,
          title, company, location, salary,
          type: r.contract_time === "full_time" ? "Full-time" : r.contract_time === "part_time" ? "Part-time" : "Full-time",
          industry, market: q.market, posted_at, hot: false,
          tag: isGulf ? "🔥 Gulf Hot" : visa ? "✈️ Visa Sponsor" : null,
          source: "adzuna", source_label: "Adzuna",
          apply_url: r.redirect_url || null, description,
          country: extractCountry(location, q.market), category,
          visa_sponsorship: visa, hot_score: 0, verified: false, featured: false,
          is_active: true, discovered_at: new Date().toISOString(),
        };
        jobObj.hot_score = computeHotScore(jobObj);
        jobObj.hot = jobObj.hot_score >= 50;
        allJobs.push(jobObj);
      }
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      stats.errors.push(`Adzuna ${q.country}/${q.what}: ${err}`);
    }
  }
  return { jobs: allJobs, stats };
}

// ─── Jooble fetcher ─────────────────────────────────────────────────────────
async function fetchJoobleJobs(apiKey: string): Promise<{ jobs: any[]; stats: FetchStats }> {
  const allJobs: any[] = [];
  const stats: FetchStats = { source: "jooble", fetched: 0, inserted: 0, updated: 0, skipped: 0, errors: [] };

  const queries = [
    { keywords: "cruise ship jobs", location: "", market: "USA", category: "Cruise Jobs", tag: "🚢 Cruise Line" },
    { keywords: "jobs in Dubai", location: "Dubai", market: "UAE", category: "Gulf Jobs", tag: "🔥 Gulf Hot" },
    { keywords: "jobs in Kenya", location: "Kenya", market: "Kenya", category: "Kenya Jobs", tag: null },
    { keywords: "nurse jobs abroad", location: "", market: "UK", category: "Healthcare Jobs", tag: null },
    { keywords: "visa sponsorship jobs", location: "", market: "UK", category: "Remote Jobs", tag: "✈️ Visa Sponsor" },
    { keywords: "driver jobs Dubai", location: "Dubai", market: "UAE", category: "Drivers & Logistics", tag: "🔥 Gulf Hot" },
    { keywords: "construction jobs Qatar", location: "Qatar", market: "Qatar", category: "Construction Jobs", tag: "🔥 Gulf Hot" },
    { keywords: "remote jobs Africa", location: "", market: "Kenya", category: "Remote Jobs", tag: "🌍 Remote" },
  ];

  for (const q of queries) {
    try {
      const res = await fetch(`https://jooble.org/api/${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: q.keywords, location: q.location, page: 1 }),
      });
      if (!res.ok) {
        stats.errors.push(`Jooble "${q.keywords}": HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      const results = data.jobs || [];
      stats.fetched += results.length;

      for (const r of results) {
        const title = (r.title || "").replace(/<[^>]*>/g, "").trim();
        if (!title) continue;
        const company = r.company || "Company";
        const location = r.location || q.market;
        const salary = r.salary ? `${r.salary}` : "Competitive";
        const description = (r.snippet || "").substring(0, 3000).replace(/<[^>]*>/g, "");
        const posted_at = r.updated || new Date().toISOString();
        const visa = detectVisaSponsorship(title, description);
        const industry = guessIndustry(title, company);
        const category = q.category || guessCategory(industry, q.market, q.tag, title);

        const jobObj: any = {
          external_id: r.id ? `jooble-${r.id}` : `jooble-${title.toLowerCase().replace(/\s+/g, "-").substring(0, 80)}`,
          title, company, location, salary,
          type: r.type || "Full-time",
          industry, market: q.market, posted_at, hot: false, tag: q.tag,
          source: "jooble", source_label: "Jooble",
          apply_url: r.link || null, description,
          country: extractCountry(location, q.market), category,
          visa_sponsorship: visa, hot_score: 0, verified: false, featured: false,
          is_active: true, discovered_at: new Date().toISOString(),
        };
        jobObj.hot_score = computeHotScore(jobObj);
        jobObj.hot = jobObj.hot_score >= 50;
        allJobs.push(jobObj);
      }
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      stats.errors.push(`Jooble "${q.keywords}": ${err}`);
    }
  }
  return { jobs: allJobs, stats };
}

// ─── Main handler ───────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const rapidApiKey = Deno.env.get("RAPIDAPI_KEY");
    const adzunaAppId = Deno.env.get("ADZUNA_APP_ID");
    const adzunaAppKey = Deno.env.get("ADZUNA_APP_KEY");
    const joobleApiKey = Deno.env.get("JOOBLE_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const allStats: FetchStats[] = [];
    const allJobs: any[] = [];

    // Fetch from all sources in parallel
    const promises: Promise<{ jobs: any[]; stats: FetchStats }>[] = [];
    if (rapidApiKey) promises.push(fetchJSearchJobs(rapidApiKey));
    if (adzunaAppId && adzunaAppKey) promises.push(fetchAdzunaJobs(adzunaAppId, adzunaAppKey));
    if (joobleApiKey) promises.push(fetchJoobleJobs(joobleApiKey));

    if (promises.length === 0) {
      console.log("⚠️ No API keys configured. Keeping existing jobs active.");
      const { count } = await supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true);
      console.log(`📊 Current active jobs: ${count}`);
      return new Response(
        JSON.stringify({ success: true, message: "No API keys, kept existing jobs", activeCount: count }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = await Promise.allSettled(promises);
    for (const r of results) {
      if (r.status === "fulfilled") {
        allJobs.push(...r.value.jobs);
        allStats.push(r.value.stats);
      } else {
        console.error("Source fetch failed:", r.reason);
      }
    }

    console.log(`📥 Total fetched: ${allJobs.length} from ${allStats.length} sources`);
    for (const s of allStats) {
      console.log(`  → ${s.source}: ${s.fetched} fetched, ${s.errors.length} errors`);
      if (s.errors.length) console.log(`    Errors: ${s.errors.slice(0, 5).join("; ")}`);
    }

    // Deduplicate: external_id first, then title+company+location
    const seenIds = new Set<string>();
    const seenKeys = new Set<string>();
    const uniqueJobs = allJobs.filter((j) => {
      if (j.external_id && seenIds.has(j.external_id)) return false;
      if (j.external_id) seenIds.add(j.external_id);
      const key = `${j.title.toLowerCase()}|${j.company.toLowerCase()}|${j.location.toLowerCase()}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

    const duplicatesSkipped = allJobs.length - uniqueJobs.length;
    console.log(`🔄 ${uniqueJobs.length} unique jobs (${duplicatesSkipped} duplicates skipped)`);

    // Upsert into database
    let insertedCount = 0;
    if (uniqueJobs.length > 0) {
      const { error } = await supabase.from("cached_jobs").upsert(uniqueJobs, {
        onConflict: "external_id,source",
        ignoreDuplicates: true,
      });

      if (error) {
        console.error("Bulk upsert error:", error.message);
        // Fallback: individual inserts
        for (const job of uniqueJobs) {
          const { error: insertErr } = await supabase.from("cached_jobs").upsert(job, {
            onConflict: "external_id,source",
            ignoreDuplicates: true,
          });
          if (!insertErr) insertedCount++;
        }
        console.log(`📝 Fallback: inserted ${insertedCount}/${uniqueJobs.length}`);
      } else {
        insertedCount = uniqueJobs.length;
        console.log(`✅ Bulk upserted ${insertedCount} jobs`);
      }
    }

    // ── FIX: Archive jobs by discovered_at (not posted_at) ──────────────────
    // Use discovered_at so we keep jobs YOU found recently,
    // regardless of when the employer originally posted them.
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data: archived } = await supabase
      .from("cached_jobs")
      .update({ is_active: false, hot: false, hot_score: 0 })
      .lt("discovered_at", sevenDaysAgo)
      .eq("is_active", true)
      .neq("source", "platform_seed")
      .select("id");
    console.log(`📦 Archived ${archived?.length || 0} stale jobs (discovered >7 days ago)`);

    // ── FIX: Delete by discovered_at (not created_at) ───────────────────────
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    await supabase
      .from("cached_jobs")
      .delete()
      .lt("discovered_at", thirtyDaysAgo)
      .neq("source", "platform_seed");

    // Guarantee minimum 200 active jobs: keep platform_seed active
    const { count: activeCount } = await supabase
      .from("cached_jobs")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);
    if ((activeCount || 0) < 200) {
      await supabase.from("cached_jobs").update({ is_active: true }).eq("source", "platform_seed");
      console.log(`⚡ Active jobs below 200 (${activeCount}), re-activated platform_seed jobs`);
    }

    // Update featured flags
    const { data: topJobs } = await supabase
      .from("cached_jobs")
      .select("id")
      .eq("is_active", true)
      .order("hot_score", { ascending: false })
      .limit(6);
    if (topJobs && topJobs.length > 0) {
      await supabase.from("cached_jobs").update({ featured: false }).eq("featured", true);
      const ids = topJobs.map(j => j.id);
      for (const id of ids) {
        await supabase.from("cached_jobs").update({ featured: true }).eq("id", id);
      }
    }

    // Final count
    const { count: finalActive } = await supabase
      .from("cached_jobs")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);
    console.log(`📊 Final active jobs: ${finalActive}`);
    console.log(`✅ Fetch cycle complete`);

    return new Response(
      JSON.stringify({
        success: true,
        fetched: allJobs.length,
        unique: uniqueJobs.length,
        inserted: insertedCount,
        duplicatesSkipped,
        archived: archived?.length || 0,
        activeJobs: finalActive,
        sources: allStats.map(s => ({ source: s.source, fetched: s.fetched, errors: s.errors.length })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ fetch-jobs error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
