from typing import List, Dict, Any, Tuple, Optional
import os
import io
import re
import numpy as np

_ocr_engine = None

def get_ocr_engine():
    """Lazy-initializes RapidOCR ONNX runtime engine."""
    global _ocr_engine
    if _ocr_engine is None:
        try:
            from rapidocr_onnxruntime import RapidOCR
            _ocr_engine = RapidOCR()
            print("[INFO] RapidOCR engine initialized successfully.")
        except Exception as e:
            print(f"[WARN] RapidOCR initialization failed: {e}")
            _ocr_engine = False
    return _ocr_engine if _ocr_engine is not False else None

def normalize_bbox(rect: Tuple[float, float, float, float], page_width: float, page_height: float) -> List[int]:
    """
    Normalizes coordinates (x0, y0, x1, y1) into [ymin, xmin, ymax, xmax] on a 0-1000 scale.
    Matches vision model coordinate systems.
    """
    if page_width <= 0:
        page_width = 1.0
    if page_height <= 0:
        page_height = 1.0
    x0, y0, x1, y1 = rect
    ymin = max(0, min(1000, int((y0 / page_height) * 1000)))
    xmin = max(0, min(1000, int((x0 / page_width) * 1000)))
    ymax = max(0, min(1000, int((y1 / page_height) * 1000)))
    xmax = max(0, min(1000, int((x1 / page_width) * 1000)))
    return [ymin, xmin, ymax, xmax]

def _run_ocr_on_cv2_img(img: np.ndarray) -> Dict[str, Any]:
    """Runs RapidOCR on an in-memory BGR numpy image and returns spatial structure."""
    import cv2
    engine = get_ocr_engine()
    if engine is None or img is None:
        return {"text": "", "spatial_stream": "", "words": [], "width": 800, "height": 1000}

    orig_h, orig_w = img.shape[:2]
    
    # If image is small or low-res (e.g. mobile screenshots or crops), upscale for crisp OCR recognition
    if max(orig_h, orig_w) < 1400:
        scale = min(3.0, max(1.5, 1400.0 / max(orig_h, orig_w)))
        target_w = int(orig_w * scale)
        target_h = int(orig_h * scale)
        ocr_img = cv2.resize(img, (target_w, target_h), interpolation=cv2.INTER_CUBIC)
    else:
        ocr_img = img

    cur_h, cur_w = ocr_img.shape[:2]
    result, _ = engine(ocr_img)
    if not result:
        return {"text": "", "spatial_stream": "", "words": [], "width": orig_w, "height": orig_h}

    text_lines = []
    words_data = []
    spatial_tokens = []

    for item in result:
        box, text, score = item[0], str(item[1]).strip(), float(item[2])
        if not text:
            continue
        text_lines.append(text)
        xmin = min(p[0] for p in box)
        ymin = min(p[1] for p in box)
        xmax = max(p[0] for p in box)
        ymax = max(p[1] for p in box)
        norm_box = normalize_bbox((xmin, ymin, xmax, ymax), cur_w, cur_h)
        words_data.append({"text": text, "bbox": norm_box, "confidence": score})
        spatial_tokens.append(f"<loc_{norm_box[0]}_{norm_box[1]}_{norm_box[2]}_{norm_box[3]}>{text}</loc>")

    return {
        "text": "\n".join(text_lines),
        "spatial_stream": " ".join(spatial_tokens),
        "words": words_data,
        "width": orig_w,
        "height": orig_h
    }

def parse_pdf_spatial_stream(doc_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts text and 2D bounding boxes from PDF, scanned PDF, or image byte stream.
    1. For text-based PDFs: uses fast native PyMuPDF layout extraction.
    2. For scanned/image-only PDFs: renders page pixmap and runs RapidOCR.
    3. For image formats (PNG, JPG, WEBP, TIFF): runs RapidOCR directly.
    """
    if not doc_bytes or len(doc_bytes) == 0:
        return {"text": "", "spatial_stream": "", "words": [], "width": 600, "height": 800}

    import cv2

    # Check if the document is an image (PNG, JPEG, WEBP, etc.) or doesn't start with %PDF
    is_pdf = doc_bytes.startswith(b"%PDF")

    if not is_pdf:
        # Decode as image directly
        nparr = np.frombuffer(doc_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is not None:
            return _run_ocr_on_cv2_img(img)

    # If it is a PDF or image-to-PDF
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=doc_bytes, filetype="pdf" if is_pdf else None)
        if len(doc) == 0:
            return {"text": "", "spatial_stream": "", "words": [], "width": 600, "height": 800}

        page = doc[0]
        rect = page.rect
        width, height = rect.width, rect.height

        # 1. Try native PDF text extraction first
        raw_words = page.get_text("words")  # [x0, y0, x1, y1, word, block_no, line_no, word_no]
        plain_text = page.get_text("text").strip()

        # If native PDF text has substantial content, use PyMuPDF directly
        if len(plain_text) > 30 and len(raw_words) > 5:
            words_data = []
            spatial_tokens = []
            for w in raw_words:
                box = normalize_bbox((w[0], w[1], w[2], w[3]), width, height)
                word_str = str(w[4]).strip()
                if word_str:
                    words_data.append({"text": word_str, "bbox": box})
                    spatial_tokens.append(f"<loc_{box[0]}_{box[1]}_{box[2]}_{box[3]}>{word_str}</loc>")

            return {
                "text": plain_text,
                "spatial_stream": " ".join(spatial_tokens),
                "words": words_data,
                "width": width,
                "height": height
            }

        # 2. Native text is absent or near-zero -> Scanned PDF. Render pixmap and run RapidOCR!
        pix = page.get_pixmap(dpi=150)
        pix_img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
        if pix.n >= 3:
            pix_img = cv2.cvtColor(pix_img, cv2.COLOR_RGB2BGR)
        return _run_ocr_on_cv2_img(pix_img)

    except Exception as err:
        # Fallback: try decoding as raw image
        try:
            nparr = np.frombuffer(doc_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is not None:
                return _run_ocr_on_cv2_img(img)
        except Exception:
            pass

        return {
            "text": f"Document parsing error: {str(err)}",
            "spatial_stream": "",
            "words": [],
            "width": 600,
            "height": 800
        }
