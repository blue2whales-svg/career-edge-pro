-- Create storage bucket for order documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-documents', 'order-documents', false);

-- Allow anyone to upload files to order-documents bucket
CREATE POLICY "Anyone can upload order documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'order-documents');

-- Allow anyone to read order documents
CREATE POLICY "Anyone can read order documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'order-documents');