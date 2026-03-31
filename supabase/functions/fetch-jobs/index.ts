import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function guessIndustry(title: string, employer: string): string {
  const t = (title + " " + employer).toLowerCase();
  if (/nurse|doctor|medical|health|hospital|pharma|dental/i.test(t)) return "Healthcare";
  if (/engineer|civil|mechanical|electrical|structural/i.test(t)) return "Engineering";
  if (/software|developer|data|devops|cloud|cyber/i.test(t)) return "Technology";
  if (/account|finance|bank|audit/i.test(t)) return "Finance";
  if (/teacher|lecturer|educat|school/i.test(t)) return "Education";
  if (/housemaid|nanny|housekeeper|domestic|caregiver/i.test(t)) return "Domestic & Housekeeping";
  if (/hotel|restaurant|chef|cruise|hospitality/i.test(t)) return "Cruise & Hospitality";
  if (/driv|transport|logist|warehouse/i.test(t)) return "Operations";
  return "Operations";
}

function detectVisa(title: string, desc: string): boolean {
  return /visa sponsor|relocation|work permit|sponsored visa/i.test(title + " " + desc);
}

function hotScore(job: any): number {
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

function extractCountry(location: string, market: string): string {
  const parts = location.split(",").map(s => s.trim());
  return parts.length > 1 ? parts[parts.length - 1] : market;
}

// ─── Adzuna: 5 queries, all parallel ───────────────────────────────────────
async function fetchAdzuna(appId: string, appKey: string): Promise<any[]> {
  const queries = [
    { country: "ke", what: "jobs", market: "Kenya", category: "Kenya Jobs" },
    { country: "gb", what: "visa sponsorship", market: "UK", category: "Remote Jobs" },
    { country: "au", what: "visa sponsorship", market: "Australia", category: "Remote Jobs" },
    { country: "ca", what: "visa sponsorship", market: "Canada", category: "Remote Jobs" },
    { country: "de", what: "engineer", market: "Germany", category: "Engineering Jobs" },
  ];

  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(`https://api.adzuna.com/v1/api/jobs/${q.country}/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(q.what)}&results_per_page=15&max_days_old=3&sort_by=date`)
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(data => ({ q, rows: data.results || [] }))
    )
  );

  const jobs: any[] = [];
  for (const r of results) {
    if (r.status === "rejected") { console.warn("Adzuna err:", r.reason); continue; }
    const { q, rows } = r.value;
    for (const row of rows) {
      const title = row.title?.replace(/<[^>]*>/g, "").trim() || "";
      if (!title) continue;
      const description = (row.description || "").substring(0, 2000).replace(/<[^>]*>/g, "");
      const visa = detectVisa(title, description);
      const job: any = {
        external_id: `adzuna-${row.id}`, title,
        company: row.company?.display_name || "Company",
        location: row.location?.display_name || q.market,
        salary: row.salary_min && row.salary_max
          ? `KES ${Math.round(row.salary_min * 130).toLocaleString()}–${Math.round(row.salary_max * 130).toLocaleString()}/yr`
          : "Competitive",
        type: row.contract_time === "part_time" ? "Part-time" : "Full-time",
        industry: guessIndustry(title, row.company?.display_name || ""),
        market: q.market, posted_at: row.created || new Date().toISOString(),
        hot: false, tag: visa ? "✈️ Visa Sponsor" : null,
        source: "adzuna", source_label: "Adzuna",
        apply_url: row.redirect_url || null, description,
        country: extractCountry(row.location?.display_name || q.market, q.market),
        category: q.category, visa_sponsorship: visa, hot_score: 0,
        verified: false, featured: false, is_active: true,
        discovered_at: new Date().toISOString(),
      };
      job.hot_score = hotScore(job);
      job.hot = job.hot_score >= 50;
      jobs.push(job);
    }
  }
  console.log(`Adzuna: ${jobs.length} jobs`);
  return jobs;
}

