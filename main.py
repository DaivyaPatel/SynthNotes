import os
import shutil
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from storage import get_engine, create_tables, create_session_and_register_files, get_session_sources, get_term_mapping
from ingest import detect_file_type, validate_file, IngestionError, ingest_sources
from terminology import normalize_terminology
from salience import segment_content, score_salience
from generate import generate_notes
from faithfulness import evaluate_notes_faithfulness
from quiz import generate_quiz

app = FastAPI(title="SynthNotes API")

# CORS setup per Security doc
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    os.getenv("FRONTEND_URL", "http://localhost:8000")
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = get_engine()
create_tables(engine)

# In-memory status tracking for simplicity
job_status = {}

@app.post("/sessions")
async def create_session(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")
        
    temp_dir = Path("data/tmp")
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    file_paths = []
    try:
        for file in files:
            temp_path = temp_dir / file.filename
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
            try:
                validate_file(temp_path)
                detect_file_type(temp_path)
            except IngestionError as e:
                raise HTTPException(status_code=400, detail=str(e))
                
            file_paths.append(str(temp_path))
            
        session_id = create_session_and_register_files(engine, "data/uploads", file_paths)
    finally:
        # clean up temp dir files
        for p in file_paths:
            if os.path.exists(p):
                os.remove(p)
                
    return {"session_id": session_id}

def _run_pipeline(session_id: str):
    try:
        job_status[session_id] = {"stage": "ingestion", "status": "running"}
        
        # 1. Ingest
        sources_meta = get_session_sources(engine, session_id)
        if not sources_meta:
            raise ValueError("No files found for session.")
            
        filepaths = [Path("data/uploads") / session_id / src["filename"] for src in sources_meta]
        sources = ingest_sources([str(p) for p in filepaths])
        
        # Override source_id with the one generated during storage registration
        for src, meta in zip(sources, sources_meta):
            src["source_id"] = meta["source_id"]
            
        # 2. Terminology
        job_status[session_id]["stage"] = "normalization"
        term_res = normalize_terminology(sources, session_id=session_id, engine=engine)
        canonical_map = term_res["mapping"]
        
        # 3. Salience
        job_status[session_id]["stage"] = "salience"
        units = segment_content(sources)
        ranked_units = score_salience(units)
        
        # 4. Generation
        job_status[session_id]["stage"] = "generation"
        topic = "Synthesized Topic"
        notes = generate_notes(ranked_units, canonical_map, topic)
        
        # 5. Faithfulness
        job_status[session_id]["stage"] = "faithfulness"
        faithfulness_report = evaluate_notes_faithfulness(notes, ranked_units)
        notes["faithfulness_report"] = faithfulness_report
        
        job_status[session_id]["status"] = "completed"
        job_status[session_id]["result"] = notes
        
    except Exception as e:
        job_status[session_id]["status"] = "failed"
        job_status[session_id]["error"] = str(e)


@app.post("/sessions/{session_id}/process")
async def process_session(session_id: str, background_tasks: BackgroundTasks):
    sources = get_session_sources(engine, session_id)
    if not sources:
        raise HTTPException(status_code=404, detail="Session not found.")
        
    background_tasks.add_task(_run_pipeline, session_id)
    # Initialize status immediately so client can poll
    if session_id not in job_status:
        job_status[session_id] = {"stage": "queued", "status": "pending"}
    
    return {"status_url": f"/sessions/{session_id}/status"}


@app.get("/sessions/{session_id}/status")
async def get_status(session_id: str):
    status = job_status.get(session_id)
    if not status:
        raise HTTPException(status_code=404, detail="Status not found for session.")
    return {"stage": status["stage"], "status": status["status"]}


@app.get("/sessions/{session_id}/notes")
async def get_notes(session_id: str):
    status = job_status.get(session_id)
    if not status:
        raise HTTPException(status_code=404, detail="Session not processed yet.")
    if status["status"] == "failed":
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {status.get('error')}")
    if status["status"] != "completed":
        raise HTTPException(status_code=202, detail="Processing not yet complete.")
        
    return status["result"]


@app.post("/sessions/{session_id}/quiz")
async def generate_quiz_endpoint(session_id: str):
    status = job_status.get(session_id)
    if not status or status["status"] != "completed":
        raise HTTPException(status_code=400, detail="Notes must be generated first.")
        
    notes = status["result"]
    quiz = generate_quiz(notes)
    
    status["quiz"] = quiz
    return {"message": "Quiz generated successfully."}


@app.get("/sessions/{session_id}/quiz")
async def get_quiz(session_id: str):
    status = job_status.get(session_id)
    if not status or "quiz" not in status:
        raise HTTPException(status_code=404, detail="Quiz not found. Generate it first.")
    return status["quiz"]
