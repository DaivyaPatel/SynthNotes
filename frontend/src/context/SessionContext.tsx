import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  NotesData,
  PipelineStageKey,
  QuizQuestion,
  SessionRecord,
  StudySource,
  ValidationResult,
} from '../types';
import { sessionApi } from '../services/sessionApi';
import { notesApi } from '../services/notesApi';
import { quizApi } from '../services/quizApi';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitial: string;
}

interface SessionContextType {
  sessions: SessionRecord[];
  currentSessionId: string | null;
  currentSession: SessionRecord | null;
  currentNotes: NotesData | null;
  currentQuiz: QuizQuestion[] | null;
  validationResult: ValidationResult | null;
  isValidating: boolean;
  isProcessing: boolean;
  pipelineStage: PipelineStageKey;
  completedStages: PipelineStageKey[];
  pipelineProgress: number;
  pipelineStatusMessage: string;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  loadSessions: () => Promise<void>;
  selectSession: (sessionId: string) => Promise<void>;
  createSessionWithFiles: (files: File[], title?: string) => Promise<string>;
  validateSources: (scenario?: 'valid' | 'low_overlap' | 'extraction_failure') => Promise<ValidationResult>;
  startProcessingPipeline: () => Promise<void>;
  updateFlaggedStatement: (flaggedId: string, action: 'regenerate' | 'remove' | 'keep') => Promise<void>;
  loadQuizForCurrentSession: () => Promise<void>;
  resetToUpload: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Multi-Account Management
  currentUser: { id: string; username: string } | null;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  loginUser: (id: string, username: string) => void;
  logoutUser: () => void;
}

