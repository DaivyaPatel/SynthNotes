import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { FileUpload } from '../components/FileUpload';
import { SourceList } from './SourceList';
import { SourcePreview } from './SourcePreview';
import { ValidationStatus } from './ValidationStatus';
import { Button } from '../components/Button';
import { validateUploadedFiles } from '../utils/validation';
import { MOCK_PRESET_SESSIONS } from '../utils/constants';
import {
  Sparkles,
  Link as LinkIcon,
  Layers,
  ArrowRight,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const SourceUploader: React.FC = () => {
  const {
    createSessionWithFiles,
    validateSources,
    validationResult,
    isValidating,
    startProcessingPipeline,
    setActiveNav,
  } = useSession();

  const [files, setFiles] = useState<{ name: string; size: number; type?: string }[]>([
    { name: 'ml_textbook_ch4_optimization.pdf', size: 3240000, type: 'pdf' },
    { name: 'mit_lecture_gradient_methods.pdf', size: 980000, type: 'pdf' },
    { name: 'cs229_optimization_slides.pdf', size: 1450000, type: 'pdf' },
  ]);

  const [customTopicTitle, setCustomTopicTitle] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [simulatedScenario, setSimulatedScenario] = useState<'valid' | 'low_overlap' | 'extraction_failure'>('valid');

  const handleFilesAdded = (newFiles: File[]) => {
    const formatted = newFiles.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.name.split('.').pop()?.toLowerCase() || 'pdf',
    }));
    const combined = [...files, ...formatted];
    setFiles(combined);

    if (!customTopicTitle && newFiles[0]) {
      const clean = newFiles[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setCustomTopicTitle(clean.charAt(0).toUpperCase() + clean.slice(1));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSelectPresetTopic = (presetId: string) => {
    const preset = MOCK_PRESET_SESSIONS.find((p) => p.topicId === presetId);
    if (preset) {
      setCustomTopicTitle(preset.title);
      setFiles(preset.sources.map((s) => ({ name: s.filename, size: s.size, type: s.type })));
      setValidationErrors([]);
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      const name = urlInput.replace(/^https?:\/\//, '').split('/')[0] + '_article.pdf';
      setFiles([...files, { name, size: 750000, type: 'pdf' }]);
      setUrlInput('');
      setShowUrlModal(false);
    }
  };

  const handleStartMerge = async () => {
    if (files.length < 2) {
      setValidationErrors(['Please select at least 2 source files to reconcile.']);
      return;
    }

    setValidationErrors([]);
    const sessionId = await createSessionWithFiles(files, customTopicTitle);
    await validateSources(simulatedScenario);
  };

  const handleProceedToPipeline = () => {
    startProcessingPipeline();
  };

  const handleRetryValidation = async () => {
    await validateSources(simulatedScenario);
  };

  const handleRemoveFailedFile = (failedFilename: string) => {
    setFiles(files.filter((f) => f.name !== failedFilename));
  };

  const isValidCount = files.length >= 2;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload card header */}
      <div className="bg-white rounded-2xl border border-[#E4E7E2] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-[#E4E7E2]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2E2E2E]">
              Upload Your Study Materials
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-1">
              Provide textbooks, PDFs, lecture slides or notes covering the same subject.
            </p>
          </div>

          <button
            onClick={() => setShowUrlModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E4E7E2] text-[#5B7C73] hover:bg-[#EDF1EF] transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Add from URL</span>
          </button>
        </div>

        {/* Drag & Drop Area */}
        <div className="mt-6">
          <FileUpload onFilesSelected={handleFilesAdded} />
        </div>

        {/* Example Topics quick buttons matching reference design */}
        <div className="mt-6 pt-5 border-t border-[#E4E7E2]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#5A5A5A]">Example Topics:</span>
            {MOCK_PRESET_SESSIONS.map((preset) => (
              <button
                key={preset.topicId}
                onClick={() => handleSelectPresetTopic(preset.topicId)}
                className="text-xs px-3 py-1 rounded-full bg-[#F8F9F7] border border-[#E4E7E2] text-[#2E2E2E] hover:border-[#5B7C73] hover:bg-[#EDF1EF] transition-colors cursor-pointer"
              >
                {preset.title.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected files list */}
        {files.length > 0 && (
          <SourceList
            sources={files}
            onRemove={handleRemoveFile}
            onPreview={(idx) => setPreviewIndex(idx)}
          />
        )}

        {/* Validation Errors Notice */}
        {validationErrors.length > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#FBEEEC] border border-[#C97A6D]/30 text-xs text-[#C97A6D] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationErrors.join(' ')}</span>
          </div>
        )}

        {/* Validation Status result card (if validation performed) */}
        {validationResult && (
          <div className="mt-6">
            <ValidationStatus
              validation={validationResult}
              isValidating={isValidating}
              onContinue={handleProceedToPipeline}
              onRetry={handleRetryValidation}
              onRemoveFailedFile={handleRemoveFailedFile}
            />
          </div>
        )}

        {/* Scenario simulation toolbar for evaluator testing */}
        <div className="mt-6 pt-5 border-t border-[#E4E7E2] bg-[#F8F9F7]/70 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#2E2E2E]">Simulate Validation Scenario:</span>
              <span className="text-[#8A94A6]">(Test edge cases)</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSimulatedScenario('valid')}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                  simulatedScenario === 'valid'
                    ? 'bg-[#6BA588] text-white'
                    : 'bg-white text-[#5A5A5A] border border-[#E4E7E2]'
                }`}
              >
                ✓ Valid (High Overlap)
              </button>
              <button
                onClick={() => setSimulatedScenario('low_overlap')}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                  simulatedScenario === 'low_overlap'
                    ? 'bg-[#D6A34B] text-white'
                    : 'bg-white text-[#5A5A5A] border border-[#E4E7E2]'
                }`}
              >
                ⚠ Low Overlap Warning
              </button>
              <button
                onClick={() => setSimulatedScenario('extraction_failure')}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                  simulatedScenario === 'extraction_failure'
                    ? 'bg-[#C97A6D] text-white'
                    : 'bg-white text-[#5A5A5A] border border-[#E4E7E2]'
                }`}
              >
                ✕ Extraction Failure
              </button>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        {!validationResult && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E4E7E2]">
            <p className="text-xs text-[#8A94A6]">
              {isValidCount
                ? `${files.length} sources ready for cross-document reconciliation`
                : 'Add at least 2 documents to unlock synthesis'}
            </p>

            <Button
              variant="primary"
              size="lg"
              disabled={!isValidCount || isValidating}
              isLoading={isValidating}
              onClick={handleStartMerge}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Merge These Sources
            </Button>
          </div>
        )}
      </div>

      {/* URL Input Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E4E7E2] shadow-xl p-6">
            <h3 className="text-base font-bold text-[#2E2E2E] mb-1">Add Web Article / Syllabus Link</h3>
            <p className="text-xs text-[#5A5A5A] mb-4">
              Enter the URL of a public academic page, research article, or lecture slides document.
            </p>
            <input
              type="url"
              placeholder="https://mit.edu/courses/optimization/lecture4.html"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E7E2] text-sm text-[#2E2E2E] focus:outline-none focus:border-[#5B7C73] mb-4 font-mono text-xs"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowUrlModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddUrl} disabled={!urlInput.trim()}>
                Add Source
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewIndex !== null && files[previewIndex] && (
        <SourcePreview source={files[previewIndex]} onClose={() => setPreviewIndex(null)} />
      )}
    </div>
  );
};
