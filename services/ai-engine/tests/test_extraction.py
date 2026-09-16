import unittest
import sys
import os

# Ensure the parent directory (services/ai-engine) is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.schemas import InvoiceExtractionSchema, FieldWithConfidence
from app.validator import verify_invoice_math, clean_currency_to_float
from app.spatial_parser import normalize_bbox
from app.config import settings
from app.model_loader import slm_engine

class TestDocuMindExtraction(unittest.TestCase):

    def test_currency_cleaning(self):
        self.assertEqual(clean_currency_to_float("₹1,00,000.00"), 100000.00)
        self.assertEqual(clean_currency_to_float("18,00,000.00"), 1800000.00)
        self.assertEqual(clean_currency_to_float("₹18,000.00"), 18000.00)
        self.assertEqual(clean_currency_to_float("0"), 0.0)

    def test_math_validator_valid_invoice(self):
        valid_data = InvoiceExtractionSchema(
            invoice_number=FieldWithConfidence(value="INV-2026-8941", confidence=0.99),
            vendor_name=FieldWithConfidence(value="ACME INDUSTRIES", confidence=0.98),
            vendor_gstin=FieldWithConfidence(value="27AABCU9603R1ZN", confidence=0.96),
            subtotal=FieldWithConfidence(value="₹1,00,000.00", confidence=0.98),
            gst_rate_percent=FieldWithConfidence(value="18%", confidence=0.95),
            gst_amount=FieldWithConfidence(value="₹18,000.00", confidence=0.99),
            total_amount=FieldWithConfidence(value="₹1,18,000.00", confidence=0.99)
        )
        is_valid, flagged_reason, expected_gst = verify_invoice_math(valid_data)
        self.assertTrue(is_valid)
        self.assertIsNone(flagged_reason)
        self.assertEqual(expected_gst, "₹18,000.00")

    def test_math_validator_flagged_invoice(self):
        corrupted_data = InvoiceExtractionSchema(
            invoice_number=FieldWithConfidence(value="INV-2026-8941", confidence=0.99),
            vendor_name=FieldWithConfidence(value="ACME INDUSTRIES", confidence=0.98),
            vendor_gstin=FieldWithConfidence(value="27AABCU9603R1ZN", confidence=0.96),
            subtotal=FieldWithConfidence(value="₹1,00,000.00", confidence=0.98),
            gst_rate_percent=FieldWithConfidence(value="18%", confidence=0.95),
            gst_amount=FieldWithConfidence(value="₹18,00,000.00", confidence=0.72),
            total_amount=FieldWithConfidence(value="₹1,18,000.00", confidence=0.97)
        )
        is_valid, flagged_reason, expected_gst = verify_invoice_math(corrupted_data)
        self.assertFalse(is_valid)
        self.assertIn("Tax calculation flagged for manual review", flagged_reason)
        self.assertIn("Expected GST: ₹18,000.00", flagged_reason)
        self.assertEqual(expected_gst, "₹18,000.00")

    def test_bbox_coordinate_normalization(self):
        norm = normalize_bbox((60, 80, 300, 400), 600, 800)
        self.assertEqual(norm, [100, 100, 500, 500])

    def test_mock_fallback_refusal_when_disabled(self):
        # When model weights are absent and MOCK_FALLBACK is False, extraction must be refused
        original_val = settings.MOCK_FALLBACK
        try:
            settings.MOCK_FALLBACK = False
            slm_engine.is_ready = False
            with self.assertRaises(RuntimeError) as context:
                slm_engine.extract_invoice("test text", "test spatial")
            self.assertIn("MOCK_FALLBACK is disabled", str(context.exception))
        finally:
            settings.MOCK_FALLBACK = original_val

    def test_mock_fallback_returns_source_when_enabled(self):
        # When MOCK_FALLBACK is True and weights absent, it returns (schema, 'mock_fallback')
        original_val = settings.MOCK_FALLBACK
        try:
            settings.MOCK_FALLBACK = True
            slm_engine.is_ready = False
            schema, source = slm_engine.extract_invoice("test text", "test spatial")
            self.assertEqual(source, "mock_fallback")
            self.assertEqual(schema.invoice_number.value, "INV-2026-8941")
        finally:
            settings.MOCK_FALLBACK = original_val

    def test_fastapi_auth_enforcement(self):
        try:
            from fastapi.testclient import TestClient
            from app.main import app
            client = TestClient(app)

            # 1. Unauthenticated request to extraction endpoint should return 401
            res_unauth = client.post("/api/v1/extract/test-doc-id")
            self.assertEqual(res_unauth.status_code, 401)
            self.assertIn("Invalid or missing authentication credentials", res_unauth.json()["detail"])

            # 2. Health check endpoint remains open
            res_health = client.get("/health")
            self.assertEqual(res_health.status_code, 200)
            self.assertTrue(res_health.json()["auth_required"])

            # 3. Authenticated request with invalid token should return 401
            res_bad_auth = client.post(
                "/api/v1/extract/test-doc-id",
                headers={"Authorization": "Bearer wrong-key"}
            )
            self.assertEqual(res_bad_auth.status_code, 401)

            # 4. Authenticated request with valid token reaches service logic
            # (Expect 503 if MOCK_FALLBACK=False and no weights, or 200 if MOCK_FALLBACK=True)
            settings.MOCK_FALLBACK = True
            res_auth = client.post(
                "/api/v1/extract/test-doc-id",
                headers={"Authorization": f"Bearer {settings.DOCUMIND_API_KEY}"}
            )
            self.assertEqual(res_auth.status_code, 200)
            self.assertEqual(res_auth.json()["source"], "mock_fallback")
        except ImportError:
            pass  # TestClient requires httpx/starlette

if __name__ == "__main__":
    unittest.main()
