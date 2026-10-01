import React from 'react';
import { FaithfulnessReportData, SourceContribution } from '../types';
import { FlaggedStatement } from './FlaggedStatement';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';

interface FaithfulnessReportProps {
  faithfulness: FaithfulnessReportData;
  sourceContributions: SourceContribution[];
}

export const FaithfulnessReport: React.FC<FaithfulnessReportProps> = ({
  faithfulness,
  sourceContributions,
}) => {
  const pendingFlags = faithfulness.flagged_statements.filter((f) => f.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Source Overlap / Contribution Breakdown matching Section 14 */}
      <div className="bg-white rounded-2xl border border-[#E4E7E2] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#2E2E2E]">
              Source Overlap &amp; Contribution Breakdown
            </h3>
            <p className="text-xs text-[#5A5A5A] mt-0.5">
              Proportion of synthesized claims and terminology traced to each ingested reference.
            </p>
          </div>
          <span className="text-xs font-mono text-[#8A94A6]">
            {sourceContributions.length} active sources
          </span>
        </div>

        <div className="space-y-3.5">
          {sourceContributions.map((sc) => (
            <div key={sc.source_id} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-2 text-[#2E2E2E] truncate max-w-md">
                  <span className="font-mono font-bold text-[#5B7C73] bg-[#EDF1EF] px-1.5 py-0.5 rounded text-[11px]">
                    [{sc.source_id}]
                  </span>
                  <span className="truncate">{sc.filename}</span>
                </span>
                <span className="font-mono text-[#5A5A5A] shrink-0 tabular-nums">
                  {sc.percentage}% of statements ({sc.statementCount} claims)
                </span>
              </div>
              <ProgressBar
                progress={sc.percentage}
                color={sc.percentage >= 40 ? 'bg-[#5B7C73]' : 'bg-[#8A94A6]'}
                height="h-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content Flagged for Manual Review matching Section 15 & 16 */}
      <div id="flagged-statements-panel" className="bg-white rounded-2xl border border-[#E4E7E2] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#D6A34B] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#2E2E2E]">
                Needs Your Review ({pendingFlags.length})
              </h3>
              <p className="text-xs text-[#5A5A5A] mt-0.5">
                Statements where the NLI verifier detected potential ambiguities or weak source grounding.
              </p>
            </div>
          </div>
        </div>

        {faithfulness.flagged_statements.length === 0 || pendingFlags.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#EDF7F1] border border-[#6BA588]/30 text-center">
            <CheckCircle2 className="w-6 h-6 text-[#6BA588] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#255C3D]">All Claims 100% Faithful</p>
            <p className="text-xs text-[#5A5A5A] mt-1">
              Zero unverified claims remain. Your unified study notes are fully grounded in the provided sources.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {faithfulness.flagged_statements.map((flag) => (
              <FlaggedStatement key={flag.id} flag={flag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
