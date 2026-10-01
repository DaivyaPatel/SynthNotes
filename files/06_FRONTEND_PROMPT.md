# Frontend Build Brief — SynthNotes

Feed this to Antigravity as the frontend implementation prompt, after backend Epics 0–7 (`05_TICKETS.md`) are functional enough to have a stable API contract (ideally after T-12).

---

## Prompt for Agent

You are building the frontend for **SynthNotes**, a tool that merges multiple learning sources into unified, exam-ready, source-attributed study notes with a faithfulness score and auto-generated quiz. Full product context: `01_PRD.md`. Stack: React + Vite + Tailwind CSS + React Query, per `02_TECH_STACK.md`. Backend API contract: FastAPI endpoints defined in T-12 of `05_TICKETS.md` — fetch and confirm the live OpenAPI schema before wiring calls; do not assume field names.

### Design Direction

- Clean, academic/study-tool aesthetic — not a marketing landing page. Think "study dashboard," not "SaaS homepage."
- Subtle, professional color palette — avoid default dark-blue AI-generated template look. Use a muted, restrained accent color (e.g., a slate or sage tone) against a white/near-white background, consistent with the presentation deck's visual language.
- No decorative gradients, no stock-photo hero sections, no unnecessary animation.
- Prioritize legibility of dense text (this app displays study notes) — generous line height, readable font size (16px+ body), clear visual separation between the detailed explanation and bullet notes views.

### Required Screens/Views

1. **Upload / New Session**
   - Multi-file upload (drag-and-drop + click-to-browse) accepting PDF/TXT
   - Show per-file validation feedback (rejected type, oversized file) inline, before submission
   - Clear call-to-action to start processing once ≥2 files are added (single-file sessions should be blocked or warned against, since the product is explicitly multi-source)

2. **Processing / Status View**
   - Show current pipeline stage (Ingestion → Normalization → Salience Ranking → Generation → Faithfulness Evaluation) as a step indicator, polling `GET /sessions/{id}/status`
   - Handle and display pipeline errors clearly (which stage failed, not just "something went wrong")

3. **Notes View**
   - Tab or toggle between "Detailed Explanation" and "Bullet Revision Notes"
   - Every statement/bullet visually tagged with its source ID(s) (e.g., a small inline badge `[S1]`, `[S2]`) — this is a core differentiator, not a minor UI detail
   - Statements flagged as low-faithfulness (below threshold) visually distinguished (e.g., a warning indicator) and clickable to show the NLI score/reasoning
   - Overall faithfulness score displayed prominently (e.g., a summary badge/card at the top of the notes view)
   - Canonical term list accessible (e.g., a collapsible "Terminology Map" panel showing term → canonical form → which sources used which variant)

4. **Quiz View**
   - Render all four question types distinctly (MCQ with selectable options, fill-in-the-blank as text input, short/long answer as textareas)
   - Simple self-check flow: user answers, then reveals correct answers (no need for scoring/persistence in v1 unless a ticket adds it)
   - Button to regenerate quiz from the same notes

5. **Session History (minimal, if time allows)**
   - List of past sessions (topic/filename summary, date) — stretch goal, not blocking for core demo

### Technical Requirements

- Use React Query for all API calls, with polling for the status endpoint (interval-based, stop polling once status is "complete" or "failed")
- Handle loading and error states explicitly in every view — no blank screens on failure
- Responsive down to a standard laptop width at minimum; mobile support is not required for this academic project unless requested
- Keep components small and single-purpose (e.g., `SourceBadge`, `FaithfulnessIndicator`, `QuizQuestion`) rather than monolithic page components — this matters for maintainability if a mentor asks to see the codebase
- No hardcoded API base URL — read from an environment variable (`VITE_API_BASE_URL`) so it can point to `localhost:8000` in dev without code changes

### Explicit Non-Goals for Frontend v1

- User authentication/login screens (out of scope per `03_SECURITY.md`)
- Real-time collaborative features
- Mobile-native app — web only

### Acceptance Criteria

- [ ] Can upload ≥2 files and trigger processing
- [ ] Status view accurately reflects backend pipeline stage
- [ ] Notes view displays both explanation formats with visible source attribution
- [ ] Faithfulness scores are visible and low-confidence statements are distinguishable
- [ ] Quiz view renders and allows self-check for all four question types
- [ ] No console errors on the happy path; graceful error states on failure
