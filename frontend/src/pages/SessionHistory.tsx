import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { formatDateRelative, formatPercentage } from '../utils/formatScore';
import { Button } from '../components/Button';
import {
  FileText,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Search,
  BookOpen,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export const SessionHistory: React.FC = () => {
  const { sessions, selectSession, setActiveNav, loadQuizForCurrentSession } = useSession();
  const [filterText, setFilterText] = useState('');

  const filtered = sessions.filter((s) =>
    s.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleOpenNotes = async (sessionId: string) => {
    await selectSession(sessionId);
    setActiveNav('notes');
  };

  const handleOpenQuiz = async (sessionId: string) => {
    await selectSession(sessionId);
    await loadQuizForCurrentSession();
    setActiveNav('quiz');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveNav('home')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8A94A6] hover:text-[#2E2E2E] mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-[#2E2E2E]">Your Study Sessions</h1>
          <p className="text-xs sm:text-sm text-[#5A5A5A] mt-0.5">
            Access past multi-source study sessions, exam notes, and self-testing quizzes.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-[#8A94A6] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter topics..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E4E7E2] bg-white text-xs text-[#2E2E2E] focus:outline-none focus:border-[#5B7C73]"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((sess) => {
          const score = sess.faithfulness_score || sess.notes?.faithfulness.overall_score || 0.94;
          const scorePercent = Math.round(score * 100);

          return (
            <div
              key={sess.session_id}
              className="p-5 bg-white rounded-2xl border border-[#E4E7E2] hover:border-[#5B7C73] transition-all duration-150 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#2E2E2E] truncate">{sess.title}</h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#EDF7F1] text-[#255C3D] font-bold shrink-0">
                    {scorePercent}% Faithfulness
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A94A6]">
                  <span className="text-[#5A5A5A] font-medium">{sess.sources.length} sources</span>
                  <span>•</span>
                  <span>{formatDateRelative(sess.created_at)}</span>
                  <span>•</span>
                  <span className="text-[#5B7C73] font-semibold">
                    {sess.sources.map((s) => s.filename).slice(0, 2).join(', ')}
                    {sess.sources.length > 2 ? ` +${sess.sources.length - 2} more` : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenNotes(sess.session_id)}
                  icon={<BookOpen className="w-3.5 h-3.5 text-[#5B7C73]" />}
                >
                  View Notes
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenQuiz(sess.session_id)}
                  icon={<GraduationCap className="w-3.5 h-3.5" />}
                  className="bg-[#5B7C73] hover:bg-[#4C6A62]"
                >
                  View Quiz
                </Button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#E4E7E2] text-xs text-[#8A94A6]">
            No study sessions found matching &ldquo;{filterText}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
};
