import re
from typing import Tuple, Optional, Dict, Any
from app.schemas import InvoiceExtractionSchema

def clean_currency_to_float(val: str) -> float:
    """Removes currency symbols (₹, $, Rs), commas, and whitespace, returning float."""
    if not val:
        return 0.0
    cleaned = re.sub(r"[^\d.]", "", str(val))
    try:
        return float(cleaned)
    except ValueError:
        return 0.0

def format_inr(val: float) -> str:
    """Formats float into Indian Rupee format."""
    return f"₹{val:,.2f}"

def verify_invoice_math(data: InvoiceExtractionSchema) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Deterministically audits the invoice arithmetic:
    1. Checks if Subtotal * (GST Rate / 100) ≈ Extracted GST Amount
    2. Checks if Subtotal + Extracted GST Amount ≈ Total Amount
    
    Returns:
        (is_valid, flagged_reason, expected_gst_str)
    """
    try:
        subtotal = clean_currency_to_float(data.subtotal.value)
        gst_extracted = clean_currency_to_float(data.gst_amount.value)
        total_extracted = clean_currency_to_float(data.total_amount.value)
        
        # Parse rate percentage (e.g. "18%" -> 0.18)
        rate_digits = re.sub(r"[^\d.]", "", str(data.gst_rate_percent.value))
        rate_fraction = float(rate_digits) / 100.0 if rate_digits else 0.18

        expected_gst = round(subtotal * rate_fraction, 2)
        expected_total = round(subtotal + expected_gst, 2)
        
        gst_diff = abs(gst_extracted - expected_gst)
        total_diff = abs((subtotal + gst_extracted) - total_extracted)

        # Tolerance of ₹1.50 for rounding variations
        if gst_diff > 1.50 or total_diff > 1.50:
            reason = (
                f"Tax calculation flagged for manual review. "
                f"Expected GST: {format_inr(expected_gst)}. "
                f"Extracted GST reads {format_inr(gst_extracted)}."
            )
            return False, reason, format_inr(expected_gst)
        
        return True, None, format_inr(expected_gst)
    except Exception as exc:
        return False, f"Arithmetic audit error: {str(exc)}", None
