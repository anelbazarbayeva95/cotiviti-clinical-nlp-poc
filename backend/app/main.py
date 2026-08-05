import logging

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import extract, ocr
from .models import ExtractRequest, ExtractResponse, OcrResponse, StructuredNote

app = FastAPI(
    title="Clinical Note Structuring POC",
    description=(
        "Cotiviti GenAI Research Engineer Intern assessment POC: OCR + Claude-powered "
        "extraction of structured fields from a clinical note. Synthetic demo data only "
        "— no real patient data."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/ocr", response_model=OcrResponse)
async def run_ocr(file: UploadFile = File(...)):
    image_bytes = await file.read()
    try:
        text = ocr.extract_text_from_image(image_bytes)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Could not read image: {exc}") from exc
    return OcrResponse(extracted_text=text)


@app.post("/api/extract", response_model=ExtractResponse)
def run_extract(request: ExtractRequest):
    if not request.note_text.strip():
        raise HTTPException(status_code=422, detail="note_text is empty")
    try:
        structured = extract.extract_structured_note(request.note_text)
    except Exception:
        logging.getLogger(__name__).exception("Claude extraction failed")
        raise HTTPException(
            status_code=502,
            detail="Extraction unavailable — set the ANTHROPIC_API_KEY environment variable to enable it.",
        ) from None
    return ExtractResponse(structured=StructuredNote(**structured), model_used=extract.DEFAULT_MODEL)


app.mount("/", StaticFiles(directory="static", html=True), name="static")
