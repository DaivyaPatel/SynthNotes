import pytest
from unittest.mock import patch, MagicMock
from llm_client import generate, LLMError

@patch("llm_client._generate_with_gemini")
def test_generate_success_gemini(mock_gemini):
    mock_gemini.return_value = "Mocked Response"
    
    res = generate("Hello", provider="gemini")
    assert res == "Mocked Response"
    mock_gemini.assert_called_once()


@patch("llm_client._generate_with_ollama")
def test_generate_retry_logic(mock_ollama):
    # Fail twice, then succeed
    mock_ollama.side_effect = [Exception("Network error"), Exception("Timeout"), "Success"]
    
    with patch("time.sleep"): # avoid actual sleeping in tests
        res = generate("Hello", provider="ollama")
        
    assert res == "Success"
    assert mock_ollama.call_count == 3


@patch("llm_client._generate_with_ollama")
def test_generate_exhaust_retries(mock_ollama):
    # Always fail
    mock_ollama.side_effect = Exception("Persistent Error")
    
    with patch("time.sleep"):
        with pytest.raises(LLMError, match="failed after 3 attempts"):
            generate("Hello", provider="ollama")
            
    assert mock_ollama.call_count == 3


def test_generate_unsupported_provider():
    with pytest.raises(ValueError, match="Unsupported LLM_PROVIDER"):
        generate("Hello", provider="unsupported_ai")
