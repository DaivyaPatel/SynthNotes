import json
from llm_client import generate, LLMError

def build_quiz_prompt(notes: dict, is_retry: bool = False) -> str:
    retry_instruction = ""
    if is_retry:
        retry_instruction = "\nCRITICAL: Your previous response was NOT valid JSON. You MUST return ONLY valid, parseable JSON.\n"

    notes_text = json.dumps(notes, indent=2)
    
    prompt = f"""You are an expert exam creator.
I will provide you with a set of synthesized study notes. 
Your task is to generate a diverse quiz based STRICTLY on these notes. 
Use the exact terminology found in the notes.

{retry_instruction}

You must generate exactly 4 questions, one of each type:
1. Multiple Choice Question (MCQ)
2. Fill-in-the-blank
3. Short Answer
4. Long Answer

Output your response STRICTLY as a JSON object matching this schema exactly, with no markdown formatting outside the JSON:
{{
    "quiz": [
        {{
            "id": "q1",
            "type": "mcq",
            "question": "...",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "A",
            "explanation": "..."
        }},
        {{
            "id": "q2",
            "type": "fill_in_the_blank",
            "question": "...",
            "correct_answer": "...",
            "acceptable_alternatives": ["...", "..."],
            "explanation": "..."
        }},
        {{
            "id": "q3",
            "type": "short_answer",
            "question": "...",
            "sample_answer": "...",
            "key_points": ["...", "..."],
            "explanation": "..."
        }},
        {{
            "id": "q4",
            "type": "long_answer",
            "question": "...",
            "sample_answer": "...",
            "key_points": ["...", "..."],
            "explanation": "..."
        }}
    ]
}}

NOTES:
{notes_text}
"""
    return prompt

def _parse_json_output(raw_text: str) -> dict:
    clean_text = raw_text.strip()
    if clean_text.startswith("```json"):
        clean_text = clean_text[7:]
    elif clean_text.startswith("```"):
        clean_text = clean_text[3:]
        
    if clean_text.endswith("```"):
        clean_text = clean_text[:-3]
        
    clean_text = clean_text.strip()
    
    parsed = json.loads(clean_text)
    if "quiz" not in parsed:
        raise ValueError("JSON missing required top-level 'quiz' key.")
    return parsed

def generate_quiz(notes: dict) -> dict:
    """
    Generates a structured quiz purely based on the finalized notes (T-11).
    """
    prompt = build_quiz_prompt(notes)
    try:
        raw_output = generate(prompt)
        return _parse_json_output(raw_output)
    except (json.JSONDecodeError, ValueError):
        # retry
        retry_prompt = build_quiz_prompt(notes, is_retry=True)
        raw_output = generate(retry_prompt)
        try:
            return _parse_json_output(raw_output)
        except (json.JSONDecodeError, ValueError) as e:
            raise LLMError(f"Failed to parse quiz output as JSON after retry. Error: {e}")
