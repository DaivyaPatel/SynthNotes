import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Shuffle,
  Eye,
  ArrowLeft,
  Brain,
} from 'lucide-react';
import { Button } from '../components/Button';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  source: string;
  category: string;
}

export const Flashcards: React.FC = () => {
  const { currentNotes, currentSession, setActiveNav } = useSession();
  const topicTitle = currentSession?.title || currentNotes?.topic_title || 'Gradient Descent Optimization';

  const defaultCards: Flashcard[] = [
    {
      id: 'fc_1',
      category: 'Core Definition',
      front: 'What is the standard parameter update rule in Gradient Descent?',
      back: 'θ_{t+1} = θ_t - η · ∇J(θ_t), where η is the learning rate and ∇J(θ_t) is the negative gradient vector pointing towards the steepest local decrease.',
      source: 'S1 & S2',
    },
    {
      id: 'fc_2',
      category: 'Terminology Discrepancy',
      front: 'What alias does Textbook [S1] use for Gradient Descent?',
      back: '"Steepest Descent". Both terms describe the identical mathematical first-order optimization method for differentiable continuous loss functions.',
      source: 'S1: ml_textbook_ch4.pdf',
    },
    {
      id: 'fc_3',
      category: 'Comparative Tradeoff',
      front: 'Why does Stochastic Gradient Descent (SGD) escape local minima better than Batch GD?',
      back: 'SGD computes the gradient from a single random sample per iteration, introducing noise and stochastic fluctuations that dislodge iterates from shallow saddle points and local minima.',
      source: 'S2 & S3',
    },
    {
      id: 'fc_4',
      category: 'Exam Pitfall',
      front: 'Under what condition does gradient descent guarantee global convergence?',
      back: 'Convergence to the absolute global minimum is mathematically guaranteed ONLY for strictly convex functions. On non-convex deep learning loss surfaces, it can settle in local sub-optima or saddle points.',
      source: 'S1: Optimization Foundations',
    },
    {
      id: 'fc_5',
      category: 'Momentum Dynamics',
      front: 'How does classical Momentum alleviate oscillations in ill-conditioned ravines?',
      back: 'By calculating an exponential moving average of past gradients: v_t = γ v_{t-1} + η ∇J(θ_t). Perpendicular oscillations cancel out while forward directional velocity is accelerated.',
      source: 'S2 & S3',
    },
  ];

  const [cards, setCards] = useState<Flashcard[]>(defaultCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(cards.length - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCards([...cards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  const markKnown = () => {
    setKnownCount((prev) => prev + 1);
    handleNext();
  };

  const markReview = () => {
    setReviewCount((prev) => prev + 1);
    handleNext();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveNav('home')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Interactive Study Flashcards
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold">
              Active Recall
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Synthesized key definitions and high-yield exam checkpoints for: <strong>{topicTitle}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShuffle}
            icon={<Shuffle className="w-3.5 h-3.5 text-[#64748B]" />}
          >
            Shuffle
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveNav('quiz')}
            className="bg-[#4338CA] hover:bg-[#3730A3]"
          >
            Take Exam Quiz
          </Button>
        </div>
      </div>

      {/* Progress & Counter */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center justify-between shadow-xs text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#0F172A]">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="text-[#94A3B8]">•</span>
          <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] font-medium text-[11px]">
            {currentCard.category}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-[#16A34A] font-semibold">Mastered: {knownCount}</span>
          <span className="text-[#DC2626] font-semibold">Need Review: {reviewCount}</span>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[300px] sm:min-h-[340px] bg-white rounded-3xl border-2 border-[#CBD5E1] hover:border-[#4F46E5] shadow-md p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none relative group"
      >
        <div className="absolute top-5 right-5 flex items-center gap-1.5 text-xs text-[#94A3B8] group-hover:text-[#4F46E5]">
          <RotateCw className="w-4 h-4 transition-transform group-hover:rotate-45" />
          <span className="font-medium text-[11px]">Click to flip</span>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-4">
          {isFlipped ? 'Answer & Explanation' : 'Question / Concept Prompt'}
        </span>

        <div className="max-w-xl mx-auto space-y-4">
          <p
            className={`font-semibold leading-relaxed transition-all ${
              isFlipped ? 'text-base sm:text-lg text-[#1E293B]' : 'text-lg sm:text-2xl text-[#0F172A]'
            }`}
          >
            {isFlipped ? currentCard.back : currentCard.front}
          </p>

          {isFlipped && (
            <div className="pt-3 border-t border-[#E2E8F0] inline-block">
              <span className="font-mono text-xs text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-full font-bold">
                Source: {currentCard.source}
              </span>
            </div>
          )}
        </div>

        <div className="absolute bottom-5 text-[11px] text-[#94A3B8]">
          {isFlipped ? 'Tap card again to see question' : 'Tap anywhere to reveal verified answer'}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={handlePrev}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={handleNext}
            icon={<ChevronRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Next
          </Button>
        </div>

        {/* Confidence rating */}
        <div className="flex items-center gap-3">
          <button
            onClick={markReview}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] hover:bg-[#FEE2E2] font-semibold text-xs transition-colors cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Still Learning</span>
          </button>

          <button
            onClick={markKnown}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] hover:bg-[#DCFCE7] font-semibold text-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I Know This</span>
          </button>
        </div>
      </div>
    </div>
  );
};
