
CREATE TABLE public.generated_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'generating',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- Anyone can view documents linked to their order (by order_id match)
CREATE POLICY "Anyone can view generated documents"
  ON public.generated_documents
  FOR SELECT
  USING (true);

CREATE POLICY "System can insert generated documents"
  ON public.generated_documents
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update generated documents"
  ON public.generated_documents
  FOR UPDATE
  USING (true);

GRANT SELECT, INSERT, UPDATE ON public.generated_documents TO anon;
GRANT SELECT, INSERT, UPDATE ON public.generated_documents TO authenticated;

-- Add career detail columns to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS skills TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS education TEXT;