// ─── Jooble: 5 queries, all parallel ───────────────────────────────────────
async function fetchJooble(apiKey: string): Promise<any[]> {
  const queries = [
    { keywords: "jobs in Dubai", location: "Dubai", market: "UAE", category: "Gulf Jobs", tag: "🔥 Gulf Hot" },
    { keywords: "jobs in Kenya", location: "Kenya", market: "Kenya", category: "Kenya Jobs", tag: null },
    { keywords: "nurse jobs abroad", location: "", market: "UK", category: "Healthcare Jobs", tag: null },
    { keywords: "visa sponsorship jobs", location: "", market: "UK", category: "Remote Jobs", tag: "✈️ Visa Sponsor" },
    { keywords: "remote jobs Africa", location: "", market: "Kenya", category: "Remote Jobs", tag: "🌍 Remote" },
  ];

  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(`https://jooble.org/api/${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: q.keywords, location: q.location, page: 1 }),
      })
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(data => ({ q, rows: data.jobs || [] }))
    )
  );

  const jobs: any[] = [];
  for (const r of results) {
    if (r.status === "rejected") { console.warn("Jooble err:", r.reason); continue; }
    const { q, rows } = r.value;
    for (const row of rows) {
      const title = (row.title || "").replace(/<[^>]*>/g, "").trim();
      if (!title) continue;
      const description = (row.snippet || "").substring(0, 2000).replace(/<[^>]*>/g, "");
      const visa = detectVisa(title, description);
      const job: any = {
        external_id: row.id ? `jooble-${row.id}` : `jooble-${title.toLowerCase().replace(/\s+/g, "-").substring(0, 80)}`,
        title, company: row.company || "Company",
        location: row.location || q.market,
        salary: row.salary || "Competitive",
        type: row.type || "Full-time",
        industry: guessIndustry(title, row.company || ""),
        market: q.market, posted_at: row.updated || new Date().toISOString(),
        hot: false, tag: q.tag,
        source: "jooble", source_label: "Jooble",
        apply_url: row.link || null, description,
        country: extractCountry(row.location || q.market, q.market),
        category: q.category, visa_sponsorship: visa, hot_score: 0,
        verified: false, featured: false, is_active: true,
        discovered_at: new Date().toISOString(),
      };
      job.hot_score = hotScore(job);
      job.hot = job.hot_score >= 50;
      jobs.push(job);
    }
  }
  console.log(`Jooble: ${jobs.length} jobs`);
  return jobs;
}

// ─── Main handler ───────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const adzunaAppId = Deno.env.get("ADZUNA_APP_ID");
    const adzunaAppKey = Deno.env.get("ADZUNA_APP_KEY");
    const joobleApiKey = Deno.env.get("JOOBLE_API_KEY");

    // Fetch from both sources in parallel — no delays
    const promises: Promise<any[]>[] = [];
    if (adzunaAppId && adzunaAppKey) promises.push(fetchAdzuna(adzunaAppId, adzunaAppKey));
    if (joobleApiKey) promises.push(fetchJooble(joobleApiKey));

    if (promises.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No API keys configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const settled = await Promise.allSettled(promises);
    const allJobs: any[] = [];
    for (const r of settled) {
      if (r.status === "fulfilled") allJobs.push(...r.value);
      else console.error("Source failed:", r.reason);
    }

    // Deduplicate
    const seen = new Set<string>();
    const unique = allJobs.filter(j => {
      const key = j.external_id || `${j.title}|${j.company}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`📥 ${allJobs.length} fetched, ${unique.length} unique`);

    // Single batch upsert
    let inserted = 0;
    if (unique.length > 0) {
      const { error } = await supabase.from("cached_jobs").upsert(unique, {
        onConflict: "external_id,source",
        ignoreDuplicates: true,
      });
      if (error) console.error("Upsert error:", error.message);
      else inserted = unique.length;
    }

    // Archive stale jobs (>2 days) — single query
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
    await supabase.from("cached_jobs")
      .update({ is_active: false })
      .lt("discovered_at", twoDaysAgo)
      .eq("is_active", true)
      .neq("source", "platform_seed");

    // Re-activate seeds if below 200
    const { count } = await supabase.from("cached_jobs")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);
    if ((count || 0) < 200) {
      await supabase.from("cached_jobs").update({ is_active: true }).eq("source", "platform_seed");
    }

    console.log(`✅ Inserted ${inserted}, active: ${count}`);

    return new Response(
      JSON.stringify({ success: true, fetched: allJobs.length, inserted, active: count }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ fetch-jobs error:", error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
