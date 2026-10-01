import React from 'react';
import { CheckCircle2, AlertCircle, FileX, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { TopicOverlapWarning } from './TopicOverlapWarning';
import { ValidationResult } from '../types';

interface ValidationStatusProps {
  validation: ValidationResult | null;
  isValidating: boolean;
  onContinue: () => void;
  onRetry: () => void;
  onRemoveFailedFile?: (filename: string) => void;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({
  validation,
  isValidating,
  onContinue,
  onRetry,
  onRemoveFailedFile,
}) => {
  if (isValidating) {
    return (
      <div className="w-full bg-white border border-[#E4E7E2] rounded-2xl p-8 text-center my-6 shadow-xs animate-in fade-in">
        <div className="w-12 h-12 rounded-full border-3 border-[#E4E7E2] border-t-[#5B7C73] animate-spin mx-auto mb-4" />
        <h4 className="text-base font-bold text-[#2E2E2E] mb-1">
          Validating &amp; Extracting Documents...
        </h4>
        <p className="text-xs text-[#5A5A5A] max-w-sm mx-auto">
          Checking document extractability, OCR layer integrity, and semantic topic overlap across uploaded sources.
        </p>
      </div>
    );
  }

  if (!validation) return null;

  // Case 1: Extraction Failure
  if (!validation.valid || validation.status === 'extraction_failure') {
    return (
      <div className="w-full bg-[#FBEEEC] border border-[#C97A6D]/40 rounded-2xl p-6 sm:p-7 text-left my-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#C97A6D] flex items-center justify-center shrink-0 border border-[#C97A6D]/30 mt-0.5">
            <FileX className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-[#2E2E2E]">
                Couldn&apos;t Read One Or More Files
              </h4>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-200/60 text-[#8F3527] font-semibold">
                Extraction Failed
              </span>
            </div>

            <p className="text-sm text-[#5A5A5A] mt-2 leading-relaxed">
              {validation.message}
            </p>

            {validation.failed_files && validation.failed_files.length > 0 && (
              <div className="mt-3 p-3 bg-white/90 rounded-lg border border-rose-200 text-xs">
                <span className="font-semibold text-[#2E2E2E]">Corrupted or unreadable item: </span>
                <span className="font-mono text-[#C97A6D]">{validation.failed_files.join(', ')}</span>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {validation.failed_files?.[0] && onRemoveFailedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveFailedFile(validation.failed_files![0])}
                >
                  Remove Corrupted File
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={onRetry}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Re-upload / Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Low Topic Overlap Warning
  if (validation.status === 'low_overlap') {
    return (
      <TopicOverlapWarning
        validation={validation}
        onUploadDifferent={onRetry}
        onContinueAnyway={onContinue}
      />
    );
  }

  // Case 3: All Sources Valid
  return (
    <div className="w-full bg-[#EDF7F1] border border-[#6BA588]/40 rounded-2xl p-6 sm:p-7 text-left my-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#6BA588] flex items-center justify-center shrink-0 border border-[#6BA588]/30 mt-0.5">
          <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-[#2E2E2E]">✓ Sources Ready &amp; Validated</h4>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-200/60 text-[#255C3D] font-semibold">
              {Math.round(validation.topic_overlap_score * 100)}% Topic Overlap
            </span>
          </div>

          <p className="text-sm text-[#5A5A5A] mt-2 leading-relaxed">
            {validation.message}
          </p>

          {validation.keySharedTerms && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[#5A5A5A]">
              <span className="font-semibold text-[#2E2E2E]">Shared Academic Anchors:</span>
              {validation.keySharedTerms.map((term, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-white text-[#2E2E2E] rounded border border-emerald-200/80 font-medium"
                >
                  {term}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={onContinue}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="bg-[#6BA588] hover:bg-[#598E73]"
            >
              Proceed to Processing Pipeline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
