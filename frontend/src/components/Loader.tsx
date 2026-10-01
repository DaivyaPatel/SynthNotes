import React from 'react';

interface LoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ label = 'Processing...', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div
        className={`${sizeMap[size]} border-[#E4E7E2] border-t-[#5B7C73] rounded-full animate-spin`}
      />
      {label && <span className="text-sm font-medium text-[#5A5A5A]">{label}</span>}
    </div>
  );
};
