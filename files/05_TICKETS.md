# Tickets - SynthNotes Backend & Pipeline Implementation

Ordered by dependency. Each ticket has: description, acceptance criteria, dependencies, and notes for the agent. Feed these to Antigravity sequentially. Tickets marked **[P]** can be worked in parallel once their dependencies are met.

---

## Epic 0 - Project Setup

### T-00: Repository & Environment Scaffolding
**Description:** Set up project structure, dependency management, and config baseline.
**Acceptance Criteria:**
- `requirements.txt` created matching `02_TECH_STACK.md` pins
- `venv` confirmed working with all dependencies installed
- `.env.example` created with placeholder keys (LLM API key name, faithfulness threshold, max file size/count)
- `.gitignore` includes `venv/`, `__pycache__/`, `.env`, `data/uploads/*` (keep `data/` folder tracked via `.gitkeep`)
- `tests/` directory created
- `README.md` with setup instructions (venv activation, install, run)
**Dependencies:** None

---

## Epic 1 - Ingestion (extend existing)

### T-01: Harden Ingestion Module
**Description:** Extend `ingest.py` with validation and error handling per PRD FR1 and Security doc.
**Acceptance Criteria:**
- File type validated by content (not just extension) before parsing
- Max file size enforced (configurable via `.env`)
- Corrupted/unreadable files raise a clear, catchable exception (not a silent empty string return)
- Filenames sanitized before any disk write
- Unit tests: valid PDF, valid TXT, corrupted PDF, oversized file, disallowed file type
**Dependencies:** T-00

### T-02 [P]: Session/File Storage Layer
**Description:** Implement a storage module that persists uploaded files under `data/uploads/<session_id>/` and tracks metadata in SQLite.
**Acceptance Criteria:**
- SQLAlchemy models: `Session`, `SourceDocument` (id, session_id, filename, source_id tag, upload timestamp)
- Function to create a new session and register uploaded files against it
- Function to retrieve all sources for a session
- Unit tests covering create/retrieve
**Dependencies:** T-00

---

## Epic 2 - Terminology Normalization (extend existing)

### T-03: Wrap Terminology Module as a Service
**Description:** Refactor `terminology.py`'s functions to be callable as a pipeline stage (not just CLI), and persist the canonical mapping.
**Acceptance Criteria:**
- `normalize_terminology(sources: list[dict]) -> dict` function added, returning `{term: canonical_term}` plus per-source term lists
- Canonical mapping persisted to DB, keyed by session ID, so downstream stages can query it
- Existing CLI behavior (`__main__` block) still works unmodified
- Unit tests: known synonym pairs cluster correctly; unrelated terms don't merge; empty input handled
**Dependencies:** T-01, T-02

### T-04 [P]: Similarity Threshold Evaluation
**Description:** Empirically evaluate the 0.75 cosine similarity threshold against a small labeled sample of synonym/non-synonym term pairs relevant to your demo domain(s).
**Acceptance Criteria:**
- A labeled test set of ≥20 term pairs (synonym / not-synonym) created (can be manually curated from your sample sources)
- Script/notebook reporting precision/recall at threshold 0.70, 0.75, 0.80
- Threshold decision documented with rationale in code comments or a short `docs/threshold_eval.md`
**Dependencies:** T-03
**Notes:** This produces the real evidence needed for the Result Analysis slide - do not skip in favor of only implementing the feature.

---

## Epic 3 - Salience Ranking (new - build from scratch)

### T-05: Content Unit Segmentation
**Description:** Split normalized, merged source content into scoreable units (sentences or short paragraphs), tagged with originating source ID(s).
**Acceptance Criteria:**
- `segment_content(sources: list[dict]) -> list[dict]` returns units with fields: `text`, `source_ids`, `position_in_doc`
- Unit tests on multi-source input
**Dependencies:** T-03

