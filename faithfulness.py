import os
import numpy as np
from sentence_transformers.cross_encoder import CrossEncoder
from dotenv import load_dotenv

load_dotenv()

FAITHFULNESS_THRESHOLD = float(os.getenv("FAITHFULNESS_THRESHOLD", "0.5"))

# We use a fast, local cross-encoder for NLI
# Label mapping: 0=Contradiction, 1=Entailment, 2=Neutral
_model = None

def get_nli_model():
    global _model
    if _model is None:
        _model = CrossEncoder("cross-encoder/nli-distilroberta-base", max_length=512)
    return _model

def score_faithfulness(statement: str, source_text: str) -> dict:
    """
    Evaluates if a generated statement is supported by the source_text.
    """
    model = get_nli_model()
    # predict returns logits for [contradiction, entailment, neutral]
    scores = model.predict([(statement, source_text)])[0]
    
    # Softmax to get probabilities
    exp_scores = np.exp(scores - np.max(scores))
    probs = exp_scores / np.sum(exp_scores)
    
    contra_prob = float(probs[0])
    entail_prob = float(probs[1])
    neutral_prob = float(probs[2])
    
    # Faithfulness score: Entailment - Contradiction
    score = entail_prob - contra_prob
    
    return {
        "entailment": entail_prob,
        "contradiction": contra_prob,
        "neutral": neutral_prob,
        "faithfulness_score": score
    }

def evaluate_notes_faithfulness(notes: dict, source_units: list[dict]) -> dict:
    """
    Evaluates every attributed statement in the generated notes against its cited sources.
    Returns the notes with an appended 'faithfulness_report' and flags low-score statements.
    """
    source_map = {u["source_ids"][0]: u["text"] for u in source_units if len(u["source_ids"]) == 1}
    # To handle multiple source IDs per unit, we build a mapping from source ID to all its texts
    full_source_map = {}
    for u in source_units:
        for sid in u["source_ids"]:
            full_source_map.setdefault(sid, []).append(u["text"])
            
    # Combine texts for each source
    for sid in full_source_map:
        full_source_map[sid] = " ".join(full_source_map[sid])
        
    report = {
        "overall_score": 0.0,
        "flagged_statements": [],
        "statements_evaluated": 0
    }
    
    total_score = 0.0
    
    # Evaluate Detailed Explanation
    for item in notes.get("detailed_explanation", []):
        statement = item.get("statement", "")
        sids = item.get("source_ids", [])
        
        # Concatenate all cited source texts to check against
        cited_text = " ".join([full_source_map.get(sid, "") for sid in sids])
        
        if cited_text and statement:
            res = score_faithfulness(statement, cited_text)
            total_score += res["faithfulness_score"]
            report["statements_evaluated"] += 1
            
            if res["faithfulness_score"] < FAITHFULNESS_THRESHOLD:
                report["flagged_statements"].append({
                    "statement": statement,
                    "cited_sources": sids,
                    "score": res["faithfulness_score"],
                    "reason": "Low entailment or high contradiction detected."
                })
                
    # Evaluate Revision Notes
    for item in notes.get("revision_notes", []):
        bullet = item.get("bullet", "")
        sids = item.get("source_ids", [])
        cited_text = " ".join([full_source_map.get(sid, "") for sid in sids])
        
        if cited_text and bullet:
            res = score_faithfulness(bullet, cited_text)
            total_score += res["faithfulness_score"]
            report["statements_evaluated"] += 1
            
            if res["faithfulness_score"] < FAITHFULNESS_THRESHOLD:
                report["flagged_statements"].append({
                    "statement": bullet,
                    "cited_sources": sids,
                    "score": res["faithfulness_score"],
                    "reason": "Low entailment or high contradiction detected."
                })
                
    if report["statements_evaluated"] > 0:
        report["overall_score"] = total_score / report["statements_evaluated"]
        
    return report
