import os
import time
from dotenv import load_dotenv

load_dotenv()

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()
MAX_RETRIES = 3

class LLMError(Exception):
    """Custom exception for all LLM-related failures."""
    pass

def _generate_with_gemini(prompt: str, **kwargs) -> str:
    import google.generativeai as genai
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set.")
        
    genai.configure(api_key=api_key)
    # Defaulting to gemini-flash-latest as the current available model
    model_name = kwargs.get("model", "gemini-flash-latest")
    model = genai.GenerativeModel(model_name)
    
    response = model.generate_content(prompt)
    if not response.text:
        raise LLMError("Received empty response from Gemini.")
    return response.text

def _generate_with_ollama(prompt: str, **kwargs) -> str:
    import requests
    url = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/generate")
    model = kwargs.get("model", "llama3.1:8b")
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    response = requests.post(url, json=payload)
    response.raise_for_status()
    data = response.json()
    return data.get("response", "")

def _generate_with_claude(prompt: str, **kwargs) -> str:
    raise NotImplementedError("Claude provider is not yet fully implemented in v1.")

def _generate_with_groq(prompt: str, **kwargs) -> str:
    import httpx
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or not api_key.startswith("gsk_"):
            raise ValueError("GROQ_API_KEY is not set.")
            
    url = "https://api.groq.com/openai/v1/chat/completions"
    model = kwargs.get("model", "llama-3.1-8b-instant")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}]
    }
    
    with httpx.Client(timeout=60.0) as client:
        response = client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]

def generate(prompt: str, **kwargs) -> str:
    """
    Generate text using the configured LLM provider.
    Includes retry logic up to MAX_RETRIES.
    """
    provider = kwargs.get("provider", LLM_PROVIDER)
    
    # Auto-detect Groq if they pasted a Groq key instead of Gemini
    if provider == "gemini":
        gemini_key = os.getenv("GEMINI_API_KEY", "")
        if gemini_key.startswith("gsk_") or os.getenv("GROQ_API_KEY"):
            provider = "groq"

    last_error = None
    
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            if provider == "gemini":
                return _generate_with_gemini(prompt, **kwargs)
            elif provider == "ollama":
                return _generate_with_ollama(prompt, **kwargs)
            elif provider == "claude":
                return _generate_with_claude(prompt, **kwargs)
            elif provider == "groq":
                return _generate_with_groq(prompt, **kwargs)
            else:
                raise ValueError(f"Unsupported LLM_PROVIDER: {provider}")
        except ValueError as e:
            # Configuration errors shouldn't be retried
            raise e
        except Exception as e:
            last_error = e
            if attempt < MAX_RETRIES:
                time.sleep(2 ** attempt)  # Exponential backoff: 2s, 4s, etc.
                
    raise LLMError(f"LLM generation failed after {MAX_RETRIES} attempts. Last error: {last_error}")
