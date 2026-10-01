# terminology.py

import spacy
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

nlp = spacy.load("en_core_web_sm")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

SIMILARITY_THRESHOLD = 0.75  # tune this if clustering is too loose/strict


def extract_terms(text: str) -> list[str]:
    """Pull candidate domain terms (noun chunks) from a text block."""
    doc = nlp(text)
    terms = set()
    for chunk in doc.noun_chunks:
        term = chunk.text.strip()
        # filter out junk: single stopwords, pronouns, very short/long spans
        if len(term.split()) <= 4 and len(term) > 2 and not chunk.root.is_stop:
            terms.add(term)
    return list(terms)


def extract_terms_from_sources(sources: list[dict]) -> dict:
    """Extract terms per source. Returns {source_id: [terms]}."""
    return {src["source_id"]: extract_terms(src["text"]) for src in sources}


def cluster_terms(terms_by_source: dict) -> dict:
    """
    Cluster semantically similar terms across all sources into canonical groups.
    Returns a mapping: {original_term: canonical_term}
    """
    all_terms = []
    for terms in terms_by_source.values():
        all_terms.extend(terms)
    all_terms = list(set(all_terms))

    if not all_terms:
        return {}

    embeddings = embedder.encode(all_terms)
    sim_matrix = cosine_similarity(embeddings)

    canonical_map = {}
    assigned = set()

    for i, term in enumerate(all_terms):
        if term in assigned:
            continue
        # this term becomes canonical for itself + anything similar enough
        cluster = [term]
        for j, other_term in enumerate(all_terms):
            if i != j and other_term not in assigned and sim_matrix[i][j] >= SIMILARITY_THRESHOLD:
                cluster.append(other_term)
                assigned.add(other_term)
        assigned.add(term)

        # pick the shortest term in the cluster as canonical (usually cleanest)
        canonical = min(cluster, key=len)
        for t in cluster:
            canonical_map[t] = canonical

    return canonical_map


def normalize_terminology(sources: list[dict], session_id: str = None, engine=None) -> dict:
    """
    Pipeline stage for terminology normalization.
    Returns:
        {
            "mapping": {original_term: canonical_term},
            "terms_by_source": {source_id: [term1, term2, ...]}
        }
    """
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


if __name__ == "__main__":
    import sys
    from ingest import ingest_sources

    if len(sys.argv) < 2:
        print("Usage: python terminology.py file1.txt file2.pdf ...")
        sys.exit(1)

    sources = ingest_sources(sys.argv[1:])
    terms_by_source = extract_terms_from_sources(sources)

    print("\n--- Extracted terms per source ---")
    for sid, terms in terms_by_source.items():
        print(f"{sid}: {terms}")

    canonical_map = cluster_terms(terms_by_source)

    print("\n--- Canonical term mapping (only showing merged clusters) ---")
    reverse = {}
    for original, canonical in canonical_map.items():
        reverse.setdefault(canonical, []).append(original)
    for canonical, originals in reverse.items():
        if len(originals) > 1:
            print(f"{canonical}  <-  {originals}")