import re

def extract_terms_from_sources(sources: list[dict]) -> dict:
    terms_by_source = {}
    for src in sources:
        sid = src["source_id"]
        text = src["text"]
        # Basic heuristic: words that are capitalized and longer than 4 letters,
        # or acronyms. This replaces the heavy spacy NLP model.
        words = re.findall(r'\b[A-Z][a-zA-Z]{3,}\b', text)
        terms_by_source[sid] = list(set(words))
    return terms_by_source

def cluster_terms(terms_by_source: dict) -> dict:
    all_terms = set()
    for terms in terms_by_source.values():
        all_terms.update(terms)
        
    canonical_map = {}
    for term in all_terms:
        # Without sentence-transformers, map terms exactly
        canonical_map[term] = term
    return canonical_map

def normalize_terminology(sources: list[dict], session_id: str = None, engine=None) -> dict:
    if not sources:
        return {"mapping": {}, "terms_by_source": {}}

    terms_by_source = extract_terms_from_sources(sources)
    mapping = cluster_terms(terms_by_source)
    
    if session_id and engine:
        from storage import save_term_mapping
        save_term_mapping(engine, session_id, mapping)
    
    return {
        "mapping": mapping,
        "terms_by_source": terms_by_source
    }