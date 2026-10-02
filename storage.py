import os
import uuid
import shutil
from datetime import datetime, timezone
from pathlib import Path
from sqlalchemy import create_engine, Column, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

Base = declarative_base()


class SessionModel(Base):
    __tablename__ = 'sessions'
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    documents = relationship("SourceDocument", back_populates="session", cascade="all, delete")


class SourceDocument(Base):
    __tablename__ = 'source_documents'
    id = Column(String, primary_key=True)
    session_id = Column(String, ForeignKey('sessions.id'))
    filename = Column(String, nullable=False)
    source_id = Column(String, nullable=False)
    upload_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    session = relationship("SessionModel", back_populates="documents")


def get_engine(db_path: str = "sqlite:///data/synthnotes.db"):
    """Get the SQLAlchemy engine. Ensure data folder exists for SQLite."""
    if db_path.startswith("sqlite:///"):
        path = db_path.replace("sqlite:///", "")
        if path != ":memory:":
            Path(path).parent.mkdir(parents=True, exist_ok=True)
    return create_engine(db_path, connect_args={"check_same_thread": False})


def create_tables(engine):
    Base.metadata.create_all(engine)


def create_session_and_register_files(engine, upload_dir: str, file_paths: list[str], user_id: str = None) -> str:
    """
    Creates a new session, copies files to the session directory, and registers metadata in SQLite.
    Returns the session_id.
    """
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        session_id = str(uuid.uuid4())
        session_dir = Path(upload_dir) / session_id
        session_dir.mkdir(parents=True, exist_ok=True)
        
        new_session = SessionModel(id=session_id, user_id=user_id)
        db.add(new_session)
        
        for i, path_str in enumerate(file_paths):
            path = Path(path_str)
            # Copy file to session directory
            dest_path = session_dir / path.name
            if path.absolute() != dest_path.absolute():
                shutil.copy2(path, dest_path)
            
            src_doc = SourceDocument(
                id=str(uuid.uuid4()),
                session_id=session_id,
                filename=path.name,
                source_id=f"S{i+1}"
            )
            db.add(src_doc)
            
        db.commit()
        return session_id
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


def get_session_sources(engine, session_id: str) -> list[dict]:
    """Retrieve metadata of all sources for a given session."""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        docs = db.query(SourceDocument).filter(SourceDocument.session_id == session_id).all()
        return [
            {
                "id": d.id,
                "session_id": d.session_id,
                "filename": d.filename,
                "source_id": d.source_id,
                "upload_timestamp": d.upload_timestamp.isoformat()
            }
            for d in docs
        ]
    finally:
        db.close()


class TermMapping(Base):
    __tablename__ = 'term_mappings'
    id = Column(String, primary_key=True)
    session_id = Column(String, ForeignKey('sessions.id'))
    original_term = Column(String, nullable=False)
    canonical_term = Column(String, nullable=False)

    session = relationship("SessionModel")


def save_term_mapping(engine, session_id: str, mapping: dict):
    """Save the terminology mapping (original -> canonical) for a session."""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        # Clear existing mappings for idempotency
        db.query(TermMapping).filter(TermMapping.session_id == session_id).delete()
        
        for original, canonical in mapping.items():
            db.add(TermMapping(
                id=str(uuid.uuid4()),
                session_id=session_id,
                original_term=original,
                canonical_term=canonical
            ))
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


def get_term_mapping(engine, session_id: str) -> dict:
    """Retrieve the terminology mapping for a session."""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        mappings = db.query(TermMapping).filter(TermMapping.session_id == session_id).all()
        return {m.original_term: m.canonical_term for m in mappings}
    finally:
        db.close()
