import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  GraduationCap,
  Sliders,
  Check,
  Save,
  BookOpen,
  Target,
  FileCheck,
  UserCheck,
  Award,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/Button';

export const SettingsPage: React.FC = () => {
  const { currentUser } = useSession();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'synthesis' | 'curricula' | 'grounding' | 'profile'>('synthesis');

  // Settings State
  const [examType, setExamType] = useState('Competitive Graduate / GATE / GRE / CS');
  const [depthMode, setDepthMode] = useState<'concise' | 'balanced' | 'comprehensive'>('balanced');
  const [targetScoreGoal, setTargetScoreGoal] = useState('95th Percentile / Top Rank');
  const [activeCurriculumYear, setActiveCurriculumYear] = useState('2026 Latest Pattern');

  // Faithfulness & Grounding State
  const [faithfulnessThreshold, setFaithfulnessThreshold] = useState(85);
  const [citationFormat, setCitationFormat] = useState<'inline' | 'footnote' | 'compact'>('inline');
  const [autoFlagging, setAutoFlagging] = useState(true);
  const [crossSourceCheck, setCrossSourceCheck] = useState(true);

  // Student Profile State
  const [studentName, setStudentName] = useState(currentUser?.username || '');
  const [studentEmail, setStudentEmail] = useState('');
  const [studyProgram, setStudyProgram] = useState('Computer Science & Machine Learning');
  const [studentModeEnabled, setStudentModeEnabled] = useState(true);
  const [examReminders, setExamReminders] = useState(true);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20 font-sans">
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-[#4F46E5]" />
            <span>Preferences &amp; Synthesis Configuration</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Customize AI NLP synthesis parameters, examination target criteria, and source-grounding thresholds.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          icon={saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          className="bg-[#4338CA] hover:bg-[#3730A3]"
        >
          {saveSuccess ? 'Preferences Saved!' : 'Save Preferences'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Interactive Category Navigation */}
        <div className="md:col-span-1 space-y-3">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-2.5 shadow-xs space-y-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('synthesis')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                activeTab === 'synthesis'
                  ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Synthesis &amp; NLP Rules</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('curricula')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                activeTab === 'curricula'
                  ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Target Exam Curricula</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('grounding')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                activeTab === 'grounding'
                  ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Faithfulness &amp; Grounding</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Student Profile</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] space-y-1">
            <span className="font-semibold text-[#0F172A] block">Tip for Exam Preps</span>
            <p className="leading-relaxed">
              {activeTab === 'synthesis' && 'Synthesis Depth controls the verbosity and mathematical rigor of unified notes.'}
              {activeTab === 'curricula' && 'Configuring your target curriculum aligns terminology normalization to past year exam papers.'}
              {activeTab === 'grounding' && 'Setting Faithfulness Threshold above 80% automatically highlights ambiguous professor notes and conflicting equations.'}
              {activeTab === 'profile' && 'Your profile settings customize the distraction-free mode across study sessions.'}
            </p>
          </div>
        </div>

        {/* Right Column: Dynamic Content Sections based on Active Tab */}
        <div className="md:col-span-2 space-y-5">
          {/* TAB 1: Synthesis & NLP Rules */}
          {activeTab === 'synthesis' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#4F46E5]" />
                  <span>NLP Synthesis &amp; Summarization Rules</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-[#334155] block mb-1.5">
                      Synthesis Depth Level:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['concise', 'balanced', 'comprehensive'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDepthMode(level)}
                          className={`p-3 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                            depthMode === level
                              ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] shadow-xs ring-1 ring-[#4F46E5]'
                              : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]'
                          }`}
                        >
                          <span className="block font-bold">{level}</span>
                          <span className="text-[10px] font-normal text-[#64748B] block mt-0.5">
                            {level === 'concise' ? 'Key bullets & formulas' : level === 'balanced' ? 'Standard exam note' : 'In-depth derivations'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#0F172A] block">
                        Cross-Document Discrepancy Resolution
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        Automatically build terminology normalization matrices across ingested sources.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCrossSourceCheck(!crossSourceCheck)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        crossSourceCheck ? 'bg-[#4F46E5]' : 'bg-[#CBD5E1]'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                          crossSourceCheck ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Target Exam Curricula */}
          {activeTab === 'curricula' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#4F46E5]" />
                  <span>Target Examination Focus &amp; Syllabus Benchmark</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-[#334155] block mb-1">
                      Active Examination Pattern:
                    </label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                    >
                      <option>Competitive Graduate / GATE / GRE / CS</option>
                      <option>University Semester End Finals (Detailed derivations)</option>
                      <option>Civil Services / UPSC Mains (Comparative analytical)</option>
                      <option>Medical &amp; Life Sciences Entrance (MCQ intensive)</option>
                      <option>Foundational High School Olympiad</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-[#334155] block mb-1">
                      Target Performance Goal:
                    </label>
                    <select
                      value={targetScoreGoal}
                      onChange={(e) => setTargetScoreGoal(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                    >
                      <option>95th Percentile / Top Rank (Maximum rigor)</option>
                      <option>High Passing / Grade A</option>
                      <option>Conceptual Revision &amp; Mastery</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-[#334155] block mb-1">
                      Curriculum Standard:
                    </label>
                    <input
                      type="text"
                      value={activeCurriculumYear}
                      onChange={(e) => setActiveCurriculumYear(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Faithfulness & Grounding */}
          {activeTab === 'grounding' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#16A34A]" />
                  <span>NLI Grounding &amp; Claim Citation Verification</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-[#334155]">
                        Minimum Confidence Threshold for Auto-Approval:
                      </span>
                      <span className="font-mono font-bold text-[#4F46E5] text-sm">
                        {faithfulnessThreshold}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="95"
                      value={faithfulnessThreshold}
                      onChange={(e) => setFaithfulnessThreshold(Number(e.target.value))}
                      className="w-full accent-[#4F46E5] cursor-pointer"
                    />
                    <span className="text-[11px] text-[#94A3B8]">
                      Statements evaluated below this threshold are routed to &quot;Needs Your Review&quot;.
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#0F172A] block">
                        Auto-flag Contradictory Textbook Claims
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        Detects when two professors or textbooks contradict each other.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoFlagging(!autoFlagging)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        autoFlagging ? 'bg-[#4F46E5]' : 'bg-[#CBD5E1]'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                          autoFlagging ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9]">
                    <label className="font-semibold text-[#334155] block mb-2">
                      Inline Citation Badge Style:
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="radio"
                          name="badgeStyle"
                          checked={citationFormat === 'inline'}
                          onChange={() => setCitationFormat('inline')}
                          className="text-[#4F46E5] focus:ring-[#4F46E5]"
                        />
                        <span>Bracketed Tags [S1][S2]</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="radio"
                          name="badgeStyle"
                          checked={citationFormat === 'footnote'}
                          onChange={() => setCitationFormat('footnote')}
                          className="text-[#4F46E5] focus:ring-[#4F46E5]"
                        />
                        <span>Superscript Footnotes ¹ ²</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Student Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#4F46E5]" />
                  <span>Active Student Account &amp; Preferences</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-[#334155] block mb-1">
                      Student Display Name:
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#334155] block mb-1">
                      Email Address:
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#334155] block mb-1">
                      Enrolled Study Subject / Major:
                    </label>
                    <input
                      type="text"
                      value={studyProgram}
                      onChange={(e) => setStudyProgram(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#0F172A] block">
                        Student Mode (SynthNotes Focus)
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        Hides complex developer debug logs and displays clean study flashcards and notes.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStudentModeEnabled(!studentModeEnabled)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        studentModeEnabled ? 'bg-[#4F46E5]' : 'bg-[#CBD5E1]'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                          studentModeEnabled ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
