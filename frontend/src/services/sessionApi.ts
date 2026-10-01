import {
  PipelineStageKey,
  PipelineStatusResponse,
  SessionRecord,
  StudySource,
  ValidationResult,
} from '../types';
import { INITIAL_PRESET_SESSIONS } from './mockData';

const STORAGE_KEY = 'synthnotes_sessions_v1';

function getStoredSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRESET_SESSIONS));
      return INITIAL_PRESET_SESSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRESET_SESSIONS;
  }
}

function saveStoredSessions(sessions: SessionRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving sessions to localStorage', e);
  }
}

export const sessionApi = {
  async getSessions(): Promise<SessionRecord[]> {
    // Artificial small delay for realism
    await new Promise((r) => setTimeout(r, 120));
    return getStoredSessions();
  },

  async getSession(sessionId: string): Promise<SessionRecord | null> {
    const sessions = getStoredSessions();
    return sessions.find((s) => s.session_id === sessionId) || null;
  },

  async createSession(
    files: { name: string; size: number; type?: string }[],
    topicTitle?: string
  ): Promise<{ session_id: string; sources: StudySource[] }> {
    await new Promise((r) => setTimeout(r, 350));
    const sessionId = `sn_${Date.now()}`;
    const sources: StudySource[] = files.map((f, idx) => ({
      source_id: `S${idx + 1}`,
      filename: f.name,
      size: f.size,
      type: f.name.split('.').pop()?.toLowerCase() || 'pdf',
      status: 'ready',
      wordCount: Math.round(3000 + Math.random() * 6000),
      contributionPercent: Math.round(100 / files.length),
    }));

    const inferredTitle =
      topicTitle ||
      files[0].name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/(chapter|ch\d+|notes|slides|textbook)/gi, '')
        .trim() ||
      'Multi-Source Study Session';

    const newRecord: SessionRecord = {
      session_id: sessionId,
      title: inferredTitle.charAt(0).toUpperCase() + inferredTitle.slice(1),
      sources,
      created_at: new Date().toISOString(),
      status: 'uploaded',
      validation: {
        valid: true,
        topic_overlap_score: 0.92,
        status: 'valid',
        message: 'Sources uploaded and ready for extraction.',
      },
    };

    const current = getStoredSessions();
    saveStoredSessions([newRecord, ...current]);

    return { session_id: sessionId, sources };
  },

  async validateSources(
    sessionId: string,
    forcedScenario?: 'valid' | 'low_overlap' | 'extraction_failure'
  ): Promise<ValidationResult> {
    await new Promise((r) => setTimeout(r, 600));
    const sessions = getStoredSessions();
    const session = sessions.find((s) => s.session_id === sessionId);

    let result: ValidationResult;

    if (forcedScenario === 'extraction_failure') {
      result = {
        valid: false,
        topic_overlap_score: 0.0,
        status: 'extraction_failure',
        failed_files: [session?.sources[session.sources.length - 1]?.filename || 'corrupted_file.pdf'],
        message: `Couldn't Read One Or More Files: "${session?.sources[session.sources.length - 1]?.filename || 'file'}" could not be processed (corrupted or unreadable format). Please re-upload or remove it.`,
      };
    } else if (forcedScenario === 'low_overlap') {
      result = {
        valid: true,
        topic_overlap_score: 0.38,
        status: 'low_overlap',
        message:
          "Topic Overlap Is Low (38%): These documents don't appear to cover the same subject closely. SynthNotes merges multiple sources on one subject — please upload sources on the same topic, or continue anyway if you're sure.",
        detectedTopic: 'Mixed: Machine Learning & Relational Database Management',
        keySharedTerms: ['Data', 'Algorithms', 'Query'],
      };
    } else {
      // Normal valid scenario
      result = {
        valid: true,
        topic_overlap_score: 0.93,
        status: 'valid',
        message: `${session?.sources.length || 3} documents extracted successfully and appear to cover a highly compatible topic. Ready for pipeline processing.`,
        detectedTopic: session?.title || 'Consolidated Topic',
        keySharedTerms: ['Core Mechanisms', 'Canonical Terminology', 'Mathematical Formulations', 'Exam High-Yield Criteria'],
      };
    }

    if (session) {
      session.validation = result;
      session.status = result.valid ? 'validated' : 'error';
      saveStoredSessions(sessions);
    }

    return result;
  },

  async triggerPipeline(sessionId: string): Promise<{ job_id: string; status: string }> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      job_id: `job_${Date.now()}`,
      status: 'queued',
    };
  },

  async getPipelineStatus(
    sessionId: string,
    currentStepIndex: number
  ): Promise<PipelineStatusResponse> {
    const stages: PipelineStageKey[] = [
      'ingestion',
      'terminology_normalization',
      'salience_ranking',
      'generation',
      'faithfulness_verification',
    ];

    const currentKey = stages[Math.min(currentStepIndex, stages.length - 1)];
    const completedStages = stages.slice(0, currentStepIndex);
    const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / stages.length) * 100));

    const messages: Record<PipelineStageKey, string> = {
      ingestion: 'Extracting text and identifying document sections...',
      terminology_normalization: 'Normalizing synonymous vocabulary & mathematical notations...',
      salience_ranking: 'Ranking content by exam frequency and conceptual importance...',
      generation: 'Synthesizing source-attributed explanation and revision notes...',
      faithfulness_verification: 'Executing NLI faithfulness checks across all cited claims...',
    };

    return {
      stage: currentKey,
      stages_completed: completedStages,
      status: currentStepIndex >= stages.length ? 'completed' : 'in_progress',
      progressPercent,
      currentMessage: messages[currentKey] || 'Processing...',
    };
  },

  saveSession(session: SessionRecord) {
    const current = getStoredSessions();
    const idx = current.findIndex((s) => s.session_id === session.session_id);
    if (idx >= 0) {
      current[idx] = session;
    } else {
      current.unshift(session);
    }
    saveStoredSessions(current);
  },
};
