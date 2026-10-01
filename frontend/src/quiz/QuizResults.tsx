import React from 'react';
import { QuizQuestion, UserQuizAnswer } from '../types';
import { Button } from '../components/Button';
import { CheckCircle2, RotateCcw, BookOpen, Award, ArrowRight } from 'lucide-react';
import { useSession } from '../context/SessionContext';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  gradedAnswers: UserQuizAnswer[];
  questions: QuizQuestion[];
  onRetry: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  percentage,
  gradedAnswers,
  questions,
  onRetry,
}) => {
  const { setActiveNav, currentSession } = useSession();

  const isHighPassing = percentage >= 80;

  return (
    <div className="bg-white rounded-2xl border border-[#E4E7E2] p-6 sm:p-8 shadow-xs text-center max-w-2xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#EDF7F1] border border-[#6BA588]/30 text-[#6BA588] flex items-center justify-center mx-auto">
        <Award className="w-8 h-8 stroke-[2]" />
      </div>

      <div>
        <span className="font-mono text-xs uppercase tracking-wider text-[#8A94A6]">
          Quiz Completed
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2E2E2E] mt-1">
          {percentage}% Performance
        </h2>
        <p className="text-sm text-[#5A5A5A] mt-1 max-w-md mx-auto">
          {isHighPassing
            ? 'Excellent mastery of the reconciled study notes and normalized terminology.'
            : 'Good effort! Review the source explanations below to reinforce weaker areas.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
        <div className="p-3 rounded-xl border border-[#E4E7E2] bg-[#F8F9F7]">
          <span className="text-[11px] text-[#8A94A6] block">Correct Answers</span>
          <span className="font-mono font-bold text-lg text-[#2E2E2E]">
            {score} / {totalQuestions}
          </span>
        </div>
        <div className="p-3 rounded-xl border border-[#E4E7E2] bg-[#F8F9F7]">
          <span className="text-[11px] text-[#8A94A6] block">Exam Readiness</span>
          <span className="font-mono font-bold text-lg text-[#5B7C73]">
            {isHighPassing ? 'Exam Ready' : 'Review Needed'}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-[#E4E7E2] flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={onRetry}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Retake Quiz
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={() => setActiveNav('notes')}
          icon={<BookOpen className="w-4 h-4" />}
        >
          Review Study Notes
        </Button>
      </div>
    </div>
  );
};
