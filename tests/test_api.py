import pytest
from fastapi.testclient import TestClient
from main import app, job_status
from unittest.mock import patch

client = TestClient(app)

@patch("main.create_session_and_register_files")
@patch("main.validate_file")
@patch("main.detect_file_type")
def test_create_session(mock_detect, mock_validate, mock_create):
    mock_create.return_value = "session-123"
    
    # Send a dummy file
    response = client.post(
        "/sessions", 
        files=[("files", ("test.txt", b"dummy content", "text/plain"))]
    )
    
    assert response.status_code == 200
    assert response.json()["session_id"] == "session-123"


def test_create_session_no_files():
    response = client.post("/sessions", files=[])
    # FastAPI returns 422 Unprocessable Entity when required form data is missing entirely
    assert response.status_code == 422


@patch("main.get_session_sources")
def test_process_session(mock_get_sources):
    mock_get_sources.return_value = [{"filename": "test.txt", "source_id": "S1"}]
    
    with patch("main.BackgroundTasks.add_task") as mock_add_task:
        response = client.post("/sessions/session-123/process")
        
    assert response.status_code == 200
    assert "status_url" in response.json()
    mock_add_task.assert_called_once()
    
    # Check status endpoint
    status_response = client.get("/sessions/session-123/status")
    assert status_response.status_code == 200
    assert status_response.json()["status"] == "pending"


def test_get_notes_not_ready():
    job_status["session-999"] = {"stage": "salience", "status": "running"}
    response = client.get("/sessions/session-999/notes")
    assert response.status_code == 202


def test_get_notes_ready():
    job_status["session-777"] = {"stage": "faithfulness", "status": "completed", "result": {"notes": "test"}}
    response = client.get("/sessions/session-777/notes")
    assert response.status_code == 200
    assert response.json() == {"notes": "test"}


@patch("main.generate_quiz")
def test_generate_and_get_quiz(mock_generate_quiz):
    mock_generate_quiz.return_value = {"quiz": []}
    job_status["session-555"] = {"stage": "faithfulness", "status": "completed", "result": {"notes": "test"}}
    
    post_res = client.post("/sessions/session-555/quiz")
    assert post_res.status_code == 200
    
    get_res = client.get("/sessions/session-555/quiz")
    assert get_res.status_code == 200
    assert "quiz" in get_res.json()
