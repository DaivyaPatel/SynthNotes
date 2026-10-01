import React from 'react';
import { FlaggedStatement as FlaggedStatementType } from '../types';
import { useSession } from '../context/SessionContext';
import { SourceBadge } from '../components/SourceBadge';
import { Button } from '../components/Button';
import { AlertTriangle, RefreshCw, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface FlaggedStatementProps {
  flag: FlaggedStatementType;
}

export const FlaggedStatement: React.FC<FlaggedStatementProps> = ({ flag }) => {
  const { updateFlaggedStatement, currentSession } = useSession();

  const isResolved = flag.status && flag.status !== 'pending';

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 transition-all duration-150 ${
        isResolved
          ? 'bg-neutral-50/70 border-[#E4E7E2] opacity-75'
          : 'bg-[#FBF3E4]/70 border-[#D6A34B]/40 shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-amber-100 text-[#D6A34B]">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-[#8C6016] uppercase tracking-wider">
            Faithfulness Score: {Math.round(flag.faithfulness_score * 100)}% (Low Confidence)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#5A5A5A]">
          <span>Cited Source:</span>
          {flag.source_ids.map((sId) => (
            <SourceBadge key={sId} sourceId={sId} />
          ))}
        </div>
      </div>

      {/* Structured Fields */}
      <div className="space-y-2.5 text-xs">
        <div>
          <span className="font-semibold text-[#8A94A6] uppercase tracking-wider text-[10px] block">
            Generated Statement:
          </span>
          <p className="text-sm font-medium text-[#2E2E2E] mt-0.5 p-2.5 bg-white rounded-lg border border-[#E4E7E2]">
            &ldquo;{flag.statement}&rdquo;
          </p>
        </div>

        <div>
          <span className="font-semibold text-[#8A94A6] uppercase tracking-wider text-[10px] block">
            Verification Issue:
          </span>
          <p className="text-xs text-[#8C6016] mt-0.5 leading-relaxed">
            {flag.issue}
          </p>
        </div>

        {flag.suggestedCorrection && !isResolved && (
          <div className="p-2.5 rounded-lg bg-[#EDF7F1] border border-[#6BA588]/30">
            <span className="font-bold text-[#255C3D] text-[10px] uppercase tracking-wider block mb-0.5">
              Strictly Grounded Alternative:
            </span>
            <p className="text-xs text-[#2E2E2E] font-medium leading-relaxed">
              &ldquo;{flag.suggestedCorrection}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Status or Action Buttons matching Section 16 */}
      <div className="mt-4 pt-3 border-t border-[#E4E7E2] flex flex-wrap items-center justify-between gap-3">
        {isResolved ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6BA588]">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Action Applied:{' '}
              {flag.status === 'regenerated'
                ? 'Regenerated with Grounded Sentence'
                : flag.status === 'removed'
                ? 'Removed From Notes'
                : 'Kept As-Is'}
            </span>
          </div>
        ) : (
          <>
            <span className="text-[11px] text-[#8A94A6]">
              Choose reconciliation action:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => updateFlaggedStatement(flag.id, 'regenerate')}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                className="bg-[#5B7C73] hover:bg-[#4C6A62]"
              >
                Regenerate This Statement
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFlaggedStatement(flag.id, 'remove')}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Remove From Notes
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFlaggedStatement(flag.id, 'keep')}
              >
                Keep Anyway
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
