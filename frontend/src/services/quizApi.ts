import { QuizQuestion } from '../types';
import { GRADIENT_DESCENT_QUIZ } from './mockData';
import { sessionApi } from './sessionApi';

export const quizApi = {
  async getOrGenerateQuiz(sessionId: string): Promise<QuizQuestion[]> {
    await new Promise((r) => setTimeout(r, 300));
    const session = await sessionApi.getSession(sessionId);

    if (session?.quiz && session.quiz.length > 0) {
      return session.quiz;
    }

    if (sessionId === 'sn_gradient_descent') {
      return GRADIENT_DESCENT_QUIZ;
    }

    const title = session?.title || 'Synthesized Study Topic';

    const generatedQuiz: QuizQuestion[] = [
      {
        id: `q_gen_1`,
        type: 'mcq',
        question: `Based strictly on the synthesized notes for ${title}, which statement best articulates the primary theoretical foundation?`,
        options: [
          `The core mechanics depend on iterative parameter adjustments derived from first-principles analysis.`,
          `All sources reject continuous mathematical formulations in favor of discrete rule engines.`,
          `Boundary constraints are irrelevant once empirical heuristics are deployed.`,
          `No consensus exists across the ingested documents regarding definitions.`,
        ],
        correct_answer: `The core mechanics depend on iterative parameter adjustments derived from first-principles analysis.`,
        explanation: `As detailed in Section 1 of the synthesized notes, the governing framework establishes iterative updates grounded in foundational derivations.`,
        source_reference: 'Section 1: Foundational Overview',
      },
      {
        id: `q_gen_2`,
        type: 'fill_in_the_blank',
        question: `According to the normalized terminology map, the canonical concept is defined as the ________ across modern examination rubrics.`,
        prefixText: 'Enter the canonical terminology focus',
        correct_answer: 'Primary Governing Principle',
        acceptable_alternatives: ['governing principle', 'primary principle', 'axiom'],
        explanation: `The Terminology Map specifically normalizes divergent textbook synonyms under the canonical standard "Primary Governing Principle".`,
        source_reference: 'Terminology Map Synthesis',
      },
      {
        id: `q_gen_3`,
        type: 'short_answer',
        question: `Summarize the key exam pitfall highlighted in the high-yield bullet revision notes for ${title}.`,
        sample_answer: `The high-yield pitfall cautions students against conflating cosmetic vocabulary differences between distinct reference authors, as varying terminology often maps back to the same underlying theoretical mechanism.`,
        key_points: [
          'Beware of synonymous jargon across authors',
          'Focus on underlying physical/mathematical mechanism',
          'Identify canonical exam definitions',
        ],
        explanation: `Derived from the High-Yield Exam Focus in the bullet revision summary.`,
        source_reference: 'Bullet Revision Notes',
      },
      {
        id: `q_gen_4`,
        type: 'long_answer',
        question: `Synthesize how reconciling multiple sources provides a more resilient understanding of ${title} than relying on a single textbook or slide deck.`,
        sample_answer: `Single textbooks often introduce author-specific biases, idiosyncratic notations, or omissions of practical exam tricks found in lecture companion notes. By reconciling multiple resources, SynthNotes normalizes contradictory naming schemes, cross-verifies theoretical proofs with empirical edge cases, and provides verifiable citations that protect against unverified exam claims.`,
        rubric_criteria: [
          { criterion: 'Clear explanation of terminology reconciliation benefits', weight: 35 },
          { criterion: 'Identification of single-source coverage blindspots', weight: 35 },
          { criterion: 'Articulation of faithfulness verification and exam-readiness', weight: 30 },
        ],
        explanation: `Comprehensive synthesis grounded across all ingested documents.`,
        source_reference: 'Multi-Source Synthesis Synthesis',
      },
    ];

    if (session) {
      session.quiz = generatedQuiz;
      sessionApi.saveSession(session);
    }

    return generatedQuiz;
  },
};
