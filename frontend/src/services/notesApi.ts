import { DetailedSection, NotesData, TerminologyMapItem } from '../types';
import { GRADIENT_DESCENT_NOTES } from './mockData';
import { sessionApi } from './sessionApi';

export const notesApi = {
  async getNotes(sessionId: string): Promise<NotesData> {
    await new Promise((r) => setTimeout(r, 250));
    const session = await sessionApi.getSession(sessionId);

    if (session?.notes) {
      return session.notes;
    }

    // If session has no custom notes yet, generate tailored notes based on title & sources
    const title = session?.title || 'Synthesized Study Topic';
    const sources = session?.sources || [
      { source_id: 'S1', filename: 'primary_reference_ch1.pdf', size: 2400000, type: 'pdf', status: 'ready' },
      { source_id: 'S2', filename: 'lecture_notes_companion.pdf', size: 1200000, type: 'pdf', status: 'ready' },
      { source_id: 'S3', filename: 'revision_slides_summary.pdf', size: 850000, type: 'pdf', status: 'ready' },
    ];

    const sourceContributions = sources.map((s, idx) => ({
      source_id: s.source_id,
      filename: s.filename,
      percentage: Math.round(100 / sources.length) + (idx === 0 ? 100 % sources.length : 0),
      statementCount: Math.round(10 + Math.random() * 8),
    }));

    const detailedSections: DetailedSection[] = [
      {
        heading: `1. Foundational Overview: ${title}`,
        statements: [
          {
            id: 'ds_gen_1',
            text: `${title} constitutes a critical subject area requiring integration of theoretical foundations with empirical application.`,
            source_ids: [sources[0]?.source_id || 'S1', sources[1]?.source_id || 'S2'],
            faithfulness_score: 0.97,
          },
          {
            id: 'ds_gen_2',
            text: `Cross-source analysis demonstrates that core analytical mechanisms remain consistent across both academic curricula, despite cosmetic discrepancies in terminology and instructional depth.`,
            source_ids: [sources[0]?.source_id || 'S1', sources[sources.length - 1]?.source_id || 'S2'],
            faithfulness_score: 0.95,
          },
          {
            id: 'ds_gen_3',
            text: `Key governing equations and operational constraints must be contextualized within boundary parameters established in initial lecture modules.`,
            source_ids: sources.map((s) => s.source_id),
            faithfulness_score: 0.98,
          },
        ],
      },
      {
        heading: '2. Comparative Methodology & Key Principles',
        statements: [
          {
            id: 'ds_gen_4',
            text: `Primary literature establishes deterministic behavior under baseline assumptions, while supplementary seminar materials highlight edge cases under high load.`,
            source_ids: [sources[0]?.source_id || 'S1'],
            faithfulness_score: 0.94,
          },
          {
            id: 'ds_gen_5',
            text: `Iterative refinement methods yield higher asymptotic fidelity when normalized against standardized baseline coefficients.`,
            source_ids: [sources[1]?.source_id || 'S2'],
            faithfulness_score: 0.92,
          },
        ],
      },
    ];

    const terminologyMap: TerminologyMapItem[] = [
      {
        id: 'tm_gen_1',
        canonical: 'Primary Governing Principle',
        definition: 'The axiomatic theoretical underpinning adopted across modern examination syllabi.',
        variants: [
          { term: 'Core Law / Axiom', source_id: sources[0]?.source_id || 'S1', frequency: 12 },
          { term: 'Standard Paradigm', source_id: sources[1]?.source_id || 'S2', frequency: 7 },
        ],
      },
      {
        id: 'tm_gen_2',
        canonical: 'Operational Coefficient',
        definition: 'Scalar tuning parameter determining update rates and system stability.',
        variants: [
          { term: 'Modulation Factor', source_id: sources[1]?.source_id || 'S2', frequency: 9 },
          { term: 'Scaling Index', source_id: sources[sources.length - 1]?.source_id || 'S3', frequency: 4 },
        ],
      },
    ];

    const generatedNotes: NotesData = {
      session_id: sessionId,
      topic_title: title,
      subject_category: 'Exam Synthesis',
      created_at: new Date().toISOString(),
      source_contributions: sourceContributions,
      detailed_sections: detailedSections,
      bullet_notes: [
        {
          id: 'bn_gen_1',
          label: 'Definition',
          text: `Unified conceptual formulation of ${title} synthesized from all ${sources.length} active documents.`,
          source_ids: [sources[0]?.source_id || 'S1', sources[1]?.source_id || 'S2'],
          importance: 'critical',
        },
        {
          id: 'bn_gen_2',
          label: 'Key Framework',
          text: 'Combines structural derivations from textbook chapters with real-world exam heuristics from lecture summaries.',
          source_ids: sources.map((s) => s.source_id),
          importance: 'high',
        },
        {
          id: 'bn_gen_3',
          label: 'High-Yield Exam Focus',
          text: 'Common error point: Confusing alternative terminology variants between distinct authored texts.',
          source_ids: [sources[0]?.source_id || 'S1'],
          importance: 'critical',
        },
      ],
      terminology_map: terminologyMap,
      faithfulness: {
        overall_score: 0.93,
        total_statements: 18,
        verified_statements: 17,
        flagged_count: 1,
        reliability_tier: 'Highly Reliable',
        flagged_statements: [
          {
            id: 'flag_gen_1',
            statement: `An edge claim states that all historical variations of ${title} operate identically regardless of dimensional scale.`,
            source_ids: [sources[sources.length - 1]?.source_id || 'S2'],
            faithfulness_score: 0.44,
            verdict: 'unsupported',
            issue: 'Source documents condition this behavior strictly on finite bounded domains, not universal scale.',
            suggestedCorrection: 'This holds true specifically within finite bounded domains under verified steady-state criteria.',
            status: 'pending',
          },
        ],
      },
    };

    if (session) {
      session.notes = generatedNotes;
      session.faithfulness_score = generatedNotes.faithfulness.overall_score;
      sessionApi.saveSession(session);
    }

    return generatedNotes;
  },

  async updateFlaggedStatement(
    sessionId: string,
    flaggedId: string,
    action: 'regenerate' | 'remove' | 'keep'
  ): Promise<NotesData> {
    await new Promise((r) => setTimeout(r, 200));
    const notes = await this.getNotes(sessionId);

    const flag = notes.faithfulness.flagged_statements.find((f) => f.id === flaggedId);
    if (flag) {
      flag.status = action === 'regenerate' ? 'regenerated' : action === 'remove' ? 'removed' : 'kept';

      if (action === 'regenerate' && flag.suggestedCorrection) {
        // Replace in detailed notes
        for (const sec of notes.detailed_sections) {
          const match = sec.statements.find((st) => st.id === flaggedId || st.text === flag.statement);
          if (match) {
            match.text = flag.suggestedCorrection;
            match.faithfulness_score = 0.96;
            match.isFlagged = false;
          }
        }
        flag.faithfulness_score = 0.96;
      } else if (action === 'remove') {
        for (const sec of notes.detailed_sections) {
          sec.statements = sec.statements.filter((st) => st.id !== flaggedId && st.text !== flag.statement);
        }
      }

      // Recompute faithfulness overall score slightly
      const remainingPending = notes.faithfulness.flagged_statements.filter((f) => f.status === 'pending');
      notes.faithfulness.flagged_count = remainingPending.length;
      if (remainingPending.length === 0) {
        notes.faithfulness.overall_score = 0.97;
        notes.faithfulness.reliability_tier = 'Highly Reliable';
      }

      const session = await sessionApi.getSession(sessionId);
      if (session) {
        session.notes = notes;
        sessionApi.saveSession(session);
      }
    }

    return notes;
  },
};
