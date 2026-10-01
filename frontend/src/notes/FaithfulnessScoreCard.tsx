import React from 'react';
import { FaithfulnessReportData } from '../types';
import { FaithfulnessIndicator } from '../components/FaithfulnessIndicator';
import { ShieldCheck, AlertTriangle, FileCheck2, Info } from 'lucide-react';

interface FaithfulnessScoreCardProps {
  faithfulness: FaithfulnessReportData;
  onScrollToFlagged?: () => void;
}

export const FaithfulnessScoreCard: React.FC<FaithfulnessScoreCardProps> = ({
  faithfulness,
  onScrollToFlagged,
}) => {
  const flaggedCount = faithfulness.flagged_statements.filter((f) => f.status === 'pending').length;

  return (
    <div className="bg-white rounded-2xl border border-[#E4E7E2] p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A94A6]">
              Overall Faithfulness Score
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#6BA588] font-semibold bg-[#EDF7F1] px-2 py-0.5 rounded-full border border-[#6BA588]/30">
              <ShieldCheck className="w-3 h-3" />
              NLI Verified
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2E2E]">
            {faithfulness.reliability_tier} Study Notes
          </h2>

          <p className="text-xs sm:text-sm text-[#5A5A5A] max-w-xl leading-relaxed">
            Your notes are synthesized exclusively from verified claims across all ingested source documents. Every statement is cross-referenced with exact citation coordinates.
          </p>

          {flaggedCount > 0 && (
            <div className="pt-2">
              <button
                onClick={onScrollToFlagged}
                className="inline-flex items-center gap-1.5 text-xs text-[#D6A34B] hover:text-[#B88732] font-semibold underline underline-offset-2 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{flaggedCount} statement{flaggedCount > 1 ? 's' : ''} flagged for manual review ↓</span>
              </button>
            </div>
          )}
        </div>

        <div className="shrink-0 flex items-center md:border-l md:border-[#E4E7E2] md:pl-8">
          <FaithfulnessIndicator score={faithfulness.overall_score} size="lg" />
        </div>
      </div>
    </div>
  );
};
