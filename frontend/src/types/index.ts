export interface StudySource {
  source_id: string; // e.g. "S1", "S2", "S3"
  filename: string;
  size: number; // bytes
  type: string; // "pdf" | "txt" | "ppt" | "docx"
  status: 'ready' | 'validating' | 'error';
  errorMessage?: string;
  wordCount?: number;
  snippet?: string;
  contributionPercent?: number; // e.g. 42
}

export interface ValidationResult {
  valid: boolean;
  topic_overlap_score: number; // 0.0 - 1.0 (e.g. 0.91 or 0.38)
  status: 'valid' | 'low_overlap' | 'extraction_failure';
  message: string;
  failed_files?: string[];
  detectedTopic?: string;
  keySharedTerms?: string[];
}

export type PipelineStageKey =
  | 'ingestion'
  | 'terminology_normalization'
  | 'salience_ranking'
  | 'generation'
  | 'faithfulness_verification';

export interface PipelineStageInfo {
  key: PipelineStageKey;
  label: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

export interface PipelineStatusResponse {
  stage: PipelineStageKey;
  stages_completed: PipelineStageKey[];
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  progressPercent: number;
  currentMessage: string;
}

export interface DetailedStatement {
  id: string;
  text: string;
  source_ids: string[];
  faithfulness_score?: number; // e.g. 0.96
  isFlagged?: boolean;
}

export interface DetailedSection {
  heading: string;
  statements: DetailedStatement[];
}

export interface BulletNoteItem {
  id: string;
  label: string; // e.g. "Definition", "Core Mechanics", "Key Algorithms"
  text: string;
  source_ids: string[];
  importance: 'high' | 'medium' | 'critical';
}

export interface TermVariant {
  term: string;
  source_id: string;
  frequency?: number;
}

export interface TerminologyMapItem {
  id: string;
  canonical: string;
  definition?: string;
  variants: TermVariant[];
}

export interface FlaggedStatement {
  id: string;
  statement: string;
  source_ids: string[];
  faithfulness_score: number; // e.g. 0.42
  verdict: 'neutral' | 'unsupported' | 'contradiction';
  issue: string;
  suggestedCorrection?: string;
  status?: 'pending' | 'regenerated' | 'removed' | 'kept';
}

export interface FaithfulnessReportData {
  overall_score: number; // 0.0 - 1.0 (e.g. 0.94)
  total_statements: number;
  verified_statements: number;
  flagged_count: number;
  reliability_tier: 'Highly Reliable' | 'Moderate' | 'Needs Attention';
  flagged_statements: FlaggedStatement[];
}

export interface SourceContribution {
  source_id: string;
  filename: string;
  percentage: number;
  statementCount: number;
}

export interface NotesData {
  session_id: string;
  topic_title: string;
  subject_category: string;
  created_at: string;
  detailed_sections: DetailedSection[];
  bullet_notes: BulletNoteItem[];
  terminology_map: TerminologyMapItem[];
  faithfulness: FaithfulnessReportData;
  source_contributions: SourceContribution[];
}

export type QuizQuestionType = 'mcq' | 'fill_in_the_blank' | 'short_answer' | 'long_answer';

export interface QuizQuestionBase {
  id: string;
  type: QuizQuestionType;
  question: string;
  source_reference?: string;
}

export interface MCQQuestionData extends QuizQuestionBase {
  type: 'mcq';
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface FillInTheBlankQuestionData extends QuizQuestionBase {
  type: 'fill_in_the_blank';
  prefixText?: string;
  suffixText?: string;
  correct_answer: string;
  acceptable_alternatives?: string[];
  explanation: string;
}

export interface ShortAnswerQuestionData extends QuizQuestionBase {
  type: 'short_answer';
  sample_answer: string;
  key_points: string[];
  explanation: string;
}

export interface LongAnswerQuestionData extends QuizQuestionBase {
  type: 'long_answer';
  sample_answer: string;
  rubric_criteria: { criterion: string; weight: number }[];
  explanation: string;
}

export type QuizQuestion =
  | MCQQuestionData
  | FillInTheBlankQuestionData
  | ShortAnswerQuestionData
  | LongAnswerQuestionData;

export interface UserQuizAnswer {
  questionId: string;
  userResponse: string;
  isCorrect?: boolean;
  scorePercent?: number;
  feedback?: string;
}

export interface SessionRecord {
  session_id: string;
  user_id?: string;
  title: string;
  sources: StudySource[];
  validation: ValidationResult;
  notes?: NotesData;
  quiz?: QuizQuestion[];
  created_at: string;
  status: 'uploaded' | 'validated' | 'processing' | 'completed' | 'error';
  faithfulness_score?: number;
}
