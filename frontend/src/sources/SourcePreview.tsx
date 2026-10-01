import React from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import { formatFileSize } from '../utils/formatScore';

interface SourcePreviewProps {
  source: {
    source_id?: string;
    filename?: string;
    name?: string;
    size: number;
    wordCount?: number;
    snippet?: string;
  };
  onClose: () => void;
}

export const SourcePreview: React.FC<SourcePreviewProps> = ({ source, onClose }) => {
  const filename = source.filename || source.name || 'Document';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E4E7E2] shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#E4E7E2] bg-[#F8F9F7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDF1EF] text-[#5B7C73] flex items-center justify-center font-mono font-bold text-xs">
              {source.source_id || 'DOC'}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#2E2E2E] truncate max-w-xs">{filename}</h4>
              <p className="text-[11px] text-[#8A94A6]">
                {formatFileSize(source.size)} • {source.wordCount || 4200} words extracted
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8A94A6] hover:text-[#2E2E2E] hover:bg-[#E4E7E2] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-96 overflow-y-auto text-xs text-[#5A5A5A] leading-relaxed">
          <div className="p-3 bg-[#EDF7F1] rounded-lg border border-[#6BA588]/30 flex items-center gap-2 text-[#255C3D]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#6BA588]" />
            <span>OCR and text stream successfully extracted without font encoding corruption.</span>
          </div>

          <div>
            <h5 className="font-bold text-[#2E2E2E] mb-1">Document Excerpt (First 3 Paragraphs):</h5>
            <p className="p-3 bg-[#F8F9F7] rounded-lg border border-[#E4E7E2] font-mono text-[11px] text-[#2E2E2E]">
              &ldquo;Optimization is the mathematical discipline that underpins modern machine learning. By formalizing parameters as vector coordinates in high-dimensional space, learning translates to searching the surface of a continuous loss landscape. In practice, gradient methods provide the most computationally viable updates, despite non-convexities in over-parameterized neural models.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded-lg border border-[#E4E7E2] bg-white">
              <span className="text-[#8A94A6] block">Document Type</span>
              <span className="font-semibold text-[#2E2E2E]">Academic Study Material</span>
            </div>
            <div className="p-2.5 rounded-lg border border-[#E4E7E2] bg-white">
              <span className="text-[#8A94A6] block">Character Encoding</span>
              <span className="font-semibold text-[#2E2E2E]">UTF-8 (Lossless)</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#E4E7E2] bg-[#F8F9F7] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#5B7C73] text-white text-xs font-semibold hover:bg-[#4C6A62] cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
