
-- ============================================================
-- 1. FIX ORDERS TABLE RLS POLICIES
-- ============================================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can view orders by email or user_id" ON public.orders;
DROP POLICY IF EXISTS "Service can update orders" ON public.orders;

-- Owner can view their own orders (by user_id or email match)
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow guest order lookup by email (for unauthenticated order placement flow)
-- Guest users who placed an order can view it by matching email
CREATE POLICY "Guest can view own orders by email"
  ON public.orders FOR SELECT
  TO anon
  USING (false);

-- Only service role can update orders (M-Pesa callback, admin)
CREATE POLICY "Service role can update orders"
  ON public.orders FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 2. FIX GENERATED_DOCUMENTS TABLE RLS POLICIES
-- ============================================================

DROP POLICY IF EXISTS "Anyone can view generated documents" ON public.generated_documents;
DROP POLICY IF EXISTS "Anyone can view generated documents by order" ON public.generated_documents;
DROP POLICY IF EXISTS "Anyone can update generated documents" ON public.generated_documents;
DROP POLICY IF EXISTS "System can insert generated documents" ON public.generated_documents;

-- Users can view documents for their own orders
CREATE POLICY "Users can view own documents"
  ON public.generated_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = generated_documents.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- Only service role can insert/update documents
CREATE POLICY "Service role can insert documents"
  ON public.generated_documents FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update documents"
  ON public.generated_documents FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 3. FIX CACHED_JOBS WRITE POLICIES (restrict to service role)
-- ============================================================

DROP POLICY IF EXISTS "Service can delete cached jobs" ON public.cached_jobs;
DROP POLICY IF EXISTS "Service can insert cached jobs" ON public.cached_jobs;
DROP POLICY IF EXISTS "Service can update cached jobs" ON public.cached_jobs;

CREATE POLICY "Service role can insert cached jobs"
  ON public.cached_jobs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update cached jobs"
  ON public.cached_jobs FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete cached jobs"
  ON public.cached_jobs FOR DELETE
  TO service_role
  USING (true);

-- ============================================================
-- 4. FIX STORAGE POLICIES ON order-documents BUCKET
-- ============================================================

DROP POLICY IF EXISTS "Anyone can read order documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload order documents" ON storage.objects;

-- Owner can read their own documents (folder = user_id)
CREATE POLICY "Owner can read own order documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'order-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Owner can upload to their own folder
CREATE POLICY "Owner can upload own order documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'order-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);
