import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function guessIndustry(title: string, employer: string): string {
  const t = (title + " " + employer).toLowerCase();
  if (/nurse|doctor|medical|health|hospital|pharma|dental|clinic/i.test(t)) return "Healthcare";
  if (/engineer|civil|mechanical|electrical|structural/i.test(t)) return "Engineering";
  if (/software|developer|data|devops|cloud|cyber|frontend|backend/i.test(t)) return "Technology";
  if (/account|finance|bank|audit|tax/i.test(t)) return "Finance";
  if (/teacher|lecturer|educat|school/i.test(t)) return "Education";
  if (/hotel|restaurant|chef|cruise|hospitality|waiter|barista|cook/i.test(t)) return "Hospitality";
  if (/driv|transport|logist|warehouse|delivery/i.test(t)) return "Logistics";
  if (/sales|marketing|business develop/i.test(t)) return "Sales";
  if (/admin|secretary|receptionist|office|hr\b|human resource/i.test(t)) return "Administration";
  if (/security|guard|surveillance/i.test(t)) return "Security";
  return "Operations";
}

function guessCategory(title: string, market: string, industry: string): string {
  if (market === "Cruise") return "Cruise Jobs";
  if (market === "Remote") return "Remote Jobs";
  if (["UAE", "Qatar", "Saudi Arabia", "Kuwait", "Bahrain", "Oman"].includes(market)) return "Gulf Jobs";
  if (market === "Kenya") return "Kenya Jobs";
  if (industry === "Healthcare") return "Healthcare Jobs";
  if (["UK", "Germany", "France", "Netherlands", "Belgium", "Austria", "Switzerland", "Italy", "Spain", "Poland", "Luxembourg", "Ireland", "Sweden", "Denmark", "Norway", "Finland", "Portugal", "Europe"].includes(market)) return "Europe Jobs";
  if (market === "USA") return "USA Jobs";
  if (["Singapore", "Malaysia", "India", "Japan"].includes(market)) return "Asia Jobs";
  if (market === "Australia") return "Australia Jobs";
  if (market === "Canada") return "Canada Jobs";
  return "Kenya Jobs";
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

// ─── Adzuna: 12 countries, all parallel ─────────────────────────────────────
async function fetchAdzuna(appId: string, appKey: string): Promise<any[]> {
  // Adzuna only supports these countries (gb, us, au, ca, de, fr, in, it, mx, nl, pl, sg, za, at, ch, be, nz, es).
  // Kenya & Gulf are NOT supported — those return 404. Kenya jobs come from platform_seed + scrapers.
  const kenyaQueries: any[] = [];
  const intlQueries = [
    { country: "gb", what: "visa sponsorship", market: "UK" },
    { country: "gb", what: "nurse healthcare", market: "UK" },
    { country: "gb", what: "jobs", market: "UK" },
    { country: "us", what: "visa sponsorship", market: "USA" },
    { country: "us", what: "jobs", market: "USA" },
    { country: "au", what: "visa sponsorship", market: "Australia" },
    { country: "au", what: "jobs", market: "Australia" },
    { country: "ca", what: "visa sponsorship", market: "Canada" },
    { country: "ca", what: "jobs", market: "Canada" },
    { country: "de", what: "engineer", market: "Germany" },
    { country: "de", what: "jobs", market: "Germany" },
    { country: "de", what: "english speaking", market: "Germany" },
    { country: "de", what: "visa sponsorship", market: "Germany" },
    { country: "de", what: "nurse pflege", market: "Germany" },
    { country: "fr", what: "jobs", market: "France" },
    { country: "fr", what: "english speaking", market: "France" },
    { country: "fr", what: "visa sponsorship", market: "France" },
    { country: "nl", what: "jobs", market: "Netherlands" },
    { country: "nl", what: "english speaking", market: "Netherlands" },
    { country: "nl", what: "visa sponsorship", market: "Netherlands" },
    { country: "be", what: "jobs", market: "Belgium" },
    { country: "be", what: "english speaking", market: "Belgium" },
    { country: "at", what: "jobs", market: "Austria" },
    { country: "at", what: "english speaking", market: "Austria" },
    { country: "ch", what: "jobs", market: "Switzerland" },
    { country: "ch", what: "english speaking", market: "Switzerland" },
    { country: "it", what: "jobs", market: "Italy" },
    { country: "it", what: "english speaking", market: "Italy" },
    { country: "es", what: "jobs", market: "Spain" },
    { country: "es", what: "english speaking", market: "Spain" },
    { country: "pl", what: "jobs", market: "Poland" },
    { country: "pl", what: "english speaking", market: "Poland" },
    { country: "sg", what: "jobs", market: "Singapore" },
    { country: "in", what: "jobs", market: "India" },
    { country: "za", what: "jobs", market: "South Africa" },
  ];
  const queries = [...kenyaQueries, ...intlQueries];

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  async function fetchOne(q: any, attempt = 0): Promise<{ q: any; rows: any[] }> {
    const url = `https://api.adzuna.com/v1/api/jobs/${q.country}/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(q.what)}&results_per_page=${q.country === "ke" ? 50 : 20}&max_days_old=${q.country === "ke" ? 7 : 3}&sort_by=date`;
    try {
      const r = await fetch(url);
      if (r.status === 429 || r.status === 503) {
        if (attempt < 3) {
          await sleep(2000 * (attempt + 1) + Math.random() * 1000);
          return fetchOne(q, attempt + 1);
        }
        console.warn(`Adzuna ${q.country} (${q.what}): ${r.status} after retries`);
        return { q, rows: [] };
      }
      if (!r.ok) {
        console.warn(`Adzuna ${q.country} (${q.what}): ${r.status}`);
        return { q, rows: [] };
      }
      const data = await r.json();
      return { q, rows: data.results || [] };
    } catch (err) {
      console.warn(`Adzuna fetch err ${q.country}:`, err);
      return { q, rows: [] };
    }
  }

  // Serialize Kenya queries (same country = strict per-IP throttle), run intl in parallel.
  const results: { q: any; rows: any[] }[] = [];
  for (const q of kenyaQueries) {
    results.push(await fetchOne(q));
    await sleep(800);
  }
  const intlResults = await Promise.all(intlQueries.map(q => fetchOne(q)));
  results.push(...intlResults);

  const jobs: any[] = [];
  for (const r of results) {
    const { q, rows } = r;
    for (const row of rows) {
      const title = row.title?.replace(/<[^>]*>/g, "").trim() || "";
      if (!title) continue;
      const description = (row.description || "").substring(0, 2000).replace(/<[^>]*>/g, "");
      const visa = detectVisa(title, description);
      const industry = guessIndustry(title, row.company?.display_name || "");
      const category = guessCategory(title, q.market, industry);
      const currMap: Record<string, string> = { ke: "KES", gb: "GBP", us: "USD", au: "AUD", ca: "CAD", de: "EUR", fr: "EUR", nl: "EUR", be: "EUR", at: "EUR", it: "EUR", es: "EUR", ch: "CHF", pl: "PLN", ae: "AED", sa: "SAR", qa: "QAR", kw: "KWD", bh: "BHD", om: "OMR" };
      const curr = currMap[q.country] || "USD";
      const job: any = {
        external_id: `adzuna-${row.id}`, title,
        company: row.company?.display_name || "Company",
        location: row.location?.display_name || q.market,
        salary: row.salary_min && row.salary_max
          ? `${curr} ${Math.round(row.salary_min).toLocaleString()}–${Math.round(row.salary_max).toLocaleString()}/yr`
          : "Competitive",
        type: row.contract_time === "part_time" ? "Part-time" : "Full-time",
        industry, market: q.market,
        posted_at: row.created || new Date().toISOString(),
        hot: false, tag: visa ? "✈️ Visa Sponsor" : null,
        source: "adzuna", source_label: "Adzuna",
        apply_url: row.redirect_url || null, description,
        country: q.market, category,
        visa_sponsorship: visa, hot_score: 0,
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

// ─── Jooble: 11 queries, all parallel ───────────────────────────────────────
async function fetchJooble(apiKey: string): Promise<any[]> {
  const queries = [
    { keywords: "jobs in Kenya", location: "Kenya", market: "Kenya", tag: null },
    { keywords: "Nairobi jobs", location: "Nairobi", market: "Kenya", tag: null },
    { keywords: "Mombasa jobs", location: "Mombasa", market: "Kenya", tag: null },
    { keywords: "driver jobs Kenya", location: "Kenya", market: "Kenya", tag: null },
    { keywords: "accountant jobs Kenya", location: "Kenya", market: "Kenya", tag: null },
    { keywords: "sales jobs Kenya", location: "Kenya", market: "Kenya", tag: null },
    { keywords: "nurse jobs Kenya", location: "Kenya", market: "Kenya", tag: null },
    { keywords: "teacher jobs Kenya", location: "Kenya", market: "Kenya", tag: null },
    { keywords: "NGO jobs Kenya", location: "Kenya", market: "Kenya", tag: null },
    { keywords: "IT developer Kenya", location: "Kenya", market: "Kenya", tag: null },
    { keywords: "jobs in Dubai", location: "Dubai", market: "UAE", tag: "🔥 Gulf Hot" },
    { keywords: "jobs in Qatar", location: "Qatar", market: "Qatar", tag: "🔥 Gulf Hot" },
    { keywords: "jobs in Saudi Arabia", location: "Saudi Arabia", market: "Saudi Arabia", tag: "🔥 Gulf Hot" },
    { keywords: "jobs in Kuwait", location: "Kuwait", market: "Kuwait", tag: "🔥 Gulf Hot" },
    { keywords: "cruise ship jobs", location: "", market: "Cruise", tag: "🚢 Cruise Line" },
    { keywords: "remote jobs Africa", location: "", market: "Remote", tag: "🌍 Remote" },
    { keywords: "remote work from home", location: "", market: "Remote", tag: "🌍 Remote" },
    { keywords: "nurse jobs abroad visa sponsorship", location: "", market: "UK", tag: "✈️ Visa Sponsor" },
    { keywords: "visa sponsorship jobs Europe", location: "Europe", market: "Europe", tag: "✈️ Visa Sponsor" },
    { keywords: "jobs Luxembourg", location: "Luxembourg", market: "Luxembourg", tag: "✈️ Visa Sponsor" },
    { keywords: "english speaking jobs Luxembourg", location: "Luxembourg", market: "Luxembourg", tag: "✈️ Visa Sponsor" },
    { keywords: "jobs Ireland", location: "Ireland", market: "Ireland", tag: "✈️ Visa Sponsor" },
    { keywords: "jobs Sweden", location: "Sweden", market: "Sweden", tag: "✈️ Visa Sponsor" },
    { keywords: "jobs Denmark", location: "Denmark", market: "Denmark", tag: "✈️ Visa Sponsor" },
    { keywords: "jobs Norway", location: "Norway", market: "Norway", tag: "✈️ Visa Sponsor" },
    { keywords: "jobs Finland", location: "Finland", market: "Finland", tag: "✈️ Visa Sponsor" },
    { keywords: "jobs Portugal", location: "Portugal", market: "Portugal", tag: "✈️ Visa Sponsor" },
    { keywords: "jobs Netherlands english", location: "Netherlands", market: "Netherlands", tag: "✈️ Visa Sponsor" },
    { keywords: "jobs Germany english", location: "Germany", market: "Germany", tag: "✈️ Visa Sponsor" },
    { keywords: "jobs France english", location: "France", market: "France", tag: "✈️ Visa Sponsor" },
  ];

  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(`https://jooble.org/api/${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: q.keywords, location: q.location, page: 1 }),
      })
        .then(r => r.ok ? r.json() : Promise.reject(`Jooble ${q.market}: ${r.status}`))
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
      const industry = guessIndustry(title, row.company || "");
      const category = guessCategory(title, q.market, industry);
      const job: any = {
        external_id: row.id ? `jooble-${row.id}` : `jooble-${title.toLowerCase().replace(/\s+/g, "-").substring(0, 80)}`,
        title, company: row.company || "Company",
        location: row.location || q.market,
        salary: row.salary || "Competitive",
        type: row.type || "Full-time",
        industry, market: q.market,
        posted_at: row.updated || new Date().toISOString(),
        hot: false, tag: visa ? "✈️ Visa Sponsor" : q.tag,
        source: "jooble", source_label: "Jooble",
        apply_url: row.link || null, description,
        country: q.market, category,
        visa_sponsorship: visa, hot_score: 0,
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

// ─── Main handler ────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Parse body once
    let body: any = {};
    if (req.method === "POST") {
      try { body = await req.json(); } catch { body = {}; }
    }

    // ── Feed mode: serve jobs data to the frontend ──────────────────────────
    if (body.mode === "feed") {
      return await handleFeedMode(supabase, body);
    }

    const adzunaAppId = Deno.env.get("ADZUNA_APP_ID");
    const adzunaAppKey = Deno.env.get("ADZUNA_APP_KEY");
    const joobleApiKey = Deno.env.get("JOOBLE_API_KEY");

    // Fetch from all sources in parallel
    const promises: Promise<any[]>[] = [];
    if (adzunaAppId && adzunaAppKey) promises.push(fetchAdzuna(adzunaAppId, adzunaAppKey));
    if (joobleApiKey) promises.push(fetchJooble(joobleApiKey));

    const settled = await Promise.allSettled(promises);
    const allJobs: any[] = [];
    for (const r of settled) {
      if (r.status === "fulfilled") allJobs.push(...r.value);
      else console.error("Source failed:", r.reason);
    }

    // Deduplicate by external_id
    const seen = new Set<string>();
    const unique = allJobs.filter(j => {
      const key = j.external_id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`📥 ${allJobs.length} fetched, ${unique.length} unique`);

    // Batch upsert in chunks of 100
    let inserted = 0;
    const BATCH = 100;
    for (let i = 0; i < unique.length; i += BATCH) {
      const batch = unique.slice(i, i + BATCH);
      const { error } = await supabase.from("cached_jobs").upsert(batch, {
        onConflict: "external_id,source",
        ignoreDuplicates: false,
      });
      if (error) console.error("Upsert error:", error.message);
      else inserted += batch.length;
    }

    // Delete jobs older than 3 days (except platform_seed)
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
    await supabase.from("cached_jobs")
      .delete()
      .lt("discovered_at", threeDaysAgo)
      .neq("source", "platform_seed");

    // Get active count
    const { count } = await supabase.from("cached_jobs")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    console.log(`✅ Inserted/updated ${inserted}, active: ${count}`);

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

// ─── Feed mode handler ──────────────────────────────────────────────────────
const GULF_MARKETS = ["UAE", "Qatar", "Saudi Arabia", "Kuwait", "Bahrain", "Oman"];
const EUROPE_MARKETS = ["Europe", "Germany", "UK", "France", "Netherlands", "Belgium", "Austria", "Switzerland", "Italy", "Spain", "Poland", "Luxembourg", "Ireland", "Sweden", "Denmark", "Norway", "Finland", "Portugal"];
const ASIA_MARKETS = ["Singapore", "Malaysia", "India", "Japan"];
const CATEGORY_TO_MARKETS: Record<string, string[]> = {
  "Gulf Jobs": GULF_MARKETS,
  "Europe Jobs": EUROPE_MARKETS,
  "Asia Jobs": ASIA_MARKETS,
};

async function handleFeedMode(supabase: any, body: any) {
  const page = Math.max(0, Number(body.page ?? 0));
  const pageSize = Math.min(Math.max(1, Number(body.pageSize ?? 20)), 200);
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const filters = body.filters || {};

  // Build main jobs query
  let q = supabase
    .from("cached_jobs")
    .select("*", { count: "exact" })
    .eq("is_active", true);

  q = applyFilters(q, filters);
  q = q.order("posted_at", { ascending: false, nullsFirst: false })
       .order("hot_score", { ascending: false })
       .range(from, to);

  // Featured query (hot jobs, sorted by score)
  const featuredP = body.includeFeatured
    ? supabase
        .from("cached_jobs")
        .select("*")
        .eq("is_active", true)
        .eq("hot", true)
        .order("hot_score", { ascending: false })
        .order("posted_at", { ascending: false, nullsFirst: false })
        .limit(6)
    : Promise.resolve({ data: [] });

  // Counts: use individual count queries to avoid row limits
  const countFilter = (col: string, val: string) =>
    supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true).eq(col, val);
  const countIn = (col: string, vals: string[]) =>
    supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true).in(col, vals);

  const countsP = body.includeCounts
    ? Promise.all([
        supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true),
        countFilter("market", "Kenya"),
        countIn("market", GULF_MARKETS),
        countFilter("market", "Cruise"),
        countFilter("market", "Remote"),
        supabase.from("cached_jobs").select("*", { count: "exact", head: true }).eq("is_active", true).eq("visa_sponsorship", true),
        countFilter("industry", "Healthcare"),
        countFilter("market", "UK"),
        countFilter("market", "Australia"),
        countFilter("market", "Germany"),
        countFilter("market", "Canada"),
        countIn("market", EUROPE_MARKETS),
        countIn("market", ASIA_MARKETS),
        countFilter("market", "USA"),
      ])
    : null;

  const [jobsRes, featuredRes, countsRes] = await Promise.all([q, featuredP, countsP || Promise.resolve(null)]);

  if (jobsRes.error) throw jobsRes.error;

  // Compute counts from individual queries
  const counts: Record<string, number> = {
    kenya: 0, gulf: 0, cruise: 0, remote: 0, visa: 0,
    healthcare: 0, uk: 0, australia: 0, germany: 0, canada: 0, europe: 0, asia: 0, usa: 0, total: 0,
  };
  if (countsRes && Array.isArray(countsRes)) {
    counts.total = countsRes[0]?.count ?? 0;
    counts.kenya = countsRes[1]?.count ?? 0;
    counts.gulf = countsRes[2]?.count ?? 0;
    counts.cruise = countsRes[3]?.count ?? 0;
    counts.remote = countsRes[4]?.count ?? 0;
    counts.visa = countsRes[5]?.count ?? 0;
    counts.healthcare = countsRes[6]?.count ?? 0;
    counts.uk = countsRes[7]?.count ?? 0;
    counts.australia = countsRes[8]?.count ?? 0;
    counts.germany = countsRes[9]?.count ?? 0;
    counts.canada = countsRes[10]?.count ?? 0;
    counts.europe = countsRes[11]?.count ?? 0;
    counts.asia = countsRes[12]?.count ?? 0;
    counts.usa = countsRes[13]?.count ?? 0;
  }

  return new Response(JSON.stringify({
    success: true,
    jobs: jobsRes.data || [],
    totalCount: jobsRes.count ?? 0,
    page,
    featured: featuredRes.data || [],
    counts,
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

function applyFilters(query: any, f: any) {
  if (f.search) {
    const s = `%${f.search.trim()}%`;
    query = query.or(`title.ilike.${s},company.ilike.${s},location.ilike.${s}`);
  }
  if (f.company) {
    query = query.ilike("company", `%${f.company.trim()}%`);
  }
  if (f.category && f.category !== "All Categories") {
    const mg = CATEGORY_TO_MARKETS[f.category];
    if (mg) query = query.in("market", mg);
    else query = query.eq("category", f.category);
  }
  if (f.industry && f.industry !== "All" && f.industry !== "🔥 Hot Abroad") {
    query = query.eq("industry", f.industry);
  }
  if (f.industry === "🔥 Hot Abroad") {
    query = query.eq("hot", true);
  }
  if (f.market && f.market !== "All Markets") {
    query = query.eq("market", f.market);
  }
  if (f.hotOnly) query = query.eq("hot", true);
  if (f.visaOnly) query = query.eq("visa_sponsorship", true);
  return query;
}
