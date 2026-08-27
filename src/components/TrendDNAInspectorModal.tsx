import React, { useState } from 'react';
import {
  X,
  Flame,
  Dna,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Copy,
  Check,
  Sliders,
  Send
} from 'lucide-react';
import { SocialTrend, BrandProfile } from '../types';

interface TrendDNAInspectorModalProps {
  trend: SocialTrend;
  brand: BrandProfile;
  isOpen: boolean;
  onClose: () => void;
  onSimulateTrend: (trend: SocialTrend) => void;
  onDraftContent: (trendTitle: string, format: string) => void;
}

export const TrendDNAInspectorModal: React.FC<TrendDNAInspectorModalProps> = ({
  trend,
  brand,
  isOpen,
  onClose,
  onSimulateTrend,
  onDraftContent
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dna' | 'ideas' | 'fit'>('dna');

  if (!isOpen) return null;

  const fitScore = trend.fitScores[brand.id] || {
    audienceRelevance: 90,
    brandRelevance: 85,
    culturalRelevance: 92,
    commercialPotential: 88,
    timing: 94,
    saturationRisk: 25,
    brandSafety: 88,
    overallScore: 89
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-[#1e1f20] border border-[#3c4043] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden select-none text-gray-200">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-[#2d2f31] flex items-center justify-between bg-[#242527] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-100">{trend.title}</h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                  {trend.dna.lifecycle}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Origin: {trend.originPlatform} • Velocity: {trend.dna.velocity}/100 • Brand: {brand.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onSimulateTrend(trend);
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulate Decision</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#282a2c] hover:bg-[#333538] text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#2d2f31] bg-[#171819] px-4 text-xs font-medium text-gray-400">
          <button
            onClick={() => setActiveTab('dna')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'dna'
                ? 'text-blue-400 border-blue-500 bg-[#1e1f20]'
                : 'border-transparent hover:text-gray-200'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span>Trend DNA & Pattern</span>
          </button>

          <button
            onClick={() => setActiveTab('ideas')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'ideas'
                ? 'text-blue-400 border-blue-500 bg-[#1e1f20]'
                : 'border-transparent hover:text-gray-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>10 Content Applications ({trend.ideas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fit')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'fit'
                ? 'text-blue-400 border-blue-500 bg-[#1e1f20]'
                : 'border-transparent hover:text-gray-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Fit Score & Risk Radar</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 space-y-4">
          {/* TAB 1: TREND DNA & UNDERLYING PATTERN */}
          {activeTab === 'dna' && (
            <div className="space-y-4">
              {/* Cultural Context */}
              <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-2">
                <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                  Cultural Context & Origin
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {trend.dna.culturalContext}
                </p>
                <div className="text-xs text-gray-400 italic pt-1">
                  Example Quote: <span className="text-gray-300 font-medium">"{trend.quoteExample}"</span>
                </div>
              </div>

              {/* Core DNA Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-[#242527] rounded-xl border border-[#3c4043]">
                  <div className="text-[10px] text-gray-400 uppercase">Emotion</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">{trend.dna.emotion}</div>
                </div>
                <div className="p-3 bg-[#242527] rounded-xl border border-[#3c4043]">
                  <div className="text-[10px] text-gray-400 uppercase">Tone</div>
                  <div className="text-xs font-bold text-purple-400 mt-0.5">{trend.dna.tone}</div>
                </div>
                <div className="p-3 bg-[#242527] rounded-xl border border-[#3c4043]">
                  <div className="text-[10px] text-gray-400 uppercase">Lifespan Window</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">{trend.dna.recommendedLifespanDays} Days</div>
                </div>
                <div className="p-3 bg-[#242527] rounded-xl border border-[#3c4043]">
                  <div className="text-[10px] text-gray-400 uppercase">Brand Safety</div>
                  <div className="text-xs font-bold text-blue-400 mt-0.5">{trend.dna.brandSafetyScore}/100</div>
                </div>
              </div>

              {/* Underlying Cultural Pattern */}
              <div className="p-4 bg-gradient-to-br from-[#171819] to-[#242527] rounded-2xl border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Underlying Cultural Pattern: {trend.dna.underlyingPattern.patternName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">Cultural Psychology</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-gray-300">
                    <span className="text-purple-400 font-semibold">Linguistic Syntax: </span>
                    {trend.dna.underlyingPattern.linguisticStructure}
                  </div>
                  <div className="text-gray-300">
                    <span className="text-blue-400 font-semibold">Rhythm & Cadence: </span>
                    {trend.dna.underlyingPattern.rhythm}
                  </div>
                  <div className="text-gray-300">
                    <span className="text-emerald-400 font-semibold">Social Utility: </span>
                    {trend.dna.underlyingPattern.socialFunction}
                  </div>
                </div>

                {/* Brand-Safe Adaptations */}
                <div className="pt-2 border-t border-[#333538] space-y-1.5">
                  <div className="text-[11px] font-semibold text-gray-300">
                    Recommended Brand-Safe Adaptations:
                  </div>
                  {trend.dna.underlyingPattern.brandSafeAdaptations.map((adapt, i) => (
                    <div
                      key={i}
                      className="p-2 bg-[#1e1f20] rounded-lg border border-[#333538] text-xs text-gray-200 italic flex items-center justify-between"
                    >
                      <span>"{adapt}"</span>
                      <button
                        onClick={() => handleCopy(adapt, `adapt-${i}`)}
                        className="text-gray-400 hover:text-gray-200 ml-2"
                      >
                        {copiedId === `adapt-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 10 STRATEGIC CONTENT IDEAS */}
          {activeTab === 'ideas' && (
            <div className="space-y-3">
              <div className="text-xs text-gray-400">
                10 distinct commercial applications mapped to {brand.name}’s voice and audience.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {trend.ideas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-3.5 bg-[#242527] rounded-2xl border border-[#3c4043] hover:border-[#4c5054] transition-colors space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono text-blue-400 font-bold">
                          #{idea.number} {idea.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono px-1.5 py-0.5 bg-[#1e1f20] rounded">
                          {idea.targetPlatform}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-gray-100">{idea.headline}</h4>
                      <p className="text-[11px] text-emerald-300/90 font-medium italic mt-1">
                        "{idea.hook}"
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        {idea.sampleCopy}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#333538] flex items-center justify-between text-[11px]">
                      <span className="text-gray-400 text-[10px]">{idea.format}</span>
                      <button
                        onClick={() => {
                          onClose();
                          onDraftContent(trend.title, idea.format);
                        }}
                        className="px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Draft Asset</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FIT SCORE & RISK RADAR */}
          {activeTab === 'fit' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Overall Brand Fit Score
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-0.5">
                    {fitScore.overallScore} / 100
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Strategic Directive
                  </span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {trend.recommendation === 'act_now' ? '🔥 ACT NOW' : trend.recommendation === 'do_not_use' ? '🚫 STRICT ABSTAIN' : 'PASSIVE MONITOR'}
                  </div>
                </div>
              </div>

              {/* 7 Dimensions of Fit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Audience Relevance', score: fitScore.audienceRelevance, desc: 'Resonance with primary target age & cultural taste' },
                  { label: 'Brand Relevance', score: fitScore.brandRelevance, desc: 'Alignment with brand positioning & premium tone' },
                  { label: 'Cultural Relevance', score: fitScore.culturalRelevance, desc: 'Authenticity within Nigerian and diaspora pop culture' },
                  { label: 'Commercial Potential', score: fitScore.commercialPotential, desc: 'Ability to translate attention into product waitlists' },
                  { label: 'Timing & Lifecycle', score: fitScore.timing, desc: 'Optimal timing window before saturation occurs' },
                  { label: 'Brand Safety Index', score: fitScore.brandSafety, desc: 'Zero conflict with brand guardrails & controversy' }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-[#242527] rounded-xl border border-[#3c4043] space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-200">{item.label}</span>
                      <span className="text-emerald-400 font-mono">{item.score}%</span>
                    </div>
                    <div className="w-full bg-[#1e1f20] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