const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'acc_rohan',
    name: 'Rohan Satkar',
    email: 'rohansatkar04.sphs@gmail.com',
    role: 'Student Mode',
    avatarInitial: 'R',
  },
  {
    id: 'acc_alex',
    name: 'Alex Johnson',
    email: 'alex.j@mit.edu',
    role: 'Researcher Mode',
    avatarInitial: 'A',
  },
  {
    id: 'acc_priya',
    name: 'Priya Sharma',
    email: 'priya.exam@gate.ac.in',
    role: 'GATE Aspirant',
    avatarInitial: 'P',
  },
];

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<SessionRecord | null>(null);
  const [currentNotes, setCurrentNotes] = useState<NotesData | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[] | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<PipelineStageKey>('ingestion');
  const [completedStages, setCompletedStages] = useState<PipelineStageKey[]>([]);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [pipelineStatusMessage, setPipelineStatusMessage] = useState('');
  const [activeNav, setActiveNav] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(true);

  const loadSessions = async () => {
    const list = await sessionApi.getSessions();
    setSessions(list);
    if (!currentSessionId && list.length > 0) {
      setCurrentSessionId(list[0].session_id);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (currentSessionId) {
      sessionApi.getSession(currentSessionId).then((sess) => {
        if (sess) {
          setCurrentSession(sess);
          if (sess.notes) {
            setCurrentNotes(sess.notes);
          } else {
            notesApi.getNotes(sess.session_id).then(setCurrentNotes);
          }
          if (sess.quiz) {
            setCurrentQuiz(sess.quiz);
          }
        }
      });
    }
  }, [currentSessionId]);

  const selectSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const sess = await sessionApi.getSession(sessionId);
    if (sess) {
      setCurrentSession(sess);
      setValidationResult(sess.validation);
      const notes = await notesApi.getNotes(sessionId);
      setCurrentNotes(notes);
      const quiz = await quizApi.getOrGenerateQuiz(sessionId);
      setCurrentQuiz(quiz);
    }
  };

  const createSessionWithFiles = async (
    files: File[],
    title?: string
  ): Promise<string> => {
    const res = await sessionApi.createSession(files, title);
    await loadSessions();
    setCurrentSessionId(res.session_id);
    const sess = await sessionApi.getSession(res.session_id);
    if (sess) {
      setCurrentSession(sess);
      setValidationResult(sess.validation);
    }
    return res.session_id;
  };

  const validateSources = async (
    scenario?: 'valid' | 'low_overlap' | 'extraction_failure'
  ): Promise<ValidationResult> => {
    if (!currentSessionId) throw new Error('No active session to validate');
    setIsValidating(true);
    try {
      const res = await sessionApi.validateSources(currentSessionId, scenario);
      setValidationResult(res);
      await loadSessions();
      return res;
    } finally {
      setIsValidating(false);
    }
  };

  const startProcessingPipeline = async () => {
    if (!currentSessionId) return;
    setIsProcessing(true);
    setPipelineProgress(5);
    setCompletedStages([]);

    try {
      await sessionApi.triggerPipeline(currentSessionId);

      let isDone = false;
      while (!isDone) {
        const statusRes = await sessionApi.getPipelineStatus(currentSessionId);
        
        setPipelineStage(statusRes.stage);
        setCompletedStages(statusRes.stages_completed);
        setPipelineProgress(statusRes.progressPercent);
        setPipelineStatusMessage(statusRes.currentMessage);

        if (statusRes.status === 'completed' || statusRes.status === 'failed') {
          isDone = true;
          if (statusRes.status === 'failed') {
            console.error("Pipeline failed on backend");
            setPipelineStatusMessage(`ERROR: Pipeline failed. Check your document size or API keys. (Backend says: Failed)`);
            // Do not set isProcessing(false) here so the user can read the error!
            return;
          }
        } else {
          await new Promise((r) => setTimeout(r, 1000)); // Poll every 1s
        }
      }

      // We will leave the mocked notes and quiz fetching intact for now until T-18 and T-19
      const notes = await notesApi.getNotes(currentSessionId);
      setCurrentNotes(notes);
      const quiz = await quizApi.getOrGenerateQuiz(currentSessionId);
      setCurrentQuiz(quiz);

      if (currentSession) {
        currentSession.status = 'completed';
        currentSession.notes = notes;
        currentSession.quiz = quiz;
        currentSession.faithfulness_score = notes.faithfulness?.overall_score || 0;
        sessionApi.saveSession(currentSession);
      }
      setActiveNav('notes');
      setIsProcessing(false); // Set it here when successfully done
    } catch (e) {
      console.error("Pipeline error:", e);
      setPipelineStatusMessage("Error: Pipeline processing failed.");
    } finally {
      // Do NOT call setIsProcessing(false) here, otherwise errors are silently hidden
      await loadSessions();
    }
  };

  const updateFlaggedStatement = async (
    flaggedId: string,
    action: 'regenerate' | 'remove' | 'keep'
  ) => {
    if (!currentSessionId) return;
    const updated = await notesApi.updateFlaggedStatement(currentSessionId, flaggedId, action);
    setCurrentNotes({ ...updated });
    await loadSessions();
  };

  const loadQuizForCurrentSession = async () => {
    if (!currentSessionId) return;
    const questions = await quizApi.getOrGenerateQuiz(currentSessionId);
    setCurrentQuiz(questions);
  };

  const resetToUpload = () => {
    setValidationResult(null);
    setCompletedStages([]);
    setPipelineProgress(0);
    setActiveNav('upload');
  };

  const loginUser = (id: string, username: string) => {
    setCurrentUser({ id, username });
    sessionStorage.setItem('synthnotes_user_id', id);
    sessionStorage.setItem('synthnotes_username', username);
    setIsAccountModalOpen(false);
    loadSessions(); // Reload sessions for this new user
  };

  const logoutUser = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('synthnotes_user_id');
    sessionStorage.removeItem('synthnotes_username');
    setSessions([]);
    setCurrentSessionId(null);
    setIsAccountModalOpen(true);
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        currentSessionId,
        currentSession,
        currentNotes,
        currentQuiz,
        validationResult,
        isValidating,
        isProcessing,
        pipelineStage,
        completedStages,
        pipelineProgress,
        pipelineStatusMessage,
        activeNav,
        setActiveNav,
        loadSessions,
        selectSession,
        createSessionWithFiles,
        validateSources,
        startProcessingPipeline,
        updateFlaggedStatement,
        loadQuizForCurrentSession,
        resetToUpload,
        searchQuery,
        setSearchQuery,
        currentUser,
        isAccountModalOpen,
        setIsAccountModalOpen,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
