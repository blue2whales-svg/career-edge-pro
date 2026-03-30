import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;

function guessIndustry(title, employer) {
  const t = (title + ' ' + employer).toLowerCase();
  if (/nurse|doctor|medical|health|hospital/.test(t)) return 'Healthcare';
  if (/engineer|civil|mechanical|electrical/.test(t)) return 'Engineering';
  if (/software|developer|data|devops|cloud/.test(t)) return 'Technology';
  if (/account|finance|bank|audit/.test(t)) return 'Finance';
  if (/teacher|lecturer|educat|school/.test(t)) return 'Education';
  if (/housemaid|nanny|housekeeper|domestic|caregiver/.test(t)) return 'Domestic & Housekeeping';
  if (/hotel|restaurant|chef|cruise|hospitality/.test(t)) return 'Cruise & Hospitality';
  if (/driv|transport|logist|warehouse/.test(t)) return 'Operations';
  return 'Operations';
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
  const queries = [
    { country: 'ke', what: 'jobs', market: 'Kenya', category: 'Kenya Jobs' },
    { country: 'ke', what: 'nurse', market: 'Kenya', category: 'Healthcare Jobs' },
    { country: 'gb', what: 'visa sponsorship', market: 'UK', category: 'Remote Jobs' },
    { country: 'gb', what: 'nurse', market: 'UK', category: 'Healthcare Jobs' },
    { country: 'au', what: 'visa sponsorship', market: 'Australia', category: 'Remote Jobs' },
    { country: 'ca', what: 'visa sponsorship', market: 'Canada', category: 'Remote Jobs' },
    { country: 'za', what: 'jobs', market: 'South Africa', category: 'Remote Jobs' },
    { country: 'de', what: 'engineer', market: 'Germany', category: 'Engineering Jobs' },
  ];

  const jobs = [];
  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(`https://api.adzuna.com/v1/api/jobs/${q.country}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&what=${encodeURIComponent(q.what)}&results_per_page=20&max_days_old=3&sort_by=date`)
        .then(r => r.json())
        .then(data => ({ q, rows: data.results || [] }))
    )
  );

  for (const r of results) {
    if (r.status === 'rejected') { console.error('Adzuna error:', r.reason); continue; }
    const { q, rows } = r.value;
    for (const row of rows) {
      const title = (row.title || '').replace(/<[^>]*>/g, '').trim();
      if (!title) continue;
      const description = (row.description || '').substring(0, 2000).replace(/<[^>]*>/g, '');
      const visa = detectVisa(title, description);
      const job = {
        external_id: `adzuna-${row.id}`,
        title, company: row.company?.display_name || 'Company',
        location: row.location?.display_name || q.market,
        salary: row.salary_min && row.salary_max
          ? `KES ${Math.round(row.salary_min * 130).toLocaleString()}–${Math.round(row.salary_max * 130).toLocaleString()}/yr`
          : 'Competitive',
        type: row.contract_time === 'part_time' ? 'Part-time' : 'Full-time',
        industry: guessIndustry(title, row.company?.display_name || ''),
        market: q.market, posted_at: row.created || new Date().toISOString(),
        hot: false, tag: visa ? '✈️ Visa Sponsor' : null,
        source: 'adzuna', source_label: 'Adzuna',
        apply_url: row.redirect_url || null, description,
        country: q.market, category: q.category,
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
    { keywords: 'cruise ship jobs', location: '', market: 'USA', category: 'Cruise Jobs', tag: '🚢 Cruise Line' },
    { keywords: 'jobs in Dubai', location: 'Dubai', market: 'UAE', category: 'Gulf Jobs', tag: '🔥 Gulf Hot' },
    { keywords: 'jobs in Kenya', location: 'Kenya', market: 'Kenya', category: 'Kenya Jobs', tag: null },
    { keywords: 'nurse jobs abroad', location: '', market: 'UK', category: 'Healthcare Jobs', tag: null },
    { keywords: 'visa sponsorship jobs', location: '', market: 'UK', category: 'Remote Jobs', tag: '✈️ Visa Sponsor' },
    { keywords: 'driver jobs Dubai', location: 'Dubai', market: 'UAE', category: 'Drivers & Logistics', tag: '🔥 Gulf Hot' },
    { keywords: 'construction jobs Qatar', location: 'Qatar', market: 'Qatar', category: 'Construction Jobs', tag: '🔥 Gulf Hot' },
    { keywords: 'remote jobs Africa', location: '', market: 'Kenya', category: 'Remote Jobs', tag: '🌍 Remote' },
  ];

  const jobs = [];
  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(`https://jooble.org/api/${JOOBLE_API_KEY}`, {
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
      const job = {
        external_id: row.id ? `jooble-${row.id}` : `jooble-${title.toLowerCase().replace(/\s+/g, '-').substring(0, 80)}`,
        title, company: row.company || 'Company',
        location: row.location || q.market,
        salary: row.salary || 'Competitive',
        type: row.type || 'Full-time',
        industry: guessIndustry(title, row.company || ''),
        market: q.market, posted_at: row.updated || new Date().toISOString(),
        hot: false, tag: q.tag,
        source: 'jooble', source_label: 'Jooble',
        apply_url: row.link || null, description,
        country: q.market, category: q.category,
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

  const BATCH = 50;
  let inserted = 0;
  for (let i = 0; i < unique.length; i += BATCH) {
    const batch = unique.slice(i, i + BATCH);
    const { error } = await supabase.from('cached_jobs').upsert(batch, {
      onConflict: 'external_id,source',
      ignoreDuplicates: true,
    });
    if (error) {
      console.error(`Batch ${i} error:`, error.message);
    } else {
      inserted += batch.length;
    }
  }
  console.log(`✅ Inserted ${inserted} jobs`);
}

main().catch(err => { console.error(err); process.exit(1); });
