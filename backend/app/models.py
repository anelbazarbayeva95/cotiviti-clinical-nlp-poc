from pydantic import BaseModel


class OcrResponse(BaseModel):
    extracted_text: str


class ExtractRequest(BaseModel):
    note_text: str


class Medication(BaseModel):
    name: str
    dosage: str = ""
    frequency: str = ""


class Diagnosis(BaseModel):
    name: str
    icd10_hint: str = ""


class StructuredNote(BaseModel):
    chief_complaint: str = ""
    diagnoses: list[Diagnosis] = []
    medications: list[Medication] = []
    procedures: list[str] = []
    follow_up: list[str] = []


class ExtractResponse(BaseModel):
    structured: StructuredNote
    model_used: str
