import React, { useState } from 'react';
import {
  Headphones,
  Presentation,
  Video,
  Network,
  FileText,
  CreditCard,
  HelpCircle,
  PieChart,
  Table as TableIcon,
  Sliders,
  Sparkles,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  BrandProfile,
  SocialTrend,
  DecisionSimulation,
  DecisionRecord,
  StudioAudioOverview,
  StudioSlideDeck,
  StudioVideoOverview,
  StudioMindMap,
  StudioReport,
  StudioFlashcard,
  StudioQuizQuestion,
  StudioInfographic,
  StudioDataTable,
  StudioToolType
} from '../types';

import { AudioOverviewModule } from './studio/AudioOverviewModule';
import { SlideDeckModule } from './studio/SlideDeckModule';
import { VideoOverviewModule } from './studio/VideoOverviewModule';
import { MindMapModule } from './studio/MindMapModule';
import { ReportsModule } from './studio/ReportsModule';
import { FlashcardsModule } from './studio/FlashcardsModule';
import { QuizModule } from './studio/QuizModule';
import { InfographicsModule } from './studio/InfographicsModule';
import { DataTableModule } from './studio/DataTableModule';
import { DecisionSandboxModule } from './studio/DecisionSandboxModule';

interface InteractionStudioProps {
  currentBrand: BrandProfile;
  trends: SocialTrend[];
  selectedTrend: SocialTrend | null;
  activeStudioTab: StudioToolType;
  onSelectStudioTab: (tab: StudioToolType) => void;
  audioData: StudioAudioOverview;
  onUpdateAudioData?: (newData: StudioAudioOverview) => void;
  slideDeck: StudioSlideDeck;
  videoData: StudioVideoOverview;
  mindMap: StudioMindMap;
  report: StudioReport;
  flashcards: StudioFlashcard[];
  quizQuestions: StudioQuizQuestion[];
  infographics: StudioInfographic[];
  dataTable: StudioDataTable;
  simulation: DecisionSimulation;
  onCommitDecision: (record: DecisionRecord) => void;
}

export const InteractionStudio: React.FC<InteractionStudioProps> = ({
  currentBrand,
  trends,
  selectedTrend,
  activeStudioTab,
  onSelectStudioTab,
  audioData,
  onUpdateAudioData,
  slideDeck,
  videoData,
  mindMap,
  report,
  flashcards,
  quizQuestions,
  infographics,
  dataTable,
  simulation,
  onCommitDecision
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tools: { id: StudioToolType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'decision_simulator', label: 'What-If Studio', icon: Sliders },
    { id: 'audio_overview', label: 'Audio Overview', icon: Headphones },
    { id: 'slide_deck', label: 'Slide Deck', icon: Presentation },
    { id: 'video_overview', label: 'Video Overview', icon: Video },
    { id: 'mind_map', label: 'Mind Map', icon: Network },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'flashcards', label: 'Flashcards', icon: CreditCard },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'infographic', label: 'Infographic', icon: PieChart },
    { id: 'data_table', label: 'Data Table', icon: TableIcon }
  ];

  return (
    <div
      className={`border-l border-[#2d2f31] bg-[#1e1f20] flex flex-col h-full transition-all duration-200 select-none ${
        isExpanded ? 'w-[680px]' : 'w-[420px]'
      }`}
    >
      {/* Studio Top Bar */}
      <div className="p-3 border-b border-[#2d2f31] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-gray-200 tracking-tight">
            Interaction Studio
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#282a2c] text-gray-400 border border-[#3c4043]">
            10 Tools
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#282a2c] transition-colors"
            title={isExpanded ? 'Collapse studio width' : 'Expand studio width'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Tool Icons Rail */}
      <div className="p-2 border-b border-[#2d2f31] bg-[#171819] overflow-x-auto scrollbar-none flex gap-1">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeStudioTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectStudioTab(t.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'bg-[#242527] text-gray-400 border border-[#333538] hover:text-gray-200 hover:bg-[#282a2c]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Studio View Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeStudioTab === 'audio_overview' && (
          <AudioOverviewModule
            audioData={audioData}
            currentBrand={currentBrand}
            selectedTrend={selectedTrend}
            onUpdateAudioData={onUpdateAudioData}
          />
        )}
        {activeStudioTab === 'slide_deck' && (
          <SlideDeckModule slideDeck={slideDeck} />
        )}
        {activeStudioTab === 'video_overview' && (
          <VideoOverviewModule videoData={videoData} />
        )}
        {activeStudioTab === 'mind_map' && (
          <MindMapModule mindMap={mindMap} />
        )}
        {activeStudioTab === 'reports' && (
          <ReportsModule report={report} />
        )}
        {activeStudioTab === 'flashcards' && (
          <FlashcardsModule flashcards={flashcards} />
        )}
        {activeStudioTab === 'quiz' && (
          <QuizModule quizQuestions={quizQuestions} />
        )}
        {activeStudioTab === 'infographic' && (
          <InfographicsModule infographics={infographics} />
        )}
        {activeStudioTab === 'data_table' && (
          <DataTableModule dataTable={dataTable} />
        )}
        {activeStudioTab === 'decision_simulator' && (
          <DecisionSandboxModule
            currentBrand={currentBrand}
            trends={trends}
            initialSimulation={simulation}
            onCommitDecision={onCommitDecision}
          />
        )}
      </div>
    </div>
  );
};
