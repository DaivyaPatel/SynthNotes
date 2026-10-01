import os
import sys
import json
import uuid
from pathlib import Path

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up mock environment variables for the demo if not present
os.environ.setdefault("GEMINI_API_KEY", "dummy_key_for_demo")
os.environ.setdefault("LLM_PROVIDER", "demo_mock") # We'll patch llm_client if needed, or just let it try gemini

# Patch the LLM client to return dummy data so the demo runs even without an API key
import llm_client
def mock_generate(prompt, **kwargs):
    if "quiz" in prompt.lower():
        return json.dumps({
            "quiz": [
                {"type": "mcq", "question": "Demo Q1?", "options": ["A", "B"], "answer": "A"},
                {"type": "fill_in_the_blank", "question": "Demo Q2?", "answer": "Demo"},
                {"type": "short_answer", "question": "Demo Q3?", "answer": "Demo"},
                {"type": "long_answer", "question": "Demo Q4?", "answer": "Demo"}
            ]
        })
    else:
        return json.dumps({
            "detailed_explanation": [
                {"statement": "This is a demo generated explanation.", "source_ids": ["S1", "S2"]}
            ],
            "revision_notes": [
                {"bullet": "Demo bullet point.", "source_ids": ["S1"]}
            ]
        })
llm_client.generate = mock_generate

from storage import get_engine, create_tables, create_session_and_register_files, get_session_sources
from ingest import ingest_sources
from terminology import normalize_terminology
from salience import segment_content, score_salience
from generate import generate_notes
from faithfulness import evaluate_notes_faithfulness
from quiz import generate_quiz

engine = get_engine("sqlite:///data/demo.db")
create_tables(engine)

DEMO_DATA = {
    "Machine_Learning": [
        "Gradient descent is a popular optimization algorithm used in machine learning. It minimizes the loss function.",
        "Steepest descent is an optimization algorithm. Backpropagation calculates the gradients."
    ],
    "Biology": [
        "Photosynthesis is a process used by plants. It converts light energy into chemical energy.",
        "Chlorophyll absorbs light. Photosynthesis creates oxygen as a byproduct."
    ]
}

def run_demo():
    print("Starting End-to-End Pipeline Demo...")
    out_dir = Path("data/demo_runs")
    
    for topic, texts in DEMO_DATA.items():
        print(f"\nProcessing Topic: {topic}")
        topic_dir = out_dir / topic
        topic_dir.mkdir(parents=True, exist_ok=True)
        
        # 1. Create mock files
        file_paths = []
        for i, text in enumerate(texts):
            p = topic_dir / f"source_{i+1}.txt"
            p.write_text(text, encoding="utf-8")
            file_paths.append(str(p))
            
        # 2. Ingest
        session_id = create_session_and_register_files(engine, "data/demo_uploads", file_paths)
        sources_meta = get_session_sources(engine, session_id)
        
        filepaths = [Path("data/demo_uploads") / session_id / src["filename"] for src in sources_meta]
        sources = ingest_sources([str(p) for p in filepaths])
        for src, meta in zip(sources, sources_meta):
            src["source_id"] = meta["source_id"]
            
        # 3. Terminology
        term_res = normalize_terminology(sources, session_id=session_id, engine=engine)
        canonical_map = term_res["mapping"]
        
        with open(topic_dir / "canonical_mapping.json", "w") as f:
            json.dump(canonical_map, f, indent=2)
            
        # 4. Salience
        units = segment_content(sources)
        ranked_units = score_salience(units)
        
        with open(topic_dir / "salience_ranked_units.json", "w") as f:
            json.dump(ranked_units, f, indent=2)
            
        # 5. Generation
        notes = generate_notes(ranked_units, canonical_map, topic)
        
        with open(topic_dir / "generated_notes.json", "w") as f:
            json.dump(notes, f, indent=2)
            
        # 6. Faithfulness
        faithfulness_report = evaluate_notes_faithfulness(notes, ranked_units)
        
        with open(topic_dir / "faithfulness_report.json", "w") as f:
            json.dump(faithfulness_report, f, indent=2)
            
        # 7. Quiz
        quiz = generate_quiz(notes)
        
        with open(topic_dir / "quiz.json", "w") as f:
            json.dump(quiz, f, indent=2)
            
        # Summary for Slides
        summary = f"""# {topic} Pipeline Summary
- Sources processed: {len(sources)}
- Extracted terminology mapping keys: {len(canonical_map)}
- Number of scoreable units ranked: {len(ranked_units)}
- Faithfulness evaluation statements evaluated: {faithfulness_report.get('statements_evaluated', 0)}
- Faithfulness overall score: {faithfulness_report.get('overall_score', 0):.2f}
- Quiz questions generated: {len(quiz.get('quiz', []))}
"""
        with open(topic_dir / "summary_for_slides.md", "w") as f:
            f.write(summary)
            
        print(f"[{topic}] Complete! Artifacts saved to: {topic_dir}")

if __name__ == "__main__":
    run_demo()
