
CREATE TABLE public.cached_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text,
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  salary text,
  type text DEFAULT 'Full-time',
  industry text,
  market text,
  posted text,
  posted_at timestamp with time zone,
  hot boolean DEFAULT false,
  tag text,
  source text NOT NULL DEFAULT 'jsearch',
  apply_url text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(external_id, source)
);

ALTER TABLE public.cached_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cached jobs"
  ON public.cached_jobs
  FOR SELECT
  USING (true);

CREATE POLICY "Service can insert cached jobs"
  ON public.cached_jobs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service can update cached jobs"
  ON public.cached_jobs
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can delete cached jobs"
  ON public.cached_jobs
  FOR DELETE
  USING (true);

GRANT SELECT ON public.cached_jobs TO anon;
GRANT SELECT ON public.cached_jobs TO authenticated;
