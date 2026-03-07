
-- Messages table for specialist-client communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL DEFAULT 'client' CHECK (sender_type IN ('client', 'specialist')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages on their orders"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = messages.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Users can send messages on their orders"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = messages.order_id AND orders.user_id = auth.uid())
  );

-- Revision requests table
CREATE TABLE public.revision_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.revision_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their revision requests"
  ON public.revision_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create revision requests"
  ON public.revision_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Allow authenticated users to also view orders (update existing policy scope)
-- Add policy for guest order viewing by email (already exists for user_id)
CREATE POLICY "Anyone can view generated documents by order"
  ON public.generated_documents FOR SELECT
  USING (true);
