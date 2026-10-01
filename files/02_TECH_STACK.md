# Tech Stack — SynthNotes

This defines the stack for implementing the full pipeline (ingestion → normalization → salience → generation → faithfulness → quiz) plus a minimal usable frontend, sized appropriately for a mini-project with academic evaluation, buildable solo/pair with an AI coding agent (Antigravity + Gemini/Claude).

## Guiding Principles
- Prefer libraries already in use (`spacy`, `sentence-transformers`, `pdfplumber`) over introducing redundant tooling
- Keep the stack small enough that every part can be explained in a viva — avoid unnecessary infra (no Kubernetes, no microservices split for a mini-project)
- Local-first / free-tier friendly — avoid paid API dependencies as the only path; support local models with an optional cloud LLM fallback

## 1. Backend

| Layer | Choice | Rationale |
|---|---|---|
| Language | Python 3.11+ | Existing codebase (`ingest.py`, `terminology.py`) is Python |
| API framework | FastAPI | Async support for long-running pipeline jobs, automatic OpenAPI docs, easy to demo via Swagger UI during evaluation |
| Task/job handling | FastAPI `BackgroundTasks` for v1; upgrade to Celery + Redis only if pipeline latency requires true async queuing | Avoid infra overkill unless demo requires concurrent multi-user load |
| Server | Uvicorn | Standard ASGI server for FastAPI |

## 2. NLP / ML Pipeline Components

| Stage | Component | Notes |
|---|---|---|
| Ingestion | `pdfplumber` (PDF), plain file read (TXT) | Already implemented in `ingest.py` |
| Terminology Normalization | `spaCy` (`en_core_web_sm`) for noun-chunk extraction, `sentence-transformers` (`all-MiniLM-L6-v2`) for embeddings, `scikit-learn` cosine similarity for clustering | Already implemented in `terminology.py`; keep as-is, wrap as a service function |
| Salience Ranking | Custom scoring function combining: (a) cross-source repetition (embedding similarity clustering across sources), (b) structural position heuristics (heading/definition detection via regex/spaCy POS + doc structure), (c) emphasis signals (bold/italic if available from PDF metadata, else frequency-based) | No heavy ML model required for v1 — a weighted scoring function is defensible and explainable in a viva |
| Grounded Generation | LLM-based, via **one** of: (a) local via Ollama (e.g., `llama3.1:8b` or `mistral`) for zero-cost, offline-capable generation, or (b) hosted API (Gemini API / Claude API) for higher quality, used through Antigravity's existing model access | Design the generation module behind an interface (`generate(prompt, sources) -> attributed_text`) so the underlying model is swappable |
| Faithfulness Evaluation | NLI model: `cross-encoder/nli-deberta-v3-base` (via `sentence-transformers` `CrossEncoder`) or `roberta-large-mnli` via `transformers` | Runs locally, no API dependency — important since faithfulness must be checked on every generated statement, which can be costly via hosted APIs |
| Quiz Generation | LLM-based (same interface as Generation stage), constrained to only take synthesized notes as input, with a strict output schema (JSON) parsed into question types | Use JSON-mode / structured output where the chosen LLM supports it, to avoid brittle text parsing |

## 3. Data Layer

| Need | Choice | Rationale |
|---|---|---|
| Session/document metadata | SQLite (v1) → PostgreSQL (if deployed beyond local demo) | SQLite needs zero setup, sufficient for single-user/demo scale |
| File storage | Local filesystem under a `data/` directory (already present), namespaced per session ID | Simplicity for a mini-project; swap for object storage (S3-compatible) only if deployed publicly |
| Vector/embedding storage | In-memory (`numpy` arrays) for v1 given expected corpus size; consider `FAISS` only if source counts scale beyond a handful per session | Avoid standing up a vector DB unless the demo genuinely needs it |

## 4. Frontend

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React (Vite) | Fast dev loop, wide agent-tooling support, minimal boilerplate vs. Next.js for a non-SSR internal tool |
| Styling | Tailwind CSS | Speeds up building a clean, presentable UI without a design system investment |
| State/data fetching | React Query (`@tanstack/react-query`) | Handles polling for long-running pipeline job status cleanly |
| File upload | Native `<input type="file" multiple>` + drag-and-drop via a small library (e.g., `react-dropzone`) | Keep dependencies minimal |

## 5. AI Coding Agent Integration

| Tool | Role |
|---|---|
| Antigravity (agent orchestrator) | Drives implementation from the Tickets file, executes file edits, runs tests |
| Gemini / Claude (underlying models via Antigravity) | Code generation and (optionally) the Generation/Quiz pipeline stages themselves, via API, behind the swappable interface above |

## 6. Testing

| Type | Tool |
|---|---|
| Unit tests (pipeline functions) | `pytest` |
| API tests | `pytest` + `httpx` (FastAPI test client) |
| Frontend | Manual QA for v1; add `Vitest` + React Testing Library if time allows |

## 7. Environment & Dependency Management

- Python: `venv` (already present) + `requirements.txt` (pin versions used in the already-uploaded scripts)
- Node: `package.json` with locked versions (`package-lock.json`)
- Environment variables (API keys, thresholds) via `.env`, never committed — see Security file

## 8. Deployment Scope for Evaluation

- **Minimum viable for demo:** run locally — FastAPI backend on `localhost:8000`, React frontend on `localhost:5173`, SQLite file-based DB
- **Stretch (if time allows):** containerize with a single `docker-compose.yml` (backend + frontend) for a one-command reviewer setup — not required for correctness, but improves presentation polish

## 9. Explicit Version Pins (initial)

```
python>=3.11
fastapi
uvicorn[standard]
pdfplumber
spacy
en_core_web_sm (spacy model)
sentence-transformers
scikit-learn
numpy
transformers
torch
sqlalchemy
python-dotenv
pytest
httpx
```

```
react
vite
tailwindcss
@tanstack/react-query
react-dropzone
```
