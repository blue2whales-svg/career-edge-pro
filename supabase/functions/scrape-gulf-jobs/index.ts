// Scrapes fresh Gulf job listings (UAE, Qatar, Saudi Arabia, Kuwait, Bahrain, Oman)
// from Bayt, GulfTalent and Naukrigulf via Firecrawl, then upserts into cached_jobs.
// Scheduled hourly via pg_cron.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

type Source = { url: string; source_label: string; market: string; country: string };

const SOURCES: Source[] = [
  // UAE
  { url: "https://www.bayt.com/en/uae/jobs/", source_label: "Bayt", market: "UAE", country: "UAE" },
  { url: "https://www.naukrigulf.com/jobs-in-uae", source_label: "Naukrigulf", market: "UAE", country: "UAE" },
  { url: "https://www.gulftalent.com/uae/jobs", source_label: "GulfTalent", market: "UAE", country: "UAE" },
  // Qatar
  { url: "https://www.bayt.com/en/qatar/jobs/", source_label: "Bayt", market: "Qatar", country: "Qatar" },
  { url: "https://www.naukrigulf.com/jobs-in-qatar", source_label: "Naukrigulf", market: "Qatar", country: "Qatar" },
  // Saudi Arabia
  { url: "https://www.bayt.com/en/saudi-arabia/jobs/", source_label: "Bayt", market: "Saudi Arabia", country: "Saudi Arabia" },
  { url: "https://www.naukrigulf.com/jobs-in-saudi-arabia", source_label: "Naukrigulf", market: "Saudi Arabia", country: "Saudi Arabia" },
  // Kuwait
  { url: "https://www.bayt.com/en/kuwait/jobs/", source_label: "Bayt", market: "Kuwait", country: "Kuwait" },
  { url: "https://www.naukrigulf.com/jobs-in-kuwait", source_label: "Naukrigulf", market: "Kuwait", country: "Kuwait" },
  // Bahrain
  { url: "https://www.bayt.com/en/bahrain/jobs/", source_label: "Bayt", market: "Bahrain", country: "Bahrain" },
  { url: "https://www.naukrigulf.com/jobs-in-bahrain", source_label: "Naukrigulf", market: "Bahrain", country: "Bahrain" },
  // Oman
  { url: "https://www.bayt.com/en/oman/jobs/", source_label: "Bayt", market: "Oman", country: "Oman" },
  { url: "https://www.naukrigulf.com/jobs-in-oman", source_label: "Naukrigulf", market: "Oman", country: "Oman" },
];

const JOBS_SCHEMA = {
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
          job_type: { type: "string", description: "Full-time, Part-time, Contract, etc." },
          industry: { type: "string" },
          posted: { type: "string", description: "When the job was posted, e.g. '2 days ago'" },
          apply_url: { type: "string", description: "Absolute URL to apply for the job" },
          description: { type: "string", description: "Short job summary (max 300 chars)" },
        },
        required: ["title", "company"],
      },
    },
  },
};

function guessIndustry(title: string, employer: string): string {
  const t = (title + " " + employer).toLowerCase();
  if (/nurse|doctor|medical|health|hospital|pharma|dental/i.test(t)) return "Healthcare";
  if (/engineer|civil|mechanical|electrical/i.test(t)) return "Engineering";
  if (/software|developer|data|devops|cloud|cyber/i.test(t)) return "Technology";
  if (/account|finance|bank|audit/i.test(t)) return "Finance";
  if (/teacher|lecturer|educat|school/i.test(t)) return "Education";
  if (/hotel|restaurant|chef|hospitality|waiter|cook/i.test(t)) return "Hospitality";
  if (/driv|transport|logist|warehouse|delivery/i.test(t)) return "Logistics";
  if (/sales|marketing|business develop/i.test(t)) return "Sales";
  if (/admin|secretary|receptionist|office|hr\b/i.test(t)) return "Administration";
  if (/security|guard/i.test(t)) return "Security";
  if (/housemaid|nanny|housekeeper|domestic|caregiver/i.test(t)) return "Domestic & Housekeeping";
  return "Operations";
}

function detectVisa(title: string, description: string): boolean {
  return /visa sponsor|relocation|work permit|sponsored visa|free visa|visa provided/i.test(title + " " + description);
}

