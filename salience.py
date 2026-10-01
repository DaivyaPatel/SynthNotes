import spacy
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load the spaCy model once for the module
nlp = spacy.load("en_core_web_sm")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Configurable constants for salience scoring (T-06)
WEIGHT_REPETITION = 0.5
WEIGHT_POSITION = 0.3
WEIGHT_EMPHASIS = 0.2
SIMILARITY_THRESHOLD = 0.75


def segment_content(sources: list[dict]) -> list[dict]:
    """
    Split normalized, merged source content into scoreable units (sentences).
    
    Args:
        sources: list of dicts with 'source_id' and 'text'.
        
    Returns:
        list of dicts containing:
        - text: the segmented string
        - source_ids: list of source IDs where this exact text appeared
        - position_in_doc: a dictionary mapping source_id to its sentence index
    """
    units_dict = {}
    
    for src in sources:
        sid = src["source_id"]
        text = src["text"]
        
        # We increase the max_length to avoid errors on very large documents
        # but for this project default is usually fine unless > 1M chars
        doc = nlp(text)
        
        for i, sent in enumerate(doc.sents):
            clean_text = sent.text.strip()
            
            # Skip empty or extremely short junk tokens
            if len(clean_text) < 5:
                continue
                
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
    """
    Applies the composite salience score per PRD FR3.
    Updates the units in-place with 'salience_score' and sorts them descending.
    """
    if not units:
        return []

    texts = [u["text"] for u in units]
    embeddings = embedder.encode(texts)
    sim_matrix = cosine_similarity(embeddings)

    # 1. Repetition Signal
    repetition_scores = []
    for i, unit in enumerate(units):
        my_sources = set(unit["source_ids"])
        similar_other_sources = set()
        
        for j, other_unit in enumerate(units):
            if i != j and sim_matrix[i][j] >= SIMILARITY_THRESHOLD:
                other_sources = set(other_unit["source_ids"])
                similar_other_sources.update(other_sources - my_sources)
        
        repetition_count = len(similar_other_sources) + len(my_sources)
        repetition_scores.append(repetition_count)
        
    max_rep = max(repetition_scores) if repetition_scores else 1
    repetition_scores = [r / max_rep for r in repetition_scores]

    # 2. Structural Position Signal
    position_scores = []
    for unit in units:
        min_pos = min(unit["position_in_doc"].values())
        # Heuristic: Sentences near the beginning (pos 0) score 1.0, decaying slowly
        pos_score = 1.0 / (1.0 + 0.1 * min_pos)
        position_scores.append(pos_score)

    # 3. Emphasis Signal
    # Fallback heuristic: Definitions or acronym indicators often represent emphasis
    emphasis_scores = []
    definitional_phrases = ["is a ", "is defined as", "refers to", "known as", "stands for"]
    for unit in units:
        text_lower = unit["text"].lower()
        if any(phrase in text_lower for phrase in definitional_phrases):
            emphasis_scores.append(1.0)
        else:
            emphasis_scores.append(0.5)

    # Combine scores
    for i, unit in enumerate(units):
        final_score = (
            WEIGHT_REPETITION * repetition_scores[i] +
            WEIGHT_POSITION * position_scores[i] +
            WEIGHT_EMPHASIS * emphasis_scores[i]
        )
        unit["salience_score"] = round(final_score, 4)
        unit["score_components"] = {
            "repetition": round(repetition_scores[i], 4),
            "position": round(position_scores[i], 4),
            "emphasis": round(emphasis_scores[i], 4)
        }
        
    # Sort descending
    units.sort(key=lambda x: x["salience_score"], reverse=True)
    return units
