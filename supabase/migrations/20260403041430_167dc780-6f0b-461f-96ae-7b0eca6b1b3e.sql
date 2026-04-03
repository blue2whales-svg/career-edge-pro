
-- Add missing columns to cached_jobs
ALTER TABLE public.cached_jobs
  ADD COLUMN IF NOT EXISTS requirements text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT true;

-- Add free unlock tracking to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS free_unlocks_used integer NOT NULL DEFAULT 0;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_cached_jobs_active_market ON public.cached_jobs (is_active, market);
CREATE INDEX IF NOT EXISTS idx_cached_jobs_category ON public.cached_jobs (category);
CREATE INDEX IF NOT EXISTS idx_cached_jobs_is_premium ON public.cached_jobs (is_premium);
CREATE INDEX IF NOT EXISTS idx_cached_jobs_discovered ON public.cached_jobs (discovered_at DESC);
