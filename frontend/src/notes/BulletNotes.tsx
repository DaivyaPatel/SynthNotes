import React from 'react';
import { BulletNoteItem } from '../types';
import { SourceBadge } from '../components/SourceBadge';
import { Sparkles, Bookmark, Flame } from 'lucide-react';

interface BulletNotesProps {
  bulletNotes: BulletNoteItem[];
}

export const BulletNotes: React.FC<BulletNotesProps> = ({ bulletNotes }) => {
  if (!bulletNotes || bulletNotes.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-[#8A94A6]">
        No revision bullet notes available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-[#EDF1EF]/60 border border-[#5B7C73]/20 flex items-center justify-between text-xs text-[#5B7C73]">
        <span className="font-semibold flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5" />
          Exam-Ready Revision Condensed Bullets
        </span>
        <span className="text-[#8A94A6]">All claims source-grounded</span>
      </div>

      <div className="grid gap-3">
        {bulletNotes.map((item, idx) => {
          const isCritical = item.importance === 'critical';

          return (
            <div
              key={item.id || idx}
              className={`p-4 rounded-xl border transition-all duration-150 ${
                isCritical
                  ? 'bg-amber-50/40 border-amber-200/80'
                  : 'bg-white border-[#E4E7E2] hover:border-[#D0D5DD]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {isCritical ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-amber-100 text-[#D6A34B]" title="High-Yield Exam Focus">
                      <Flame className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#5B7C73] inline-block mt-1.5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isCritical ? 'text-[#8C6016]' : 'text-[#5B7C73]'
                      }`}
                    >
                      {item.label}:
                    </span>
                    <span className="font-times text-base sm:text-[17px] font-normal text-[#1E293B] leading-relaxed">
                      {item.text}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      {item.source_ids.map((sId) => (
                        <SourceBadge key={sId} sourceId={sId} />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
