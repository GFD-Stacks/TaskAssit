import React, { useState } from 'react';
import {
  Brain,
  Flame,
  Swords,
  History,
  Plus,
  Search,
  CheckSquare,
  Square,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  FileText,
  Radio,
  Sliders
} from 'lucide-react';
import {
  BrandProfile,
  SocialTrend,
  CompetitorShift,
  DecisionRecord,
  TrendWatcherStatus
} from '../types';

interface SourcesPanelProps {
  currentBrand: BrandProfile;
  trends: SocialTrend[];
  competitors: CompetitorShift[];
  decisionHistory: DecisionRecord[];
  selectedTrend: SocialTrend | null;
  trendWatcherStatus?: TrendWatcherStatus;
  onToggleTrendWatcher?: () => void;
  onChangeTrendWatcherInterval?: (minutes: number) => void;
  onTriggerTrendWatcherPoll?: () => void;
  onSelectTrend: (trend: SocialTrend) => void;
  onOpenWhatIfForTrend: (trend: SocialTrend) => void;
  onOpenAddSource: () => void;
  onQuickQuery: (query: string) => void;
}

type TabType = 'trends' | 'brand-brain' | 'competitors' | 'decisions';

export const SourcesPanel: React.FC<SourcesPanelProps> = ({
  currentBrand,
  trends,
  competitors,
  decisionHistory,
  selectedTrend,
  trendWatcherStatus,
  onToggleTrendWatcher,
  onChangeTrendWatcherInterval,
  onTriggerTrendWatcherPoll,
  onSelectTrend,
  onOpenWhatIfForTrend,
  onOpenAddSource,
  onQuickQuery
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('trends');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([
    'brand-dna',
    'trend-heat-stream',
    'competitor-stream',
    'decision-memory'
  ]);

  const toggleSourceSelection = (id: string) => {
    if (selectedSourceIds.includes(id)) {
      setSelectedSourceIds(selectedSourceIds.filter((item) => item !== id));
    } else {
      setSelectedSourceIds([...selectedSourceIds, id]);
    }
  };

  const filteredTrends = trends.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.dna.culturalContext.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'avoid' && t.recommendation === 'do_not_use') ||
      (categoryFilter === 'act_now' && t.recommendation === 'act_now') ||
      t.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const getLifecycleColor = (lifecycle: string) => {
    switch (lifecycle) {
      case 'emerging':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'heating':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'viral':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'mainstream':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'saturating':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'dead':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <aside className="w-80 border-r border-[#2d2f31] bg-[#1e1f20] flex flex-col h-full flex-shrink-0 select-none">
      {/* Panel Header */}
      <div className="p-3 border-b border-[#2d2f31]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Sources & Intelligence</span>
          </div>
          <button
            onClick={onOpenAddSource}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-[11px] text-blue-400 font-medium transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Source</span>
          </button>
        </div>

        {/* Source selector status */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
          <span>{selectedSourceIds.length} sources active in reasoning</span>
          <button
            onClick={() => setSelectedSourceIds(['brand-dna', 'trend-heat-stream', 'competitor-stream', 'decision-memory'])}
            className="text-blue-400 hover:underline"
          >
            Select All
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 border-b border-[#2d2f31] bg-[#171819] text-[11px] font-medium text-gray-400">
        <button
          onClick={() => setActiveTab('trends')}
          className={`py-2 px-1 text-center flex flex-col items-center gap-1 transition-colors border-b-2 ${
            activeTab === 'trends'
              ? 'text-blue-400 border-blue-500 bg-[#1e1f20]'
              : 'border-transparent hover:text-gray-200 hover:bg-[#1a1b1c]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Heat ({trends.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('brand-brain')}
          className={`py-2 px-1 text-center flex flex-col items-center gap-1 transition-colors border-b-2 ${
            activeTab === 'brand-brain'
              ? 'text-blue-400 border-blue-500 bg-[#1e1f20]'
              : 'border-transparent hover:text-gray-200 hover:bg-[#1a1b1c]'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Brand</span>
        </button>

        <button
          onClick={() => setActiveTab('competitors')}
          className={`py-2 px-1 text-center flex flex-col items-center gap-1 transition-colors border-b-2 ${
            activeTab === 'competitors'
              ? 'text-blue-400 border-blue-500 bg-[#1e1f20]'
              : 'border-transparent hover:text-gray-200 hover:bg-[#1a1b1c]'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Rivals</span>
        </button>

        <button
          onClick={() => setActiveTab('decisions')}
          className={`py-2 px-1 text-center flex flex-col items-center gap-1 transition-colors border-b-2 ${
            activeTab === 'decisions'
              ? 'text-blue-400 border-blue-500 bg-[#1e1f20]'
              : 'border-transparent hover:text-gray-200 hover:bg-[#1a1b1c]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Log ({decisionHistory.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
        {/* TAB 1: SOCIAL HEAT & TRENDS */}
        {activeTab === 'trends' && (
          <div className="space-y-2.5">
            {/* Automated Trend Watcher Radar Widget */}
            <div className="p-3 rounded-xl bg-gradient-to-b from-[#25282c] to-[#1c1d1f] border border-[#383c40] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-100">
                  <Radio className={`w-3.5 h-3.5 ${trendWatcherStatus?.enabled ? 'text-emerald-400 animate-pulse' : 'text-gray-400'}`} />
                  <span>Automated Trend Watcher</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {onToggleTrendWatcher && (
                    <button
                      onClick={onToggleTrendWatcher}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors cursor-pointer ${
                        trendWatcherStatus?.enabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-gray-700/50 text-gray-400 border border-gray-600'
                      }`}
                      title={trendWatcherStatus?.enabled ? 'Click to Pause Polling' : 'Click to Enable Polling'}
                    >
                      {trendWatcherStatus?.enabled ? 'Active' : 'Paused'}
                    </button>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-gray-400 flex items-center justify-between mb-2">
                <span>Polling Google Search every:</span>
                {onChangeTrendWatcherInterval ? (
                  <select
                    value={trendWatcherStatus?.intervalMinutes || 30}
                    onChange={(e) => onChangeTrendWatcherInterval(Number(e.target.value))}
                    className="bg-[#171819] text-gray-200 border border-[#3c4043] rounded px-1.5 py-0.5 text-[10px] focus:outline-none cursor-pointer"
                  >
                    <option value={5}>5 mins (Fast)</option>
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins (Default)</option>
                    <option value={60}>60 mins</option>
                  </select>
                ) : (
                  <span className="font-semibold text-gray-200">{trendWatcherStatus?.intervalMinutes || 30}m</span>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1.5 border-t border-[#2d2f31]">
                <div className="truncate">
                  <span>Last Scan: </span>
                  <span className="text-gray-300 font-mono">{trendWatcherStatus?.lastPolledAt || 'Active'}</span>
                </div>

                {onTriggerTrendWatcherPoll && (
                  <button
                    onClick={onTriggerTrendWatcherPoll}
                    disabled={trendWatcherStatus?.isPolling}
                    className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline disabled:opacity-50 cursor-pointer font-medium"
                  >
                    <TrendingUp className={`w-3 h-3 ${trendWatcherStatus?.isPolling ? 'animate-spin' : ''}`} />
                    <span>{trendWatcherStatus?.isPolling ? 'Polling...' : 'Poll Now'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search & Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cultural signals, slang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-[#282a2c] border border-[#3c4043] rounded-lg text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Quick Category Chips */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] scrollbar-none">
              {['all', 'act_now', 'Slang', 'Aesthetic', 'avoid'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded-full border capitalize whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-medium'
                      : 'bg-[#282a2c] text-gray-400 border-[#3c4043] hover:text-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All Signals' : cat === 'act_now' ? '🔥 Act Now' : cat === 'avoid' ? '🚫 Avoid List' : cat}
                </button>
              ))}
            </div>

            {/* Signals List */}
            <div className="space-y-2">
              {filteredTrends.map((trend) => {
                const fitScore = trend.fitScores[currentBrand.id]?.overallScore ?? trend.dna.commercialAdaptability;
                const isSelected = selectedTrend?.id === trend.id;

                return (
                  <div
                    key={trend.id}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#282a2c] border-blue-500/60 shadow-lg shadow-blue-500/5'
                        : 'bg-[#242527] border-[#333538] hover:border-[#44474a] hover:bg-[#282a2c]'
                    }`}
                    onClick={() => onSelectTrend(trend)}
                  >
                    <div className="flex items-start justify-between gap-1.5 mb-1.5">
                      <span className="font-semibold text-xs text-gray-100 leading-snug line-clamp-1">
                        {trend.title}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-medium tracking-wide flex-shrink-0 ${getLifecycleColor(
                          trend.dna.lifecycle
                        )}`}
                      >
                        {trend.dna.lifecycle}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                      {trend.dna.culturalContext}
                    </p>

                    {/* Metric Bars */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] mb-2.5">
                      <div className="bg-[#1e1f20] px-2 py-1 rounded border border-[#333538] flex items-center justify-between">
                        <span className="text-gray-400">Velocity:</span>
                        <span className="font-semibold text-amber-400">{trend.dna.velocity}/100</span>
                      </div>
                      <div className="bg-[#1e1f20] px-2 py-1 rounded border border-[#333538] flex items-center justify-between">
                        <span className="text-gray-400">Brand Fit:</span>
                        <span
                          className={`font-semibold ${
                            fitScore >= 80 ? 'text-emerald-400' : fitScore >= 60 ? 'text-amber-400' : 'text-red-400'
                          }`}
                        >
                          {fitScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#333538] text-[11px]">
                      {trend.recommendation === 'do_not_use' ? (
                        <div className="flex items-center gap-1 text-red-400 font-medium text-[10px]">
                          <ShieldAlert className="w-3 h-3" />
                          <span>DO NOT PARTICIPATE</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-emerald-400 font-medium text-[10px]">
                          <TrendingUp className="w-3 h-3" />
                          <span>Recommendation: Act Now</span>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenWhatIfForTrend(trend);
                        }}
                        className="px-2 py-0.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] flex items-center gap-1 font-medium transition-colors"
                        title="Simulate Decision Outcomes"
                      >
                        <Sliders className="w-2.5 h-2.5" />
                        <span>Simulate</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BRAND BRAIN */}
        {activeTab === 'brand-brain' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#242527] rounded-xl border border-[#333538] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-200 text-xs">{currentBrand.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {currentBrand.industry}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 italic">"{currentBrand.tagline}"</p>
            </div>

            {/* Brand Voice & Positioning */}
            <div className="p-3 bg-[#242527] rounded-xl border border-[#333538] space-y-1.5">
              <div className="font-semibold text-gray-300 text-[11px] uppercase tracking-wider">
                Brand Voice & Tone
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">{currentBrand.voice}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {currentBrand.toneKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-1.5 py-0.5 bg-[#1e1f20] border border-[#333538] rounded text-[10px] text-gray-300"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="p-3 bg-[#242527] rounded-xl border border-[#333538] space-y-1.5">
              <div className="font-semibold text-gray-300 text-[11px] uppercase tracking-wider">
                Audience Profile
              </div>
              <div className="text-[11px] text-gray-300">
                <span className="text-gray-400 font-medium">Primary:</span> {currentBrand.primaryAudience}
              </div>
              <div className="text-[11px] text-gray-300">
                <span className="text-gray-400 font-medium">Secondary:</span> {currentBrand.secondaryAudience}
              </div>
              <div className="text-[11px] text-gray-300">
                <span className="text-gray-400 font-medium">Markets:</span> {currentBrand.geographicMarket}
              </div>
            </div>

            {/* Prohibited Content Guardrails */}
            <div className="p-3 bg-red-950/20 rounded-xl border border-red-500/30 space-y-1.5">
              <div className="font-semibold text-red-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Strict Prohibited Guardrails</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-red-200/80 space-y-1">
                {currentBrand.prohibitedContent.map((rule, idx) => (
                  <li key={idx} className="leading-snug">{rule}</li>
                ))}
              </ul>
            </div>

            {/* Historical Objections & Learnings */}
            <div className="p-3 bg-[#242527] rounded-xl border border-[#333538] space-y-1.5">
              <div className="font-semibold text-gray-300 text-[11px] uppercase tracking-wider">
                Historical Calibration
              </div>
              <div className="text-[11px] text-gray-300 flex justify-between">
                <span className="text-gray-400">Top Performing Format:</span>
                <span className="font-medium text-blue-400 text-right max-w-[140px] truncate">{currentBrand.historicalPerformance.topFormat}</span>
              </div>
              <div className="text-[11px] text-gray-300 flex justify-between">
                <span className="text-gray-400">Main Customer Objection:</span>
                <span className="font-medium text-amber-400">{currentBrand.historicalPerformance.primaryObjection}</span>
              </div>
              <div className="text-[11px] text-gray-300 flex justify-between">
                <span className="text-gray-400">Model Accuracy:</span>
                <span className="font-medium text-emerald-400">{currentBrand.historicalPerformance.modelCalibrationAccuracy}%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPETITORS */}
        {activeTab === 'competitors' && (
          <div className="space-y-2.5">
            <div className="text-[11px] text-gray-400 px-1">
              Real-time monitoring of strategic repositioning and campaign moves.
            </div>
            {competitors.map((comp) => (
              <div
                key={comp.id}
                className="p-3 bg-[#242527] rounded-xl border border-[#333538] space-y-2 hover:border-[#44474a] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-gray-200">{comp.competitorName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-medium ${
                      comp.threatLevel === 'Critical'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {comp.threatLevel} Threat
                  </span>
                </div>

                <div className="text-[11px] space-y-1">
                  <div className="text-gray-400">
                    <span className="text-red-400 font-medium">Shifted From:</span> {comp.previousStrategy}
                  </div>
                  <div className="text-gray-200">
                    <span className="text-emerald-400 font-medium">Current Focus:</span> {comp.currentStrategy}
                  </div>
                </div>

                <div className="p-2 bg-[#1e1f20] rounded-lg border border-[#333538] text-[11px]">
                  <span className="text-blue-400 font-medium">Recommended Response:</span>
                  <p className="text-gray-300 mt-0.5">{comp.recommendedResponse}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: DECISION HISTORY & LEARNING */}
        {activeTab === 'decisions' && (
          <div className="space-y-2.5">
            <div className="text-[11px] text-gray-400 px-1 flex items-center justify-between">
              <span>Historical Decision Graph</span>
              <span className="text-emerald-400 font-medium">Closed-Loop Learning</span>
            </div>

            {decisionHistory.map((dec) => (
              <div
                key={dec.id}
                className="p-3 bg-[#242527] rounded-xl border border-[#333538] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-blue-400 font-semibold">{dec.decisionCode}</span>
                  <span className="text-[10px] text-gray-400">{dec.date}</span>
                </div>

                <p className="text-xs text-gray-200 font-medium leading-snug">{dec.question}</p>

                <div className="bg-[#1e1f20] p-2 rounded-lg border border-[#333538] text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Selected Option:</span>
                    <span className="text-gray-200 font-medium truncate max-w-[130px]">{dec.selectedOption}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Budget:</span>
                    <span className="text-gray-200">{dec.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Variance:</span>
                    <span className="text-emerald-400 font-semibold">{dec.variance}</span>
                  </div>
                </div>

                {dec.learningSummary && (
                  <div className="text-[10px] text-gray-400 bg-purple-950/20 p-2 rounded border border-purple-500/20 leading-relaxed">
                    <span className="text-purple-300 font-semibold">🧬 Social DNA Calibrated: </span>
                    {dec.learningSummary}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
