from dataclasses import dataclass, field

from app.extract import RECORD_NOTE_TOOL, extract_structured_note


@dataclass
class FakeToolUseBlock:
    input: dict
    type: str = "tool_use"


@dataclass
class FakeResponse:
    content: list = field(default_factory=list)


class FakeMessages:
    def __init__(self, canned_input):
        self.canned_input = canned_input
        self.last_call_kwargs = None

    def create(self, **kwargs):
        self.last_call_kwargs = kwargs
        return FakeResponse(content=[FakeToolUseBlock(input=self.canned_input)])


class FakeAnthropicClient:
    def __init__(self, canned_input):
        self.messages = FakeMessages(canned_input)


def test_extract_structured_note_returns_tool_input():
    canned = {
        "chief_complaint": "Annual physical, no acute complaints.",
        "diagnoses": [{"name": "Essential hypertension", "icd10_hint": "I10"}],
        "medications": [{"name": "Lisinopril", "dosage": "10mg", "frequency": "once daily"}],
        "procedures": ["Routine bloodwork"],
        "follow_up": ["Return in 12 months"],
    }
    client = FakeAnthropicClient(canned)

    result = extract_structured_note("some note text", client=client)

    assert result == canned


def test_extract_structured_note_forces_the_record_tool():
    client = FakeAnthropicClient({"chief_complaint": "", "diagnoses": [], "medications": [], "procedures": [], "follow_up": []})

    extract_structured_note("note text", client=client)

    call_kwargs = client.messages.last_call_kwargs
    assert call_kwargs["tool_choice"] == {"type": "tool", "name": "record_structured_note"}
    assert call_kwargs["tools"] == [RECORD_NOTE_TOOL]
    assert "note text" in call_kwargs["messages"][0]["content"]
