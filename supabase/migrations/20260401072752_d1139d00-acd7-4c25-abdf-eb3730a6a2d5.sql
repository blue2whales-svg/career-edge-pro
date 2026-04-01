
-- Add unique index on (external_id, source) to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_cached_jobs_external_source 
ON public.cached_jobs (external_id, source) 
WHERE external_id IS NOT NULL;

-- Enable pg_cron and pg_net for scheduled functions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
