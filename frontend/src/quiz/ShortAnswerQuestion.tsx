import React from 'react';
import { ShortAnswerQuestionData } from '../types';
import { Check, Info } from 'lucide-react';

interface ShortAnswerQuestionProps {
  question: ShortAnswerQuestionData;
  answer: string;
  onChangeAnswer: (val: string) => void;
  showExplanation?: boolean;
}

export const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
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
          Write a concise academic response (2–4 sentences):
        </label>
        <textarea
          rows={4}
          placeholder="Explain the foundational concept..."
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
              Model Sample Answer:
            </span>
            <p className="p-2.5 rounded-lg bg-white border border-[#E4E7E2] text-[#2E2E2E] italic leading-relaxed">
              &ldquo;{question.sample_answer}&rdquo;
            </p>
          </div>

          <div>
            <span className="font-bold text-[#2E2E2E] uppercase text-[10px] tracking-wider block mb-1">
              Key Conceptual Checkpoints:
            </span>
            <div className="space-y-1">
              {question.key_points.map((pt, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#5B7C73]">
                  <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
