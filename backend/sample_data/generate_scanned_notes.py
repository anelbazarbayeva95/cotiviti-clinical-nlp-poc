"""Generates synthetic 'scanned note' images for the OCR demo stage.

These are typed, entirely fictional notes rendered to an image and lightly
degraded (rotation + noise) to stand in for a scanned/faxed document. No real
patient data is used anywhere here.
"""

import pathlib
import random

from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
OUTPUT_DIR = pathlib.Path(__file__).parent
STATIC_SAMPLE_DIR = pathlib.Path(__file__).parent.parent / "static" / "sample_data"

NOTE_1 = """Patient: Jordan Ellis (fictional/synthetic)
DOB: 1988-03-14 (synthetic)
Visit type: Annual physical

Chief complaint: Patient presents for routine annual
physical exam, no acute complaints.

Assessment: Mild essential hypertension, well-controlled.
Seasonal allergic rhinitis, active.

Plan / Medications: Continue lisinopril 10mg once daily.
Start loratadine 10mg once daily as needed for allergy
symptoms.

Procedures performed: Routine bloodwork drawn
(CBC, CMP, lipid panel).

Follow-up: Return in 12 months for next annual physical.
Recheck blood pressure in 3 months."""

NOTE_2 = """Patient: Casey Nguyen (fictional/synthetic)
DOB: 1996-11-30 (synthetic)
Visit type: Emergency room visit

Chief complaint: Patient presents with right ankle pain
and swelling after a fall while running, onset 2 hours
prior to arrival.

Assessment: Right ankle sprain, grade II. X-ray negative
for fracture.

Plan / Medications: Ibuprofen 600mg every 8 hours as
needed for pain. RICE protocol (rest, ice, compression,
elevation).

Procedures performed: Right ankle X-ray, 2 views.

Follow-up: Follow up with orthopedics in 1 week if pain
or swelling has not improved."""


def render_note_image(text: str, output_path: pathlib.Path, seed: int) -> None:
    random.seed(seed)
    font = ImageFont.truetype(FONT_PATH, 22)
    padding = 40
    line_height = 30
    lines = text.split("\n")
    width = 900
    height = padding * 2 + line_height * len(lines)

    image = Image.new("L", (width, height), color=255)
    draw = ImageDraw.Draw(image)
    y = padding
    for line in lines:
        draw.text((padding, y), line, font=font, fill=0)
        y += line_height

    # Light degradation to simulate a scanned/faxed document.
    rotated = image.rotate(random.uniform(-0.6, 0.6), fillcolor=255, expand=True)
    pixels = rotated.load()
    for _ in range(int(rotated.width * rotated.height * 0.004)):
        x = random.randint(0, rotated.width - 1)
        y = random.randint(0, rotated.height - 1)
        pixels[x, y] = random.choice([0, 255])

    rotated.convert("RGB").save(output_path)
    print(f"wrote {output_path}")


if __name__ == "__main__":
    STATIC_SAMPLE_DIR.mkdir(parents=True, exist_ok=True)
    render_note_image(NOTE_1, STATIC_SAMPLE_DIR / "scanned_note_1.png", seed=1)
    render_note_image(NOTE_2, STATIC_SAMPLE_DIR / "scanned_note_2.png", seed=2)
