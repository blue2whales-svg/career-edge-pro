
ALTER TABLE public.cached_jobs 
ADD COLUMN IF NOT EXISTS hot_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS visa_sponsorship boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS category text;

-- Add unique constraint for deduplication
CREATE UNIQUE INDEX IF NOT EXISTS cached_jobs_title_company_location_idx 
ON public.cached_jobs (lower(title), lower(company), lower(location));
