"""LLM structuring stage: raw clinical note text -> structured JSON. Represents the
'present' of clinical NLP — a single Claude call replaces what used to require a
purpose-built NER pipeline (regexes, dictionaries, a trained CRF/BiLSTM tagger)."""

import os

import anthropic

DEFAULT_MODEL = os.environ.get("CLINICAL_NLP_CLAUDE_MODEL", "claude-sonnet-5")

SYSTEM_PROMPT = (
    "You extract structured clinical information from free-text notes for a healthcare "
    "informatics demo. You are not making diagnostic or treatment decisions — you are "
    "transcribing what the note already states into structured fields. If a field isn't "
    "present in the note, leave it empty rather than inferring or guessing."
)

RECORD_NOTE_TOOL = {
    "name": "record_structured_note",
    "description": "Record the structured extraction of a clinical note.",
    "input_schema": {
        "type": "object",
        "properties": {
            "chief_complaint": {"type": "string"},
            "diagnoses": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "icd10_hint": {
                            "type": "string",
                            "description": "Plausible ICD-10 category if evident from context, else empty string.",
                        },
                    },
                    "required": ["name"],
                },
            },
            "medications": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "dosage": {"type": "string"},
                        "frequency": {"type": "string"},
                    },
                    "required": ["name"],
                },
            },
            "procedures": {"type": "array", "items": {"type": "string"}},
            "follow_up": {"type": "array", "items": {"type": "string"}},
        },
        "required": ["chief_complaint", "diagnoses", "medications", "procedures", "follow_up"],
    },
}


def extract_structured_note(note_text: str, client: anthropic.Anthropic = None) -> dict:
    client = client or anthropic.Anthropic()
    response = client.messages.create(
        model=DEFAULT_MODEL,
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        tools=[RECORD_NOTE_TOOL],
        tool_choice={"type": "tool", "name": "record_structured_note"},
        messages=[{"role": "user", "content": f"Clinical note:\n\n{note_text}"}],
    )
    tool_call = next(block for block in response.content if block.type == "tool_use")
    return tool_call.input
