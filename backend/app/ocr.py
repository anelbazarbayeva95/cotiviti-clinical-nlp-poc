"""OCR stage: raster image -> raw text. Represents the 'past' of clinical NLP —
before LLMs, this was the only way to get unstructured scanned/faxed records into
any machine-readable form at all."""

import io

import pytesseract
from PIL import Image


def extract_text_from_image(image_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(image_bytes))
    return pytesseract.image_to_string(image).strip()
