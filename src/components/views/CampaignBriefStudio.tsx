import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Sparkles,
  Plus,
  Target,
  Calendar,
  DollarSign,
  Layers,
  Hash,
  ArrowRight,
  CheckCircle2,
  Share2,
  Trash2,
  Copy,
  Clock,
  Send,
  HelpCircle,
  Tag
} from 'lucide-react';
import { BrandProfile, CampaignBrief, SocialPlatformType } from '../../types';

interface CampaignBriefStudioProps {
  currentBrand: BrandProfile;
  briefs: CampaignBrief[];
  onSaveBrief: (brief: CampaignBrief) => void;
  onDeleteBrief: (briefId: string) => void;
  onDraftPostsFromBrief: (brief: CampaignBrief) => void;
  onGenerateCalendarFromBrief: (brief: CampaignBrief) => void;
}

export const CampaignBriefStudio: React.FC<CampaignBriefStudioProps> = ({
  currentBrand,
  briefs,
  onSaveBrief,
  onDeleteBrief,
  onDraftPostsFromBrief,
  onGenerateCalendarFromBrief
}) => {
  const [selectedBrief, setSelectedBrief] = useState<CampaignBrief | null>(briefs[0] || null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State for new/editing brief
  const [campaignType, setCampaignType] = useState<CampaignBrief['campaignType']>('product_launch');
  const [primaryProductOrEvent, setPrimaryProductOrEvent] = useState('Autumn Silk Jacquard Capsule');
  const [targetAudience, setTargetAudience] = useState(currentBrand.primaryAudience);
  const [keyMessage, setKeyMessage] = useState('African heritage tailored for global power — handcrafted in limited quantities of 40 pieces.');
  const [budget, setBudget] = useState('₦350,000 / $500');
  const [timeline, setTimeline] = useState('14 Days');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatformType[]>([
    'instagram',
    'tiktok',
    'x',
    'linkedin'
  ]);

  const handleTogglePlatform = (p: SocialPlatformType) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleGenerateBriefWithAI = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: currentBrand,
          campaignType,
          primaryProductOrEvent,
          targetAudience,
          keyMessage,
          budget,
          timeline,
          targetPlatforms: selectedPlatforms
        })
      });

      if (res.ok) {
        const newBrief: CampaignBrief = await res.json();
        onSaveBrief(newBrief);
        setSelectedBrief(newBrief);
        setIsCreatingNew(false);
      }
    } catch (err) {
      console.error('Error generating brief:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#171819] text-gray-200">
      {/* Left Column: Briefs Explorer & Creator */}
      <div className="w-80 border-r border-[#2d2f31] bg-[#1e1f20] flex flex-col flex-shrink-0">
        <div className="p-3.5 border-b border-[#2d2f31] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-xs tracking-tight text-gray-100">
              Campaign Briefs ({briefs.length})
            </span>
          </div>
          <button
            onClick={() => setIsCreatingNew(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Brief</span>
          </button>
        </div>

        {/* Briefs List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {briefs.map((brief) => {
            const isSelected = selectedBrief?.id === brief.id && !isCreatingNew;
            return (
              <div
                key={brief.id}
                onClick={() => {
                  setSelectedBrief(brief);
                  setIsCreatingNew(false);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#282a2c] border-blue-500/50 shadow-md shadow-blue-500/5'
                    : 'bg-[#232427] hover:bg-[#282a2c] border-[#34373a]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-gray-100 line-clamp-1">
                    {brief.title}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded capitalize font-medium ${
                      brief.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-gray-700/50 text-gray-300'
                    }`}
                  >
                    {brief.status}
                  </span>
                </div>

                <div className="text-[11px] text-gray-400 line-clamp-2 mb-2">
                  {brief.keyMessage}
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-[#34373a]">
                  <span>{brief.deliverablesCount} Deliverables</span>
                  <span className="capitalize">{brief.campaignType.replace('_', ' ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center/Right: Brief Content or Brief Creation Wizard */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#171819] p-3 sm:p-5 md:p-6 lg:p-8">
        {isCreatingNew ? (
          <div className="max-w-3xl mx-auto w-full bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#2d2f31]">
              <div>
                <h2 className="text-base font-semibold text-gray-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  AI Campaign Brief Generator
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Input campaign objectives, product details, and target channels for{' '}
                  <span className="text-blue-300 font-medium">{currentBrand.name}</span>.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingNew(false)}
                className="text-xs text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Campaign Type */}
              <div>
                <label className="block text-gray-300 font-medium mb-1.5">Campaign Objective</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'product_launch', label: '🚀 Product Launch' },
                    { id: 'brand_awareness', label: '🌟 Brand Awareness' },
                    { id: 'seasonal_event', label: '🎉 Seasonal Event' },
                    { id: 'lead_gen', label: '🎯 VIP Waitlist & Leads' },
                    { id: 'community', label: '🤝 Community Story' },
                    { id: 'flash_sale', label: '⚡ Limited Allocation' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCampaignType(t.id as any)}
                      className={`px-3 py-2 rounded-lg border text-left font-medium transition-all ${
                        campaignType === t.id
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                          : 'bg-[#282a2c] border-[#3c4043] text-gray-300 hover:bg-[#333538]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product / Event Focus */}
              <div>
                <label className="block text-gray-300 font-medium mb-1.5">
                  Product / Service / Event Name
                </label>
                <input
                  type="text"
                  value={primaryProductOrEvent}
                  onChange={(e) => setPrimaryProductOrEvent(e.target.value)}
                  placeholder="e.g. Autumn Bespoke Silk Capsule, London Pop-Up Event"
                  className="w-full bg-[#282a2c] border border-[#3c4043] rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Core Key Message */}
              <div>
                <label className="block text-gray-300 font-medium mb-1.5">
                  Core Key Message & Proposition
                </label>
                <textarea
                  rows={2}
                  value={keyMessage}
                  onChange={(e) => setKeyMessage(e.target.value)}
                  placeholder="What is the singular takeaway the audience must understand and remember?"
                  className="w-full bg-[#282a2c] border border-[#3c4043] rounded-lg p-3 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Audience & Budget Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1.5">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-[#282a2c] border border-[#3c4043] rounded-lg px-3 py-2 text-xs text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-1.5">Budget Allocation</label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-[#282a2c] border border-[#3c4043] rounded-lg px-3 py-2 text-xs text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-1.5">Timeline Horizon</label>
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full bg-[#282a2c] border border-[#3c4043] rounded-lg px-3 py-2 text-xs text-gray-100"
                  />
                </div>
              </div>

              {/* Target Platforms Selection */}
              <div>
                <label className="block text-gray-300 font-medium mb-1.5">
                  Target Social Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'instagram', label: '📸 Instagram' },
                    { id: 'tiktok', label: '🎵 TikTok' },
                    { id: 'x', label: '🐦 X (Twitter)' },
                    { id: 'linkedin', label: '💼 LinkedIn' },
                    { id: 'facebook', label: '👥 Facebook' },
                    { id: 'youtube', label: '▶️ YouTube Shorts' },
                    { id: 'pinterest', label: '📌 Pinterest' }
                  ].map((p) => {
                    const isSelected = selectedPlatforms.includes(p.id as SocialPlatformType);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleTogglePlatform(p.id as SocialPlatformType)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                            : 'bg-[#282a2c] border-[#3c4043] text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleGenerateBriefWithAI}
                  disabled={isGenerating}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  <span>
                    {isGenerating ? 'Synthesizing Strategic Brief...' : 'Generate 360° Campaign Brief with AI'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : selectedBrief ? (
          <div className="max-w-4xl mx-auto w-full space-y-5">
            {/* Header Card */}
            <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {selectedBrief.campaignType.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-400">Created {selectedBrief.generatedAt}</span>
                </div>
                <h1 className="text-lg font-bold text-gray-100 tracking-tight">
                  {selectedBrief.title}
                </h1>
                <p className="text-xs text-gray-400 mt-1 max-w-2xl">{selectedBrief.keyMessage}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onDraftPostsFromBrief(selectedBrief)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md transition-colors"
                  title="Generate all platform-native captions from this brief"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Platform Posts</span>
                </button>

                <button
                  onClick={() => onGenerateCalendarFromBrief(selectedBrief)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-200 text-xs font-medium transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Build Calendar</span>
                </button>
              </div>
            </div>

            {/* Metrics & Scope Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#1e1f20] border border-[#2d2f31]">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
                  <Target className="w-3.5 h-3.5 text-blue-400" />
                  <span>Target Audience</span>
                </div>
                <div className="text-xs font-semibold text-gray-100 line-clamp-1">
                  {selectedBrief.targetAudience}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1e1f20] border border-[#2d2f31]">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Budget</span>
                </div>
                <div className="text-xs font-semibold text-gray-100">{selectedBrief.budget}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1e1f20] border border-[#2d2f31]">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Timeline</span>
                </div>
                <div className="text-xs font-semibold text-gray-100">{selectedBrief.timeline}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1e1f20] border border-[#2d2f31]">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Deliverables</span>
                </div>
                <div className="text-xs font-semibold text-gray-100">
                  {selectedBrief.deliverablesCount} Content Assets
                </div>
              </div>
            </div>

            {/* Core Pillars & Strategic Rationale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2 mb-3">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  4 Core Content Pillars
                </h3>
                <div className="space-y-2">
                  {selectedBrief.corePillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#282a2c] border border-[#34373a] text-xs text-gray-300 flex items-start gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{pillar}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2 mb-3">
                    <Target className="w-3.5 h-3.5 text-indigo-400" />
                    Target Platforms Active
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedBrief.targetPlatforms.map((plat) => (
                      <span
                        key={plat}
                        className="px-2.5 py-1 rounded-md bg-[#282a2c] border border-[#3c4043] text-xs font-medium text-gray-200 capitalize"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#282a2c]/60 border border-[#34373a] text-[11px] text-gray-300">
                  <div className="font-semibold text-blue-400 mb-1">Strategic Director Note</div>
                  {selectedBrief.strategicNotes}
                </div>
              </div>
            </div>

            {/* High-Converting Suggested Hooks */}
            <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                AI Suggested Viral Hooks (First 3 Seconds)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {selectedBrief.suggestedHooks.map((hook, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#282a2c] border border-[#34373a] text-xs flex items-start justify-between gap-2 group hover:border-blue-500/40 transition-colors"
                  >
                    <span className="text-gray-200 font-medium">"{hook}"</span>
                    <button
                      onClick={() => handleCopyText(hook, `hook-${idx}`)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Copy Hook"
                    >
                      {copiedId === `hook-${idx}` ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hashtags & Suggested CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2 mb-3">
                  <Hash className="w-3.5 h-3.5 text-blue-400" />
                  Target Hashtags & Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBrief.suggestedHashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2 mb-3">
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  Recommended Calls to Action (CTAs)
                </h3>
                <div className="space-y-1.5">
                  {selectedBrief.suggestedCTAs.map((cta, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-gray-300 p-2 rounded bg-[#282a2c] border border-[#34373a] flex items-center justify-between"
                    >
                      <span>{cta}</span>
                      <button
                        onClick={() => handleCopyText(cta, `cta-${idx}`)}
                        className="text-gray-400 hover:text-white"
                      >
                        {copiedId === `cta-${idx}` ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <FileSpreadsheet className="w-12 h-12 text-gray-600 mb-3" />
            <h3 className="text-sm font-semibold text-gray-300">No Brief Selected</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Select an existing campaign brief from the sidebar or click New Brief to synthesize one with AI.
            </p>
            <button
              onClick={() => setIsCreatingNew(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
            >
              Create First Brief
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
