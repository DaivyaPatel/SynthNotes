import React from 'react';
import { DetailedSection } from '../types';
import { SourceBadge } from '../components/SourceBadge';
import { AlertTriangle } from 'lucide-react';

interface DetailedExplanationProps {
  sections: DetailedSection[];
}

export const DetailedExplanation: React.FC<DetailedExplanationProps> = ({ sections }) => {
  if (!sections || sections.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-[#8A94A6]">
        No detailed explanation synthesized yet.
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[#2E2E2E]">
      {sections.map((sec, secIdx) => (
        <section key={secIdx} className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[#2E2E2E] pb-2 border-b border-[#E4E7E2]/70 flex items-center justify-between">
            <span>{sec.heading}</span>
          </h3>

          <div className="font-times text-base sm:text-[17px] leading-relaxed text-[#1E293B] space-y-3 font-normal tracking-normal">
            <p>
              {sec.statements.map((stmt, sIdx) => {
                const isLowScore = stmt.faithfulness_score !== undefined && stmt.faithfulness_score < 0.75;

                return (
                  <span
                    key={stmt.id || sIdx}
                    className={`inline ${
                      isLowScore
                        ? 'bg-amber-50/80 px-1 py-0.5 rounded border-b border-amber-300'
                        : ''
                    }`}
                  >
                    {stmt.text}{' '}
                    {isLowScore && (
                      <span
                        className="inline-flex items-center text-[#D6A34B] align-baseline mx-0.5"
                        title={`Faithfulness score: ${Math.round((stmt.faithfulness_score || 0) * 100)}% (Flagged for review)`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 inline" />
                      </span>
                    )}
                    {stmt.source_ids && stmt.source_ids.map((srcId) => (
                      <SourceBadge key={srcId} sourceId={srcId} />
                    ))}
                    {' '}
                  </span>
                );
              })}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
};
