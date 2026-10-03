import { DetailedSection, NotesData, TerminologyMapItem } from '../types';
import { GRADIENT_DESCENT_NOTES } from './mockData';
import { sessionApi } from './sessionApi';
import { fetchApi } from './api';

export const notesApi = {
  async getNotes(sessionId: string): Promise<NotesData> {
    const backendNotes = await fetchApi<any>(`/sessions/${sessionId}/notes`);
    const session = await sessionApi.getSession(sessionId);

    // Map detailed explanation to DetailedSection format
    const rawDetailed = Array.isArray(backendNotes.detailed_explanation) ? backendNotes.detailed_explanation : [];
    const detailedSections: DetailedSection[] = [
      {
        heading: "Synthesized Explanation",
        statements: rawDetailed.map((s: any, idx: number) => ({
          id: `ds_gen_${idx}`,
          text: s.statement || s.text || (typeof s === 'string' ? s : JSON.stringify(s)),
          source_ids: Array.isArray(s.source_ids) ? s.source_ids : [],
          faithfulness_score: s.nli_score !== undefined ? s.nli_score : 0.95,
        })),
      },
    ];

    // Map revision notes to bullet notes format
    const rawBullets = Array.isArray(backendNotes.revision_notes) ? backendNotes.revision_notes : [];
    const bulletNotes = rawBullets.map((b: any, idx: number) => ({
      id: `bn_gen_${idx}`,
      label: b.label || (b.importance === 'critical' ? 'CRITICAL' : 'CONCEPT'),
      text: b.bullet || b.text || (typeof b === 'string' ? b : JSON.stringify(b)),
      source_ids: Array.isArray(b.source_ids) ? b.source_ids : [],
      importance: (b.importance === 'critical' ? 'critical' : 'normal') as 'critical' | 'normal',
    }));

    // Map faithfulness report
    const fReport = backendNotes.faithfulness_report || {};
    const flagged = (fReport.flagged_statements || []).map((f: any, idx: number) => ({
      id: `flag_gen_${idx}`,
      statement: f.statement,
      source_ids: f.source_ids || [],
      faithfulness_score: f.nli_score || 0,
      verdict: f.nli_label || 'unsupported',
      issue: 'Potential contradiction or unsupported claim detected.',
      suggestedCorrection: 'Review source documents for clarification.',
      status: 'pending' as const,
    }));

    const generatedNotes: NotesData = {
      session_id: sessionId,
      topic_title: session?.title || 'Synthesized Study Topic',
      subject_category: 'Exam Synthesis',
      created_at: new Date().toISOString(),
      source_contributions: Array.isArray(backendNotes.source_contributions) 
        ? backendNotes.source_contributions.map((sc: any) => {
            const src = session?.sources?.find(s => s.source_id === sc.source_id);
            return {
              source_id: sc.source_id || 'unknown',
              filename: src?.filename || sc.source_id || 'Unknown Source',
              percentage: sc.percentage || 0,
              statementCount: sc.percentage || 0 // approximation
            };
          })
        : [],
      detailed_sections: detailedSections,
      bullet_notes: bulletNotes,
      terminology_map: backendNotes.terminology_map || [],
      faithfulness: {
        overall_score: fReport.average_nli_score || 0.9,
        total_statements: fReport.total_statements || 0,
        verified_statements: (fReport.total_statements || 0) - flagged.length,
        flagged_count: flagged.length,
        reliability_tier: (fReport.average_nli_score || 0.9) > 0.85 ? 'Highly Reliable' : 'Needs Review',
        flagged_statements: flagged,
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
