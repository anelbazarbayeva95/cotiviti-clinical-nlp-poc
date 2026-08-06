# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Clinical Note Structuring proof of concept built for Cotiviti's Generative AI
Research Engineer Intern assessment (Topic 1: Clinical Natural Language Technology for
Health Care). A two-stage pipeline — OCR, then Claude tool-use extraction — turns a
scanned clinical note into structured fields (chief complaint, diagnoses, medications,
procedures, follow-up). `deliverables/` holds the written report and slide deck that
accompany the POC.

**All patient data anywhere in this repo (sample notes, images) is synthetic and
fictional. Never add or reference real patient data (PHI) here.**

## Commands

### Backend (`backend/`)

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...                     # required for extraction; OCR works without it
.venv/bin/uvicorn app.main:app --reload --port 8000      # dev server, serves API + static/ at http://localhost:8000
.venv/bin/python -m pytest                                # all tests
.venv/bin/python -m pytest tests/test_ocr.py -k note_1    # single test / pattern
```

Regenerate the synthetic scanned-note images (writes into `static/sample_data/`, which
the front end fetches directly):

```bash
.venv/bin/python sample_data/generate_scanned_notes.py
```

### Deliverables (`deliverables/build/`)

The Word report and slide deck are generated, not hand-authored, via `docx`/`pptxgenjs`
Node scripts — kept for reproducibility, not runtime code.

```bash
npm install                    # docx, pptxgenjs, react-icons, react, react-dom, sharp
node generate_icons.js         # renders react-icons to PNG (deck icon motif) into icons/
node make_report.js            # writes ../Clinical_NLP_Report_Bazarbayeva.docx
node make_slides.js            # writes ../Clinical_NLP_Slides_Bazarbayeva.pptx
```

After regenerating either deliverable, verify visually before trusting it — LibreOffice
needs `libreoffice-writer`/`libreoffice-impress`/`libreoffice-calc` installed (not just
`libreoffice-core`) or conversion fails with "source file could not be loaded":

```bash
soffice --headless --convert-to pdf ../Clinical_NLP_Report_Bazarbayeva.docx --outdir ..
pdftoppm -jpeg -r 100 ../Clinical_NLP_Report_Bazarbayeva.pdf page   # then read page-*.jpg
```

## Architecture

- **`app/ocr.py` and `app/extract.py` are two independent, separately testable
  stages**, matching the report's "past vs. present" framing: `ocr.py` (pytesseract)
  is the historical digitization step; `extract.py` is the modern single-LLM-call
  structuring step. `app/main.py`'s `/api/ocr` and `/api/extract` endpoints call them
  independently — the front end chains them, but nothing on the backend requires OCR
  output to reach extraction (pasted text skips OCR entirely).
- **`extract.py` uses a forced Claude tool call** (`tool_choice: {"type": "tool", ...}`
  on `record_structured_note`) rather than prompt-and-parse JSON — this is what makes
  the output schema reliable without a fragile parsing step. `RECORD_NOTE_TOOL`'s
  `input_schema` is the source of truth for the structured note shape; keep it and
  `models.StructuredNote` in sync if either changes.
- **`app/main.py` mounts `StaticFiles` at `/` after the API routes are registered** —
  order matters in FastAPI here, since a root static mount would otherwise shadow
  `/api/*`.
- **`static/index.html` is a single file with vanilla JS/CSS, deliberately no build
  step.** The assessment explicitly grades the POC on "how well you hack to prove a
  concept," not polish, so this trades a framework for something anyone can run with
  zero tooling beyond the FastAPI server itself.
- **Sample data has two locations that must stay in sync**: the generator
  (`sample_data/generate_scanned_notes.py`) writes the actual PNGs into
  `static/sample_data/`, which is what `index.html` fetches at runtime. The `<option>`
  values in `index.html`'s sample-image `<select>` are hardcoded paths into that
  directory — regenerating notes with different filenames means updating both places.
- **Tests never hit the network.** `tests/test_extract.py` stubs the Anthropic client
  (fake `messages.create` returning a canned tool-use block) to verify the tool-call
  contract; `tests/test_ocr.py` runs real OCR against the committed synthetic images in
  `static/sample_data/`, so it needs `tesseract-ocr` installed but not network access.
