import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function guessIndustry(title: string, employer: string): string {
  const t = (title + " " + employer).toLowerCase();
  if (/nurse|doctor|medical|health|hospital/i.test(t)) return "Healthcare";
  if (/engineer|civil|mechanical|electrical/i.test(t)) return "Engineering";
  if (/software|developer|data|devops|cloud/i.test(t)) return "Technology";
  if (/account|finance|bank|audit/i.test(t)) return "Finance";
  if (/teacher|lecturer|educat|school/i.test(t)) return "Education";
  if (/housemaid|nanny|housekeeper|domestic|caregiver/i.test(t)) return "Domestic & Housekeeping";
  if (/hotel|restaurant|chef|cruise|hospitality/i.test(t)) return "Cruise & Hospitality";
  if (/driv|transport|logist|warehouse/i.test(t)) return "Operations";
  return "Operations";
}

function detectVisaSponsorship(title: string, description: string): boolean {
  return /visa sponsor|relocation|work permit|sponsored visa/i.test(title + " " + description);
}

function computeHotScore(job: any): number {
  let score = 0;
  const hoursAgo = (Date.now() - new Date(job.posted_at).getTime()) / 3600000;
  if (hoursAgo < 24) score += 40;
  else if (hoursAgo < 48) score += 25;
  else if (hoursAgo < 72) score += 10;
  if (job.salary && job.salary !== "Competitive") score += 20;
  if (job.visa_sponsorship) score += 25;
  if (["UAE", "Qatar", "Saudi Arabia", "UK", "Canada", "Australia"].includes(job.market)) score += 15;
  return score;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const apiKey = Deno.env.get("JOOBLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing Jooble key" }), { status: 400, headers: corsHeaders });
    }

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

    const jobs: any[] = [];
    const errors: string[] = [];

    const results = await Promise.allSettled(
      queries.map(q =>
        fetch(`https://jooble.org/api/${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keywords: q.keywords, location: q.location, page: 1 }),
        })
          .then(r => r.json())
          .then(data => ({ q, results: data.jobs || [] }))
      )
    );

    for (const r of results) {
      if (r.status === "rejected") { errors.push(String(r.reason)); continue; }
      const { q, results: rows } = r.value;
      for (const row of rows) {
        const title = (row.title || "").replace(/<[^>]*>/g, "").trim();
        if (!title) continue;
        const description = (row.snippet || "").substring(0, 2000).replace(/<[^>]*>/g, "");
        const visa = detectVisaSponsorship(title, description);
        const industry = guessIndustry(title, row.company || "");
        const jobObj: any = {
          external_id: row.id ? `jooble-${row.id}` : `jooble-${title.toLowerCase().replace(/\s+/g, "-").substring(0, 80)}`,
          title,
          company: row.company || "Company",
          location: row.location || q.market,
          salary: row.salary ? `${row.salary}` : "Competitive",
          type: row.type || "Full-time",
          industry, market: q.market,
          posted_at: row.updated || new Date().toISOString(),
          hot: false, tag: q.tag,
          source: "jooble", source_label: "Jooble",
          apply_url: row.link || null, description,
          country: q.market, category: q.category,
          visa_sponsorship: visa, hot_score: 0,
          verified: false, featured: false, is_active: true,
          discovered_at: new Date().toISOString(),
        };
        jobObj.hot_score = computeHotScore(jobObj);
        jobObj.hot = jobObj.hot_score >= 50;
        jobs.push(jobObj);
      }
    }

    let inserted = 0;
    if (jobs.length > 0) {
      const { error } = await supabase.from("cached_jobs").upsert(jobs, {
        onConflict: "external_id,source",
        ignoreDuplicates: true,
      });
      if (error) {
        console.error("Upsert error:", error.message);
      } else {
        inserted = jobs.length;
      }
    }

    console.log(`✅ Jooble: fetched ${jobs.length}, inserted ${inserted}`);
    return new Response(
      JSON.stringify({ success: true, fetched: jobs.length, inserted, errors: errors.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("fetch-jooble error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
