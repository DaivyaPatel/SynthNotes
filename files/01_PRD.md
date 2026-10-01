# Product Requirements Document (PRD)
## SynthNotes — Transforming Multiple Learning Resources into Unified Exam-Ready Notes

**Team:** Rohan Sanjay Satkar (32), Bhavisha Bhanushali (34)
**Mentor:** Dr. Vaqar Ansari
**Department:** AI & ML, St. Francis Institute of Technology
**Document owner:** Project team | **Status:** Draft for implementation

---

## 1. Problem Statement

Students studying a single topic typically consult multiple learning resources — textbooks, lecture notes, slide decks, and reference books. These sources:

- Use inconsistent terminology for the same concept (e.g., "Gradient Descent" vs "Steepest Descent")
- Repeat content across sources without adding value
- Vary in depth and structural emphasis
- Occasionally conflict on minor factual details

There is currently no tool that reconciles multiple sources on the same topic into one coherent, verified, exam-ready document. Existing summarization tools operate on a single document and offer no cross-source terminology alignment, no exam-oriented importance scoring, no statement-level source attribution, and no faithfulness verification.

## 2. Goals

| Goal | Success Criterion |
|---|---|
| Reconcile multiple sources on one topic into a single document | System accepts N ≥ 2 sources and produces one merged output |
| Normalize terminology across sources | Synonymous terms are clustered to a canonical form with measurable precision/recall on a labeled sample |
| Rank content by exam relevance | Salience score correlates with human-judged importance on a sample set |
| Generate faithful, attributable notes | Every generated statement carries a source tag; faithfulness score computed via NLI |
| Support self-testing | Quiz generated from synthesized notes, not raw sources |

## 3. Non-Goals (Out of Scope for this version)

- Diagram/figure understanding (text-only pipeline)
- Scanned PDF / OCR support
- Automatic resolution of genuine factual contradictions between sources (flagged for manual review only)
- Multilingual input/output
- Real-time collaborative editing

## 4. Target User

Undergraduate/postgraduate students revising for exams from 2+ heterogeneous sources on a single topic, per session (not a general-purpose document summarizer).

## 5. Core User Flow

1. User uploads 2+ source documents (PDF/TXT) covering one topic
2. System ingests and extracts text per source, tagging each with a source ID
3. System normalizes terminology across all sources into a canonical vocabulary
4. System scores combined content for exam-importance (salience ranking)
5. System generates one coherent, source-attributed explanation
6. System verifies each generated statement against its cited source (faithfulness evaluation) and reports a faithfulness score
7. User receives: detailed explanation, bullet-point revision notes, an auto-generated quiz, and (optional) an overlap/conflict visualization across sources
8. User can regenerate the quiz, flag low-faithfulness statements for manual review, and export notes

## 6. Functional Requirements

### FR1 — Ingestion
- Accept PDF and TXT uploads (multi-file per session)
- Extract text per file, preserving source-ID mapping
- Reject/flag corrupted or unreadable files with a clear error, not a silent failure

### FR2 — Terminology Normalization
- Extract candidate domain terms per source
- Cluster semantically similar terms across sources into canonical groups using embedding similarity
- Persist and expose the canonical mapping (term → canonical form) for downstream stages and for UI display (e.g., "also referred to as: ...")

### FR3 — Salience Ranking
- Score merged content units (sentences/paragraphs) using: cross-source repetition, structural position (heading/definition vs. body), and emphasis signals in original text
- Output a ranked list of content units usable for prioritizing the final notes

### FR4 — Grounded Source-Attributed Generation
- Merge normalized, ranked content into one coherent explanation
- Every generated statement must carry a reference to the source ID(s) it was derived from
- Output both a detailed explanation and condensed bullet-point revision notes

### FR5 — Faithfulness Evaluation
- For each generated statement, run an NLI check against its cited source text (entailment vs. contradiction vs. neutral)
- Compute and expose a per-statement and an overall faithfulness score
- Flag statements below a configurable faithfulness threshold for manual review

### FR6 — Quiz Generator
- Generate MCQs, fill-in-the-blank, short-answer, and long-answer questions from the synthesized notes (never from raw sources directly)
- Maintain terminology consistency between quiz and notes (reuse canonical terms from FR2)

### FR7 — Conflict/Overlap Visualization (optional/stretch)
- Visualize where sources overlap vs. diverge on a given sub-topic

### FR8 — Session & Output Management
- Persist a user's session (sources, generated notes, quiz, faithfulness report)
- Allow export of notes (PDF/Markdown minimum)

## 7. Non-Functional Requirements

- **Latency:** end-to-end pipeline run on a typical topic (2–4 sources, ~5–10 pages each) should complete within an acceptable synchronous or async-with-progress window — define target once infra is chosen (see Tech Stack doc)
- **Reliability:** pipeline failures at any stage must degrade gracefully (return partial output + error, never a silent wrong answer)
- **Transparency:** every claim in the output must be traceable to a source; this is a correctness requirement, not a nice-to-have
- **Auditability:** faithfulness scores and flagged statements must be inspectable, not just aggregated
- **Reproducibility:** given the same sources and config, output should be substantively stable across runs (temperature/config documented)

## 8. Known Limitations (to state explicitly, not hide)

- Output quality depends on input quality (garbled extraction → garbled notes)
- No figure/diagram understanding — text only
- No OCR — scanned PDFs unsupported
- Genuine factual contradictions between sources are flagged, not resolved, by the system

## 9. Future Scope (post mid-term / post-submission)

- Multilingual support
- Diagram/figure understanding
- Handwriting recognition
- Personalization to student weak areas (using quiz performance history)
- Voice interaction

## 10. Acceptance Criteria for "Version 1 Complete"

- [ ] Can ingest ≥2 PDF/TXT sources and produce a merged, canonical term list
- [ ] Can produce a salience-ranked content set
- [ ] Can generate a source-attributed detailed explanation + bullet notes
- [ ] Can compute and display a faithfulness score per statement and overall
- [ ] Can generate a quiz (all 4 question types) from synthesized notes
- [ ] End-to-end demo on at least 2 distinct topics/domains, with results reproducible for evaluation/demo purposes
