import React, { useState } from 'react';
import {
  CreditCard,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Award
} from 'lucide-react';
import { StudioFlashcard } from '../../types';

interface FlashcardsModuleProps {
  flashcards: StudioFlashcard[];
}

export const FlashcardsModule: React.FC<FlashcardsModuleProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const currentCard = flashcards[currentIndex] || flashcards[0];
  const isMastered = masteredIds.includes(currentCard.id);

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const toggleMastery = (id: string) => {
    if (masteredIds.includes(id)) {
      setMasteredIds(masteredIds.filter((item) => item !== id));
    } else {
      setMasteredIds([...masteredIds, id]);
    }
  };

  return (
    <div className="space-y-4 text-gray-200">
      {/* Header & Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-blue-400" />
            <span>Social Strategy & Brand DNA Flashcards</span>
          </h3>
          <p className="text-[11px] text-gray-400">
            Card {currentIndex + 1} of {flashcards.length} • {masteredIds.length} Mastered
          </p>
        </div>

        <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {currentCard.category}
        </span>
      </div>

      {/* 3D Flip Card Canvas */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative h-64 w-full cursor-pointer perspective-1000 select-none group"
      >
        <div
          className={`relative w-full h-full rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between shadow-2xl ${
            isFlipped
              ? 'bg-gradient-to-br from-[#1e1f20] to-[#282a2c] border-blue-500/40 text-gray-100 shadow-blue-500/5'
              : 'bg-gradient-to-br from-[#242527] to-[#1f2022] border-[#3c4043] group-hover:border-[#4c5054]'
          }`}
        >
          {/* Card Top Label */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-mono text-[10px] uppercase font-semibold text-blue-400 tracking-wider">
              {isFlipped ? 'Answer & Strategic Context' : 'Concept / Question'}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
              <span>Tap to flip</span>
            </div>
          </div>

          {/* Card Content Body */}
          <div className="my-auto text-center space-y-2">
            {!isFlipped ? (
              <h2 className="text-base sm:text-lg font-bold text-gray-100 leading-snug">
                {currentCard.front}
              </h2>
            ) : (
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-blue-200 font-medium leading-relaxed">
                  {currentCard.back}
                </p>
                {currentCard.context && (
                  <div className="text-[11px] text-gray-400 italic bg-[#171819] p-2 rounded-lg border border-[#333538]">
                    Context: {currentCard.context}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-[#333538]">
            <span className="font-mono">#{currentCard.id}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMastery(currentCard.id);
              }}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors ${
                isMastered
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'bg-[#1e1f20] text-gray-400 hover:text-gray-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isMastered ? 'Mastered' : 'Mark as Mastered'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] disabled:opacity-40 text-xs font-medium text-gray-200 border border-[#3c4043] flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Card</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] disabled:opacity-40 text-xs font-medium text-gray-200 border border-[#3c4043] flex items-center gap-1 transition-colors"
        >
          <span>Next Card</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
