ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS mpesa_checkout_request_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS mpesa_receipt text;

-- Allow service role to update orders (for callback)
CREATE POLICY "Service can update orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);