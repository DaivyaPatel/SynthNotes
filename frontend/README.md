# SynthNotes - Frontend Architecture & Specifications

SynthNotes reconciles multiple learning resources on the same topic into one unified, exam-ready, source-attributed study document.

## 🚀 Key Modules & Architecture

1. **Dashboard & Reference UI (Home)**
   - Replicates the clean study-tool layout inspired by the design mockup.
   - Header with search, quick notifications, student profile ("Rohan - Student Mode").
   - Left-hand navigation sidebar with quotes, topics, and quick actions.
   - Hero banner with hand-drawn synthesis diagram and core feature highlights.
   - Example study topics for one-click testing: *Gradient Descent*, *Cell Division*, *Indian Polity*, *Thermodynamics*, *Modern History*.

2. **Source Ingestion & Validation**
   - Multi-file drag & drop supporting PDF, TXT, DOCX, PPT.
   - Document extractability and topic-overlap validation.
   - Handles all edge cases: Valid sources (high overlap), Low topic overlap warning with choices, and Extraction failure simulation.

3. **Multi-Stage Processing Pipeline**
   - Step-by-step progress tracking across 5 pipeline stages:
     1. Text extraction from ingested documents
     2. Terminology normalization across divergent source vocabularies
     3. Exam-importance and salience ranking
     4. Source-attributed note generation
     5. Faithfulness verification via NLI grounding

4. **Unified Notes Dashboard**
   - Overall Faithfulness score card (94% Highly Reliable) with circular gauge.
   - Dual-view toggle:
     - **Detailed Explanation**: Flowing synthesis with interactive `[S1][S2]` inline citation badges.
     - **Bullet Revision Notes**: Labeled revision bullets (Definition, Mechanics, Pitfalls) with source tags.
   - **Terminology Normalization Map**: Collapsible table showing canonical concepts vs. source-specific aliases (e.g. *Steepest Descent* vs *Gradient Descent*).
   - **Source Contribution Breakdown**: Quantitative visual bars reflecting each document's representation in the notes.
   - **Flagged Claims Review**: Structured fields for low-faithfulness claims with action buttons (`[Regenerate]`, `[Remove]`, `[Keep Anyway]`).

5. **Self-Testing Layer (Exam Quiz)**
   - Auto-generated questions derived strictly from the synthesized notes.
   - Renders 4 distinct question types:
     - Multiple Choice Question (MCQ)
     - Fill-in-the-Blank
     - Short Answer (with model sample answers and key concepts check)
     - Long Answer (with evaluation rubrics and criteria weights)
   - Real-time scoring, question navigation, and grounded explanations.

6. **Source Comparison & Overlap**
   - Side-by-side analysis of individual sources, terminology differences, and unique facts.

7. **Study Session History**
   - Quick switching between past study sessions with search and filtering.
