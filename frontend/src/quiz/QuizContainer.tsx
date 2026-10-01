import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { useQuiz } from '../hooks/useQuiz';
import { MCQQuestion } from './MCQQuestion';
import { FillInTheBlankQuestion } from './FillInTheBlankQuestion';
import { ShortAnswerQuestion } from './ShortAnswerQuestion';
import { LongAnswerQuestion } from './LongAnswerQuestion';
import { QuizResults } from './QuizResults';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export const QuizContainer: React.FC = () => {
  const { currentQuiz, currentNotes, setActiveNav, currentSession } = useSession();
  const questions = currentQuiz || [];

  const {
    currentIndex,
    setCurrentIndex,
    currentQuestion,
    totalQuestions,
    answers,
    submitted,
    score,
    percentage,
    gradedAnswers,
    handleSelectOption,
    handleNext,
    handlePrev,
    handleSubmit,
    handleReset,
  } = useQuiz(questions);

  const [reviewMode, setReviewMode] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E4E7E2] p-8 text-center max-w-xl mx-auto space-y-4">
        <GraduationCap className="w-10 h-10 text-[#8A94A6] mx-auto" />
        <h3 className="text-base font-bold text-[#2E2E2E]">No Quiz Generated Yet</h3>
        <p className="text-xs text-[#5A5A5A]">
          Complete the document reconciliation pipeline on a study topic to auto-generate a targeted exam quiz.
        </p>
        <Button variant="primary" size="sm" onClick={() => setActiveNav('upload')}>
          Upload Study Sources
        </Button>
      </div>
    );
  }

  const topicTitle = currentSession?.title || currentNotes?.topic_title || 'Study Topic';

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header section matching Section 17 */}
      <div className="bg-white rounded-2xl border border-[#E4E7E2] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E4E7E2]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B7C73]">
                Self-Testing Layer
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#EDF1EF] text-[#5B7C73]">
                Ground Truth Anchored
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2E2E2E] mt-0.5">
              Test Yourself On These Notes
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-1 max-w-xl">
              Questions are generated only from your synthesized notes — not the raw sources — so terminology stays consistent with what you just studied.
            </p>
          </div>

          <button
            onClick={() => setActiveNav('notes')}
            className="inline-flex items-center gap-1.5 text-xs text-[#5B7C73] hover:underline font-semibold self-start sm:self-auto cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Notes</span>
          </button>
        </div>

        {/* Progress header */}
        {!submitted && (
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#5A5A5A]">
              <span className="font-semibold text-[#2E2E2E]">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="font-mono text-[11px] text-[#8A94A6]">
                Topic: {topicTitle}
              </span>
            </div>
            <ProgressBar
              progress={((currentIndex + 1) / totalQuestions) * 100}
              height="h-2"
            />
          </div>
        )}
      </div>

      {/* Main question area or results */}
      {submitted && !reviewMode ? (
        <div className="space-y-6">
          <QuizResults
            score={score}
            totalQuestions={totalQuestions}
            percentage={percentage}
            gradedAnswers={gradedAnswers}
            questions={questions}
            onRetry={handleReset}
          />

          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewMode(true)}
              icon={<HelpCircle className="w-4 h-4" />}
            >
              Review All Questions &amp; Detailed Explanations
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E4E7E2] p-6 sm:p-8 shadow-xs space-y-6">
          {reviewMode && (
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7E2]">
              <span className="text-xs font-bold text-[#5B7C73]">
                Reviewing Question {currentIndex + 1} of {totalQuestions} (Explanation Mode)
              </span>
              <button
                onClick={() => setReviewMode(false)}
                className="text-xs text-[#8A94A6] hover:text-[#2E2E2E] cursor-pointer"
              >
                Back to Score Card
              </button>
            </div>
          )}

          {/* Render active question component */}
          {currentQuestion && (
            <>
              {currentQuestion.type === 'mcq' && (
                <MCQQuestion
                  question={currentQuestion}
                  selectedAnswer={answers[currentQuestion.id] || ''}
                  onSelectAnswer={(ans) => handleSelectOption(currentQuestion.id, ans)}
                  showExplanation={submitted || reviewMode}
                />
              )}

              {currentQuestion.type === 'fill_in_the_blank' && (
                <FillInTheBlankQuestion
                  question={currentQuestion}
                  answer={answers[currentQuestion.id] || ''}
                  onChangeAnswer={(val) => handleSelectOption(currentQuestion.id, val)}
                  showExplanation={submitted || reviewMode}
                />
              )}

              {currentQuestion.type === 'short_answer' && (
                <ShortAnswerQuestion
                  question={currentQuestion}
                  answer={answers[currentQuestion.id] || ''}
                  onChangeAnswer={(val) => handleSelectOption(currentQuestion.id, val)}
                  showExplanation={submitted || reviewMode}
                />
              )}

              {currentQuestion.type === 'long_answer' && (
                <LongAnswerQuestion
                  question={currentQuestion}
                  answer={answers[currentQuestion.id] || ''}
                  onChangeAnswer={(val) => handleSelectOption(currentQuestion.id, val)}
                  showExplanation={submitted || reviewMode}
                />
              )}
            </>
          )}

          {/* Navigation Controls: Back, Next, Submit */}
          <div className="pt-6 border-t border-[#E4E7E2] flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Back
            </Button>

            <div className="flex items-center gap-2">
              {currentIndex < totalQuestions - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  Next Question
                </Button>
              ) : !submitted ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit}
                  icon={<CheckCircle className="w-3.5 h-3.5" />}
                  className="bg-[#6BA588] hover:bg-[#598E73]"
                >
                  Submit Quiz Answers
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReviewMode(false)}
                >
                  Back to Summary
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
