from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FieldWithConfidence(BaseModel):
    value: str = Field(description="Extracted textual or numerical value")
    confidence: float = Field(default=0.95, ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    bbox: Optional[List[int]] = Field(
        default=None,
        description="Normalized bounding box [ymin, xmin, ymax, xmax] mapped to 0-1000 coordinate space"
    )

class InvoiceExtractionSchema(BaseModel):
    invoice_number: FieldWithConfidence = Field(description="Invoice reference number (e.g., INV-2026-8941)")
    vendor_name: FieldWithConfidence = Field(description="Registered trade or company name of vendor")
    vendor_gstin: FieldWithConfidence = Field(description="15-character GSTIN tax identification number")
    invoice_date: Optional[FieldWithConfidence] = Field(default=None, description="Date of invoice issuance")
    subtotal: FieldWithConfidence = Field(description="Net taxable subtotal amount in Indian Rupees")
    gst_rate_percent: FieldWithConfidence = Field(description="Applicable GST rate percentage (e.g., 18%)")
    gst_amount: FieldWithConfidence = Field(description="Extracted or calculated GST tax amount in Indian Rupees")
    total_amount: FieldWithConfidence = Field(description="Grand total payable invoice amount in Indian Rupees")

class DocumentProcessRequest(BaseModel):
    document_id: str
    schema_type: str = "gst_invoice"

class ExtractionResponse(BaseModel):
    status: str
    document_id: str
    inference_time_ms: int
    math_validated: bool
    flagged_reason: Optional[str] = None
    expected_gst: Optional[str] = None
    data: InvoiceExtractionSchema
    confidence_scores: Dict[str, float]
    overall_confidence: float
    source: str = Field(default="local_slm_weights", description="Inference source: 'local_slm_weights' or 'mock_fallback'")
