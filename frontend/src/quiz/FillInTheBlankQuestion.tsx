import React from 'react';
import { FillInTheBlankQuestionData } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface FillInTheBlankQuestionProps {
  question: FillInTheBlankQuestionData;
  answer: string;
  onChangeAnswer: (val: string) => void;
  showExplanation?: boolean;
}

export const FillInTheBlankQuestion: React.FC<FillInTheBlankQuestionProps> = ({
  question,
  answer,
  onChangeAnswer,
  showExplanation = false,
}) => {
  const isMatch =
    answer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase() ||
    question.acceptable_alternatives?.some(
      (a) => a.trim().toLowerCase() === answer.trim().toLowerCase()
    );

  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-bold text-[#2E2E2E] leading-snug">
        {question.question}
      </h3>

      <div className="space-y-2">
        {question.prefixText && (
          <label className="block text-xs font-semibold text-[#8A94A6]">
            {question.prefixText}:
          </label>
        )}
        <div className="relative">
          <input
            type="text"
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => onChangeAnswer(e.target.value)}
            disabled={showExplanation}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
              showExplanation
                ? isMatch
                  ? 'border-[#6BA588] bg-[#EDF7F1] text-[#255C3D]'
                  : 'border-[#C97A6D] bg-[#FBEEEC] text-[#8F3527]'
                : 'border-[#E4E7E2] bg-white text-[#2E2E2E] focus:outline-none focus:border-[#5B7C73] focus:ring-1 focus:ring-[#5B7C73]'
            }`}
          />
          {showExplanation && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {isMatch ? (
                <CheckCircle2 className="w-5 h-5 text-[#6BA588]" />
              ) : (
                <XCircle className="w-5 h-5 text-[#C97A6D]" />
              )}
            </div>
          )}
        </div>
      </div>

      {showExplanation && (
        <div className="p-4 rounded-xl bg-[#F8F9F7] border border-[#E4E7E2] text-xs text-[#5A5A5A] space-y-1 animate-in fade-in">
          <p className="font-bold text-[#2E2E2E]">
            Correct Answer: <span className="text-[#5B7C73]">{question.correct_answer}</span>
          </p>
          {question.acceptable_alternatives && question.acceptable_alternatives.length > 0 && (
            <p className="text-[11px] text-[#8A94A6]">
              Also accepted: {question.acceptable_alternatives.join(', ')}
            </p>
          )}
          <p className="leading-relaxed mt-1">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};
