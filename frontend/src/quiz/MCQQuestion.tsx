import React from 'react';
import { MCQQuestionData } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface MCQQuestionProps {
  question: MCQQuestionData;
  selectedAnswer: string;
  onSelectAnswer: (ans: string) => void;
  showExplanation?: boolean;
}

export const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  showExplanation = false,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-bold text-[#2E2E2E] leading-snug">
        {question.question}
      </h3>

      <div className="space-y-2.5">
        {question.options.map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === question.correct_answer;
          const isWrongSelected = showExplanation && isSelected && !isCorrect;

          let cardStyle = 'border-[#E4E7E2] bg-white hover:border-[#5B7C73] hover:bg-[#F8F9F7]';
          if (isSelected && !showExplanation) {
            cardStyle = 'border-[#5B7C73] bg-[#EDF1EF] ring-1 ring-[#5B7C73]';
          } else if (showExplanation) {
            if (isCorrect) {
              cardStyle = 'border-[#6BA588] bg-[#EDF7F1] text-[#255C3D]';
            } else if (isWrongSelected) {
              cardStyle = 'border-[#C97A6D] bg-[#FBEEEC] text-[#8F3527]';
            }
          }

          return (
            <label
              key={idx}
              className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer ${cardStyle}`}
            >
              <input
                type="radio"
                name={`question_${question.id}`}
                value={opt}
                checked={isSelected}
                onChange={() => onSelectAnswer(opt)}
                disabled={showExplanation}
                className="mt-0.5 text-[#5B7C73] focus:ring-[#5B7C73] cursor-pointer"
              />
              <span className="flex-1">{opt}</span>

              {showExplanation && (
                <span className="shrink-0">
                  {isCorrect && <CheckCircle2 className="w-4 h-4 text-[#6BA588]" />}
                  {isWrongSelected && <XCircle className="w-4 h-4 text-[#C97A6D]" />}
                </span>
              )}
            </label>
          );
        })}
      </div>

      {showExplanation && (
        <div className="p-4 rounded-xl bg-[#F8F9F7] border border-[#E4E7E2] text-xs text-[#5A5A5A] space-y-1 animate-in fade-in">
          <p className="font-bold text-[#2E2E2E]">Explanation &amp; Source Context:</p>
          <p className="leading-relaxed">{question.explanation}</p>
          {question.source_reference && (
            <p className="font-mono text-[11px] text-[#5B7C73] pt-1">
              Ref: {question.source_reference}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
