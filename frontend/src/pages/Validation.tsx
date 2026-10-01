import React from 'react';
import { useSession } from '../context/SessionContext';
import { ValidationStatus } from '../sources/ValidationStatus';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';

export const Validation: React.FC = () => {
  const {
    validationResult,
    isValidating,
    startProcessingPipeline,
    validateSources,
    setActiveNav,
  } = useSession();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveNav('upload')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5A5A] hover:text-[#2E2E2E] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upload</span>
        </button>
        <span className="text-xs font-mono text-[#8A94A6]">Phase 1: Validation Screen</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E7E2] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-[#2E2E2E] mb-2">Source Validation Evaluation</h2>
        <p className="text-xs sm:text-sm text-[#5A5A5A] mb-6">
          SynthNotes performs strict automated checks on text extractability and semantic topic overlap before running reconciliation.
        </p>

        <ValidationStatus
          validation={validationResult}
          isValidating={isValidating}
          onContinue={() => startProcessingPipeline()}
          onRetry={() => validateSources('valid')}
        />
      </div>
    </div>
  );
};
