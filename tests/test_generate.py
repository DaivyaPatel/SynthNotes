import pytest
import json
from unittest.mock import patch, MagicMock
from generate import generate_notes, build_generation_prompt, _parse_json_output
from llm_client import LLMError

@pytest.fixture
def mock_units():
    return [
        {"text": "Gradient descent minimizes error.", "source_ids": ["S1"]}
    ]

@pytest.fixture
def mock_mapping():
    return {"Steepest Descent": "Gradient Descent"}


def test_build_generation_prompt(mock_units, mock_mapping):
    prompt = build_generation_prompt(mock_units, mock_mapping, "Optimization")
    
    # Prompt injection mitigation checks
    assert "[SOURCE: S1]" in prompt
    assert "Gradient descent minimizes error." in prompt
    assert "[/SOURCE]" in prompt
    assert "untrusted user data" in prompt
    
    # JSON structure checks
    assert "detailed_explanation" in prompt
    assert "revision_notes" in prompt


def test_parse_json_output_valid():
    raw = """```json
    {
        "detailed_explanation": [{"statement": "Foo", "source_ids": ["S1"]}],
        "revision_notes": [{"bullet": "Bar", "source_ids": ["S1"]}]
    }
    ```"""
    
    parsed = _parse_json_output(raw)
    assert len(parsed["detailed_explanation"]) == 1
    assert parsed["detailed_explanation"][0]["statement"] == "Foo"


def test_parse_json_output_invalid():
    raw = """
    This is just text, not JSON.
    """
    with pytest.raises(json.JSONDecodeError):
        _parse_json_output(raw)


@patch("generate.generate")
def test_generate_notes_success(mock_generate, mock_units, mock_mapping):
    mock_generate.return_value = '{"detailed_explanation": [], "revision_notes": []}'
    
    res = generate_notes(mock_units, mock_mapping, "Optimization")
    
    assert "detailed_explanation" in res
    assert "revision_notes" in res
    mock_generate.assert_called_once()


@patch("generate.generate")
def test_generate_notes_malformed_retry_success(mock_generate, mock_units, mock_mapping):
    # First fails, second succeeds
    mock_generate.side_effect = [
        "Not JSON",
        '{"detailed_explanation": [], "revision_notes": []}'
    ]
    
    res = generate_notes(mock_units, mock_mapping, "Optimization")
    
    assert "detailed_explanation" in res
    assert mock_generate.call_count == 2


@patch("generate.generate")
def test_generate_notes_malformed_failure(mock_generate, mock_units, mock_mapping):
    # Both fail
    mock_generate.side_effect = [
        "Not JSON",
        "Still not JSON"
    ]
    
    with pytest.raises(LLMError, match="Failed to parse LLM output as JSON after retry"):
        generate_notes(mock_units, mock_mapping, "Optimization")
        
    assert mock_generate.call_count == 2
