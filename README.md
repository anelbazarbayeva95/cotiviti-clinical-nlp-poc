# Clinical Note Structuring POC

Submission for Cotiviti's Generative AI Research Engineer Intern performance-based
assessment — Topic 1: **Clinical Natural Language Technology for Health Care: Past,
Present, and Future Approaches** (NLP, OCR, Computer Vision, LLM, LMM).

**All patient data in this project is synthetic and fictional, generated for demo
purposes only. No real patient data (PHI) is used anywhere.**

## What's here

- **`backend/`** — the working proof of concept: a two-stage pipeline (OCR, then Claude
  tool-use extraction) that turns a scanned clinical note into structured fields
  (chief complaint, diagnoses, medications, procedures, follow-up).
- **`deliverables/`** — the written report (`Clinical_NLP_Report_Bazarbayeva.docx` /
  `.pdf`) and the slide deck (`Clinical_NLP_Slides_Bazarbayeva.pptx`).

## Running the POC

```bash
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...   # required for Stage 2 (extraction); Stage 1 (OCR) works without it
.venv/bin/uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000 — pick a sample scanned note and run it through OCR, then
extraction. Without `ANTHROPIC_API_KEY` set, OCR still works; extraction returns a
clear "unavailable" message instead of failing silently.

Run the tests:

```bash
cd backend && .venv/bin/python -m pytest
```

## How it works

1. **OCR** (`app/ocr.py`) — `pytesseract` reads a synthetic "scanned" note image
   (generated with `sample_data/generate_scanned_notes.py`), representing the
   historical starting point for clinical NLP: getting unstructured, noisy text out of
   a scanned or faxed document at all.
2. **Extraction** (`app/extract.py`) — the raw OCR text (noise and all) is sent to
   Claude with a forced tool call (`record_structured_note`), which returns clean JSON
   directly — no regex, no hand-built named-entity model per document type.
3. The static front end (`static/index.html`, no build step by design) drives both
   stages and renders the result.

## Why this design

The assessment explicitly grades the POC on "how well you hack to prove a concept,"
not on polish — so the front end is a single HTML file with vanilla JS, and the
extraction step uses Claude's native tool-use for structured output rather than
prompt-engineered JSON parsing. The OCR step is intentionally imperfect (light rotation
and noise are added to the synthetic scans) to demonstrate that the LLM extraction
stage is robust to exactly the kind of noisy input real OCR produces.

See `deliverables/Clinical_NLP_Report_Bazarbayeva.docx` for the full analysis this POC
supports — trends across the field, opportunities/threats, and recommended options for
Cotiviti specifically.
