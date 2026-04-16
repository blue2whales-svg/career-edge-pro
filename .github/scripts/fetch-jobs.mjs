import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function guessIndustry(title, employer) {
  const t = (title + ' ' + employer).toLowerCase();
  if (/nurse|doctor|medical|health|hospital|pharma|dental|clinic/.test(t)) return 'Healthcare';
  if (/engineer|civil|mechanical|electrical|structural/.test(t)) return 'Engineering';
  if (/software|developer|data|devops|cloud|cyber/.test(t)) return 'Technology';
  if (/account|finance|bank|audit/.test(t)) return 'Finance';
  if (/teacher|lecturer|educat|school/.test(t)) return 'Education';
  if (/hotel|restaurant|chef|cruise|hospitality|waiter|cook/.test(t)) return 'Hospitality';
  if (/driv|transport|logist|warehouse|delivery/.test(t)) return 'Logistics';
  if (/sales|marketing|business develop/.test(t)) return 'Sales';
  if (/admin|secretary|receptionist|office|hr\b/.test(t)) return 'Administration';
  if (/security|guard|surveillance/.test(t)) return 'Security';
  return 'Operations';
}

function guessCategory(title, market, industry) {
  if (market === 'Cruise') return 'Cruise Jobs';
  if (market === 'Remote') return 'Remote Jobs';
  if (['UAE','Qatar','Saudi Arabia','Kuwait','Bahrain','Oman'].includes(market)) return 'Gulf Jobs';
  if (market === 'Kenya') return 'Kenya Jobs';
  if (industry === 'Healthcare') return 'Healthcare Jobs';
  if (['UK','Germany','Europe'].includes(market)) return 'Europe Jobs';
  if (market === 'USA') return 'USA Jobs';
  return 'Kenya Jobs';
}

function detectVisa(title, desc) {
  return /visa sponsor|relocation|work permit|sponsored visa/i.test(title + ' ' + desc);
}

function hotScore(job) {
  let score = 0;
  const hoursAgo = (Date.now() - new Date(job.posted_at).getTime()) / 3600000;
  if (hoursAgo < 24) score += 40;
  else if (hoursAgo < 48) score += 25;
  else if (hoursAgo < 72) score += 10;
  if (job.salary && job.salary !== 'Competitive') score += 20;
  if (job.visa_sponsorship) score += 25;
  if (['UAE','Qatar','Saudi Arabia','UK','Canada','Australia'].includes(job.market)) score += 15;
  return score;
}

