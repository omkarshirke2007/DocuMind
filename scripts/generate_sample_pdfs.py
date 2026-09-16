"""
Generates lightweight standard PDF documents for hackathon testing with zero third-party dependencies.
"""
import os

def create_simple_pdf(filename: str, title: str, invoice_no: str, lines: list):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # Simple valid PDF 1.4 template
    stream_content = f"""BT
/F1 18 Tf
50 750 Td
({title}) Tj
/F1 11 Tf
0 -30 Td
(Invoice No: {invoice_no}) Tj
0 -20 Td
(Date: 16 Sep 2026) Tj
0 -30 Td
"""
    for line in lines:
        stream_content += f"0 -18 Td\n({line}) Tj\n"
    stream_content += "ET"

    stream_len = len(stream_content)

    pdf_text = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length {stream_len} >>
stream
{stream_content}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000236 00000 n 
0000000305 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
450
%%EOF"""

    with open(filename, "wb") as f:
        f.write(pdf_text.encode("latin1"))
    print(f"Generated: {filename}")

if __name__ == "__main__":
    base_dir = os.path.join(os.path.dirname(__file__), "..", "web", "public", "samples")
    create_simple_pdf(
        os.path.join(base_dir, "invoice_8941.pdf"),
        "ACME INDUSTRIES - TAX INVOICE",
        "INV-2026-8941",
        [
            "Vendor GSTIN: 27AABCU9603R1ZN",
            "Item: Precision Assembly Kit (Qty: 10) - Rs 1,00,000.00",
            "Subtotal: Rs 1,00,000.00",
            "CGST + SGST (18%): Rs 18,00,000.00 (FLAGGED ANOMALY)",
            "Total Amount: Rs 1,18,000.00",
        ]
    )
    create_simple_pdf(
        os.path.join(base_dir, "techflow_inv_5520.pdf"),
        "TECHFLOW ENTERPRISES - TAX INVOICE",
        "INV-2026-5520",
        [
            "Vendor GSTIN: 29ABCDE1234F1Z5",
            "Subtotal: Rs 45,000.00",
            "GST (18%): Rs 8,100.00",
            "Total Amount: Rs 53,100.00 (100% STP VERIFIED)",
        ]
    )
    create_simple_pdf(
        os.path.join(base_dir, "apollo_claim_3091.pdf"),
        "APOLLO HEALTHCARE - PATIENT CLAIM",
        "CLM-2026-3091",
        [
            "Hospital GSTIN: 07AAAAH1234Q1Z8",
            "Inpatient Treatment: Rs 78,500.00",
            "Tax Exemption: Rs 0.00",
            "Total Claim: Rs 78,500.00",
        ]
    )
