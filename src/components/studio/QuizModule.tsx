import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import { StudioQuizQuestion } from '../../types';

interface QuizModuleProps {
  quizQuestions: StudioQuizQuestion[];
}

export const QuizModule: React.FC<QuizModuleProps> = ({ quizQuestions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);

  const currentQ = quizQuestions[currentQuestionIndex] || quizQuestions[0];
  const isCurrentSubmitted = submitted[currentQuestionIndex];
  const selectedChoice = selectedAnswers[currentQuestionIndex];

  const handleSelect = (choiceIndex: number) => {
    if (isCurrentSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: choiceIndex });
  };

  const handleSubmitQuestion = () => {
    if (selectedChoice === undefined || isCurrentSubmitted) return;

    const isCorrect = selectedChoice === currentQ.correctAnswerIndex;
    if (isCorrect) setScore((s) => s + 20);

    setSubmitted({ ...submitted, [currentQuestionIndex]: true });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmitted({});
    setScore(0);
  };

  const isCompleted = Object.keys(submitted).length === quizQuestions.length;

  return (
    <div className="space-y-4 text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Brand Fluency & Decision Quiz</span>
          </h3>
          <p className="text-[11px] text-gray-400">
            Question {currentQuestionIndex + 1} of {quizQuestions.length} • Current Score: {score}/100
          </p>
        </div>

        <button
          onClick={handleResetQuiz}
          className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-400 hover:text-gray-200 text-xs transition-colors"
          title="Restart Quiz"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Question Card */}
      <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            QUESTION 0{currentQuestionIndex + 1}
          </span>
          <span className="text-gray-400 text-[11px]">{currentQ.category}</span>
        </div>

        <h2 className="text-sm sm:text-base font-bold text-gray-100 leading-snug">
          {currentQ.question}
        </h2>

        {/* Options List */}
        <div className="space-y-2">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedChoice === idx;
            const isCorrect = idx === currentQ.correctAnswerIndex;

            let optionStyle = 'bg-[#1e1f20] border-[#333538] hover:border-[#44474a] text-gray-200';
            if (isSelected) {
              optionStyle = 'bg-blue-500/15 border-blue-500/60 text-blue-100 font-medium';
            }
            if (isCurrentSubmitted) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-100 font-medium';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-red-500/20 border-red-500 text-red-100';
              }
            }

            return (
              <button
                key={idx}
                disabled={isCurrentSubmitted}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${optionStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-gray-400 text-[11px]">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </div>

                {isCurrentSubmitted && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
                {isCurrentSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Box on Submit */}
        {isCurrentSubmitted && (
          <div className="p-3 bg-[#171819] rounded-xl border border-[#333538] text-xs space-y-1 animate-fade-in">
            <div className="font-semibold text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explanation & Brand Reasoning</span>
            </div>
            <p className="text-gray-300 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          {!isCurrentSubmitted ? (
            <button
              onClick={handleSubmitQuestion}
              disabled={selectedChoice === undefined}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-semibold text-white transition-colors"
            >
              Submit Answer
            </button>
          ) : currentQuestionIndex < quizQuestions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1 transition-colors"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400">Quiz Completed!</span>
              <button
                onClick={handleResetQuiz}
                className="px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-xs font-medium text-gray-200 border border-[#3c4043]"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
