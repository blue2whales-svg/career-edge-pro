
CREATE TABLE IF NOT EXISTS public.job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  markets TEXT[] NOT NULL DEFAULT '{Remote}',
  include_visa BOOLEAN NOT NULL DEFAULT true,
  verified_only BOOLEAN NOT NULL DEFAULT true,
  frequency_hours INTEGER NOT NULL DEFAULT 2,
  active BOOLEAN NOT NULL DEFAULT true,
  last_sent_at TIMESTAMPTZ,
  last_job_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.job_alerts TO service_role;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role full access job_alerts"
ON public.job_alerts FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_job_alerts_active_email ON public.job_alerts(active, email);

CREATE TRIGGER trg_job_alerts_updated_at
BEFORE UPDATE ON public.job_alerts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Unschedule old job if exists
DO $$ BEGIN
  PERFORM cron.unschedule('send-job-alerts-2h');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

SELECT cron.schedule(
  'send-job-alerts-2h',
  '0 */2 * * *',
  $cron$
  SELECT net.http_post(
    url := 'https://jxuqpxzsbkkywieughgh.supabase.co/functions/v1/send-job-alerts',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dXFweHpzYmtreXdpZXVnaGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDExMjgsImV4cCI6MjA4ODMxNzEyOH0.nzT2xXLGfhmY-ibQBqDMd790_01AihREvgc3ZR6053o"}'::jsonb,
    body := '{"trigger":"cron"}'::jsonb
  ) AS request_id;
  $cron$
);
