import { PipelineStageKey } from '../types';

export const PIPELINE_STAGES: { key: PipelineStageKey; label: string; description: string }[] = [
  {
    key: 'ingestion',
    label: 'Extracting Text & Ingesting Documents',
    description: 'Parsing multi-format files, stripping OCR noise, and structuring raw text chunks.',
  },
  {
    key: 'terminology_normalization',
    label: 'Normalizing Terminology Across Sources',
    description: 'Resolving synonymous academic jargon, acronyms, and varying notations into unified canonical concepts.',
  },
  {
    key: 'salience_ranking',
    label: 'Ranking Content by Exam Importance',
    description: 'Evaluating frequency across syllabi, past exam patterns, and conceptual prerequisites.',
  },
  {
    key: 'generation',
    label: 'Generating Unified, Source-Attributed Notes',
    description: 'Synthesizing coherent explanations and condensed revision bullets with inline citation badges.',
  },
  {
    key: 'faithfulness_verification',
    label: 'Verifying Faithfulness of Every Claim',
    description: 'NLI-grounding check cross-referencing each generated statement against the ingested source texts.',
  },
];

export const MOCK_PRESET_SESSIONS = [
  {
    topicId: 'gradient-descent',
    title: 'Gradient Descent Optimization',
    category: 'Machine Learning & Mathematics',
    sources: [
      { source_id: 'S1', filename: 'ml_textbook_ch4_optimization.pdf', size: 3240000, type: 'pdf', status: 'ready', wordCount: 8400, contributionPercent: 42 },
      { source_id: 'S2', filename: 'mit_lecture_gradient_methods.pdf', size: 980000, type: 'pdf', status: 'ready', wordCount: 4200, contributionPercent: 33 },
      { source_id: 'S3', filename: 'cs229_optimization_slides.pdf', size: 1450000, type: 'pdf', status: 'ready', wordCount: 2900, contributionPercent: 25 },
    ],
  },
  {
    topicId: 'cell-division',
    title: 'Cell Division: Mitosis & Meiosis',
    category: 'Cellular Biology',
    sources: [
      { source_id: 'S1', filename: 'campbell_biology_ch12_cell_cycle.pdf', size: 4120000, type: 'pdf', status: 'ready', wordCount: 9500, contributionPercent: 45 },
      { source_id: 'S2', filename: 'medical_genetics_lecture_notes.pdf', size: 1200000, type: 'pdf', status: 'ready', wordCount: 5100, contributionPercent: 35 },
      { source_id: 'S3', filename: 'meiosis_cytogenetics_summary.txt', size: 240000, type: 'txt', status: 'ready', wordCount: 2200, contributionPercent: 20 },
    ],
  },
  {
    topicId: 'indian-polity',
    title: 'Indian Polity: Fundamental Rights & Judicial Review',
    category: 'Public Administration & Law',
    sources: [
      { source_id: 'S1', filename: 'laxmikanth_constitution_part3.pdf', size: 5400000, type: 'pdf', status: 'ready', wordCount: 14200, contributionPercent: 48 },
      { source_id: 'S2', filename: 'supreme_court_landmark_cases.pdf', size: 2100000, type: 'pdf', status: 'ready', wordCount: 6800, contributionPercent: 32 },
      { source_id: 'S3', filename: 'governance_prelims_revision.txt', size: 380000, type: 'txt', status: 'ready', wordCount: 3900, contributionPercent: 20 },
    ],
  },
  {
    topicId: 'thermodynamics',
    title: 'Laws of Thermodynamics & Entropy',
    category: 'Thermal Physics',
    sources: [
      { source_id: 'S1', filename: 'callen_thermodynamics_principles.pdf', size: 3800000, type: 'pdf', status: 'ready', wordCount: 7600, contributionPercent: 55 },
      { source_id: 'S2', filename: 'mit_8044_statistical_thermo.pdf', size: 1900000, type: 'pdf', status: 'ready', wordCount: 4900, contributionPercent: 45 },
    ],
  },
  {
    topicId: 'modern-history',
    title: 'Indian National Movement (1885-1947)',
    category: 'Modern History',
    sources: [
      { source_id: 'S1', filename: 'spectrum_modern_india_freedom_struggle.pdf', size: 4800000, type: 'pdf', status: 'ready', wordCount: 12100, contributionPercent: 50 },
      { source_id: 'S2', filename: 'bipan_chandra_national_movement.pdf', size: 3200000, type: 'pdf', status: 'ready', wordCount: 8800, contributionPercent: 30 },
      { source_id: 'S3', filename: 'ncert_history_themes3.pdf', size: 1750000, type: 'pdf', status: 'ready', wordCount: 4500, contributionPercent: 20 },
    ],
  },
];
