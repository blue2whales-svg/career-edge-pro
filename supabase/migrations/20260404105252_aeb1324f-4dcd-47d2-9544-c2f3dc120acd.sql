
-- 1. verified_employers table
CREATE TABLE IF NOT EXISTS public.verified_employers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_name text NOT NULL UNIQUE,
  logo_url text,
  tier text NOT NULL DEFAULT 'corporate',
  verified boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.verified_employers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view verified employers" ON public.verified_employers FOR SELECT USING (true);

-- 2. job_unlocks table
CREATE TABLE IF NOT EXISTS public.job_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  job_id text NOT NULL,
  unlock_type text NOT NULL DEFAULT 'single',
  amount_paid integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KES',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);
ALTER TABLE public.job_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own unlocks" ON public.job_unlocks FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own unlocks" ON public.job_unlocks FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- 3. subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan text NOT NULL DEFAULT 'pro',
  status text NOT NULL DEFAULT 'active',
  billing_cycle text NOT NULL DEFAULT 'monthly',
  amount integer NOT NULL DEFAULT 500,
  currency text NOT NULL DEFAULT 'KES',
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days')
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- 4. referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  credit_amount integer NOT NULL DEFAULT 200,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT TO authenticated USING (referrer_id = auth.uid());
CREATE POLICY "Users can insert own referrals" ON public.referrals FOR INSERT TO authenticated WITH CHECK (referrer_id = auth.uid());

-- 5. Seed verified employers
INSERT INTO public.verified_employers (employer_name, tier) VALUES
  ('Safaricom', 'corporate'),
  ('KCB Bank', 'corporate'),
  ('Equity Bank', 'corporate'),
  ('Nation Media Group', 'corporate'),
  ('KenGen', 'corporate'),
  ('KPLC', 'corporate'),
  ('Co-operative Bank', 'corporate'),
  ('Standard Chartered Kenya', 'corporate'),
  ('Absa Kenya', 'corporate'),
  ('NCBA Bank', 'corporate'),
  ('Stanbic Bank', 'corporate'),
  ('I&M Bank', 'corporate'),
  ('Diamond Trust Bank', 'corporate'),
  ('Unilever Kenya', 'mnc'),
  ('Nestle Kenya', 'mnc'),
  ('BAT Kenya', 'mnc'),
  ('Bamburi Cement', 'mnc'),
  ('East African Breweries', 'corporate'),
  ('Bidco Africa', 'corporate'),
  ('Twiga Foods', 'corporate'),
  ('UNICEF Kenya', 'ngo'),
  ('UNDP Kenya', 'ngo'),
  ('WHO Kenya', 'ngo'),
  ('World Bank Nairobi', 'ngo'),
  ('Save the Children Kenya', 'ngo'),
  ('IRC Kenya', 'ngo'),
  ('Mercy Corps Kenya', 'ngo'),
  ('Aga Khan Hospital', 'hospital'),
  ('Nairobi Hospital', 'hospital'),
  ('MP Shah Hospital', 'hospital'),
  ('KRA', 'government'),
  ('KEBS', 'government'),
  ('KNEC', 'government'),
  ('CBK', 'government'),
  ('NHIF', 'government'),
  ('NSSF', 'government'),
  ('Kenya Airways', 'corporate'),
  ('Deloitte Kenya', 'big4'),
  ('PwC Kenya', 'big4'),
  ('EY Kenya', 'big4'),
  ('KPMG Kenya', 'big4'),
  ('Google Nairobi', 'mnc'),
  ('Microsoft Kenya', 'mnc'),
  ('IBM Kenya', 'mnc'),
  ('Huawei Kenya', 'mnc'),
  ('Mastercard Kenya', 'mnc'),
  ('Visa Kenya', 'mnc'),
  ('Bolt Kenya', 'mnc'),
  ('Jumia Kenya', 'mnc')
ON CONFLICT (employer_name) DO NOTHING;
