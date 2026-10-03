import pdfplumber
from pathlib import Path
import os
import re
from dotenv import load_dotenv

load_dotenv()

MAX_FILE_SIZE_MB = int(os.environ.get("MAX_FILE_SIZE_MB", 15))
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


class IngestionError(Exception):
    """Custom exception for all ingestion-related failures."""
    pass


def sanitize_filename(filename: str) -> str:
    """Sanitize a filename to prevent directory traversal and remove invalid chars."""
    filename = Path(filename).name  # Ensures no path traversal like ../
    return re.sub(r'[^a-zA-Z0-9.\-_]', '_', filename)


def validate_file(path: Path):
    """Validate file existence and size constraints."""
    if not path.exists():
        raise IngestionError(f"File not found: {path.name}")
    if path.stat().st_size > MAX_FILE_SIZE_BYTES:
        raise IngestionError(f"File {path.name} exceeds maximum size of {MAX_FILE_SIZE_MB}MB")
    if path.stat().st_size == 0:
        raise IngestionError(f"File {path.name} is empty.")


def detect_file_type(path: Path) -> str:
    """Detect file type by inspecting the content/magic numbers."""
    with open(path, 'rb') as f:
        header = f.read(5)
    
    if header.startswith(b'%PDF-'):
        return '.pdf'
    
    if header.startswith(b'PK\x03\x04') and path.name.lower().endswith('.docx'):
        return '.docx'
    
    # If not a PDF or DOCX, attempt to read as utf-8 text
    try:
        with open(path, 'r', encoding='utf-8') as f:
            f.read(1024)
        return '.txt'
    except UnicodeDecodeError:
        raise IngestionError(f"Unsupported or corrupted file content for {path.name}. Only valid PDF, DOCX, and TXT are supported.")


def load_source(filepath: str) -> str:
    """Extract raw text from a single source file (.txt or .pdf)."""
    path = Path(filepath)
    validate_file(path)
    
    file_type = detect_file_type(path)

    if file_type == ".pdf":
        text_parts = []
        try:
            with pdfplumber.open(path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
        except Exception as e:
            raise IngestionError(f"Failed to read PDF {path.name}. It may be corrupted. Error: {e}")
        
        extracted = "\n".join(text_parts).strip()
        if not extracted:
            raise IngestionError(f"No readable text found in PDF {path.name}. Scanned/image-only PDFs are unsupported.")
        return extracted

    elif file_type == ".txt":
        try:
            extracted = path.read_text(encoding="utf-8").strip()
            if not extracted:
                raise IngestionError(f"No readable text found in TXT {path.name}.")
            return extracted
        except Exception as e:
            raise IngestionError(f"Failed to read text file {path.name}. Error: {e}")

    elif file_type == ".docx":
        try:
            import docx
            doc = docx.Document(path)
            extracted = "\n".join([para.text for para in doc.paragraphs]).strip()
            if not extracted:
                raise IngestionError(f"No readable text found in DOCX {path.name}.")
            return extracted
        except Exception as e:
            raise IngestionError(f"Failed to read DOCX {path.name}. Error: {e}")


def ingest_sources(filepaths: list[str]) -> list[dict]:
    """Load multiple source files and tag each with a source ID."""
    sources = []
    for i, filepath in enumerate(filepaths):
        text = load_source(filepath)
        source_id = f"S{i+1}"
        sanitized_name = sanitize_filename(Path(filepath).name)
        sources.append({
            "source_id": source_id,
            "filename": sanitized_name,
            "text": text
        })
    return sources


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python ingest.py file1.txt file2.pdf ...")
        sys.exit(1)

    try:
        result = ingest_sources(sys.argv[1:])
        for src in result:
            print(f"\n--- {src['source_id']} ({src['filename']}) ---")
            print(src["text"][:300], "...")
    except IngestionError as e:
        print(f"Error: {e}")