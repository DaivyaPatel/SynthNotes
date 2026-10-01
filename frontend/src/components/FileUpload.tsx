import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '../utils/validation';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
    }
    // reset input so same files can be reselected if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`relative w-full border-2 border-dashed rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
        isDragOver
          ? 'border-[#5B7C73] bg-[#EDF1EF]/60 scale-[1.005]'
          : 'border-[#E4E7E2] bg-white hover:border-[#8A94A6] hover:bg-[#F8F9F7]/80'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.docx,.ppt,.pptx"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="w-14 h-14 rounded-full bg-[#EDF1EF] text-[#5B7C73] flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105">
        <UploadCloud className="w-7 h-7 stroke-[2]" />
      </div>

      <h4 className="text-base sm:text-lg font-semibold text-[#2E2E2E] mb-1">
        Drag &amp; drop files here
      </h4>
      <p className="text-sm text-[#5B7C73] font-medium mb-3">
        or click to browse from device
      </p>

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#8A94A6]">
        <span>Supported formats: PDF, PPT, DOCX, TXT</span>
        <span>•</span>
        <span>Max 25 MB per file</span>
        <span>•</span>
        <span className="font-semibold text-[#5A5A5A]">Minimum 2 sources</span>
      </div>
    </div>
  );
};
