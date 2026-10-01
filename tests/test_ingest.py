import pytest
import os
from pathlib import Path
from unittest.mock import patch, mock_open, MagicMock

from ingest import (
    load_source,
    ingest_sources,
    IngestionError,
    sanitize_filename,
    detect_file_type
)

# -----------------
# Fixtures
# -----------------

@pytest.fixture
def temp_workspace(tmp_path):
    """Provides a temporary workspace for test files."""
    return tmp_path

@pytest.fixture
def valid_txt(temp_workspace):
    file_path = temp_workspace / "valid.txt"
    file_path.write_text("This is some valid text.", encoding="utf-8")
    return file_path

@pytest.fixture
def empty_file(temp_workspace):
    file_path = temp_workspace / "empty.txt"
    file_path.write_text("")
    return file_path

@pytest.fixture
def disallowed_file(temp_workspace):
    file_path = temp_workspace / "image.png"
    # Write a PNG header
    file_path.write_bytes(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR')
    return file_path

@pytest.fixture
def oversized_file(temp_workspace):
    file_path = temp_workspace / "oversized.txt"
    with open(file_path, "wb") as f:
        # Seek past 15MB and write a byte to make it 15.1MB
        f.seek((15 * 1024 * 1024) + 1000)
        f.write(b"0")
    return file_path

@pytest.fixture
def mock_pdfplumber():
    with patch("ingest.pdfplumber.open") as mock_open:
        # Create a dummy pdf object
        mock_pdf = MagicMock()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "This is a valid PDF text."
        mock_pdf.pages = [mock_page]
        
        # Make the context manager return our dummy pdf
        mock_open.return_value.__enter__.return_value = mock_pdf
        yield mock_open

# -----------------
# Tests
# -----------------

def test_sanitize_filename():
    assert sanitize_filename("valid_name.txt") == "valid_name.txt"
    assert sanitize_filename("../../../etc/passwd") == "passwd"
    assert sanitize_filename("my file!@#.pdf") == "my_file___.pdf"


def test_detect_file_type_txt(valid_txt):
    assert detect_file_type(valid_txt) == ".txt"


def test_detect_file_type_pdf(temp_workspace):
    file_path = temp_workspace / "dummy.pdf"
    file_path.write_bytes(b"%PDF-1.4\nSome dummy content")
    assert detect_file_type(file_path) == ".pdf"


def test_load_source_valid_txt(valid_txt):
    text = load_source(str(valid_txt))
    assert text == "This is some valid text."


def test_load_source_valid_pdf(temp_workspace, mock_pdfplumber):
    file_path = temp_workspace / "dummy.pdf"
    file_path.write_bytes(b"%PDF-1.4\nSome dummy content")
    
    text = load_source(str(file_path))
    assert text == "This is a valid PDF text."


def test_load_source_corrupted_pdf(temp_workspace):
    file_path = temp_workspace / "corrupted.pdf"
    file_path.write_bytes(b"%PDF-1.4\nGarbage data")
    
    # We don't mock pdfplumber here, we expect it to fail reading garbage data
    with pytest.raises(IngestionError, match="Failed to read PDF"):
        load_source(str(file_path))


def test_load_source_empty_file(empty_file):
    with pytest.raises(IngestionError, match="is empty"):
        load_source(str(empty_file))


def test_load_source_disallowed_file(disallowed_file):
    with pytest.raises(IngestionError, match="Unsupported or corrupted file content"):
        load_source(str(disallowed_file))


def test_load_source_oversized_file(oversized_file):
    with pytest.raises(IngestionError, match="exceeds maximum size"):
        load_source(str(oversized_file))


def test_ingest_sources(valid_txt, temp_workspace, mock_pdfplumber):
    pdf_path = temp_workspace / "dummy.pdf"
    pdf_path.write_bytes(b"%PDF-1.4\nSome dummy content")
    
    result = ingest_sources([str(valid_txt), str(pdf_path)])
    
    assert len(result) == 2
    assert result[0]["source_id"] == "S1"
    assert result[0]["filename"] == "valid.txt"
    assert result[0]["text"] == "This is some valid text."
    
    assert result[1]["source_id"] == "S2"
    assert result[1]["filename"] == "dummy.pdf"
    assert result[1]["text"] == "This is a valid PDF text."
