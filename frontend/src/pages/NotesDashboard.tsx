import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { FaithfulnessScoreCard } from '../notes/FaithfulnessScoreCard';
import { NotesTabs } from '../notes/NotesTabs';
import { DetailedExplanation } from '../notes/DetailedExplanation';
import { BulletNotes } from '../notes/BulletNotes';
import { TerminologyMap } from '../notes/TerminologyMap';
import { FaithfulnessReport } from '../notes/FaithfulnessReport';
import { Button } from '../components/Button';
import { exportNotesToPDF } from '../utils/pdfExport';
import {
  GraduationCap,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  BookOpen,
  ArrowLeft,
  FileText,
  Printer,
  Check,
  FileDown,
  Layers,
  X,
} from 'lucide-react';

export const NotesDashboard: React.FC = () => {
  const { currentNotes, currentSession, setActiveNav, loadQuizForCurrentSession } = useSession();
  const [activeTab, setActiveTab] = useState<'detailed' | 'bullet'>('detailed');
  const [showExportModal, setShowExportModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'markdown' | 'txt'>('pdf');

  if (!currentNotes) {
    return (
      <div className="bg-white rounded-2xl border border-[#E4E7E2] p-8 text-center max-w-lg mx-auto my-12 space-y-4">
        <FileText className="w-10 h-10 text-[#8A94A6] mx-auto" />
        <h3 className="text-base font-bold text-[#2E2E2E]">No Notes Loaded</h3>
        <p className="text-xs text-[#5A5A5A]">
          Please upload and merge study sources to synthesize unified notes.
        </p>
        <Button variant="primary" size="sm" onClick={() => setActiveNav('upload')}>
          Upload Study Sources
        </Button>
      </div>
    );
  }

  const handleStartQuiz = async () => {
    await loadQuizForCurrentSession();
    setActiveNav('quiz');
  };

  const handleScrollToFlagged = () => {
    const el = document.getElementById('flagged-statements-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Safe file export download that produces genuine PDF or plain text / markdown files
  const handleExportDownload = () => {
    if (downloadFormat === 'pdf') {
      try {
        exportNotesToPDF(currentNotes);
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          setShowExportModal(false);
        }, 2000);
        return;
      } catch (err) {
        console.error('PDF export failed, falling back to document export', err);
      }
    }

    const title = currentNotes.topic_title || 'Study_Notes';
    const filename = `${title.toLowerCase().replace(/\s+/g, '_')}_notes.${downloadFormat === 'markdown' ? 'md' : 'txt'}`;

    let content = `# ${currentNotes.topic_title}\n\nSubject Category: ${currentNotes.subject_category || 'Unified Study Note'}\nFaithfulness Score: ${Math.round(currentNotes.faithfulness.overall_score * 100)}%\n\n`;

    content += `## 1. DETAILED EXPLANATION\n\n`;
    currentNotes.detailed_sections.forEach((sec) => {
      content += `### ${sec.heading}\n`;
      sec.statements.forEach((stmt) => {
        content += `${stmt.text} [${stmt.source_ids.join(', ')}]\n`;
      });
      content += `\n`;
    });

    content += `## 2. REVISION BULLET NOTES\n\n`;
    currentNotes.bullet_notes.forEach((b) => {
      content += `- [${b.label}] ${b.text} (${b.source_ids.join(', ')})\n`;
    });

    content += `\n## 3. TERMINOLOGY NORMALIZATION\n\n`;
    currentNotes.terminology_map.forEach((t) => {
      content += `- ${t.canonical}: ${t.definition || ''}\n`;
      t.variants.forEach((v) => {
        content += `  * Variant "${v.term}" in [${v.source_id}]\n`;
      });
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowExportModal(false);
    }, 2000);
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // If window.print is restricted by iframe sandbox, open export modal directly
      setShowExportModal(true);
    }
  };

  return (
    <div className="w-full space-y-6 pb-16 font-sans">
      {/* Top Header & Breadcrumb Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveNav('home')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8A94A6] hover:text-[#2E2E2E] mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#2E2E2E]">
              {currentNotes.topic_title}
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#EDF1EF] text-[#5B7C73] font-semibold">
              {currentNotes.subject_category || 'Unified Study Note'}
            </span>
          </div>
          <p className="text-xs text-[#5A5A5A] mt-0.5">
            Synthesized across {currentNotes.source_contributions.length} validated learning resources
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Print / Save button opens interactive save modal */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
            icon={<Printer className="w-3.5 h-3.5" />}
          >
            Print / Save
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleStartQuiz}
            icon={<GraduationCap className="w-4 h-4" />}
            iconPosition="right"
            className="bg-[#5B7C73] hover:bg-[#4C6A62]"
          >
            Generate Quiz From Notes
          </Button>
        </div>
      </div>

      {/* 1. Overall Faithfulness Score Card matching Section 11 & 12 */}
      <FaithfulnessScoreCard
        faithfulness={currentNotes.faithfulness}
        onScrollToFlagged={handleScrollToFlagged}
      />

      {/* 2. Main Study Content Area */}
      <div className="bg-white rounded-2xl border border-[#E4E7E2] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Dual-View Toggle Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E7E2]">
          <NotesTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex items-center gap-2 text-xs text-[#8A94A6]">
            <span>Click any citation</span>
            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#EDF1EF] text-[#5B7C73] font-bold">
              [S1]
            </span>
            <span>to view original source file</span>
          </div>
        </div>

        {/* Notes Content Display */}
        {activeTab === 'detailed' ? (
          <DetailedExplanation sections={currentNotes.detailed_sections} />
        ) : (
          <BulletNotes bulletNotes={currentNotes.bullet_notes} />
        )}
      </div>

      {/* 3. Terminology Normalization Map (Collapsible) matching Section 13 */}
      <TerminologyMap items={currentNotes.terminology_map} />

      {/* 4. Source Contribution & Flagged for Review Breakdown matching Section 14, 15, 16 */}
      <FaithfulnessReport
        faithfulness={currentNotes.faithfulness}
        sourceContributions={currentNotes.source_contributions}
      />

      {/* Interactive Print & Save Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#E2E8F0] shadow-2xl overflow-hidden font-sans p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EDF1EF] text-[#5B7C73] flex items-center justify-center font-bold">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Print / Save Notes</h3>
                  <p className="text-[11px] text-[#64748B]">Export your exam-ready study notes</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <span className="font-semibold text-[#334155] block">
                Select Export / Save Method:
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDownloadFormat('pdf')}
                  className={`p-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                    downloadFormat === 'pdf'
                      ? 'border-[#5B7C73] bg-[#EDF1EF] text-[#5B7C73]'
                      : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]'
                  }`}
                >
                  <FileText className="w-4 h-4 mx-auto mb-1 text-[#5B7C73]" />
                  <span>PDF (.pdf)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDownloadFormat('markdown')}
                  className={`p-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                    downloadFormat === 'markdown'
                      ? 'border-[#5B7C73] bg-[#EDF1EF] text-[#5B7C73]'
                      : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 mx-auto mb-1 text-[#5B7C73]" />
                  <span>Markdown (.md)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDownloadFormat('txt')}
                  className={`p-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                    downloadFormat === 'txt'
                      ? 'border-[#5B7C73] bg-[#EDF1EF] text-[#5B7C73]'
                      : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]'
                  }`}
                >
                  <FileDown className="w-4 h-4 mx-auto mb-1 text-[#5B7C73]" />
                  <span>Plain Text</span>
                </button>
              </div>

              <div className="p-3 bg-[#F8F9F7] rounded-xl border border-[#E4E7E2] text-[11px] text-[#5A5A5A] space-y-1">
                <span className="font-semibold text-[#2E2E2E] block">Export Includes:</span>
                <p>✓ All synthesized detailed explanations with [S1][S2] source markers</p>
                <p>✓ Exam revision bullet checkpoints</p>
                <p>✓ Terminology normalization map and variant matrix</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 text-xs font-semibold text-[#5A5A5A] hover:text-[#2E2E2E] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                Browser Print Window
              </button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleExportDownload}
                icon={savedSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                className="bg-[#5B7C73] hover:bg-[#4C6A62]"
              >
                {savedSuccess ? 'Downloaded!' : 'Download & Save File'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
