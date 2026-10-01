import React from 'react';
import { useSession } from '../context/SessionContext';
import { usePipelineStatus } from '../hooks/usePipelineStatus';
import { ProgressBar } from '../components/ProgressBar';
import { StepIndicator } from '../components/StepIndicator';
import { Brain, FileStack, Layers, ShieldCheck } from 'lucide-react';

export const PipelineStatus: React.FC = () => {
  const { currentSession } = useSession();
  const { stages, progress, statusMessage } = usePipelineStatus();

  const sourceCount = currentSession?.sources.length || 3;
  const topicTitle = currentSession?.title || 'Study Topic';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-[#E4E7E2] p-6 sm:p-8 shadow-xs">
        {/* Header */}
        <div className="text-center pb-6 border-b border-[#E4E7E2]">
          <div className="w-12 h-12 rounded-2xl bg-[#EDF1EF] text-[#5B7C73] flex items-center justify-center mx-auto mb-3">
            <Brain className="w-6 h-6 stroke-[2.2] animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2E2E]">
            Reconciling {sourceCount} Sources
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5A5A] mt-1 max-w-md mx-auto">
            Synthesizing &ldquo;{topicTitle}&rdquo; into an exam-focused, source-attributed study document.
          </p>

          {/* Overall progress bar */}
          <div className="mt-5 max-w-md mx-auto">
            <ProgressBar progress={progress} height="h-2.5" showLabel={true} />
            <p className="text-xs text-[#5B7C73] font-medium mt-2 font-mono">
              {statusMessage || 'Initializing pipeline...'}
            </p>
          </div>
        </div>

        {/* Step-by-step checklist matching Section 10 */}
        <div className="mt-6">
          <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider mb-3">
            Pipeline Execution Stages
          </h3>
          <StepIndicator stages={stages} />
        </div>

        {/* Transparency callout */}
        <div className="mt-6 pt-4 border-t border-[#E4E7E2] flex items-center justify-between text-[11px] text-[#8A94A6]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6BA588]" />
            NLI Faithfulness verification guarantees claim grounding
          </span>
          <span className="font-mono">Est. ~4s remaining</span>
        </div>
      </div>
    </div>
  );
};
