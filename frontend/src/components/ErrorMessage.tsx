import React, { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  children?: ReactNode;
  variant?: 'inline' | 'card';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Processing Issue Encountered',
  message,
  actionText,
  onAction,
  children,
  variant = 'card',
}) => {
  if (variant === 'inline') {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FBEEEC] text-[#C97A6D] border border-[#C97A6D]/30 text-xs">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold">{title}: </span>
          <span>{message}</span>
        </div>
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="underline font-semibold hover:text-[#B86B5E] ml-2 shrink-0 cursor-pointer"
          >
            {actionText}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FBEEEC]/60 border border-[#C97A6D]/40 rounded-2xl p-6 text-center max-w-xl mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-[#FBEEEC] border border-[#C97A6D]/40 text-[#C97A6D] flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6 stroke-[2]" />
      </div>
      <h3 className="text-base font-semibold text-[#2E2E2E] mb-1.5">{title}</h3>
      <p className="text-sm text-[#5A5A5A] leading-relaxed max-w-md mx-auto mb-4">{message}</p>
      {children}
      {actionText && onAction && (
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" size="sm" onClick={onAction} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
