
-- Employer profiles
CREATE TABLE IF NOT EXISTS public.employer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  plan_pkg text,
  plan_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Candidate profiles
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  location text,
  headline text,
  cv_url text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Job postings (employer-posted jobs)
CREATE TABLE IF NOT EXISTS public.job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  description text,
  location text,
  salary text,
  job_type text DEFAULT 'Full-time',
  industry text,
  plan_pkg text,
  status text DEFAULT 'active',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Applications
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_note text,
  status text DEFAULT 'Applied',
  applied_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Application messages (separate from order messages)
CREATE TABLE IF NOT EXISTS public.application_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Interviews
CREATE TABLE IF NOT EXISTS public.interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  scheduled_at timestamptz,
  meeting_link text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Employer profiles policies
CREATE POLICY "Users can view own employer profile" ON public.employer_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own employer profile" ON public.employer_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own employer profile" ON public.employer_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Candidate profiles policies
CREATE POLICY "Users can view own candidate profile" ON public.candidate_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own candidate profile" ON public.candidate_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own candidate profile" ON public.candidate_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Job postings policies
CREATE POLICY "Anyone can view active job postings" ON public.job_postings FOR SELECT USING (true);
CREATE POLICY "Employers can insert job postings" ON public.job_postings FOR INSERT TO authenticated WITH CHECK (employer_id = auth.uid());
CREATE POLICY "Employers can update own job postings" ON public.job_postings FOR UPDATE TO authenticated USING (employer_id = auth.uid());
CREATE POLICY "Employers can delete own job postings" ON public.job_postings FOR DELETE TO authenticated USING (employer_id = auth.uid());

-- Applications policies
CREATE POLICY "Candidates can view own applications" ON public.applications FOR SELECT TO authenticated USING (candidate_id = auth.uid());
CREATE POLICY "Employers can view applications for their jobs" ON public.applications FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.job_postings WHERE job_postings.id = applications.job_id AND job_postings.employer_id = auth.uid()));
CREATE POLICY "Candidates can insert applications" ON public.applications FOR INSERT TO authenticated WITH CHECK (candidate_id = auth.uid());
CREATE POLICY "Candidates can delete own applications" ON public.applications FOR DELETE TO authenticated USING (candidate_id = auth.uid());
CREATE POLICY "Employers can update applications for their jobs" ON public.applications FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.job_postings WHERE job_postings.id = applications.job_id AND job_postings.employer_id = auth.uid()));

-- Application messages policies
CREATE POLICY "Users can view messages on their applications" ON public.application_messages FOR SELECT TO authenticated USING (
  sender_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.job_postings j ON j.id = a.job_id
    WHERE a.id = application_messages.application_id AND (a.candidate_id = auth.uid() OR j.employer_id = auth.uid())
  )
);
CREATE POLICY "Users can send messages on their applications" ON public.application_messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

-- Interviews policies
CREATE POLICY "Users can view interviews on their applications" ON public.interviews FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.job_postings j ON j.id = a.job_id
    WHERE a.id = interviews.application_id AND (a.candidate_id = auth.uid() OR j.employer_id = auth.uid())
  )
);
CREATE POLICY "Employers can insert interviews" ON public.interviews FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.job_postings j ON j.id = a.job_id
    WHERE a.id = interviews.application_id AND j.employer_id = auth.uid()
  )
);

-- Enable realtime for applications (for tracker)
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
