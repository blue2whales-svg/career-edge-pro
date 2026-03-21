
CREATE TABLE public.vault_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  linkedin text NOT NULL DEFAULT '',
  portfolio text NOT NULL DEFAULT '',
  target_roles text NOT NULL DEFAULT '',
  career_summary text NOT NULL DEFAULT '',
  roles jsonb NOT NULL DEFAULT '[]'::jsonb,
  education jsonb NOT NULL DEFAULT '[]'::jsonb,
  technical_skills text NOT NULL DEFAULT '',
  soft_skills text NOT NULL DEFAULT '',
  languages text NOT NULL DEFAULT '',
  certifications text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.vault_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own vault profile"
  ON public.vault_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vault profile"
  ON public.vault_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vault profile"
  ON public.vault_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_vault_profiles_updated_at
  BEFORE UPDATE ON public.vault_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