function parsePostedAgo(s: string | undefined): string {
  if (!s) return new Date().toISOString();
  const t = s.toLowerCase();
  const num = parseInt(t.match(/\d+/)?.[0] || "0", 10);
  const now = Date.now();
  if (/minute|min/.test(t)) return new Date(now - num * 60_000).toISOString();
  if (/hour|hr/.test(t)) return new Date(now - num * 3_600_000).toISOString();
  if (/day/.test(t)) return new Date(now - num * 86_400_000).toISOString();
  if (/week/.test(t)) return new Date(now - num * 7 * 86_400_000).toISOString();
  if (/month/.test(t)) return new Date(now - num * 30 * 86_400_000).toISOString();
  return new Date().toISOString();
}

function computeHotScore(job: any): number {
  let score = 15; // Gulf bonus
  const hoursAgo = (Date.now() - new Date(job.posted_at).getTime()) / 3600000;
  if (hoursAgo < 24) score += 40;
  else if (hoursAgo < 48) score += 25;
  else if (hoursAgo < 72) score += 10;
  if (job.salary && job.salary !== "Competitive") score += 20;
  if (job.visa_sponsorship) score += 25;
  return score;
}

async function firecrawlScrape(apiKey: string, url: string): Promise<any[]> {
  const res = await fetch(`${FIRECRAWL_V2}/scrape`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      onlyMainContent: true,
      formats: [
        {
          type: "json",
          schema: JOBS_SCHEMA,
          prompt:
            "Extract every job listing visible on this Gulf jobs page. Include title, company, location, salary if shown, job type, industry, when it was posted, the absolute apply URL, and a short description.",
        },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.warn(`Firecrawl ${url}: ${res.status} ${JSON.stringify(data).slice(0, 200)}`);
    return [];
  }
  const jobs =
    data?.data?.json?.jobs ||
    data?.json?.jobs ||
    data?.data?.extract?.jobs ||
    [];
  return Array.isArray(jobs) ? jobs : [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "FIRECRAWL_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const all: any[] = [];
    // Run in parallel for speed
    const results = await Promise.allSettled(
      SOURCES.map(async (s) => {
        const rows = await firecrawlScrape(apiKey, s.url);
        return { s, rows };
      }),
    );

    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      const { s, rows } = r.value;
      for (const row of rows) {
        const title = (row.title || "").trim();
        if (!title) continue;
        const company = (row.company || "Confidential Employer").trim();
        const description = (row.description || "").substring(0, 1000);
        const visa = detectVisa(title, description);
        const industry = (row.industry || "").trim() || guessIndustry(title, company);
        const posted_at = parsePostedAgo(row.posted);
        const id = `${s.source_label.toLowerCase()}-${s.market.toLowerCase()}-${title}-${company}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .substring(0, 100);
        const job: any = {
          external_id: id,
          title,
          company,
          location: (row.location || s.market).trim(),
          salary: (row.salary || "Competitive").trim(),
          type: row.job_type || "Full-time",
          industry,
          market: s.market,
          posted_at,
          hot: false,
          tag: "🔥 Gulf Hot",
          source: s.source_label.toLowerCase(),
          source_label: s.source_label,
          apply_url: row.apply_url || s.url,
          description,
          country: s.country,
          category: "Gulf Jobs",
          visa_sponsorship: visa,
          hot_score: 0,
          verified: false,
          featured: false,
          is_active: true,
          discovered_at: new Date().toISOString(),
        };
        job.hot_score = computeHotScore(job);
        job.hot = job.hot_score >= 50;
        all.push(job);
      }
    }

    // Dedupe by external_id
    const seen = new Set<string>();
    const unique = all.filter((j) => {
      if (seen.has(j.external_id)) return false;
      seen.add(j.external_id);
      return true;
    });

    let inserted = 0;
    if (unique.length > 0) {
      const { error } = await supabase
        .from("cached_jobs")
        .upsert(unique, { onConflict: "external_id,source", ignoreDuplicates: false });
      if (error) console.error("Upsert error:", error.message);
      else inserted = unique.length;
    }

    console.log(`✅ Gulf scrape: ${all.length} fetched, ${unique.length} unique, ${inserted} upserted`);
    return new Response(
      JSON.stringify({ success: true, fetched: all.length, unique: unique.length, inserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("scrape-gulf-jobs error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
