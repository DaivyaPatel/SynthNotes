import React, { useState } from 'react';
import { TerminologyMapItem } from '../types';
import { useSession } from '../context/SessionContext';
import { BookA, ChevronDown, ChevronUp, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { SourceBadge } from '../components/SourceBadge';

interface TerminologyMapProps {
  items: TerminologyMapItem[];
}

export const TerminologyMap: React.FC<TerminologyMapProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { currentSession } = useSession();

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E4E7E2] overflow-hidden shadow-xs transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#F8F9F7] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EDF1EF] text-[#5B7C73] flex items-center justify-center shrink-0">
            <BookA className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#2E2E2E]">
                Terminology Normalization Map
              </h3>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#EDF1EF] text-[#5B7C73] font-semibold">
                {items.length} Canonical Terms
              </span>
            </div>
            <p className="text-xs text-[#5A5A5A] mt-0.5">
              Transparently resolving synonymous academic jargon and varying notations across sources.
            </p>
          </div>
        </div>

        <div className="text-[#8A94A6] p-1 rounded-lg">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 pt-0 border-t border-[#E4E7E2]/70 space-y-4 animate-in fade-in">
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((term) => (
              <div
                key={term.id}
                className="p-4 rounded-xl border border-[#E4E7E2] bg-[#F8F9F7]/70 space-y-2.5"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider block">
                    Canonical Exam Term:
                  </span>
                  <p className="text-sm font-bold text-[#2E2E2E] mt-0.5">
                    {term.canonical}
                  </p>
                  {term.definition && (
                    <p className="font-times text-sm sm:text-base text-[#334155] mt-1 leading-snug">
                      {term.definition}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E4E7E2]/60">
                  <span className="text-[10px] font-semibold text-[#5A5A5A] block mb-1">
                    Also appears in your ingested sources as:
                  </span>
                  <div className="space-y-1.5">
                    {term.variants.map((v, vIdx) => {
                      const sourceName =
                        currentSession?.sources.find((s) => s.source_id === v.source_id)?.filename ||
                        `Source ${v.source_id}`;

                      return (
                        <div
                          key={vIdx}
                          className="flex items-center justify-between text-xs p-1.5 rounded bg-white border border-[#E4E7E2]/80 text-[#2E2E2E]"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-semibold">&ldquo;{v.term}&rdquo;</span>
                            <span className="text-[#8A94A6] text-[11px] truncate">
                              — in {sourceName}
                            </span>
                          </div>
                          <SourceBadge sourceId={v.source_id} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
