import React, { useState } from 'react';
import {
  Share2,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  Layers,
  Copy,
  Sliders,
  Check,
  ShieldCheck,
  Zap,
  Globe,
  Radio
} from 'lucide-react';
import {
  BrandProfile,
  ConnectedPlatformAccount,
  CrossPostLog,
  OmnichannelAdaptation,
  SocialPlatformType
} from '../../types';

interface OmnichannelCrossPostStudioProps {
  currentBrand: BrandProfile;
  connectedAccounts: ConnectedPlatformAccount[];
  crossPostLogs: CrossPostLog[];
  onAddLogs: (logs: CrossPostLog[]) => void;
}

export const OmnichannelCrossPostStudio: React.FC<OmnichannelCrossPostStudioProps> = ({
  currentBrand,
  connectedAccounts,
  crossPostLogs,
  onAddLogs
}) => {
  // Base single piece of content to adapt
  const [baseContent, setBaseContent] = useState(
    `We designed 40 numbered bespoke suits in Lagos using pure hand-woven silk jacquard. When fast fashion floods the market with 100,000 throwaway garments, true luxury stands on artisan permanence, cultural pride, and master craftsmanship.\n\nOnly available through private bespoke fittings in Lagos and London.`
  );

  const [isAdapting, setIsAdapting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Adapted content per platform
  const [adaptations, setAdaptations] = useState<OmnichannelAdaptation>({
    instagram: {
      platform: 'instagram',
      format: 'reel',
      hook: 'When they said heritage tailoring couldn’t command London and Lagos at the same time...',
      caption: `You thought we were playing with this Autumn drop? Hand-finished silk jacquard, structured lapels, and zero compromises on heritage.\n\nOnly 40 numbered pieces worldwide. Tap link in bio to join the VIP waitlist.`,
      hashtags: ['#AfricanLuxury', '#LuxeAuraBespoke', '#SilkCapsule', '#LagosToLondon', '#OmoNoTryMe'],
      cta: 'Tap link in bio to join VIP waitlist',
      optimalTime: '6:30 PM WAT',
      strategicRationale: 'Visual-first format with audio sync drives 42% higher waitlist signups.'
    },
    tiktok: {
      platform: 'tiktok',
      format: 'short_video',
      hook: 'Omo no try me oo… wait for the 180 spin! ✨',
      caption: 'Told my tailor to make something that commands respect before you even introduce yourself. How did we do? #FashionTok #FitCheck',
      hashtags: ['#FashionTok', '#FitCheck', '#AfricanLuxury', '#StyleInspo'],
      cta: 'Drop a 🔥 in comments if you need this',
      optimalTime: '8:15 PM WAT',
      strategicRationale: 'High cultural wit and audio pairing optimizes algorithm hook score.'
    },
    x: {
      platform: 'x',
      format: 'thread',
      hook: '1/4 Fast fashion makes 100k identical pieces that end up in landfills. We made 40.',
      caption: '1/4 Fast fashion makes 100k identical pieces that end up in landfills. We made 40.\n\n2/4 Each piece requires 18 days of hand-weaving by master artisans.\n\n3/4 True luxury is scarcity, not volume.\n\n4/4 Link below to read the craftsmanship dossier.',
      hashtags: ['#SlowFashion', '#LuxuryCraft', '#AfricanDesign'],
      cta: 'Retweet to support independent craft',
      optimalTime: '12:45 PM WAT',
      strategicRationale: 'Lunchtime founder and executive timeline peaks for retweet velocity.'
    },
    linkedin: {
      platform: 'linkedin',
      format: 'long_form_article',
      hook: 'Building a global luxury brand from Africa requires rejecting the conventional mass-scale playbook.',
      caption: 'When we founded LuxeAura, advisers insisted we outsource to lower-cost factories. We chose artisan permanence instead.\n\n3 key lessons from our 2026 growth:\n1. Scarcity generates pricing power.\n2. Cultural resonance creates unshakeable loyalty.\n3. Direct relationships beat distributor markups.\n\nWhat is your stance on sustainable luxury?',
      hashtags: ['#LuxuryBranding', '#GlobalCommerce', '#AfricanExcellence', '#Leadership'],
      cta: 'Share your perspectives below',
      optimalTime: '8:30 AM WAT',
      strategicRationale: 'Morning leadership digest delivers 2.8x comment depth from executives.'
    },
    facebook: {
      platform: 'facebook',
      format: 'carousel',
      hook: 'Step inside our master atelier in Victoria Island, Lagos.',
      caption: 'Every seam tells a story of 18 months of dedicated artistry. Swipe through to discover the journey from raw natural silk to finished sculpture.\n\nOnly 40 pieces available for private commission worldwide.',
      hashtags: ['#AfricanDesign', '#LuxuryArtisans', '#BespokeCraft'],
      cta: 'Click "Learn More" to explore the lookbook',
      optimalTime: '2:00 PM WAT',
      strategicRationale: 'Community browsing with high link click-through for trunk show RSVPs.'
    },
    youtube: {
      platform: 'youtube',
      format: 'short_video',
      hook: 'Testing hand-loomed Nigerian silk vs imported silk...',
      caption: 'The untold story of African haute couture. Subscribe for exclusive atelier tours and design breakdowns. #Shorts',
      hashtags: ['#Shorts', '#FashionDesign', '#Artisan', '#Luxury'],
      cta: 'Subscribe for weekly atelier episodes',
      optimalTime: '5:30 PM WAT',
      strategicRationale: 'Late afternoon watch queue optimization before peak evening.'
    }
  });

  // Selected channels to publish to
  const [selectedChannels, setSelectedChannels] = useState<SocialPlatformType[]>([
    'instagram',
    'tiktok',
    'x',
    'linkedin'
  ]);

  const handleToggleChannel = (p: SocialPlatformType) => {
    if (selectedChannels.includes(p)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== p));
      }
    } else {
      setSelectedChannels([...selectedChannels, p]);
    }
  };

  const handleAdaptWithAI = async () => {
    setIsAdapting(true);
    try {
      const res = await fetch('/api/gemini/adapt-omnichannel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: currentBrand,
          baseIdea: baseContent,
          targetAudience: currentBrand.primaryAudience
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAdaptations(data);
      }
    } catch (e) {
      console.error('Adaptation failed:', e);
    } finally {
      setIsAdapting(false);
    }
  };

  const handlePublishAll = async () => {
    setIsPublishing(true);
    setPublishSuccess(false);
    try {
      const platformsToPost = selectedChannels.map((plat) => {
        const item = adaptations[plat];
        return {
          platform: plat,
          content: `${item?.hook || ''}\n\n${item?.caption || ''}\n\n${(item?.hashtags || []).join(' ')}`,
          format: item?.format || 'single_image',
          mediaUrl: currentBrand.logoUrl
        };
      });

      const res = await fetch('/api/social/cross-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: currentBrand.id,
          postTitle: baseContent.slice(0, 40),
          platforms: platformsToPost
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.results) {
          onAddLogs(result.results);
          setPublishSuccess(true);
          setTimeout(() => setPublishSuccess(false), 4000);
        }
      }
    } catch (e) {
      console.error('Cross-post failed:', e);
    } finally {
      setIsPublishing(false);
    }
  };

  const updateAdaptationText = (
    platformKey: SocialPlatformType,
    field: 'caption' | 'hook' | 'cta',
    value: string
  ) => {
    const prev = adaptations[platformKey];
    if (prev) {
      setAdaptations({
        ...adaptations,
        [platformKey]: {
          ...prev,
          [field]: value
        }
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#171819] text-gray-200">
      {/* Left Column: Connected Accounts & Base Content Input */}
      <div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-[#2d2f31] bg-[#1e1f20] flex flex-col flex-shrink-0 p-4 sm:p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2d2f31]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
            <h2 className="text-xs font-semibold text-gray-100">Live Cross-Posting Engine</h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            6 APIs Online
          </span>
        </div>

        {/* Connected Social Accounts */}
        <div className="space-y-2 mb-5">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Connected Accounts & Handles
          </label>
          <div className="space-y-1.5">
            {connectedAccounts.map((acc) => {
              const isSelected = selectedChannels.includes(acc.platform);
              return (
                <div
                  key={acc.id}
                  onClick={() => handleToggleChannel(acc.platform)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#282a2c] border-purple-500/60 shadow-sm'
                      : 'bg-[#212225] border-[#34373a] opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={acc.avatarUrl}
                      alt={acc.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#444]"
                    />
                    <div>
                      <div className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                        <span className="capitalize">{acc.platform}</span>
                        <span className="text-[10px] text-gray-400 font-mono">({acc.followerCount})</span>
                      </div>
                      <div className="text-[10px] text-purple-300 font-mono">{acc.handle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-emerald-400 font-mono">{acc.lastSynced}</span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'border-[#555] bg-[#333]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Base Content to Rewrite */}
        <div className="space-y-2 mb-4">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Master Seed Content
          </label>
          <textarea
            rows={5}
            value={baseContent}
            onChange={(e) => setBaseContent(e.target.value)}
            placeholder="Paste raw concept, blog paragraph, product announcement, or event outline..."
            className="w-full bg-[#282a2c] border border-[#3c4043] rounded-lg p-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
          />
        </div>

        {/* AI Rewrite Action */}
        <button
          type="button"
          onClick={handleAdaptWithAI}
          disabled={isAdapting}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isAdapting ? 'animate-spin' : ''}`} />
          <span>{isAdapting ? 'Adapting for all 6 Platforms...' : '1-Click Omnichannel Adaptation'}</span>
        </button>
      </div>

      {/* Right Column: Multi-Platform Previews & 1-Click Publishing Bar */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 flex flex-col gap-4 sm:gap-5">
        {/* Sticky Publishing Header Bar */}
        <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <h2 className="text-sm font-bold text-gray-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Multi-Channel Direct Publishing Hub
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Publish customized, platform-native content to {selectedChannels.length} selected channels simultaneously.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {publishSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                Dispatched to {selectedChannels.length} Networks!
              </span>
            )}

            <button
              onClick={handlePublishAll}
              disabled={isPublishing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isPublishing ? 'animate-spin' : ''}`} />
              <span>{isPublishing ? 'Transmitting to APIs...' : `Publish to ${selectedChannels.length} Channels Now`}</span>
            </button>
          </div>
        </div>

        {/* Grid of Platform Adaptation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(adaptations) as SocialPlatformType[]).map((platKey) => {
            const item = adaptations[platKey];
            if (!item) return null;
            const isTargeted = selectedChannels.includes(platKey);

            return (
              <div
                key={platKey}
                className={`bg-[#1e1f20] border rounded-xl p-4 flex flex-col justify-between transition-all ${
                  isTargeted
                    ? 'border-purple-500/40 shadow-md shadow-purple-500/5'
                    : 'border-[#2d2f31] opacity-75'
                }`}
              >
                {/* Card Top */}
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#2d2f31]">
                    <div className="flex items-center gap-2">
                      <span className="capitalize font-bold text-xs text-white flex items-center gap-1.5">
                        {platKey}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#282a2c] text-gray-300 font-mono capitalize">
                        {item.format.replace('_', ' ')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleChannel(platKey)}
                      className={`text-[10px] px-2 py-0.5 rounded border font-medium transition-colors ${
                        isTargeted
                          ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                          : 'bg-[#282a2c] text-gray-400 border-[#3c4043]'
                      }`}
                    >
                      {isTargeted ? 'Included' : '+ Add'}
                    </button>
                  </div>

                  {/* Hook */}
                  <div className="mb-2.5">
                    <label className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                      Viral Hook
                    </label>
                    <input
                      type="text"
                      value={item.hook}
                      onChange={(e) => updateAdaptationText(platKey, 'hook', e.target.value)}
                      className="w-full bg-[#282a2c] border border-[#3c4043] rounded-md px-2 py-1 text-xs text-gray-200 font-medium"
                    />
                  </div>

                  {/* Caption */}
                  <div className="mb-2.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Adapted Native Caption
                    </label>
                    <textarea
                      rows={4}
                      value={item.caption}
                      onChange={(e) => updateAdaptationText(platKey, 'caption', e.target.value)}
                      className="w-full bg-[#282a2c] border border-[#3c4043] rounded-md p-2 text-xs text-gray-200 resize-none font-sans leading-relaxed"
                    />
                  </div>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {item.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div className="pt-2 border-t border-[#2d2f31] flex items-center justify-between text-[10px] text-gray-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Clock className="w-3 h-3" />
                    {item.optimalTime}
                  </span>
                  <span className="text-gray-500 truncate max-w-[140px]" title={item.strategicRationale}>
                    {item.strategicRationale}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Publishing Dispatch Audit Logs */}
        <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2d2f31]">
            <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              API Dispatch Audit Log (Realtime Network Status)
            </h3>
            <span className="text-[10px] text-gray-400 font-mono">
              {crossPostLogs.length} Total Dispatches
            </span>
          </div>

          <div className="space-y-2">
            {crossPostLogs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-[#282a2c] border border-[#34373a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-white capitalize">{log.platform}</span>
                  <span className="text-gray-400 font-mono text-[11px]">{log.handle}</span>
                  <span className="text-gray-400 text-[11px] hidden md:inline">— {log.postTitle}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-gray-400 font-mono">{log.timestamp}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                    {log.responseTimeMs}ms
                  </span>
                  {log.postUrl && (
                    <a
                      href={log.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
                    >
                      <span>View Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
