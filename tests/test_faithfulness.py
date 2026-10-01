import pytest
from unittest.mock import patch, MagicMock

@patch("faithfulness.get_nli_model")
def test_score_faithfulness_entailment(mock_get_model):
    from faithfulness import score_faithfulness
    # 0=Contra, 1=Entail, 2=Neutral
    mock_model = MagicMock()
    # High logit for entailment
    mock_model.predict.return_value = [[-2.0, 5.0, -1.0]]
    mock_get_model.return_value = mock_model
    
    res = score_faithfulness("A cat is on a mat.", "There is a cat sitting on the mat.")
    
    assert res["entailment"] > 0.9
    assert res["contradiction"] < 0.1
    assert res["faithfulness_score"] > 0.8

@patch("faithfulness.get_nli_model")
def test_score_faithfulness_contradiction(mock_get_model):
    from faithfulness import score_faithfulness
    # High logit for contradiction
    mock_model = MagicMock()
    mock_model.predict.return_value = [[5.0, -2.0, -1.0]]
    mock_get_model.return_value = mock_model
    
    res = score_faithfulness("A dog is on a mat.", "There is a cat sitting on the mat.")
    
    assert res["contradiction"] > 0.9
    assert res["entailment"] < 0.1
    assert res["faithfulness_score"] < -0.8

@patch("faithfulness.get_nli_model")
def test_evaluate_notes_faithfulness(mock_get_model):
    from faithfulness import evaluate_notes_faithfulness
    
    mock_model = MagicMock()
    # Return high entailment for the first call, high contradiction for the second
    mock_model.predict.side_effect = [
        [[-2.0, 5.0, -1.0]], # Call 1
        [[5.0, -2.0, -1.0]]  # Call 2
    ]
    mock_get_model.return_value = mock_model
    
    notes = {
        "detailed_explanation": [
            {"statement": "True fact.", "source_ids": ["S1"]}
        ],
        "revision_notes": [
            {"bullet": "False fact.", "source_ids": ["S2"]}
        ]
    }
    
    source_units = [
        {"text": "This is a true fact.", "source_ids": ["S1"]},
        {"text": "This contradicts the false fact.", "source_ids": ["S2"]}
    ]
    
    report = evaluate_notes_faithfulness(notes, source_units)
    
    assert report["statements_evaluated"] == 2
    assert len(report["flagged_statements"]) == 1
    assert report["flagged_statements"][0]["statement"] == "False fact."
    assert report["flagged_statements"][0]["score"] < 0.0
