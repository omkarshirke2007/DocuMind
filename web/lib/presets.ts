// ==============================================================================
// DocuMind SLM — Benchmark Datasets & Presets for Hackathon Demos
// ==============================================================================

import { InvoiceData } from './types';

export interface DocumentPreset {
  id: string;
  filename: string;
  pageCount: number;
  schemaType: string;
  status: 'flagged' | 'completed';
  mathValidated: boolean;
  latencyMs: number;
  overallConfidence: number;
  flaggedReason: string | null;
  expectedGst: string | null;
  extractedData: InvoiceData;
  documentMeta: {
    vendorName: string;
    vendorAddress: string;
    invoiceTitle: string;
    invoiceNo: string;
    invoiceDate: string;
    billToName: string;
    billToAddress: string;
    billToGstin: string;
    lineItems: Array<{ description: string; qty: string; amount: string }>;
    subtotal: string;
    taxLine: string;
    taxAmount: string;
    totalAmount: string;
    corruptedFieldKey?: string;
  };
  rawSpatialPrompt: string;
}

export const DOCUMENT_PRESETS: Record<string, DocumentPreset> = {
  'preset-acme-corrupted': {
    id: 'preset-acme-corrupted',
    filename: 'invoice_8941.pdf',
    pageCount: 1,
    schemaType: 'GST Tax Invoice',
    status: 'flagged',
    mathValidated: false,
    latencyMs: 1420,
    overallConfidence: 0.89,
    flaggedReason: 'Tax calculation flagged for manual review. Expected GST: ₹18,000. Extracted GST reads ₹18,00,000.',
    expectedGst: '₹18,000.00',
    extractedData: {
      invoice_number: {
        value: 'INV-2026-8941',
        confidence: 0.99,
        bbox: [220, 50, 260, 210],
      },
      vendor_name: {
        value: 'ACME INDUSTRIES',
        confidence: 0.98,
        bbox: [80, 50, 115, 280],
      },
      vendor_gstin: {
        value: '27AABCU9603R1ZN',
        confidence: 0.96,
        bbox: [320, 280, 350, 480],
      },
      invoice_date: {
        value: '16 Sep 2026',
        confidence: 0.97,
        bbox: [290, 50, 325, 200],
      },
      subtotal: {
        value: '₹1,00,000.00',
        confidence: 0.98,
        bbox: [565, 340, 595, 480],
      },
      gst_rate_percent: {
        value: '18%',
        confidence: 0.95,
        bbox: [600, 220, 630, 320],
      },
      gst_amount: {
        value: '₹18,00,000.00',
        confidence: 0.72,
        bbox: [600, 340, 635, 480], // Corrupted field matching screenshot
      },
      total_amount: {
        value: '₹1,18,000.00',
        confidence: 0.97,
        bbox: [670, 340, 710, 480],
      },
    },
    documentMeta: {
      vendorName: 'ACME INDUSTRIES',
      vendorAddress: 'Industrial Supplies & Components\nMumbai, Maharashtra - India',
      invoiceTitle: 'TAX INVOICE\nOriginal for Recipient',
      invoiceNo: 'INV-2026-8941',
      invoiceDate: '16 Sep 2026',
      billToName: 'Universal Business Corp.',
      billToAddress: 'Bengaluru, Karnataka',
      billToGstin: '27AABCU9603R1ZN',
      lineItems: [
        { description: 'Precision Assembly Kit', qty: '10', amount: '₹1,00,000.00' },
        { description: 'Handling & Logistics', qty: '1', amount: 'Included' },
      ],
      subtotal: '₹1,00,000.00',
      taxLine: 'CGST + SGST (18%)',
      taxAmount: '₹18,00,000.00',
      totalAmount: '₹1,18,000.00',
      corruptedFieldKey: 'gst_amount',
    },
    rawSpatialPrompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are DocuMind SLM, a 100% on-premise layout-aware document understanding engine.
Extract all tax invoice fields with 2D bounding boxes normalized to [0, 1000] space.
Enforce Pydantic schema constraints. Ensure arithmetic integrity: Subtotal + GST == Total.

<|start_header_id|>user<|end_header_id|>
[2D SPATIAL TOKEN STREAM]:
<loc_80_50_115_280>ACME INDUSTRIES</loc>
<loc_115_50_140_260>Industrial Supplies & Components</loc>
<loc_80_380_110_480>TAX INVOICE</loc>
<loc_220_50_260_210>Invoice No. INV-2026-8941</loc>
<loc_290_50_325_200>Invoice Date: 16 Sep 2026</loc>
<loc_220_280_250_450>Bill To: Universal Business Corp.</loc>
<loc_320_280_350_480>GSTIN: 27AABCU9603R1ZN</loc>
<loc_420_50_450_250>Precision Assembly Kit</loc><loc_420_260_450_300>10</loc><loc_420_360_450_480>₹1,00,000.00</loc>
<loc_460_50_490_250>Handling & Logistics</loc><loc_460_260_490_300>1</loc><loc_460_360_490_480>Included</loc>
<loc_565_220_595_320>Subtotal</loc><loc_565_340_595_480>₹1,00,000.00</loc>
<loc_600_220_630_320>CGST + SGST (18%)</loc><loc_600_340_635_480>₹18,00,000.00</loc>  <-- OCR Corruption
<loc_670_220_710_320>Total</loc><loc_670_340_710_480>₹1,18,000.00</loc>
<|eot_id|>`,
  },

  'preset-techflow-clean': {
    id: 'preset-techflow-clean',
    filename: 'techflow_inv_5520.pdf',
    pageCount: 1,
    schemaType: 'GST Tax Invoice',
    status: 'completed',
    mathValidated: true,
    latencyMs: 1380,
    overallConfidence: 0.98,
    flaggedReason: null,
    expectedGst: '₹8,100.00',
    extractedData: {
      invoice_number: {
        value: 'INV-2026-5520',
        confidence: 0.99,
        bbox: [220, 50, 260, 210],
      },
      vendor_name: {
        value: 'TECHFLOW ENTERPRISES',
        confidence: 0.99,
        bbox: [80, 50, 115, 320],
      },
      vendor_gstin: {
        value: '29ABCDE1234F1Z5',
        confidence: 0.98,
        bbox: [320, 280, 350, 480],
      },
      invoice_date: {
        value: '12 Sep 2026',
        confidence: 0.98,
        bbox: [290, 50, 325, 200],
      },
      subtotal: {
        value: '₹45,000.00',
        confidence: 0.99,
        bbox: [565, 340, 595, 480],
      },
      gst_rate_percent: {
        value: '18%',
        confidence: 0.97,
        bbox: [600, 220, 630, 320],
      },
      gst_amount: {
        value: '₹8,100.00',
        confidence: 0.98,
        bbox: [600, 340, 635, 480],
      },
      total_amount: {
        value: '₹53,100.00',
        confidence: 0.99,
        bbox: [670, 340, 710, 480],
      },
    },
    documentMeta: {
      vendorName: 'TECHFLOW ENTERPRISES',
      vendorAddress: 'Cloud Infrastructure & Microchips\nWhitefield, Bengaluru - India',
      invoiceTitle: 'TAX INVOICE\n100% STP Verified',
      invoiceNo: 'INV-2026-5520',
      invoiceDate: '12 Sep 2026',
      billToName: 'Apex Data Labs Pvt Ltd',
      billToAddress: 'Hyderabad, Telangana',
      billToGstin: '29ABCDE1234F1Z5',
      lineItems: [
        { description: 'Edge Tensor Accelerator Board', qty: '2', amount: '₹30,000.00' },
        { description: 'Firmware Flash & Telemetry License', qty: '1', amount: '₹15,000.00' },
      ],
      subtotal: '₹45,000.00',
      taxLine: 'Integrated GST (18%)',
      taxAmount: '₹8,100.00',
      totalAmount: '₹53,100.00',
    },
    rawSpatialPrompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are DocuMind SLM, a 100% on-premise layout-aware document understanding engine.
Extract all tax invoice fields with 2D bounding boxes normalized to [0, 1000] space.

<|start_header_id|>user<|end_header_id|>
[2D SPATIAL TOKEN STREAM]:
<loc_80_50_115_320>TECHFLOW ENTERPRISES</loc>
<loc_220_50_260_210>Invoice No. INV-2026-5520</loc>
<loc_320_280_350_480>GSTIN: 29ABCDE1234F1Z5</loc>
<loc_565_340_595_480>Subtotal: ₹45,000.00</loc>
<loc_600_340_635_480>GST (18%): ₹8,100.00</loc>
<loc_670_340_710_480>Total: ₹53,100.00</loc>
<|eot_id|>`,
  },

  'preset-apollo-medical': {
    id: 'preset-apollo-medical',
    filename: 'apollo_claim_3091.pdf',
    pageCount: 1,
    schemaType: 'Medical Insurance Claim',
    status: 'completed',
    mathValidated: true,
    latencyMs: 1460,
    overallConfidence: 0.96,
    flaggedReason: null,
    expectedGst: '₹0.00',
    extractedData: {
      invoice_number: {
        value: 'CLM-2026-3091',
        confidence: 0.98,
        bbox: [220, 50, 260, 210],
      },
      vendor_name: {
        value: 'APOLLO HEALTHCARE NETWORK',
        confidence: 0.99,
        bbox: [80, 50, 115, 360],
      },
      vendor_gstin: {
        value: '07AAAAH1234Q1Z8',
        confidence: 0.95,
        bbox: [320, 280, 350, 480],
      },
      invoice_date: {
        value: '14 Sep 2026',
        confidence: 0.97,
        bbox: [290, 50, 325, 200],
      },
      subtotal: {
        value: '₹78,500.00',
        confidence: 0.97,
        bbox: [565, 340, 595, 480],
      },
      gst_rate_percent: {
        value: '0% (Exempt)',
        confidence: 0.99,
        bbox: [600, 220, 630, 320],
      },
      gst_amount: {
        value: '₹0.00',
        confidence: 0.99,
        bbox: [600, 340, 635, 480],
      },
      total_amount: {
        value: '₹78,500.00',
        confidence: 0.98,
        bbox: [670, 340, 710, 480],
      },
    },
    documentMeta: {
      vendorName: 'APOLLO HEALTHCARE NETWORK',
      vendorAddress: 'Super Specialty Hospital & Research Wing\nNew Delhi, India',
      invoiceTitle: 'PATIENT CLAIM SUMMARY\nDPDP Sensitive Medical Data',
      invoiceNo: 'CLM-2026-3091',
      invoiceDate: '14 Sep 2026',
      billToName: 'Star Health & Allied Insurance',
      billToAddress: 'Chennai, Tamil Nadu',
      billToGstin: '07AAAAH1234Q1Z8',
      lineItems: [
        { description: 'Inpatient Room & Nursing (3 Days)', qty: '1', amount: '₹36,000.00' },
        { description: 'Diagnostic MRI & Blood Profiling', qty: '1', amount: '₹22,500.00' },
        { description: 'Pharmacy & Surgical Consumables', qty: '1', amount: '₹20,000.00' },
      ],
      subtotal: '₹78,500.00',
      taxLine: 'Hospital Tax Exemption (Sec 12)',
      taxAmount: '₹0.00',
      totalAmount: '₹78,500.00',
    },
    rawSpatialPrompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are DocuMind SLM, a 100% on-premise layout-aware document understanding engine.
Sensitive Medical Claim Data - Zero Cloud Egress Mandate under DPDP Act 2023.

<|start_header_id|>user<|end_header_id|>
[2D SPATIAL TOKEN STREAM]:
<loc_80_50_115_360>APOLLO HEALTHCARE NETWORK</loc>
<loc_220_50_260_210>Claim No. CLM-2026-3091</loc>
<loc_565_340_595_480>Subtotal: ₹78,500.00</loc>
<loc_600_340_635_480>Tax Exemption: ₹0.00</loc>
<loc_670_340_710_480>Total Claim: ₹78,500.00</loc>
<|eot_id|>`,
  },
};
