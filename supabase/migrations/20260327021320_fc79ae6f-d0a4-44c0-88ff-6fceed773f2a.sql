
-- Add new columns to cached_jobs
ALTER TABLE public.cached_jobs ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.cached_jobs ADD COLUMN IF NOT EXISTS discovered_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.cached_jobs ADD COLUMN IF NOT EXISTS source_label text;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cached_jobs_category ON public.cached_jobs (category);
CREATE INDEX IF NOT EXISTS idx_cached_jobs_country ON public.cached_jobs (country);
CREATE INDEX IF NOT EXISTS idx_cached_jobs_posted_at ON public.cached_jobs (posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_cached_jobs_created_at ON public.cached_jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cached_jobs_is_active ON public.cached_jobs (is_active);
CREATE INDEX IF NOT EXISTS idx_cached_jobs_hot ON public.cached_jobs (hot);
CREATE INDEX IF NOT EXISTS idx_cached_jobs_visa ON public.cached_jobs (visa_sponsorship);
CREATE INDEX IF NOT EXISTS idx_cached_jobs_hot_score ON public.cached_jobs (hot_score DESC);
CREATE INDEX IF NOT EXISTS idx_cached_jobs_active_score ON public.cached_jobs (is_active, hot_score DESC);

-- Set all existing jobs as active and set discovered_at
UPDATE public.cached_jobs SET is_active = true, discovered_at = created_at WHERE discovered_at = now();