async function fetchAdzuna() {
  // Kenya-heavy queries for maximum local coverage
  const kenyaQueries = [
    { country: 'ke', what: 'jobs', market: 'Kenya' },
    { country: 'ke', what: 'nurse healthcare hospital', market: 'Kenya' },
    { country: 'ke', what: 'accountant finance banking', market: 'Kenya' },
    { country: 'ke', what: 'sales marketing', market: 'Kenya' },
    { country: 'ke', what: 'driver logistics warehouse', market: 'Kenya' },
    { country: 'ke', what: 'engineer', market: 'Kenya' },
    { country: 'ke', what: 'teacher education', market: 'Kenya' },
    { country: 'ke', what: 'IT software developer', market: 'Kenya' },
    { country: 'ke', what: 'hotel chef hospitality', market: 'Kenya' },
    { country: 'ke', what: 'admin secretary receptionist', market: 'Kenya' },
    { country: 'ke', what: 'security guard', market: 'Kenya' },
    { country: 'ke', what: 'NGO UN international', market: 'Kenya' },
  ];

  const intlQueries = [
    { country: 'ae', what: 'jobs', market: 'UAE' },
    { country: 'ae', what: 'hotel hospitality', market: 'UAE' },
    { country: 'sa', what: 'jobs', market: 'Saudi Arabia' },
    { country: 'qa', what: 'jobs', market: 'Qatar' },
    { country: 'kw', what: 'jobs', market: 'Kuwait' },
    { country: 'bh', what: 'jobs', market: 'Bahrain' },
    { country: 'om', what: 'jobs', market: 'Oman' },
    { country: 'gb', what: 'visa sponsorship', market: 'UK' },
    { country: 'gb', what: 'nurse healthcare', market: 'UK' },
    { country: 'us', what: 'visa sponsorship', market: 'USA' },
    { country: 'au', what: 'visa sponsorship', market: 'Australia' },
    { country: 'ca', what: 'visa sponsorship', market: 'Canada' },
    { country: 'de', what: 'engineer', market: 'Germany' },
  ];

  const queries = [...kenyaQueries, ...intlQueries];

  const jobs = [];
  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(`https://api.adzuna.com/v1/api/jobs/${q.country}/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&what=${encodeURIComponent(q.what)}&results_per_page=${q.country === 'ke' ? 50 : 20}&max_days_old=${q.country === 'ke' ? 7 : 3}&sort_by=date`)
        .then(r => r.json())
        .then(data => ({ q, rows: data.results || [] }))
    )
  );

  for (const r of results) {
    if (r.status === 'rejected') { console.error('Adzuna error:', r.reason); continue; }
    const { q, rows } = r.value;
    const currMap = { ke: 'KES', gb: 'GBP', us: 'USD', au: 'AUD', ca: 'CAD', de: 'EUR', ae: 'AED', sa: 'SAR', qa: 'QAR', kw: 'KWD', bh: 'BHD', om: 'OMR' };
    for (const row of rows) {
      const title = (row.title || '').replace(/<[^>]*>/g, '').trim();
      if (!title) continue;
      const description = (row.description || '').substring(0, 2000).replace(/<[^>]*>/g, '');
      const visa = detectVisa(title, description);
      const industry = guessIndustry(title, row.company?.display_name || '');
      const category = guessCategory(title, q.market, industry);
      const curr = currMap[q.country] || 'USD';
      const job = {
        external_id: `adzuna-${row.id}`, title,
        company: row.company?.display_name || 'Company',
        location: row.location?.display_name || q.market,
        salary: row.salary_min && row.salary_max
          ? `${curr} ${Math.round(row.salary_min).toLocaleString()}–${Math.round(row.salary_max).toLocaleString()}/yr`
          : 'Competitive',
        type: row.contract_time === 'part_time' ? 'Part-time' : 'Full-time',
        industry, market: q.market,
        posted_at: row.created || new Date().toISOString(),
        hot: false, tag: visa ? '✈️ Visa Sponsor' : null,
        source: 'adzuna', source_label: 'Adzuna',
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
  console.log(`Adzuna: ${jobs.length} jobs fetched`);
  return jobs;
}

async function fetchJooble() {
  const queries = [
    // Kenya
    { keywords: 'jobs in Kenya', location: 'Kenya', market: 'Kenya', tag: null },
    { keywords: 'Nairobi jobs', location: 'Nairobi', market: 'Kenya', tag: null },
    { keywords: 'Mombasa jobs', location: 'Mombasa', market: 'Kenya', tag: null },
    { keywords: 'driver jobs Kenya', location: 'Kenya', market: 'Kenya', tag: null },
    { keywords: 'accountant jobs Kenya', location: 'Kenya', market: 'Kenya', tag: null },
    { keywords: 'sales jobs Kenya', location: 'Kenya', market: 'Kenya', tag: null },
    { keywords: 'nurse jobs Kenya', location: 'Kenya', market: 'Kenya', tag: null },
    { keywords: 'teacher jobs Kenya', location: 'Kenya', market: 'Kenya', tag: null },
    { keywords: 'NGO jobs Kenya', location: 'Kenya', market: 'Kenya', tag: null },
    { keywords: 'IT developer Kenya', location: 'Kenya', market: 'Kenya', tag: null },
    // Gulf
    { keywords: 'jobs in Dubai', location: 'Dubai', market: 'UAE', tag: '🔥 Gulf Hot' },
    { keywords: 'hotel hospitality Dubai', location: 'Dubai', market: 'UAE', tag: '🔥 Gulf Hot' },
    { keywords: 'jobs in Qatar', location: 'Qatar', market: 'Qatar', tag: '🔥 Gulf Hot' },
    { keywords: 'jobs in Saudi Arabia', location: 'Saudi Arabia', market: 'Saudi Arabia', tag: '🔥 Gulf Hot' },
    { keywords: 'jobs in Kuwait', location: 'Kuwait', market: 'Kuwait', tag: '🔥 Gulf Hot' },
    // USA
    { keywords: 'jobs in USA', location: 'USA', market: 'USA', tag: null },
    { keywords: 'visa sponsorship jobs USA', location: 'USA', market: 'USA', tag: '✈️ Visa Sponsor' },
    { keywords: 'software engineer USA', location: 'USA', market: 'USA', tag: null },
    { keywords: 'nurse jobs USA', location: 'USA', market: 'USA', tag: null },
    // Europe
    { keywords: 'jobs in UK', location: 'UK', market: 'UK', tag: null },
    { keywords: 'visa sponsorship jobs UK', location: 'UK', market: 'UK', tag: '✈️ Visa Sponsor' },
    { keywords: 'nurse jobs UK', location: 'UK', market: 'UK', tag: null },
    { keywords: 'jobs in Germany', location: 'Germany', market: 'Germany', tag: null },
    { keywords: 'engineer jobs Germany', location: 'Germany', market: 'Germany', tag: null },
    { keywords: 'visa sponsorship jobs Europe', location: 'Europe', market: 'Europe', tag: '✈️ Visa Sponsor' },
    // Asia
    { keywords: 'jobs in Singapore', location: 'Singapore', market: 'Singapore', tag: null },
    { keywords: 'jobs in Malaysia', location: 'Malaysia', market: 'Malaysia', tag: null },
    { keywords: 'IT jobs India', location: 'India', market: 'India', tag: null },
    { keywords: 'jobs in Japan', location: 'Japan', market: 'Japan', tag: null },
    // Cruise & Remote
    { keywords: 'cruise ship jobs', location: '', market: 'Cruise', tag: '🚢 Cruise Line' },
    { keywords: 'remote jobs Africa', location: '', market: 'Remote', tag: '🌍 Remote' },
    { keywords: 'remote work from home', location: '', market: 'Remote', tag: '🌍 Remote' },
    // Australia & Canada
    { keywords: 'visa sponsorship jobs Australia', location: 'Australia', market: 'Australia', tag: '✈️ Visa Sponsor' },
    { keywords: 'jobs in Canada', location: 'Canada', market: 'Canada', tag: null },
    { keywords: 'visa sponsorship jobs Canada', location: 'Canada', market: 'Canada', tag: '✈️ Visa Sponsor' },
  ];

  const jobs = [];
  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(`https://jooble.org/api/${process.env.JOOBLE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: q.keywords, location: q.location, page: 1 }),
      })
        .then(r => r.json())
        .then(data => ({ q, rows: data.jobs || [] }))
    )
  );

  for (const r of results) {
    if (r.status === 'rejected') { console.error('Jooble error:', r.reason); continue; }
    const { q, rows } = r.value;
    for (const row of rows) {
      const title = (row.title || '').replace(/<[^>]*>/g, '').trim();
      if (!title) continue;
      const description = (row.snippet || '').substring(0, 2000).replace(/<[^>]*>/g, '');
      const visa = detectVisa(title, description);
      const industry = guessIndustry(title, row.company || '');
      const category = guessCategory(title, q.market, industry);
      const job = {
        external_id: row.id ? `jooble-${row.id}` : `jooble-${title.toLowerCase().replace(/\s+/g, '-').substring(0, 80)}`,
        title, company: row.company || 'Company',
        location: row.location || q.market,
        salary: row.salary || 'Competitive',
        type: row.type || 'Full-time',
        industry, market: q.market,
        posted_at: row.updated || new Date().toISOString(),
        hot: false, tag: visa ? '✈️ Visa Sponsor' : q.tag,
        source: 'jooble', source_label: 'Jooble',
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
  console.log(`Jooble: ${jobs.length} jobs fetched`);
  return jobs;
}

async function upsertBatch(batch, attempt = 0) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/cached_jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Prefer': 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(batch),
  });
  if (res.ok || res.status === 201) return true;
  const err = await res.text();
  console.error(`Upsert failed (attempt ${attempt}):`, res.status, err);
  if (attempt < 2) {
    await new Promise(r => setTimeout(r, 3000));
    return upsertBatch(batch, attempt + 1);
  }
  return false;
}

async function main() {
  const [adzunaJobs, joobleJobs] = await Promise.all([fetchAdzuna(), fetchJooble()]);
  const allJobs = [...adzunaJobs, ...joobleJobs];

  const seen = new Set();
  const unique = allJobs.filter(j => {
    if (seen.has(j.external_id)) return false;
    seen.add(j.external_id);
    return true;
  });

  console.log(`Total unique jobs: ${unique.length}`);

  // Delete jobs older than 3 days
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
  await fetch(`${SUPABASE_URL}/rest/v1/cached_jobs?discovered_at=lt.${threeDaysAgo}&source=neq.platform_seed`, {
    method: 'DELETE',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
  });

  const BATCH = 100;
  let inserted = 0;

  for (let i = 0; i < unique.length; i += BATCH) {
    const batch = unique.slice(i, i + BATCH);
    const ok = await upsertBatch(batch);
    if (ok) inserted += batch.length;
  }

  console.log(`✅ Inserted ${inserted} jobs`);
}

main().catch(err => { console.error(err); process.exit(1); });
