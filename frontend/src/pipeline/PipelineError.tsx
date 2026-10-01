import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { useSession } from '../context/SessionContext';

interface PipelineErrorProps {
  stageName?: string;
  errorMessage?: string;
  onRetry: () => void;
}

export const PipelineError: React.FC<PipelineErrorProps> = ({
  stageName = 'Salience Ranking & Faithfulness',
  errorMessage = 'Unable to complete cross-document verification. The processing cluster timed out while evaluating citation claims.',
  onRetry,
}) => {
  const { setActiveNav } = useSession();

  return (
    <div className="bg-[#FBEEEC]/70 border border-[#C97A6D]/40 rounded-2xl p-6 sm:p-8 text-center max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-[#FBEEEC] border border-[#C97A6D]/40 text-[#C97A6D] flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6 stroke-[2]" />
      </div>

      <h3 className="text-base font-bold text-[#2E2E2E] mb-1">
        Pipeline Stalled at: {stageName}
      </h3>
      <p className="text-xs text-[#5A5A5A] leading-relaxed mb-6">
        {errorMessage}
      </p>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveNav('upload')}
          icon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          Back to Upload
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          className="bg-[#C97A6D] hover:bg-[#B86B5E]"
        >
          Resume Processing
        </Button>
      </div>
    </div>
  );
};
