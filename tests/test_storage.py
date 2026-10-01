import pytest
from pathlib import Path
from storage import (
    get_engine,
    create_tables,
    create_session_and_register_files,
    get_session_sources
)

@pytest.fixture
def engine():
    # Use in-memory SQLite for tests
    eng = get_engine("sqlite:///:memory:")
    create_tables(eng)
    return eng

@pytest.fixture
def temp_uploads(tmp_path):
    upload_dir = tmp_path / "uploads"
    upload_dir.mkdir()
    return upload_dir

@pytest.fixture
def sample_files(tmp_path):
    file1 = tmp_path / "source1.txt"
    file1.write_text("dummy 1")
    file2 = tmp_path / "source2.txt"
    file2.write_text("dummy 2")
    return [str(file1), str(file2)]

def test_create_and_retrieve_session(engine, temp_uploads, sample_files):
    session_id = create_session_and_register_files(engine, str(temp_uploads), sample_files)
    
    assert session_id is not None
    
    # Check that files were copied
    session_dir = temp_uploads / session_id
    assert session_dir.exists()
    assert (session_dir / "source1.txt").exists()
    assert (session_dir / "source2.txt").exists()
    
    # Retrieve from DB
    sources = get_session_sources(engine, session_id)
    
    assert len(sources) == 2
    assert sources[0]["filename"] == "source1.txt"
    assert sources[0]["source_id"] == "S1"
    assert sources[1]["filename"] == "source2.txt"
    assert sources[1]["source_id"] == "S2"
