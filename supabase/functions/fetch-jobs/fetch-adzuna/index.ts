import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    const appId = Deno.env.get("ADZUNA_APP_ID");
    const appKey = Deno.env.get("ADZUNA_APP_KEY");
    if (!appId || !appKey) {
      return new Response(JSON.stringify({ error: "Missing Adzuna keys" }), { status: 400, headers: corsHeaders });
    }

    const queries = [
      // Kenya — broad + role-specific
      { country: "ke", what: "jobs", market: "Kenya", category: "Kenya Jobs" },
      { country: "ke", what: "accountant", market: "Kenya", category: "Kenya Jobs" },
      { country: "ke", what: "driver", market: "Kenya", category: "Kenya Jobs" },
      { country: "ke", what: "nurse", market: "Kenya", category: "Healthcare Jobs" },
      { country: "ke", what: "sales", market: "Kenya", category: "Kenya Jobs" },
      { country: "ke", what: "engineer", market: "Kenya", category: "Kenya Jobs" },
      { country: "ke", what: "teacher", market: "Kenya", category: "Kenya Jobs" },
      { country: "ke", what: "IT", market: "Kenya", category: "Kenya Jobs" },
      { country: "ke", what: "marketing", market: "Kenya", category: "Kenya Jobs" },
      { country: "ke", what: "admin", market: "Kenya", category: "Kenya Jobs" },
      // UK, AU, CA
      { country: "gb", what: "visa sponsorship", market: "UK", category: "Europe Jobs" },
      { country: "gb", what: "nurse", market: "UK", category: "Healthcare Jobs" },
      { country: "au", what: "visa sponsorship", market: "Australia", category: "Australia Jobs" },
      { country: "ca", what: "visa sponsorship", market: "Canada", category: "Canada Jobs" },
    ];

    const jobs: any[] = [];
    const errors: string[] = [];

    const results = await Promise.allSettled(
      queries.map(q =>
        fetch(`https://api.adzuna.com/v1/api/jobs/${q.country}/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(q.what)}&results_per_page=20&max_days_old=3&sort_by=date`)
          .then(r => r.json())
          .then(data => ({ q, results: data.results || [] }))
      )
    );

    for (const r of results) {
      if (r.status === "rejected") { errors.push(String(r.reason)); continue; }
      const { q, results: rows } = r.value;
      for (const row of rows) {
        const title = row.title?.replace(/<[^>]*>/g, "").trim() || "";
        if (!title) continue;