### T-06: Salience Scoring Function
**Description:** Implement the composite salience score per PRD FR3: cross-source repetition + structural position + emphasis.
**Acceptance Criteria:**
- `score_salience(units: list[dict]) -> list[dict]` adds a `salience_score` field to each unit
- Repetition signal: embedding-similarity clustering across units from different sources (reuse `sentence-transformers` model already in use)
- Structural position signal: heading/definition detection heuristic (e.g., short units near a detected heading score higher) - document the heuristic explicitly
- Emphasis signal: PDF bold/italic metadata if extractable via `pdfplumber`, else a documented fallback (e.g., frequency of the sentence's key term)
- Weights for combining the three signals are configurable constants, not magic numbers buried in logic
- Unit tests: a repeated-across-sources unit scores higher than a unique, buried one on synthetic input
**Dependencies:** T-05

---

## Epic 4 - Grounded Generation (new - build from scratch)

### T-07: LLM Client Interface
**Description:** Build the swappable LLM interface referenced in `04_AGENTS.md`.
**Acceptance Criteria:**
- `llm_client.py` exposes `generate(prompt: str, **kwargs) -> str`
- Backend selectable via `.env` config: `LLM_PROVIDER=ollama|gemini|claude`
- API keys loaded via `python-dotenv`, never hardcoded
- Retry logic with a max retry cap (no infinite retry loops) and clear error on exhaustion
- Unit tests mock the LLM call (no real API calls in test suite)
**Dependencies:** T-00

### T-08: Prompt Template for Grounded Generation
**Description:** Design the generation prompt per PRD FR4, with source-delimited input to mitigate prompt injection per `03_SECURITY.md`.
**Acceptance Criteria:**
- Prompt template clearly delimits each source block (e.g., `[SOURCE: S1]...[/SOURCE]`) and instructs the model to tag every output statement with its source ID(s)
- Output is requested in a structured format (JSON: list of `{statement, source_ids}`) to avoid brittle parsing
- Explicit instruction in the prompt that source content is data, not instructions, to override
**Dependencies:** T-06, T-07

### T-09: Generation Pipeline Function
**Description:** Implement `generate_notes(session_id) -> dict` in `generate.py`, producing the detailed explanation and bullet-point revision notes.
**Acceptance Criteria:**
- Takes salience-ranked, normalized content for a session as input
- Calls the LLM client with the T-08 prompt template
- Parses structured output into: `detailed_explanation` (list of attributed statements) and `revision_notes` (list of attributed bullets)
- Handles malformed LLM output gracefully (retry once with a stricter format reminder, then fail clearly rather than silently returning garbage)
- Unit tests using a mocked LLM response (valid JSON, malformed JSON cases)
**Dependencies:** T-08

---

## Epic 5 - Faithfulness Evaluation (new - build from scratch)

### T-10: NLI-Based Faithfulness Scorer
**Description:** Implement PRD FR5 using a local NLI model.
**Acceptance Criteria:**
- `score_faithfulness(statement: str, source_text: str) -> dict` returns entailment/neutral/contradiction probabilities and a derived faithfulness score
- Uses a local `transformers`/`sentence-transformers` cross-encoder NLI model (no external API call required for this stage, per Security doc cost/latency concerns)
- `evaluate_notes_faithfulness(notes: dict) -> dict` runs this across every generated statement and its cited source, returning per-statement scores + an overall aggregate
- Statements below a configurable threshold (`.env`) are flagged for manual review in the output
- Unit tests: a clearly entailed statement scores high; a clearly contradicted/fabricated statement scores low
**Dependencies:** T-09

---

## Epic 6 - Quiz Generation (new - build from scratch)

### T-11 [P]: Quiz Prompt & Generation Function
**Description:** Implement PRD FR6.
**Acceptance Criteria:**
- `generate_quiz(notes: dict) -> dict` takes only the synthesized notes (never raw sources) as input
- Produces all four question types: MCQ, fill-in-the-blank, short-answer, long-answer
- Output in a structured schema (JSON) with question, options (where applicable), and correct answer
- Terminology in quiz questions reuses canonical terms from T-03's mapping (validate by spot-checking, not just assuming)
- Unit tests with a mocked LLM response covering all four question types
**Dependencies:** T-09, T-03

---

## Epic 7 - API Layer

### T-12: FastAPI Endpoints
**Description:** Expose the full pipeline via REST endpoints.
**Acceptance Criteria:**
- `POST /sessions` - create a session, accept file uploads (multipart), returns session ID
- `POST /sessions/{id}/process` - triggers the pipeline (ingestion → normalization → salience → generation → faithfulness), runs as a background task, returns a job status endpoint
- `GET /sessions/{id}/status` - returns current pipeline stage and completion status
- `GET /sessions/{id}/notes` - returns generated detailed explanation + bullet notes + faithfulness report once ready
- `POST /sessions/{id}/quiz` - triggers quiz generation from completed notes
- `GET /sessions/{id}/quiz` - returns generated quiz
- CORS restricted to the frontend dev origin per `03_SECURITY.md`
- All inputs validated server-side (file types/sizes/session existence)
- API tests via `pytest` + `httpx` covering the happy path and key error cases (invalid session, invalid file type, oversized file)
**Dependencies:** T-01, T-02, T-03, T-06, T-09, T-10, T-11

---

## Epic 8 - Evaluation & Evidence (for grading)

### T-13: End-to-End Demo Script
**Description:** A script/notebook that runs the full pipeline on at least two distinct topics/sample source sets and outputs results usable as evidence in the presentation (Slide 8 evidence, Slide 5/6 comparison table support).
**Acceptance Criteria:**
- Runs ingestion → normalization → salience → generation → faithfulness → quiz end-to-end on ≥2 topics
- Outputs saved to `data/demo_runs/<topic>/` including: canonical term mapping, salience-ranked units, generated notes, faithfulness report, quiz
- A short markdown summary per run suitable for pasting into slides (numbers, not just "it worked")
**Dependencies:** T-12

### T-14 [P]: Test Coverage & Regression Pass
**Description:** Final pass ensuring the full test suite is green and coverage is reported.
**Acceptance Criteria:**
- `pytest --cov` run, coverage report generated
- Any failing/flaky test fixed or explicitly documented with reason if deferred
**Dependencies:** T-12
