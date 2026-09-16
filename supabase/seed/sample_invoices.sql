-- Seed data matching the reference benchmark invoice (invoice_8941.pdf)
INSERT INTO public.documents (
    id,
    filename,
    file_path,
    file_size_bytes,
    mime_type,
    schema_type,
    status
) VALUES (
    'e7d01894-8941-4c6e-b3f9-7104b2026001',
    'invoice_8941.pdf',
    'invoices/invoice_8941.pdf',
    1048576,
    'application/pdf',
    'gst_invoice',
    'flagged'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.extractions (
    id,
    document_id,
    extracted_data,
    confidence_scores,
    overall_confidence,
    inference_time_ms,
    math_validated,
    flagged_reason
) VALUES (
    'f8a02894-8941-4c6e-b3f9-7104b2026002',
    'e7d01894-8941-4c6e-b3f9-7104b2026001',
    '{
        "invoice_number": {
            "value": "INV-2026-8941",
            "confidence": 0.99,
            "bbox": [365, 115, 395, 185]
        },
        "vendor_gstin": {
            "value": "27AABCU9603R1ZN",
            "confidence": 0.96,
            "bbox": [445, 240, 465, 305]
        },
        "subtotal": {
            "value": "₹1,00,000.00",
            "confidence": 0.98,
            "bbox": [680, 315, 695, 355]
        },
        "gst_rate_percent": {
            "value": "18%",
            "confidence": 0.95,
            "bbox": [700, 240, 715, 290]
        },
        "gst_amount": {
            "value": "₹18,00,000.00",
            "confidence": 0.72,
            "bbox": [700, 315, 718, 355]
        },
        "total_amount": {
            "value": "₹1,18,000.00",
            "confidence": 0.97,
            "bbox": [748, 300, 765, 355]
        }
    }'::jsonb,
    '{
        "invoice_number": 0.99,
        "vendor_gstin": 0.96,
        "subtotal": 0.98,
        "gst_rate_percent": 0.95,
        "gst_amount": 0.72,
        "total_amount": 0.97
    }'::jsonb,
    0.89,
    1420,
    FALSE,
    'Tax calculation flagged for manual review. Expected GST: ₹18,000. Extracted GST reads ₹18,00,000.'
) ON CONFLICT (id) DO NOTHING;
