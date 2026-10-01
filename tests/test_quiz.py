import pytest
import json
from unittest.mock import patch
from quiz import generate_quiz
from llm_client import LLMError

@pytest.fixture
def mock_notes():
    return {
        "detailed_explanation": [{"statement": "Gradient descent minimizes error.", "source_ids": ["S1"]}],
        "revision_notes": [{"bullet": "Used in ML.", "source_ids": ["S1"]}]
    }

@patch("quiz.generate")
def test_generate_quiz_success(mock_generate, mock_notes):
    mock_response = {
        "quiz": [
            {"type": "mcq", "question": "Q1", "options": ["A", "B"], "answer": "A"},
            {"type": "fill_in_the_blank", "question": "Q2", "answer": "A"},
            {"type": "short_answer", "question": "Q3", "answer": "A"},
            {"type": "long_answer", "question": "Q4", "answer": "A"}
        ]
    }
    mock_generate.return_value = json.dumps(mock_response)
    
    res = generate_quiz(mock_notes)
    
    assert "quiz" in res
    assert len(res["quiz"]) == 4
    
    types = [q["type"] for q in res["quiz"]]
    assert "mcq" in types
    assert "fill_in_the_blank" in types

@patch("quiz.generate")
def test_generate_quiz_retry(mock_generate, mock_notes):
    # Fails once, succeeds next
    mock_response = {
        "quiz": []
    }
    mock_generate.side_effect = [
        "Not JSON",
        json.dumps(mock_response)
    ]
    
    res = generate_quiz(mock_notes)
    assert "quiz" in res
    assert mock_generate.call_count == 2
