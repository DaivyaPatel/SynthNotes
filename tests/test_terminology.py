import pytest
from terminology import extract_terms, cluster_terms, normalize_terminology

def test_extract_terms():
    text = "Gradient descent is an optimization algorithm used to minimize the cost function."
    terms = extract_terms(text)
    # Depending on spaCy's parsing, we should expect certain terms
    assert any("descent" in t.lower() for t in terms)
    assert any("algorithm" in t.lower() for t in terms)

def test_cluster_terms_known_synonyms():
    # Provide synthetic terms that are highly related
    # According to evaluation, "Neural Network" and "Artificial Neural Network" have ~0.88 similarity
    terms_by_source = {
        "S1": ["Neural Network", "apple"],
        "S2": ["Artificial Neural Network", "banana"]
    }
    mapping = cluster_terms(terms_by_source)
    
    # "Neural Network" and "Artificial Neural Network" should map to the same canonical term
    assert mapping["Neural Network"] == mapping["Artificial Neural Network"]

def test_cluster_terms_unrelated():
    terms_by_source = {
        "S1": ["Neural Network", "apple"],
        "S2": ["Artificial Neural Network", "banana"]
    }
    mapping = cluster_terms(terms_by_source)
    
    # Apple and banana should not be merged
    assert mapping["apple"] != mapping["banana"]
    assert mapping["Neural Network"] == mapping["Artificial Neural Network"]

def test_normalize_terminology_empty():
    res = normalize_terminology([])
    assert res["mapping"] == {}
    assert res["terms_by_source"] == {}

def test_normalize_terminology_full():
    sources = [
        {"source_id": "S1", "text": "Gradient descent is an optimization algorithm."},
        {"source_id": "S2", "text": "Steepest descent is used to optimize the loss."}
    ]
    res = normalize_terminology(sources)
    
    assert "mapping" in res
    assert "terms_by_source" in res
    
    mapping = res["mapping"]
    
    # Ensure some mapping happened
    assert len(mapping) > 0
