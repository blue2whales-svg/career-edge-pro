import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Search queries to cover all target markets
const JSEARCH_QUERIES = [
  // Cruise & hospitality
  { query: "cruise ship jobs", market: "USA", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line" },
  { query: "cruise line careers", market: "UK", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line" },
  // Domestic & Housekeeping
  { query: "housemaid jobs Dubai UAE", market: "UAE", industry: "Domestic & Housekeeping", tag: "🔥 Gulf Hot" },
  { query: "nanny jobs Saudi Arabia", market: "Saudi Arabia", industry: "Domestic & Housekeeping", tag: "🔥 Gulf Hot" },
  { query: "housekeeper jobs Qatar", market: "Qatar", industry: "Domestic & Housekeeping", tag: "🔥 Gulf Hot" },
  { query: "domestic worker jobs abroad", market: "UK", industry: "Domestic & Housekeeping", tag: null },
  // Gulf / Middle East
  { query: "jobs in Dubai UAE", market: "UAE", industry: null, tag: "🔥 Gulf Hot" },
  { query: "jobs in Qatar Doha", market: "Qatar", industry: null, tag: "🔥 Gulf Hot" },
  { query: "jobs in Saudi Arabia", market: "Saudi Arabia", industry: null, tag: "🔥 Gulf Hot" },
  { query: "jobs in Oman Muscat", market: "Oman", industry: null, tag: "🔥 Gulf Hot" },
  // Kenya local
  { query: "jobs in Nairobi Kenya", market: "Kenya", industry: null, tag: null },
  { query: "jobs in Mombasa Kenya", market: "Kenya", industry: null, tag: null },
  // International
  { query: "jobs in London UK for africans", market: "UK", industry: null, tag: null },
  { query: "jobs in Canada for immigrants", market: "Canada", industry: null, tag: null },
  { query: "jobs in Australia skilled workers", market: "Australia", industry: null, tag: null },
  { query: "jobs in Germany engineering", market: "Germany", industry: null, tag: null },
  { query: "nursing jobs abroad", market: "UK", industry: "Healthcare", tag: null },
];

// Map JSearch employment types
function mapType(types: string[] | undefined): string {
  if (!types || types.length === 0) return "Full-time";
  if (types.includes("FULLTIME")) return "Full-time";
  if (types.includes("CONTRACTOR") || types.includes("INTERN")) return "Contract";
  if (types.includes("PARTTIME")) return "Part-time";
  return "Full-time";
}

// Guess industry from title/description
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
  if (/hotel|restaurant|chef|cruise|hospitality|waiter|bartend|spa|cabin crew/i.test(t)) return "Cruise & Hospitality";
  if (/oil|gas|petrol|energy/i.test(t)) return "Oil & Gas";
  if (/ngo|unicef|world vision|red cross|amref/i.test(t)) return "NGO";
  if (/consult|advisory|mckinn|deloitt/i.test(t)) return "Consulting";
  if (/govern|public service|county/i.test(t)) return "Government";
  return "Operations";
}

function timeAgo(dateStr: string | undefined): string {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

async function fetchJSearchJobs(rapidApiKey: string): Promise<any[]> {
  const allJobs: any[] = [];

  for (const q of JSEARCH_QUERIES) {
    try {
      const url = new URL("https://jsearch.p.rapidapi.com/search");
      url.searchParams.set("query", q.query);
      url.searchParams.set("page", "1");
      url.searchParams.set("num_pages", "1");
      url.searchParams.set("date_posted", "week");

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

        allJobs.push({
          external_id: job.job_id,
          title: job.job_title,
          company: job.employer_name || "Company",
          location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ") || q.market,
          salary: job.job_min_salary && job.job_max_salary
            ? `KES ${Math.round(job.job_min_salary * 130).toLocaleString()}–${Math.round(job.job_max_salary * 130).toLocaleString()}/mo`
            : isGulf ? "Competitive tax-free" : "Competitive",
          type: mapType(job.job_employment_type ? [job.job_employment_type] : undefined),
          industry,
          market: q.market,
          posted: timeAgo(job.job_posted_at_datetime_utc),
          posted_at: job.job_posted_at_datetime_utc || new Date().toISOString(),
          hot: isGulf || isCruise,
          tag: q.tag || (isCruise ? "🚢 Cruise Line" : isGulf ? "🔥 Gulf Hot" : null),
          source: "jsearch",
          apply_url: job.job_apply_link || null,
          description: (job.job_description || "").substring(0, 2000),
        });
      }
    } catch (err) {
      console.error(`JSearch fetch error for "${q.query}":`, err);
    }
  }

  return allJobs;
}

async function fetchFirecrawlJobs(firecrawlKey: string): Promise<any[]> {
  const allJobs: any[] = [];

  // Scrape niche cruise/Gulf job boards
  const SCRAPE_TARGETS = [
    { url: "https://www.allcruisejobs.com/search/", market: "USA", industry: "Cruise & Hospitality", tag: "🚢 Cruise Line" },
    { url: "https://www.bayt.com/en/international/jobs/", market: "UAE", industry: null, tag: "🔥 Gulf Hot" },
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
        allJobs.push({
          external_id: `fc-${target.market}-${job.title}`.replace(/\s+/g, "-").toLowerCase().substring(0, 100),
          title: job.title,
          company: job.company || "Company",
          location: job.location || target.market,
          salary: job.salary || "Competitive",
          type: job.type || "Full-time",
          industry,
          market: target.market,
          posted: job.posted_date || "Recently",
          posted_at: new Date().toISOString(),
          hot: ["UAE", "Qatar", "Saudi Arabia", "Oman"].includes(target.market),
          tag: target.tag,
          source: "firecrawl",
          apply_url: null,
          description: null,
        });
      }
    } catch (err) {
      console.error(`Firecrawl error for ${target.url}:`, err);
    }
  }

  return allJobs;
}

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

    // Fetch from both sources in parallel
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

    // Upsert into database
    if (allJobs.length > 0) {
      const { error } = await supabase.from("cached_jobs").upsert(allJobs, {
        onConflict: "external_id,source",
        ignoreDuplicates: false,
      });

      if (error) {
        console.error("Upsert error:", error);
      }
    }

    // Clean up jobs older than 14 days
    const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString();
    await supabase.from("cached_jobs").delete().lt("created_at", twoWeeksAgo);

    return new Response(
      JSON.stringify({ success: true, fetched: allJobs.length }),
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
