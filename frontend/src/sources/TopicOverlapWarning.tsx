import React from 'react';
import { AlertTriangle, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { Button } from '../components/Button';
import { ValidationResult } from '../types';

interface TopicOverlapWarningProps {
  validation: ValidationResult;
  onUploadDifferent: () => void;
  onContinueAnyway: () => void;
}

export const TopicOverlapWarning: React.FC<TopicOverlapWarningProps> = ({
  validation,
  onUploadDifferent,
  onContinueAnyway,
}) => {
  const overlapPct = Math.round(validation.topic_overlap_score * 100);

  return (
    <div className="w-full bg-[#FBF3E4] border border-[#D6A34B]/40 rounded-2xl p-6 sm:p-7 text-left my-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D6A34B] flex items-center justify-center shrink-0 border border-[#D6A34B]/30 mt-0.5">
          <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-[#2E2E2E]">
              Topic Overlap Is Low ({overlapPct}%)
            </h4>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-200/60 text-[#8C6016] font-semibold">
              Warning
            </span>
          </div>

          <p className="text-sm text-[#5A5A5A] mt-2 leading-relaxed">
            These documents don&apos;t appear to cover the same topic closely. SynthNotes merges multiple sources on one subject - please upload sources on the same topic, or continue anyway if you&apos;re sure.
          </p>

          {validation.detectedTopic && (
            <div className="mt-3 p-3 bg-white/80 rounded-lg border border-amber-200/80 text-xs">
              <span className="font-semibold text-[#2E2E2E]">Detected divergent topics: </span>
              <span className="text-[#5A5A5A]">{validation.detectedTopic}</span>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onUploadDifferent}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Upload Different Sources
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onContinueAnyway}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
              className="bg-[#D6A34B] hover:bg-[#BF8E3D]"
            >
              Continue Anyway
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
