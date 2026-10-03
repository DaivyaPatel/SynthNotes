import React from 'react';
import { useSession } from '../context/SessionContext';
import {
  Upload,
  Play,
  BookOpen,
  Layers,
  CheckCircle2,
  FileText,
  Zap,
  Users,
  MoreHorizontal,
  Link2,
  ArrowRight,
} from 'lucide-react';

export const Home: React.FC = () => {
  const {
    sessions,
    selectSession,
    setActiveNav,
    createSessionWithFiles,
    validateSources,
    searchQuery,
  } = useSession();



  const handleOpenNote = async (sessionId: string) => {
    await selectSession(sessionId);
    setActiveNav('notes');
  };

  const filteredSessions = sessions.filter((s) =>
    searchQuery ? s.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="w-full space-y-9 pb-12 font-sans select-none">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9]/60 to-[#E0E7FF]/20 border border-[#E2E8F0]/80 p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-bold tracking-widest text-[#64748B] uppercase inline-block font-mono">
              STUDY SMARTER WITH AI
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Multiple Resources. <br />
              <span className="text-[#4338CA]">One Exam-Ready Note.</span>
            </h1>

            <p className="text-[13px] sm:text-sm text-[#475569] max-w-lg leading-relaxed">
              Upload your books, notes, PDFs or links - our NLP engine synthesizes them into a clear, structured and exam-focused note.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveNav('upload')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4338CA] text-white font-semibold text-[13px] hover:bg-[#3730A3] transition-colors shadow-xs cursor-pointer"
              >
                <Upload className="w-4 h-4 stroke-[2.2]" />
                <span>Upload Materials</span>
                <span className="text-base leading-none ml-0.5">→</span>
              </button>
            </div>
          </div>

          {/* Hero Right Visual Diagram matching the screenshot */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* The floating hand-drawn callout at top right */}
            <div className="absolute -top-7 right-2 sm:right-6 z-20 text-right">
              <span className="font-handwriting text-[19px] sm:text-[21px] text-[#334155] font-bold rotate-[-6deg] block leading-tight">
                Different sources. <br />
                One clear note!
              </span>
              <svg className="w-6 h-6 ml-auto mr-4 text-[#64748B] -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2C6.5 4 4 10 5 18M5 18L2 14M5 18L9 16" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="relative w-full max-w-sm flex items-center justify-between gap-3 pt-4">
              {/* Stack of sources */}
              <div className="flex flex-col gap-2 relative z-10">
                <div className="px-3.5 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-[11px] font-semibold shadow-xs">
                  Textbooks
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[11px] font-semibold shadow-xs -ml-2">
                  Notes
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[11px] font-semibold shadow-xs">
                  PPTs
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] text-[11px] font-semibold shadow-xs -ml-1">
                  Web Articles
                </div>
              </div>

              {/* Central synthesis connector */}
              <div className="flex items-center gap-2 relative z-10 shrink-0">
                {/* Purple Brain Icon */}
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E0E7FF] text-[#4F46E5] flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M11 6C8.2 6 6 8.2 6 11c0 .9.2 1.7.6 2.4-.9 1-1.6 2.4-1.6 3.9 0 2.1 1.2 3.9 2.9 4.8.1 1.7 1.4 3 3.1 3 .5 0 1-.1 1.4-.4.8.8 1.9 1.3 3.2 1.3V6c-1.7 0-3.2.9-4 2.3-.2-.2-.4-.4-.6-.6V6z"
                      stroke="#4F46E5"
                      strokeWidth="2"
                    />
                    <path
                      d="M21 6c2.8 0 5 2.2 5 5 0 .9-.2 1.7-.6 2.4.9 1 1.6 2.4 1.6 3.9 0 2.1-1.2 3.9-2.9 4.8-.1 1.7-1.4 3-3.1 3-.5 0-1-.1-1.4-.4-.8.8-1.9 1.3-3.2 1.3V6c1.7 0 3.2.9 4 2.3.2-.2.4-.4.6-.6V6z"
                      stroke="#4F46E5"
                      strokeWidth="2"
                    />
                    <circle cx="11" cy="12" r="1.5" fill="#4F46E5" />
                    <circle cx="21" cy="12" r="1.5" fill="#4F46E5" />
                  </svg>
                </div>
                <span className="text-[#4338CA] text-xl font-bold">→</span>
              </div>

              {/* Output Exam-Ready Note mockup */}
              <div className="w-36 bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-3 relative z-10 space-y-2">
                <span className="text-[10px] font-bold text-[#0F172A] block leading-tight">
                  Your Exam-Ready Note
                </span>
                <div className="space-y-1.5 pt-0.5">
                  <div className="h-1.5 bg-[#E2E8F0] rounded w-full" />
                  <div className="h-1.5 bg-[#E2E8F0] rounded w-5/6" />
                  <div className="h-1.5 bg-[#C7D2FE] rounded w-full" />
                  <div className="h-1.5 bg-[#E2E8F0] rounded w-4/6" />
                  <div className="h-1.5 bg-[#E2E8F0] rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Feature highlights row - 6 columns */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0]/70 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-2">
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1E293B]">Terminology Normalization</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center mb-2">
              <Layers className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1E293B]">Multi-Source Synthesis</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mb-2">
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1E293B]">Source Attribution</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-2">
              <FileText className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1E293B]">Exam-Focused Notes</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mb-2">
              <Zap className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1E293B]">Saves Time</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center mb-2">
              <Users className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1E293B]">For All Competitive Exams</span>
          </div>
        </div>
      </section>

      {/* 3. Lower Dual-Column Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column (7 cols): Upload Your Study Materials */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <h3 className="text-base font-bold text-[#0F172A]">
              Upload Your Study Materials
            </h3>
            <button
              onClick={() => setActiveNav('upload')}
              className="inline-flex items-center gap-1.5 text-xs text-[#4F46E5] font-semibold hover:underline cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Add from URL</span>
            </button>
          </div>

          {/* Dotted Upload Zone */}
          <div
            onClick={() => setActiveNav('upload')}
            className="w-full border-2 border-dashed border-[#CBD5E1] rounded-2xl py-10 px-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#4F46E5] hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="w-12 h-12 rounded-full text-[#4F46E5] flex items-center justify-center mb-3">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#0F172A]">
              Drag &amp; drop files here
            </p>
            <p className="text-xs text-[#4F46E5] font-medium mt-0.5">
              or click to browse
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-3">
              Supported formats: PDF, PPT, DOCX, TXT (Max 100 MB each)
            </p>
          </div>
        </div>

        {/* Right Column (5 cols): Recent Notes */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4 relative">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <h3 className="text-base font-bold text-[#0F172A]">Recent Notes</h3>
            <button
              onClick={() => setActiveNav('history')}
              className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <span className="text-sm leading-none">→</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredSessions.length > 0 ? (
              filteredSessions.slice(0, 5).map((session) => {
                const status = session.notes ? 'Completed' : 'Processing';
                const statusColor = status === 'Completed' ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#EFF6FF] text-[#2563EB]';
                
                return (
                  <div
                    key={session.session_id}
                    onClick={() => handleOpenNote(session.session_id)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-8 h-8 rounded-lg ${statusColor} flex items-center justify-center shrink-0`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#0F172A] truncate group-hover:text-[#4F46E5]">
                          {session.title}
                        </p>
                        <p className="text-[11px] text-[#94A3B8]">
                          {session.sources?.length || 0} sources • {new Date(session.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusColor}`}>
                        {status}
                      </span>
                      <MoreHorizontal className="w-4 h-4 text-[#94A3B8]" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-[#94A3B8]">
                No recent notes found. Upload some study materials to get started!
              </div>
            )}
          </div>

          {/* Hand-drawn study slogan at the bottom right */}
          <div className="pt-3 flex justify-end">
            <span className="font-handwriting text-base text-[#64748B] font-bold rotate-[-3deg] text-right block leading-tight">
              Study <br />
              Plan <br />
              Achieve <br />
              Repeat ⤴
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
