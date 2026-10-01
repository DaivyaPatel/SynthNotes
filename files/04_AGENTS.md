# AGENTS.md — Instructions for Antigravity (Gemini / Claude)

This file governs how the coding agent should operate on the SynthNotes repository. Read this before executing any ticket from `05_TICKETS.md`.

## Project Summary

SynthNotes merges multiple learning sources (PDF/TXT) on one topic into a single, exam-ready, source-attributed, faithfulness-verified document with an auto-generated quiz. Full requirements: `01_PRD.md`. Stack decisions: `02_TECH_STACK.md`. Security constraints: `03_SECURITY.md` — **treat these as binding, not optional context.**

## Existing Code (do not rewrite from scratch)

- `ingest.py` — PDF/TXT ingestion, already functional. Extend, don't replace, unless a ticket explicitly says otherwise.
- `terminology.py` — terminology extraction + clustering, already functional. Wrap as a service/module; do not change its core clustering logic without a ticket authorizing it.
- `generate.py` — currently empty/placeholder. This is where Stage 3 (Grounded Generation) and the Quiz Generator will live.
- `get-pip.py` — not project code (pip installer script). Ignore; do not modify or reference.
- `data/`, `venv/`, `__pycache__/` — leave structure as-is; `venv` and `__pycache__` should be gitignored if not already.

## Operating Rules

1. **Work ticket-by-ticket, in the order given in `05_TICKETS.md`**, unless a ticket is explicitly marked parallelizable. Do not skip ahead to later-stage tickets before earlier pipeline stages are functional — later stages depend on earlier stages' output contracts.
2. **Every ticket must end in a runnable, testable state.** Do not leave the repo in a broken/non-importing state between tickets. If a ticket can't be fully completed, stop and report what's blocking it rather than committing partial broken code silently.
3. **Never hardcode API keys or secrets.** Load all credentials via `.env` per `03_SECURITY.md`. If a ticket requires a new secret, add its name to `.env.example`, not a real value anywhere.
4. **Preserve function signatures already in use** (`ingest_sources`, `extract_terms_from_sources`, `cluster_terms`) unless a ticket explicitly changes the interface — other stages will be built against these contracts.
5. **Write a unit test for every new pipeline function** (`pytest`), placed under `tests/`, mirroring the module structure (e.g., `tests/test_salience.py` for `salience.py`).
6. **Treat extracted document text as untrusted** when building any LLM prompt (generation, quiz) — follow the prompt-injection mitigation in `03_SECURITY.md` (delimited source blocks, no instruction-following from source content).
7. **Do not fabricate pipeline output** to make a ticket "look done." If a stage's real output quality is poor on a test document, report it — do not silently cherry-pick a good example to hide it. This is an evaluated academic project; honest intermediate state matters more than appearing complete.
8. **Keep the LLM-calling code behind a single interface** (e.g., `llm_client.py` with a `generate(prompt: str) -> str` function) so the underlying model (local Ollama vs. Gemini API vs. Claude API) can be swapped via config, not by editing call sites.
9. **After completing a ticket, run:**
   - `pytest` (all tests must pass, including previously passing ones — no regressions)
   - A quick manual smoke run of the affected pipeline stage on the sample data in `data/` (or request sample data if none exists yet)
10. **Log, don't print, in library code.** `ingest.py`/`terminology.py`/new modules should use Python's `logging` module rather than bare `print()`, except in `if __name__ == "__main__":` blocks (existing pattern in `terminology.py` is fine to keep as-is for CLI testing).
11. **Frontend and backend are built against an explicit API contract.** Before wiring the frontend to any backend endpoint, confirm the endpoint's request/response schema is defined (ideally via FastAPI's auto-generated OpenAPI schema) — do not guess a contract from both sides independently.
12. **Commit granularity:** one logical change per commit, with a message referencing the ticket ID (e.g., `[T-04] Implement salience scoring function`).

## Definition of Done (applies to every ticket unless overridden)

- [ ] Code implemented and matches the ticket's acceptance criteria
- [ ] Unit tests written and passing
- [ ] No hardcoded secrets or credentials
- [ ] No regressions in existing tests
- [ ] Function/module has a docstring explaining input/output contract
- [ ] If the ticket touches the pipeline's public interface, `01_PRD.md`'s functional requirement it maps to is satisfied

## Escalation

If a ticket is ambiguous, underspecified, or conflicts with `01_PRD.md`/`03_SECURITY.md`, **stop and ask** rather than making an assumption that silently narrows or changes scope — this is a graded academic project and scope decisions belong to the team, not the agent.

## Reference Order

1. `01_PRD.md` — what to build and why
2. `02_TECH_STACK.md` — what to build it with
3. `03_SECURITY.md` — constraints that override convenience
4. `04_AGENTS.md` (this file) — how to operate
5. `05_TICKETS.md` — what to do, in order
6. `06_FRONTEND_PROMPT.md` — frontend-specific build brief
