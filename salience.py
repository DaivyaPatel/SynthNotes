import re

# Configurable constants for salience scoring (T-06)
WEIGHT_REPETITION = 0.5
WEIGHT_POSITION = 0.3
WEIGHT_EMPHASIS = 0.2

def segment_content(sources: list[dict]) -> list[dict]:
    units_dict = {}
    for src in sources:
        sid = src["source_id"]
        text = src["text"]
        # Basic heuristic segmentation replacing spacy
        sents = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if len(s.strip()) > 5]
        
        for i, clean_text in enumerate(sents):
            if clean_text in units_dict:
                if sid not in units_dict[clean_text]["source_ids"]:
                    units_dict[clean_text]["source_ids"].append(sid)
                    units_dict[clean_text]["position_in_doc"][sid] = i
            else:
                units_dict[clean_text] = {
                    "text": clean_text,
                    "source_ids": [sid],
                    "position_in_doc": {sid: i}
                }
    return list(units_dict.values())

def score_salience(units: list[dict]) -> list[dict]:
    if not units:
        return []
    
    for unit in units:
        unit["temp_rep"] = len(set(unit["source_ids"]))
        
    max_rep = max([u["temp_rep"] for u in units]) if units else 1
    
    for unit in units:
        rep_score = unit["temp_rep"] / max_rep
        
        min_pos = min(unit["position_in_doc"].values())
        pos_score = 1.0 / (1.0 + 0.1 * min_pos)
        
        emphasis_score = 0.5
        definitional_phrases = ["is a ", "is defined as", "refers to", "known as", "stands for"]
        if any(p in unit["text"].lower() for p in definitional_phrases):
            emphasis_score = 1.0
            
        final_score = (
            WEIGHT_REPETITION * rep_score +
            WEIGHT_POSITION * pos_score +
            WEIGHT_EMPHASIS * emphasis_score
        )
        unit["salience_score"] = round(final_score, 4)
        unit["score_components"] = {
            "repetition": round(rep_score, 4),
            "position": round(pos_score, 4),
            "emphasis": round(emphasis_score, 4)
        }
        del unit["temp_rep"]
        
    units.sort(key=lambda x: x["salience_score"], reverse=True)
    return units
