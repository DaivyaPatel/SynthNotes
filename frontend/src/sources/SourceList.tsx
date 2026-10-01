import React from 'react';
import { StudySource } from '../types';
import { formatFileSize } from '../utils/formatScore';
import { FileText, CheckCircle2, AlertCircle, Trash2, Eye } from 'lucide-react';

interface SourceListProps {
  sources: {
    source_id?: string;
    filename?: string;
    name?: string;
    size: number;
    type?: string;
    status?: string;
  }[];
  onRemove: (index: number) => void;
  onPreview?: (index: number) => void;
}

export const SourceList: React.FC<SourceListProps> = ({ sources, onRemove, onPreview }) => {
  if (sources.length === 0) return null;

  return (
    <div className="w-full space-y-2.5 mt-4">
      <div className="flex items-center justify-between text-xs font-semibold text-[#5A5A5A] px-1">
        <span>Selected Sources ({sources.length})</span>
        <span className="text-[#8A94A6]">Min. 2 required to synthesize</span>
      </div>

      <div className="space-y-2">
        {sources.map((src, idx) => {
          const name = src.filename || src.name || `Source ${idx + 1}`;
          const ext = name.split('.').pop()?.toUpperCase() || 'PDF';

          return (
            <div
              key={`${name}-${idx}`}
              className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#E4E7E2] hover:border-[#D0D5DD] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-lg bg-[#EDF1EF] text-[#5B7C73] flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                  {src.source_id || `S${idx + 1}`}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#2E2E2E] truncate">{name}</p>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F1F3F0] text-[#5A5A5A]">
                      {ext}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#8A94A6] mt-0.5">
                    <span>{formatFileSize(src.size)}</span>
                    <span>•</span>
                    <span className="text-[#6BA588] flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {onPreview && (
                  <button
                    onClick={() => onPreview(idx)}
                    className="p-1.5 text-[#8A94A6] hover:text-[#2E2E2E] hover:bg-[#F1F3F0] rounded-md transition-colors cursor-pointer"
                    title="Preview extracted sample"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onRemove(idx)}
                  className="p-1.5 text-[#8A94A6] hover:text-[#C97A6D] hover:bg-[#FBEEEC] rounded-md transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
