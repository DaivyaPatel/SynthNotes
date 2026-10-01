import React from 'react';
import { Check, CircleDot, Circle } from 'lucide-react';
import { PipelineStageInfo } from '../types';

interface StepIndicatorProps {
  stages: PipelineStageInfo[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ stages }) => {
  return (
    <div className="w-full space-y-4">
      {stages.map((st, idx) => {
        const isCompleted = st.status === 'completed';
        const isInProgress = st.status === 'in_progress';
        const isPending = st.status === 'pending';

        return (
          <div
            key={st.key}
            className={`flex items-start gap-3.5 p-3 rounded-xl transition-colors duration-200 ${
              isInProgress
                ? 'bg-[#EDF1EF]/70 border border-[#5B7C73]/30 shadow-xs'
                : isCompleted
                ? 'bg-white border border-[#E4E7E2]'
                : 'opacity-55'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isCompleted ? (
                <div className="w-6 h-6 rounded-full bg-[#EDF7F1] text-[#6BA588] flex items-center justify-center border border-[#6BA588]/40">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              ) : isInProgress ? (
                <div className="w-6 h-6 rounded-full bg-[#EDF1EF] text-[#5B7C73] flex items-center justify-center border border-[#5B7C73]">
                  <CircleDot className="w-4 h-4 animate-pulse stroke-[2.5]" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#F1F3F0] text-[#98A2B3] flex items-center justify-center border border-[#E4E7E2]">
                  <span className="text-xs font-mono font-medium">{idx + 1}</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-sm font-semibold truncate ${
                    isInProgress
                      ? 'text-[#5B7C73]'
                      : isCompleted
                      ? 'text-[#2E2E2E]'
                      : 'text-[#5A5A5A]'
                  }`}
                >
                  {st.label}
                </span>
                <span className="text-xs text-[#8A94A6] shrink-0 font-mono">
                  {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Queued'}
                </span>
              </div>
              <p className="text-xs text-[#5A5A5A] mt-0.5 leading-relaxed">{st.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
