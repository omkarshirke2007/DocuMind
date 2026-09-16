// ==============================================================================
// DocuMind SLM — TypeScript Shared Interfaces & Data Contracts
// ==============================================================================

export interface FieldWithConfidence {
  value: string;
  confidence: number;
  bbox: [number, number, number, number] | null; // [ymin, xmin, ymax, xmax] mapped to 0-1000 scale
}

export interface InvoiceData {
  invoice_number: FieldWithConfidence;
  vendor_name: FieldWithConfidence;
  vendor_gstin: FieldWithConfidence;
  invoice_date?: FieldWithConfidence;
  subtotal: FieldWithConfidence;
  gst_rate_percent: FieldWithConfidence;
  gst_amount: FieldWithConfidence;
  total_amount: FieldWithConfidence;
}

export interface ExtractionRecord {
  id: string;
  document_id: string;
  extracted_data: InvoiceData;
  confidence_scores: Record<string, number>;
  overall_confidence: number;
  inference_time_ms: number;
  math_validated: boolean;
  flagged_reason: string | null;
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  filename: string;
  file_path: string;
  file_size_bytes: number;
  mime_type: string;
  schema_type: string;
  status: 'uploaded' | 'processing' | 'completed' | 'flagged';
  created_at: string;
  updated_at: string;
}

export interface HitlReviewRecord {
  id: string;
  extraction_id: string;
  field_name: string;
  original_value: string;
  corrected_value: string;
  status: 'approved' | 'escalated';
  reviewer_notes?: string;
  reviewed_at: string;
}

export interface TelemetryMetrics {
  inferenceLatencyMs: number;
  vramUsageGb: number;
  accuracyF1: number;
  localMode: boolean;
  totalParsedFields: number;
}
