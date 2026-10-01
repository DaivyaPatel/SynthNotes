import pytest
from salience import segment_content

def test_segment_content_single_source():
    sources = [
        {"source_id": "S1", "text": "This is sentence one. This is sentence two."}
    ]
    
    units = segment_content(sources)
    assert len(units) == 2
    assert units[0]["text"] == "This is sentence one."
    assert units[0]["source_ids"] == ["S1"]
    assert units[0]["position_in_doc"]["S1"] == 0
    
    assert units[1]["text"] == "This is sentence two."
    assert units[1]["source_ids"] == ["S1"]
    assert units[1]["position_in_doc"]["S1"] == 1

def test_segment_content_multi_source_exact_match():
    sources = [
        {"source_id": "S1", "text": "Gradient descent is popular."},
        {"source_id": "S2", "text": "We start with a baseline. Gradient descent is popular."}
    ]
    
    units = segment_content(sources)
    # Total unique units: 
    # 1: "Gradient descent is popular." (appears in both)
    # 2: "We start with a baseline."
    
    assert len(units) == 2
    
    gd_unit = next(u for u in units if "Gradient descent" in u["text"])
    assert "S1" in gd_unit["source_ids"]
    assert "S2" in gd_unit["source_ids"]
    assert gd_unit["position_in_doc"]["S1"] == 0
    assert gd_unit["position_in_doc"]["S2"] == 1
    
    baseline_unit = next(u for u in units if "baseline" in u["text"])
    assert baseline_unit["source_ids"] == ["S2"]
    assert baseline_unit["position_in_doc"]["S2"] == 0

from unittest.mock import patch, MagicMock

@patch("salience.nlp")
def test_segment_content_filters_junk(mock_nlp):
    sources = [
        {"source_id": "S1", "text": "Dummy text."}
    ]
    
    mock_doc = MagicMock()
    
    sent1 = MagicMock()
    sent1.text = "A.  " # Length after strip is 2 (< 5)
    
    sent2 = MagicMock()
    sent2.text = "Valid sentence here."
    
    mock_doc.sents = [sent1, sent2]
    mock_nlp.return_value = mock_doc
    
    units = segment_content(sources)
    assert len(units) == 1
    assert units[0]["text"] == "Valid sentence here."


def test_score_salience():
    from salience import score_salience
    
    units = [
        {"text": "Gradient descent is defined as an optimization algorithm.", "source_ids": ["S1"], "position_in_doc": {"S1": 0}},
        {"text": "We can use backpropagation.", "source_ids": ["S1"], "position_in_doc": {"S1": 1}},
        {"text": "Gradient descent is an optimization algorithm.", "source_ids": ["S2"], "position_in_doc": {"S2": 15}},
        {"text": "Random text here.", "source_ids": ["S2"], "position_in_doc": {"S2": 16}}
    ]
    
    scored_units = score_salience(units)
    
    assert len(scored_units) == 4
    for u in scored_units:
        assert "salience_score" in u
        
    # The gradient descent sentences should be clustered and score highly 
    # (repetition from S1 and S2, plus definitional phrase in one)
    top_unit = scored_units[0]
    assert "Gradient descent" in top_unit["text"]
    
    # Check that sorting is descending
    scores = [u["salience_score"] for u in scored_units]
    assert scores == sorted(scores, reverse=True)
