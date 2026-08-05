import pathlib

from app.ocr import extract_text_from_image

SAMPLE_DIR = pathlib.Path(__file__).parent.parent / "static" / "sample_data"


def test_extract_text_from_image_reads_synthetic_note_1():
    image_bytes = (SAMPLE_DIR / "scanned_note_1.png").read_bytes()
    text = extract_text_from_image(image_bytes)
    assert "Jordan Ellis" in text
    assert "lisinopril" in text.lower()


def test_extract_text_from_image_reads_synthetic_note_2():
    image_bytes = (SAMPLE_DIR / "scanned_note_2.png").read_bytes()
    text = extract_text_from_image(image_bytes)
    assert "Casey Nguyen" in text
    assert "ankle" in text.lower()
