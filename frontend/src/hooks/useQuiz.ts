import { useState } from 'react';
import { QuizQuestion, UserQuizAnswer } from '../types';

export function useQuiz(questions: QuizQuestion[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (questionId: string, answer: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
  };

  // Compute results
  let score = 0;
  const gradedAnswers: UserQuizAnswer[] = questions.map((q) => {
    const userResp = answers[q.id] || '';
    let isCorrect = false;

    if (q.type === 'mcq') {
      isCorrect = userResp.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
    } else if (q.type === 'fill_in_the_blank') {
      const normalizedResp = userResp.trim().toLowerCase();
      const matchPrimary = normalizedResp === q.correct_answer.trim().toLowerCase();
      const matchAlternative = q.acceptable_alternatives?.some(
        (alt) => alt.trim().toLowerCase() === normalizedResp
      );
      isCorrect = matchPrimary || !!matchAlternative;
    } else if (q.type === 'short_answer' || q.type === 'long_answer') {
      // If student wrote a substantive response (> 15 chars)
      isCorrect = userResp.trim().length >= 20;
    }

    if (isCorrect) score += 1;

    return {
      questionId: q.id,
      userResponse: userResp,
      isCorrect,
    };
  });

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return {
    currentIndex,
    setCurrentIndex,
    currentQuestion,
    totalQuestions: questions.length,
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
  };
}
