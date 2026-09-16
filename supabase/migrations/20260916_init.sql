-- ==============================================================================
-- DocuMind SLM — Supabase Database Migration
-- Tables: documents, extractions, hitl_reviews
-- Buckets: document-vault
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Supabase Storage Bucket relative path
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL DEFAULT 'application/pdf',
    schema_type TEXT NOT NULL DEFAULT 'gst_invoice', -- 'gst_invoice', 'form_16', 'medical_bill'
    status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'flagged')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Extractions Table
CREATE TABLE IF NOT EXISTS public.extractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    extracted_data JSONB NOT NULL, -- Pydantic schema serialized with values, confidence, bboxes
    confidence_scores JSONB NOT NULL, -- e.g. {"invoice_number": 0.99, "gst_amount": 0.72}
    overall_confidence NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    inference_time_ms INT NOT NULL DEFAULT 0,
    math_validated BOOLEAN DEFAULT TRUE,
    flagged_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Human-in-the-Loop (HITL) Review Logs
CREATE TABLE IF NOT EXISTS public.hitl_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    extraction_id UUID NOT NULL REFERENCES public.extractions(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    original_value TEXT NOT NULL,
    corrected_value TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'escalated')),
    reviewer_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for high-throughput queries
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_extractions_doc_id ON public.extractions(document_id);
CREATE INDEX IF NOT EXISTS idx_hitl_extraction_id ON public.hitl_reviews(extraction_id);

-- Storage bucket initialization for document vault
INSERT INTO storage.buckets (id, name, public) 
VALUES ('document-vault', 'document-vault', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Security Policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Document Vault'
    ) THEN
        CREATE POLICY "Public Read Document Vault" ON storage.objects 
        FOR SELECT USING (bucket_id = 'document-vault');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert Document Vault'
    ) THEN
        CREATE POLICY "Public Insert Document Vault" ON storage.objects 
        FOR INSERT WITH CHECK (bucket_id = 'document-vault');
    END IF;
END $$;

-- Enable Realtime for dynamic UI sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.extractions;
