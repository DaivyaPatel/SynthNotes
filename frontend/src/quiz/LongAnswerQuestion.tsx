import React from 'react';
import { LongAnswerQuestionData } from '../types';
import { CheckSquare, Award } from 'lucide-react';

interface LongAnswerQuestionProps {
  question: LongAnswerQuestionData;
  answer: string;
  onChangeAnswer: (val: string) => void;
  showExplanation?: boolean;
}

export const LongAnswerQuestion: React.FC<LongAnswerQuestionProps> = ({
  question,
  answer,
  onChangeAnswer,
  showExplanation = false,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-bold text-[#2E2E2E] leading-snug">
        {question.question}
      </h3>

      <div>
        <label className="block text-xs font-semibold text-[#8A94A6] mb-1.5">
          Write an in-depth structured essay response:
        </label>
        <textarea
          rows={7}
          placeholder="Structure your answer with comparative synthesis, mechanics, and tradeoffs..."
          value={answer}
          onChange={(e) => onChangeAnswer(e.target.value)}
          disabled={showExplanation}
          className="w-full p-3.5 rounded-xl border border-[#E4E7E2] bg-white text-sm text-[#2E2E2E] leading-relaxed focus:outline-none focus:border-[#5B7C73] focus:ring-1 focus:ring-[#5B7C73] transition-colors resize-none"
        />
      </div>

      {showExplanation && (
        <div className="p-4 rounded-xl bg-[#F8F9F7] border border-[#E4E7E2] text-xs text-[#5A5A5A] space-y-3 animate-in fade-in">
          <div>
            <span className="font-bold text-[#2E2E2E] uppercase text-[10px] tracking-wider block mb-1">
              Exemplary Exam Response:
            </span>
            <p className="p-3 rounded-lg bg-white border border-[#E4E7E2] text-[#2E2E2E] leading-relaxed">
              {question.sample_answer}
            </p>
          </div>

          <div>
            <span className="font-bold text-[#2E2E2E] uppercase text-[10px] tracking-wider block mb-1.5">
              Evaluation Rubric Criteria:
            </span>
            <div className="grid gap-2 sm:grid-cols-2">
              {question.rubric_criteria.map((rc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-white border border-[#E4E7E2] flex items-center justify-between gap-2"
                >
                  <span className="text-[11px] text-[#2E2E2E] font-medium leading-tight">
                    {rc.criterion}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#EDF1EF] text-[#5B7C73] font-bold shrink-0">
                    {rc.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
