import React from 'react';
import { SourceUploader } from '../sources/SourceUploader';
import { useSession } from '../context/SessionContext';
import { ArrowLeft, BookOpen, Layers } from 'lucide-react';

export const UploadSources: React.FC = () => {
  const { setActiveNav } = useSession();

  return (
    <div className="w-full space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveNav('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5A5A] hover:text-[#2E2E2E] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#8A94A6]">
          <span className="font-semibold text-[#5B7C73]">Phase 1: Ingestion &amp; Validation</span>
          <span>→</span>
          <span>Phase 2: Reconciliation Pipeline</span>
        </div>
      </div>

      <SourceUploader />
    </div>
  );
};
