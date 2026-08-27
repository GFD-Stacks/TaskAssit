import React, { useState } from 'react';
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Download,
  Presentation,
  CheckCircle2,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { StudioSlideDeck } from '../../types';

interface SlideDeckModuleProps {
  slideDeck: StudioSlideDeck;
}

export const SlideDeckModule: React.FC<SlideDeckModuleProps> = ({ slideDeck }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSlide = slideDeck.slides[currentSlideIndex] || slideDeck.slides[0];
  const totalSlides = slideDeck.slides.length;

  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) setCurrentSlideIndex(currentSlideIndex + 1);
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) setCurrentSlideIndex(currentSlideIndex - 1);
  };

  const handleDownloadDeck = () => {
    const textContent = `${slideDeck.title}\n${slideDeck.subtitle}\n\n` +
      slideDeck.slides.map((s) => `--- SLIDE ${s.slideNumber}: ${s.title} ---\n${s.subtitle}\n\nBullets:\n${s.bullets.map((b) => `• ${b}`).join('\n')}\n\nMetric: ${s.metricLabel || ''}: ${s.metricValue || ''}\nStrategic Note: ${s.strategicNote}\n`).join('\n\n');

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TaskAssit_Executive_Deck_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="space-y-4 text-gray-200">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
            <Presentation className="w-3.5 h-3.5 text-blue-400" />
            <span>Executive Presentation (10 Slides)</span>
          </h3>
          <p className="text-[11px] text-gray-400">{slideDeck.subtitle}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-300 text-xs flex items-center gap-1 transition-colors"
            title="Present Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Present</span>
          </button>

          <button
            onClick={handleDownloadDeck}
            className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-300 text-xs flex items-center gap-1 transition-colors"
            title="Export Slide Deck"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Slide Viewer Canvas */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-[#171819] via-[#1f2022] to-[#282a2c] rounded-2xl border border-[#3c4043] p-5 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Slide Header */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
            <span className="font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              SLIDE {currentSlide.slideNumber} / {totalSlides}
            </span>
            <span className="text-gray-400 font-medium">TaskAssit Intelligence</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-gray-100 leading-tight">
            {currentSlide.title}
          </h2>
          <p className="text-xs text-blue-300/90 mt-0.5 font-medium">{currentSlide.subtitle}</p>
        </div>

        {/* Slide Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
          <div className="md:col-span-2 space-y-2">
            {currentSlide.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>

          {/* Highlight KPI Card */}
          {currentSlide.metricValue && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-950/40 to-[#1e1f20] border border-blue-500/30 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                {currentSlide.metricLabel || 'Key Focus Metric'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-300 mt-0.5">
                {currentSlide.metricValue}
              </span>
              <span className="text-[9px] text-emerald-400 font-medium mt-1">Verified Telemetry</span>
            </div>
          )}
        </div>

        {/* Slide Footer */}
        <div className="pt-2.5 border-t border-[#333538] flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5 truncate max-w-[80%]">
            <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="truncate italic">{currentSlide.strategicNote}</span>
          </div>
          <span className="font-mono text-gray-400">{currentSlide.slideNumber}</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] disabled:opacity-40 disabled:hover:bg-[#282a2c] text-xs font-medium text-gray-200 border border-[#3c4043] flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === totalSlides - 1}
            className="px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] disabled:opacity-40 disabled:hover:bg-[#282a2c] text-xs font-medium text-gray-200 border border-[#3c4043] flex items-center gap-1 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <span className="text-xs font-mono text-gray-400">
          Slide {currentSlideIndex + 1} of {totalSlides}
        </span>
      </div>

      {/* Slide Thumbnails Rail */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1">
          Slide Overview
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#3c4043]">
          {slideDeck.slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlideIndex(i)}
              className={`w-32 flex-shrink-0 p-2 rounded-xl border text-left transition-all ${
                currentSlideIndex === i
                  ? 'bg-[#282a2c] border-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-[#242527] border-[#333538] hover:border-[#44474a]'
              }`}
            >
              <div className="text-[10px] font-mono text-blue-400 font-semibold mb-0.5">
                0{s.slideNumber}
              </div>
              <div className="text-[11px] font-medium text-gray-200 line-clamp-2 leading-snug">
                {s.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Presentation Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-[#0d0e0f]/95 backdrop-blur-md z-50 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-200 text-sm">{slideDeck.title}</span>
              <span className="text-xs font-mono px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded">
                Slide {currentSlide.slideNumber} / {totalSlides}
              </span>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-4xl w-full mx-auto p-8 bg-gradient-to-br from-[#1e1f20] to-[#282a2c] rounded-3xl border border-[#3c4043] shadow-2xl space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">{currentSlide.title}</h1>
              <p className="text-base text-blue-300 mt-1 font-medium">{currentSlide.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-3">
                {currentSlide.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-base text-gray-200 leading-relaxed">
                    <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {currentSlide.metricValue && (
                <div className="p-6 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex flex-col justify-center items-center text-center">
                  <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                    {currentSlide.metricLabel}
                  </span>
                  <span className="text-4xl font-black text-blue-300 mt-2">
                    {currentSlide.metricValue}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#333538] text-sm text-gray-400 italic">
              Strategic Note: {currentSlide.strategicNote}
            </div>
          </div>

          <div className="flex items-center justify-between max-w-4xl w-full mx-auto">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#282a2c] hover:bg-[#333538] text-sm text-gray-200 border border-[#3c4043] flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>
            <span className="text-xs text-gray-400">Use arrow buttons to navigate</span>
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === totalSlides - 1}
              className="px-4 py-2 rounded-xl bg-[#282a2c] hover:bg-[#333538] text-sm text-gray-200 border border-[#3c4043] flex items-center gap-1.5"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
