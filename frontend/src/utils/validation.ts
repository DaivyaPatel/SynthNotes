export interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

export const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.docx', '.ppt', '.pptx'];
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const MIN_SOURCES_COUNT = 2;

export function validateUploadedFiles(files: File[]): FileValidationResult {
  const errors: string[] = [];

  if (!files || files.length === 0) {
    errors.push('Please select at least 2 source files.');
    return { valid: false, errors };
  }

  if (files.length < MIN_SOURCES_COUNT) {
    errors.push(`At least ${MIN_SOURCES_COUNT} source documents are required to perform multi-source synthesis.`);
  }

  for (const file of files) {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(`File "${file.name}" has an unsupported format. Supported formats: PDF, TXT, DOCX, PPT.`);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push(`File "${file.name}" exceeds the maximum 25 MB size limit.`);
    }

    if (file.size === 0) {
      errors.push(`File "${file.name}" is empty (0 bytes).`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
