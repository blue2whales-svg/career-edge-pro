import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── Search queries covering all target markets ────────────────────────────
const JSEARCH_QUERIES = [
  // Cruise & Hospitality
  { query: "cruise ship jobs", market: "USA", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line", category: "Cruise Jobs" },
  { query: "cruise line careers", market: "UK", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line", category: "Cruise Jobs" },
  { query: "cruise ship chef jobs", market: "USA", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line", category: "Cruise Jobs" },
  { query: "cruise ship entertainment jobs", market: "USA", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line", category: "Cruise Jobs" },
  // Domestic & Housekeeping
  { query: "housemaid jobs Dubai UAE", market: "UAE", industry: "Domestic & Housekeeping", tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "nanny jobs Saudi Arabia", market: "Saudi Arabia", industry: "Domestic & Housekeeping", tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "housekeeper jobs Qatar", market: "Qatar", industry: "Domestic & Housekeeping", tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "domestic worker jobs abroad", market: "UK", industry: "Domestic & Housekeeping", tag: null, category: "Hospitality Jobs" },
  { query: "caregiver jobs Canada visa sponsorship", market: "Canada", industry: "Domestic & Housekeeping", tag: null, category: "Healthcare Jobs" },
  // Gulf / Middle East
  { query: "jobs in Dubai UAE", market: "UAE", industry: null, tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "jobs in Qatar Doha", market: "Qatar", industry: null, tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "jobs in Saudi Arabia", market: "Saudi Arabia", industry: null, tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "jobs in Oman Muscat", market: "Oman", industry: null, tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  { query: "hotel jobs Dubai", market: "UAE", industry: "Cruise & Hospitality", tag: "🔥 Gulf Hot", category: "Hospitality Jobs" },
  { query: "construction jobs Qatar", market: "Qatar", industry: "Engineering", tag: "🔥 Gulf Hot", category: "Construction Jobs" },
  { query: "driver jobs Dubai UAE", market: "UAE", industry: "Operations", tag: "🔥 Gulf Hot", category: "Drivers & Logistics" },
  { query: "security guard jobs Saudi Arabia", market: "Saudi Arabia", industry: "Operations", tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  // Kenya local
  { query: "jobs in Nairobi Kenya", market: "Kenya", industry: null, tag: null, category: "Kenya Jobs" },
  { query: "jobs in Mombasa Kenya", market: "Kenya", industry: null, tag: null, category: "Kenya Jobs" },
  { query: "NGO jobs Kenya", market: "Kenya", industry: "NGO", tag: null, category: "Kenya Jobs" },
  { query: "accounting jobs Nairobi", market: "Kenya", industry: "Finance", tag: null, category: "Kenya Jobs" },
  { query: "teaching jobs Kenya", market: "Kenya", industry: "Education", tag: null, category: "Kenya Jobs" },
  // International with visa sponsorship
  { query: "visa sponsorship jobs UK", market: "UK", industry: null, tag: "✈️ Visa Sponsor", category: "Remote Jobs" },
  { query: "visa sponsorship jobs Canada", market: "Canada", industry: null, tag: "✈️ Visa Sponsor", category: "Remote Jobs" },
  { query: "visa sponsorship jobs Australia", market: "Australia", industry: null, tag: "✈️ Visa Sponsor", category: "Remote Jobs" },
  { query: "jobs in London UK for africans", market: "UK", industry: null, tag: null, category: "Remote Jobs" },
  { query: "jobs in Canada for immigrants", market: "Canada", industry: null, tag: null, category: "Remote Jobs" },
  { query: "jobs in Australia skilled workers", market: "Australia", industry: null, tag: null, category: "Remote Jobs" },
  { query: "jobs in Germany engineering", market: "Germany", industry: "Engineering", tag: null, category: "Engineering Jobs" },
  // Healthcare
  { query: "nursing jobs abroad", market: "UK", industry: "Healthcare", tag: null, category: "Healthcare Jobs" },
  { query: "nurse jobs Dubai", market: "UAE", industry: "Healthcare", tag: "🔥 Gulf Hot", category: "Healthcare Jobs" },
  { query: "nurse jobs Saudi Arabia", market: "Saudi Arabia", industry: "Healthcare", tag: "🔥 Gulf Hot", category: "Healthcare Jobs" },
  // Remote
  { query: "remote jobs Africa", market: "Kenya", industry: "Technology", tag: "🌍 Remote", category: "Remote Jobs" },
  { query: "remote customer service jobs", market: "Kenya", industry: "Operations", tag: "🌍 Remote", category: "Remote Jobs" },
  // Engineering & Construction
  { query: "civil engineer jobs Gulf", market: "UAE", industry: "Engineering", tag: "🔥 Gulf Hot", category: "Engineering Jobs" },
  { query: "construction jobs Dubai", market: "UAE", industry: "Engineering", tag: "🔥 Gulf Hot", category: "Construction Jobs" },
  // Drivers & Logistics
  { query: "driver jobs abroad", market: "UAE", industry: "Operations", tag: null, category: "Drivers & Logistics" },
  { query: "logistics jobs Dubai", market: "UAE", industry: "Operations", tag: "🔥 Gulf Hot", category: "Drivers & Logistics" },
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
  if (/consult|advisory|mckinn|deloitt/i.test(t)) return "Consulting";
  if (/govern|public service|county/i.test(t)) return "Government";
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

function computeHotScore(job: {
  posted_at: string;
  salary: string;
  visa_sponsorship: boolean;
  market: string;
  tag: string | null;
}): number {
  let score = 0;
  // Freshness: posted within 24h = +40, 48h = +25, 72h = +10
  const hoursAgo = (Date.now() - new Date(job.posted_at).getTime()) / 3600000;
  if (hoursAgo < 24) score += 40;
  else if (hoursAgo < 48) score += 25;
  else if (hoursAgo < 72) score += 10;

  // Salary visible
  if (job.salary && job.salary !== "Competitive" && job.salary !== "Competitive tax-free") score += 20;

  // Visa sponsorship
  if (job.visa_sponsorship) score += 25;

  // International/Gulf/Cruise
  if (["UAE", "Qatar", "Saudi Arabia", "Oman", "UK", "Canada", "Australia", "Germany"].includes(job.market)) score += 15;
  if (job.tag?.includes("Cruise")) score += 10;

  return score;
}

function timeAgo(dateStr: string | undefined): string {
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

function extractCountry(location: string, market: string): string {
  // Try to get country from location string
  const parts = location.split(",").map((s) => s.trim());
  if (parts.length > 1) return parts[parts.length - 1];
  return market;
}

// ─── JSearch fetcher ────────────────────────────────────────────────────────
async function fetchJSearchJobs(rapidApiKey: string): Promise<any[]> {
  const allJobs: any[] = [];

  for (const q of JSEARCH_QUERIES) {
    try {
      const url = new URL("https://jsearch.p.rapidapi.com/search");
      url.searchParams.set("query", q.query);
      url.searchParams.set("page", "1");
      url.searchParams.set("num_pages", "1");
      url.searchParams.set("date_posted", "3days");

      const res = await fetch(url.toString(), {
        headers: {
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      });

      if (!res.ok) {
        console.error(`JSearch error for "${q.query}": ${res.status}`);
        continue;
      }

      const data = await res.json();
      const jobs = data.data || [];

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

        const jobObj = {
          external_id: job.job_id,
          title,
          company: job.employer_name || "Company",
          location,
          salary,
          type: mapType(job.job_employment_type ? [job.job_employment_type] : undefined),
          industry,
          market: q.market,
          posted: timeAgo(posted_at),
          posted_at,
          hot: false, // will be set by hot_score
          tag,
          source: "jsearch",
          apply_url: job.job_apply_link || null,
          description,
          country: extractCountry(location, q.market),
          category,
          visa_sponsorship: visa,
          hot_score: 0, // computed below
          verified: false,
          featured: false,
        };
        jobObj.hot_score = computeHotScore(jobObj);
        jobObj.hot = jobObj.hot_score >= 50;

        allJobs.push(jobObj);
      }

      // Rate limiting: small delay between queries
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`JSearch fetch error for "${q.query}":`, err);
    }
  }

  return allJobs;
}

// ─── Firecrawl fetcher ──────────────────────────────────────────────────────
async function fetchFirecrawlJobs(firecrawlKey: string): Promise<any[]> {
  const allJobs: any[] = [];

  const SCRAPE_TARGETS = [
    { url: "https://www.allcruisejobs.com/search/", market: "USA", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line", category: "Cruise Jobs" },
    { url: "https://www.bayt.com/en/international/jobs/", market: "UAE", industry: null, tag: "🔥 Gulf Hot", category: "Gulf Jobs" },
  ];

  for (const target of SCRAPE_TARGETS) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${firecrawlKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: target.url,
          formats: [
            {
              type: "json",
              prompt: "Extract all job listings. For each job return: title, company, location, salary (if available), type (Full-time/Contract/Part-time), posted_date. Return as array of objects.",
              schema: {
                type: "object",
                properties: {
                  jobs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        company: { type: "string" },
                        location: { type: "string" },
                        salary: { type: "string" },
                        type: { type: "string" },
                        posted_date: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          ],
          onlyMainContent: true,
        }),
      });

      if (!res.ok) {
        console.error(`Firecrawl error for ${target.url}: ${res.status}`);
        continue;
      }

      const data = await res.json();
      const extracted = data?.data?.json?.jobs || data?.json?.jobs || [];

      for (const job of extracted) {
        if (!job.title) continue;
        const industry = target.industry || guessIndustry(job.title, job.company || "");
        const posted_at = new Date().toISOString();
        const visa = detectVisaSponsorship(job.title, "");
        const category = target.category || guessCategory(industry, target.market, target.tag, job.title);
        const salary = job.salary || "Competitive";

        const jobObj = {
          external_id: `fc-${target.market}-${job.title}`.replace(/\s+/g, "-").toLowerCase().substring(0, 100),
          title: job.title,
          company: job.company || "Company",
          location: job.location || target.market,
          salary,
          type: job.type || "Full-time",
          industry,
          market: target.market,
          posted: job.posted_date || "Recently",
          posted_at,
          hot: false,
          tag: target.tag,
          source: "firecrawl",
          apply_url: null,
          description: null,
          country: extractCountry(job.location || target.market, target.market),
          category,
          visa_sponsorship: visa,
          hot_score: 0,
          verified: false,
          featured: false,
        };
        jobObj.hot_score = computeHotScore(jobObj);
        jobObj.hot = jobObj.hot_score >= 50;

        allJobs.push(jobObj);
      }
    } catch (err) {
      console.error(`Firecrawl error for ${target.url}:`, err);
    }
  }

  return allJobs;
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
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const allJobs: any[] = [];

    // Fetch from all sources in parallel
    const promises: Promise<any[]>[] = [];
    if (rapidApiKey) promises.push(fetchJSearchJobs(rapidApiKey));
    if (firecrawlKey) promises.push(fetchFirecrawlJobs(firecrawlKey));

    if (promises.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No API keys configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = await Promise.allSettled(promises);
    for (const r of results) {
      if (r.status === "fulfilled") allJobs.push(...r.value);
    }

    console.log(`Fetched ${allJobs.length} total jobs`);

    // Deduplicate before insert (title+company+location)
    const seen = new Set<string>();
    const uniqueJobs = allJobs.filter((j) => {
      const key = `${j.title.toLowerCase()}|${j.company.toLowerCase()}|${j.location.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`${uniqueJobs.length} unique jobs after dedup`);

    // Upsert into database
    if (uniqueJobs.length > 0) {
      // Use external_id+source upsert, and also handle conflicts gracefully
      const { error } = await supabase.from("cached_jobs").upsert(uniqueJobs, {
        onConflict: "external_id,source",
        ignoreDuplicates: true,
      });

      if (error) {
        console.error("Upsert error:", error);
        // Try individual inserts as fallback for uniqueness conflicts
        let inserted = 0;
        for (const job of uniqueJobs) {
          const { error: insertErr } = await supabase.from("cached_jobs").upsert(job, {
            onConflict: "external_id,source",
            ignoreDuplicates: true,
          });
          if (!insertErr) inserted++;
        }
        console.log(`Fallback: inserted ${inserted}/${uniqueJobs.length}`);
      }
    }

    // Archive jobs older than 72 hours (mark as not hot, reduce score)
    const threeDaysAgo = new Date(Date.now() - 72 * 3600000).toISOString();
    await supabase
      .from("cached_jobs")
      .update({ hot: false, hot_score: 0 })
      .lt("posted_at", threeDaysAgo);

    // Delete jobs older than 14 days
    const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString();
    await supabase.from("cached_jobs").delete().lt("created_at", twoWeeksAgo);

    return new Response(
      JSON.stringify({ success: true, fetched: allJobs.length, unique: uniqueJobs.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("fetch-jobs error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
