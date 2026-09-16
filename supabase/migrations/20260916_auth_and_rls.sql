-- ==============================================================================
-- DocuMind SLM — Row Level Security (RLS) & Authentication Policies
-- Secures: public.documents, public.extractions, public.hitl_reviews, document-vault
-- ==============================================================================

-- 1. Enable Row Level Security (RLS) on all core tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hitl_reviews ENABLE ROW LEVEL SECURITY;

-- 2. Clean up any existing un-scoped policies
DROP POLICY IF EXISTS "Public Read Document Vault" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Document Vault" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated select on documents" ON public.documents;
DROP POLICY IF EXISTS "Allow authenticated insert on documents" ON public.documents;
DROP POLICY IF EXISTS "Allow authenticated update on documents" ON public.documents;
DROP POLICY IF EXISTS "Allow service_role full access on documents" ON public.documents;

-- 3. Documents Table RLS Policies
CREATE POLICY "Allow authenticated read on documents"
ON public.documents FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated insert on documents"
ON public.documents FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on documents"
ON public.documents FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service_role full access on documents"
ON public.documents FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4. Extractions Table RLS Policies
CREATE POLICY "Allow authenticated read on extractions"
ON public.extractions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated insert on extractions"
ON public.extractions FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on extractions"
ON public.extractions FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service_role full access on extractions"
ON public.extractions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. Human-in-the-Loop (HITL) Audit Table RLS Policies
CREATE POLICY "Allow authenticated read on hitl_reviews"
ON public.hitl_reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated insert on hitl_reviews"
ON public.hitl_reviews FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow service_role full access on hitl_reviews"
ON public.hitl_reviews FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 6. Storage Bucket Security (Restricting document-vault to authenticated auditors and service role)
UPDATE storage.buckets SET public = false WHERE id = 'document-vault';

CREATE POLICY "Authenticated Read Document Vault"
ON storage.objects FOR SELECT
TO authenticated, service_role
USING (bucket_id = 'document-vault');

CREATE POLICY "Authenticated Insert Document Vault"
ON storage.objects FOR INSERT
TO authenticated, service_role
WITH CHECK (bucket_id = 'document-vault');
