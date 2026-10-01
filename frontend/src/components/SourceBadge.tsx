import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { FileText } from 'lucide-react';

interface SourceBadgeProps {
  sourceId: string;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceId, className = '' }) => {
  const { currentNotes, currentSession } = useSession();
  const [showTooltip, setShowTooltip] = useState(false);

  // Look up source metadata
  const sourceInfo =
    currentSession?.sources.find((s) => s.source_id === sourceId) ||
    currentNotes?.source_contributions.find((s) => s.source_id === sourceId);

  const filename = sourceInfo?.filename || `Source ${sourceId}`;

  return (
    <span className="relative inline-block align-baseline mx-0.5">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={`inline-flex items-center justify-center font-mono font-semibold text-[11px] px-1.5 py-0.5 rounded bg-[#EDF1EF] text-[#5B7C73] border border-[#5B7C73]/30 hover:bg-[#5B7C73] hover:text-white transition-colors duration-150 cursor-pointer select-none leading-none ${className}`}
        aria-label={`Source citation ${sourceId}: ${filename}`}
      >
        [{sourceId}]
      </button>

      {showTooltip && (
        <span
          className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-60 p-2.5 bg-[#2E2E2E] text-white text-xs rounded-lg shadow-lg pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95"
          role="tooltip"
        >
          <span className="flex items-center gap-1.5 font-semibold text-[#EDF1EF] mb-1">
            <FileText className="w-3.5 h-3.5 text-[#6BA588] shrink-0" />
            <span className="font-mono">[{sourceId}]</span>
            <span className="truncate">{filename}</span>
          </span>
          <span className="block text-[11px] text-neutral-300 leading-snug">
            Verified ground truth extracted for this study claim.
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2E2E2E]" />
        </span>
      )}
    </span>
  );
};
