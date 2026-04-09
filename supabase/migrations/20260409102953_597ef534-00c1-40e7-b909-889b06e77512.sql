
-- Storage bucket for owner CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('owner-cvs', 'owner-cvs', false);

-- Storage policies for owner-cvs bucket
CREATE POLICY "Owner can view own CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'owner-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owner can upload own CVs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'owner-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owner can update own CVs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'owner-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owner can delete own CVs"
ON storage.objects FOR DELETE
USING (bucket_id = 'owner-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Owner application log table
CREATE TABLE public.owner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  apply_url TEXT,
  cv_version TEXT DEFAULT 'General',
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'Applied',
  follow_up_date TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.owner_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view own applications"
ON public.owner_applications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Owner can insert own applications"
ON public.owner_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update own applications"
ON public.owner_applications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete own applications"
ON public.owner_applications FOR DELETE
USING (auth.uid() = user_id);
